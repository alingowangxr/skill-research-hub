from fastapi import APIRouter, BackgroundTasks
from ..cache import load_cache, get_all_deltas
from ..services.collector import collect_dataset
from ..services.analytics import compute_stats
from ..services.reporter import get_ai_report
from ..services.xquik_social import fetch_xquik_social_signals

router = APIRouter()

@router.get("/")
def market(background_tasks: BackgroundTasks):
    # Load existing data immediately from SQLite
    data = load_cache()
    
    # Trigger background update so the next visit has fresh data
    background_tasks.add_task(collect_dataset)
    
    # Get real deltas from historical snapshots (default 7 days)
    deltas = get_all_deltas(days=7)
            
    return compute_stats(data, deltas)

@router.get("/report")
def report():
    data = load_cache()
    stats = compute_stats(data, {})
    return {"report": get_ai_report(stats)}

@router.get("/social-signals")
def social_signals():
    return fetch_xquik_social_signals()
