import requests
from ..config import API_KEY, BASE_URL

HEADERS = {"Authorization": f"Bearer {API_KEY}"}

def fetch_search(keyword, page=1):
    url = f"{BASE_URL}/skills/search?q={keyword}&page={page}&limit=50"
    r = requests.get(url, headers=HEADERS)
    return r.json()

def fetch_ai(keyword):
    url = f"{BASE_URL}/skills/ai-search?q={keyword}"
    r = requests.get(url, headers=HEADERS)
    return r.json()
