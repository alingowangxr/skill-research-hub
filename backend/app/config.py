import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SKILLSMP_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") # Added for direct GitHub crawling
XQUIK_API_KEY = os.getenv("XQUIK_API_KEY")
XQUIK_BASE_URL = os.getenv("XQUIK_BASE_URL", "https://xquik.com/api/v1")
XQUIK_SOCIAL_QUERIES = os.getenv("XQUIK_SOCIAL_QUERIES", "")
BASE_URL = os.getenv("BASE_URL")
CACHE_FILE = os.getenv("CACHE_FILE", "skills_cache.json")
