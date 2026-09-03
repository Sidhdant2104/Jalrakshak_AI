from fastapi import FastAPI

from app.database.connection import test_database_connection
from app.api.readings import router as readings_router


app = FastAPI(
    title="JalRakshak API",
    description="AI-powered water monitoring and analysis system",
    version="1.0.0",
)


@app.on_event("startup")
def startup():
    test_database_connection()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "JalRakshak API",
        "database": "connected",
    }


app.include_router(readings_router)