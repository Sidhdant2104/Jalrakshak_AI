import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import test_database_connection
from app.api.readings import router as readings_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    test_database_connection()
    yield


app = FastAPI(
    title="JalRakshak API",
    description="AI-powered water monitoring and analysis system",
    version="1.0.0",
    lifespan=lifespan,
)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    db_ok = test_database_connection()
    return {
        "status": "healthy" if db_ok else "degraded",
        "service": "JalRakshak API",
        "database": "connected" if db_ok else "unavailable",
    }


app.include_router(readings_router)
