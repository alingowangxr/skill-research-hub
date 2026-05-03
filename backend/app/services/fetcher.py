import requests
import logging
from ..config import API_KEY, BASE_URL

HEADERS = {"Authorization": f"Bearer {API_KEY}"}
logger = logging.getLogger(__name__)

def fetch_search(keyword, page=1, limit=100):
    """Search for skills by keyword with pagination."""
    url = f"{BASE_URL}/skills/search?q={keyword}&page={page}&limit={limit}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logger.error(f"Error fetching keyword '{keyword}' page {page}: {e}")
        return {}

def fetch_by_tag(tag, page=1, limit=100):
    """Discovery via tags (e.g., 'mcp', 'agent')."""
    url = f"{BASE_URL}/skills/search?tag={tag}&page={page}&limit={limit}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logger.error(f"Error fetching tag '{tag}': {e}")
        return {}

def fetch_by_author(author, page=1, limit=100):
    """Discovery all skills by a specific author."""
    url = f"{BASE_URL}/skills/search?author={author}&page={page}&limit={limit}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logger.error(f"Error fetching author '{author}': {e}")
        return {}

def fetch_ai(keyword):
    """AI-powered search for semantic discovery."""
    url = f"{BASE_URL}/skills/ai-search?q={keyword}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logger.error(f"Error in AI search for '{keyword}': {e}")
        return {}
