import json
from pathlib import Path
from .config import CACHE_FILE

def load_cache():
    if Path(CACHE_FILE).exists():
        return json.load(open(CACHE_FILE))
    return {}

def save_cache(data):
    json.dump(data, open(CACHE_FILE, "w"))
