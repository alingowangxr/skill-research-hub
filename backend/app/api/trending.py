from fastapi import APIRouter
from ..cache import load_cache
from ..services.collector import collect_dataset

router = APIRouter()

@router.get("/")
def trending():
    old = load_cache()
    new = collect_dataset()

    trends = []
    for s in new:
        prev = old.get(s["id"], {})
        delta = s.get("stars", 0) - prev.get("stars", 0)
        trends.append((delta, s))

    trends.sort(key=lambda x: x[0], reverse=True)
    return [s for _, s in trends[:20]]
