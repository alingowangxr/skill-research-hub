import sqlite3
import json
import os
import logging
from pathlib import Path
from .config import CACHE_FILE

logger = logging.getLogger(__name__)

# Change default extension if it's still .json
DB_PATH = CACHE_FILE.replace(".json", ".db")

def get_connection():
    # Increase timeout to 30 seconds to wait for locks to release
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode for better concurrency (multiple readers, one writer)
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
    except:
        pass
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id TEXT PRIMARY KEY,
            name TEXT,
            author TEXT,
            updated_at TEXT,
            stars INTEGER DEFAULT 0,
            source TEXT,
            source_url TEXT,
            fetched_at TEXT,
            is_inferred INTEGER DEFAULT 0,
            metadata_quality INTEGER DEFAULT 100,
            raw_data TEXT
        )
    """)
    
    # Migration: Check for missing columns in existing table
    cursor.execute("PRAGMA table_info(skills)")
    existing_cols = [row["name"] for row in cursor.fetchall()]
    
    new_cols = [
        ("source", "TEXT"),
        ("source_url", "TEXT"),
        ("fetched_at", "TEXT"),
        ("is_inferred", "INTEGER DEFAULT 0"),
        ("metadata_quality", "INTEGER DEFAULT 100"),
        ("stars", "INTEGER DEFAULT 0")
    ]
    
    for col_name, col_type in new_cols:
        if col_name not in existing_cols:
            logger.info(f"Migrating: Adding column {col_name} to skills table")
            cursor.execute(f"ALTER TABLE skills ADD COLUMN {col_name} {col_type}")

    # Add indexes for better performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_skills_updated_at ON skills(updated_at)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_skills_author ON skills(author)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name)")

    # Snapshots table for time-series analysis
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS snapshots (
            skill_id TEXT,
            snapshot_date TEXT,
            stars INTEGER,
            fetched_at TEXT,
            PRIMARY KEY (skill_id, snapshot_date)
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_snapshots_date ON snapshots(snapshot_date)")

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meta (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    conn.commit()
    conn.close()

# Initialize on import
init_db()

def set_meta(key, value):
    conn = get_connection()
    conn.execute("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, str(value)))
    conn.commit()
    conn.close()

def get_meta(key):
    conn = get_connection()
    row = conn.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
    conn.close()
    return row["value"] if row else None

def _prepare_skill_params(skill):
    """Helper to normalize skill data for storage."""
    source = skill.get("source", "unknown")
    source_url = skill.get("source_url", "")
    fetched_at = skill.get("fetched_at", "")
    if not fetched_at:
        from datetime import datetime, timezone
        fetched_at = datetime.now(timezone.utc).isoformat()
    
    is_inferred = 1 if skill.get("is_inferred") else 0
    metadata_quality = skill.get("metadata_quality", 100)
    stars = skill.get("stars", 0)
    if stars is None: stars = 0
    
    return (
        skill.get("id"),
        skill.get("name"),
        skill.get("author"),
        skill.get("updated_at"),
        stars,
        source,
        source_url,
        fetched_at,
        is_inferred,
        metadata_quality,
        json.dumps(skill)
    )

def save_skill(skill):
    """Upsert a single skill into the database."""
    conn = get_connection()
    cursor = conn.cursor()
    params = _prepare_skill_params(skill)

    cursor.execute("""
        INSERT INTO skills (
            id, name, author, updated_at, stars,
            source, source_url, fetched_at, 
            is_inferred, metadata_quality, raw_data
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            author=excluded.author,
            updated_at=excluded.updated_at,
            stars=excluded.stars,
            source=excluded.source,
            source_url=excluded.source_url,
            fetched_at=excluded.fetched_at,
            is_inferred=excluded.is_inferred,
            metadata_quality=excluded.metadata_quality,
            raw_data=excluded.raw_data
    """, params)
    conn.commit()
    conn.close()

def save_skills_batch(skills):
    """Upsert multiple skills in a single transaction."""
    if not skills:
        return
    
    conn = get_connection()
    cursor = conn.cursor()
    
    params_list = [_prepare_skill_params(s) for s in skills]
    
    cursor.executemany("""
        INSERT INTO skills (
            id, name, author, updated_at, stars,
            source, source_url, fetched_at, 
            is_inferred, metadata_quality, raw_data
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            author=excluded.author,
            updated_at=excluded.updated_at,
            stars=excluded.stars,
            source=excluded.source,
            source_url=excluded.source_url,
            fetched_at=excluded.fetched_at,
            is_inferred=excluded.is_inferred,
            metadata_quality=excluded.metadata_quality,
            raw_data=excluded.raw_data
    """, params_list)
    
    conn.commit()
    conn.close()

def save_snapshots_batch(skills):
    """Save metrics snapshots for a batch of skills."""
    if not skills:
        return
    
    conn = get_connection()
    cursor = conn.cursor()
    
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    snapshot_date = now.strftime("%Y-%m-%d")
    fetched_at = now.isoformat()
    
    params_list = []
    for s in skills:
        if "id" in s:
            stars = s.get("stars", 0)
            if stars is None: stars = 0
            params_list.append((s["id"], snapshot_date, stars, fetched_at))
    
    cursor.executemany("""
        INSERT INTO snapshots (skill_id, snapshot_date, stars, fetched_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(skill_id, snapshot_date) DO UPDATE SET
            stars=excluded.stars,
            fetched_at=excluded.fetched_at
    """, params_list)
    
    conn.commit()
    conn.close()

def get_historical_metrics(skill_id, days=30):
    """Return historical stars for a skill."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT snapshot_date, stars 
        FROM snapshots 
        WHERE skill_id = ? 
        ORDER BY snapshot_date DESC 
        LIMIT ?
    """, (skill_id, days))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_all_deltas(days=7):
    """Calculate star deltas for all skills compared to a snapshot N days ago."""
    conn = get_connection()
    cursor = conn.cursor()
    
    from datetime import datetime, timedelta, timezone
    target_date = (datetime.now(timezone.utc) - timedelta(days=days)).strftime("%Y-%m-%d")
    
    # Subquery to find the closest snapshot date <= target_date
    cursor.execute("""
        SELECT s.id, s.stars as current_stars, snap.stars as old_stars
        FROM skills s
        LEFT JOIN (
            SELECT skill_id, stars, MAX(snapshot_date) 
            FROM snapshots 
            WHERE snapshot_date <= ? 
            GROUP BY skill_id
        ) snap ON s.id = snap.skill_id
    """, (target_date,))
    
    rows = cursor.fetchall()
    conn.close()
    
    deltas = {}
    for row in rows:
        current = row["current_stars"] or 0
        old = row["old_stars"]
        if old is not None:
            deltas[row["id"]] = current - old
        else:
            deltas[row["id"]] = 0 # No history, zero delta
            
    return deltas

def load_cache():
    """Return all skills as a list of dicts, merging DB columns with raw_data."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, name, author, updated_at, stars, source, 
               source_url, fetched_at, is_inferred, metadata_quality, raw_data 
        FROM skills
    """)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        skill = json.loads(row["raw_data"])
        # Merge/Overwrite with DB columns which are more authoritative
        skill["id"] = row["id"]
        skill["name"] = row["name"]
        skill["author"] = row["author"]
        skill["updated_at"] = row["updated_at"]
        skill["stars"] = row["stars"]
        skill["source"] = row["source"]
        skill["source_url"] = row["source_url"]
        skill["fetched_at"] = row["fetched_at"]
        skill["is_inferred"] = bool(row["is_inferred"])
        skill["metadata_quality"] = row["metadata_quality"]
        results.append(skill)
    return results

def save_cache(data_dict):
    """Save a dictionary of skills (for backward compatibility)."""
    for skill_id, skill in data_dict.items():
        save_skill(skill)
