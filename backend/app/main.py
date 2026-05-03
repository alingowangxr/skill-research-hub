from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import market, rankings, trending

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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
