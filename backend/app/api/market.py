from fastapi import APIRouter, BackgroundTasks
from ..cache import load_cache
from ..services.collector import collect_dataset
from ..services.analytics import compute_stats
from ..services.reporter import get_ai_report

router = APIRouter()

@router.get("/")
def market(background_tasks: BackgroundTasks):
    # Load existing data immediately from SQLite
    data = load_cache()
    
    # Trigger background update so the next visit has fresh data
    background_tasks.add_task(collect_dataset)
    
    # Since we don't have 'prev' stars easily without 
    # doing complex SQL, we simplify delta for background mode:
    # Most users care about current stats; deltas will update 
    # as the background task completes and saves to DB.
    deltas = {} # Can be populated by comparing with a snapshot if needed
            
    return compute_stats(data, deltas)

@router.get("/report")
def report():
    data = load_cache()
    stats = compute_stats(data, {})
    return {"report": get_ai_report(stats)}
