from fastapi import APIRouter
from ..cache import load_cache
from ..services.collector import collect_dataset
from ..services.analytics import compute_stats
from ..services.reporter import get_ai_report

router = APIRouter()

@router.get("/")
def market():
    old = load_cache()
    data = collect_dataset()
    
    # Calculate deltas for predictions
    deltas = {}
    for s in data:
        s_id = s.get("id")
        if s_id:
            prev = old.get(s_id, {})
            deltas[s_id] = s.get("stars", 0) - prev.get("stars", 0)
            
    return compute_stats(data, deltas)

@router.get("/report")
def report():
    old = load_cache()
    data = collect_dataset()
    
    deltas = {}
    for s in data:
        s_id = s.get("id")
        if s_id:
            prev = old.get(s_id, {})
            deltas[s_id] = s.get("stars", 0) - prev.get("stars", 0)
            
    stats = compute_stats(data, deltas)
    return {"report": get_ai_report(stats)}
