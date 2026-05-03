from fastapi import APIRouter, BackgroundTasks
from ..cache import load_cache, get_all_deltas
from ..services.collector import collect_dataset
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.get("/")
def trending(background_tasks: BackgroundTasks):
    data = load_cache()
    deltas = get_all_deltas(days=7)
    background_tasks.add_task(collect_dataset)

    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)

    # 1. Growth (Top 20 by delta)
    growth = []
    for s in data:
        s_id = s.get("id")
        d = deltas.get(s_id, 0)
        if d > 0:
            s["delta"] = d
            growth.append(s)
    
    growth.sort(key=lambda x: x.get("delta", 0), reverse=True)
    
    # 2. New Comers (Added in last 7 days)
    new_comers = []
    for s in data:
        fetched_at = s.get("fetched_at")
        if fetched_at:
            try:
                dt = datetime.fromisoformat(fetched_at.replace("Z", "+00:00"))
                if dt > seven_days_ago:
                    # If delta is same as stars, it's truly new history-wise
                    s_id = s.get("id")
                    if deltas.get(s_id) is None: # No old snapshot
                        new_comers.append(s)
            except:
                pass
    
    new_comers.sort(key=lambda x: x.get("stars", 0), reverse=True)

    # 3. Revivals (Low total stars but positive delta, or long inactive then updated)
    revivals = []
    for s in data:
        s_id = s.get("id")
        d = deltas.get(s_id, 0)
        stars = s.get("stars", 0)
        if d > 0 and stars < 50: # Small but growing
            s["delta"] = d
            revivals.append(s)
        
    revivals.sort(key=lambda x: (x.get("delta", 0) / (stars + 1)), reverse=True)

    return {
        "growth": growth[:20],
        "new_comers": new_comers[:20],
        "revivals": revivals[:20]
    }
