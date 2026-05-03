from fastapi import APIRouter, BackgroundTasks
from ..cache import load_cache
from ..services.collector import collect_dataset
from ..services.analytics import skill_score

router = APIRouter()

@router.get("/")
def rankings(background_tasks: BackgroundTasks):
    data = load_cache()
    background_tasks.add_task(collect_dataset)
    
    ranked = sorted(data, key=skill_score, reverse=True)
    return ranked[:50]
