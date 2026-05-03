import sqlite3
import json
import os
from pathlib import Path
from .config import CACHE_FILE

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
            raw_data TEXT
        )
    """)
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

def save_skill(skill):
    """Upsert a single skill into the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO skills (id, name, author, updated_at, raw_data)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            name=excluded.name,
            author=excluded.author,
            updated_at=excluded.updated_at,
            raw_data=excluded.raw_data
    """, (
        skill.get("id"),
        skill.get("name"),
        skill.get("author"),
        skill.get("updated_at"),
        json.dumps(skill)
    ))
    conn.commit()
    conn.close()

def load_cache():
    """Return all skills as a list of dicts (for backward compatibility where possible)."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT raw_data FROM skills")
    rows = cursor.fetchall()
    conn.close()
    return [json.loads(row["raw_data"]) for row in rows]

def save_cache(data_dict):
    """Save a dictionary of skills (for backward compatibility)."""
    for skill_id, skill in data_dict.items():
        save_skill(skill)
