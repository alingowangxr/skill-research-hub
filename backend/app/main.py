import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import market, rankings, trending

app = FastAPI()

# Configuration from environment
allow_origins_env = os.getenv("ALLOW_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
allow_origins = [origin.strip() for origin in allow_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router, prefix="/market")
app.include_router(rankings.router, prefix="/rankings")
app.include_router(trending.router, prefix="/trending")

@app.get("/")
def root():
    return {"status": "ok"}
