from fastapi import APIRouter, BackgroundTasks
from ..cache import load_cache
from ..services.collector import collect_dataset

router = APIRouter()

@router.get("/")
def trending(background_tasks: BackgroundTasks):
    data = load_cache()
    background_tasks.add_task(collect_dataset)

    # For trending, we show top starred in the current cache 
    # as a fallback when background task is still running
    sorted_data = sorted(data, key=lambda x: x.get("stars", 0), reverse=True)
    return sorted_data[:20]
