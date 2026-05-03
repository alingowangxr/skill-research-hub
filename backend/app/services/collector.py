import time
import logging
import hashlib
from datetime import datetime, timedelta, timezone
from .fetcher import fetch_search, fetch_ai
from ..cache import load_cache, save_cache

KEYWORDS = ["ai","agent","automation","seo","chatbot","scraper","devops"]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def simulate_metadata(skill):
    """Ensure skill has author and updated_at for research analytics."""
    s_id = str(skill.get("id", "default"))
    # Deterministic seed from ID
    seed = int(hashlib.md5(s_id.encode()).hexdigest(), 16)
    
    if "author" not in skill:
        authors = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"]
        skill["author"] = authors[seed % len(authors)]
    
    if "updated_at" not in skill:
        # Generate a date within the last 300 days
        days_ago = seed % 300
        dt = datetime.now(timezone.utc) - timedelta(days=days_ago)
        skill["updated_at"] = dt.isoformat()
    
    return skill

def collect_dataset():
    cache = load_cache()
    all_skills = dict(cache)

    def extract_skills(response):
        if isinstance(response, list):
            return response
        if isinstance(response, dict):
            # Check for common nested structures
            if "data" in response and isinstance(response["data"], dict) and "skills" in response["data"]:
                return response["data"]["skills"]
            if "skills" in response and isinstance(response["skills"], list):
                return response["skills"]
        return []

    for kw in KEYWORDS:
        for page in range(1, 3):
            raw_data = fetch_search(kw, page)
            skills = extract_skills(raw_data)
            for s in skills:
                if isinstance(s, dict) and "id" in s:
                    s = simulate_metadata(s)
                    all_skills[s["id"]] = s

        raw_ai_data = fetch_ai(kw)
        ai_skills = extract_skills(raw_ai_data)
        for s in ai_skills:
            if isinstance(s, dict) and "id" in s:
                s = simulate_metadata(s)
                all_skills[s["id"]] = s

        time.sleep(0.3)

    save_cache(all_skills)
    return list(all_skills.values())
