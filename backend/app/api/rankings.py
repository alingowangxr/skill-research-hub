from fastapi import APIRouter
from ..services.collector import collect_dataset
from ..services.analytics import skill_score

router = APIRouter()

@router.get("/")
def rankings():
    data = collect_dataset()
    ranked = sorted(data, key=skill_score, reverse=True)
    return ranked[:50]
