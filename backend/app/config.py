import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("SKILLSMP_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") # Added for direct GitHub crawling
BASE_URL = os.getenv("BASE_URL")
CACHE_FILE = os.getenv("CACHE_FILE", "skills_cache.json")
