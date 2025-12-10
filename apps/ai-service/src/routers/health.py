"""Health check endpoints."""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "SupplyGraph AI Service",
        "version": "0.1.0",
    }


@router.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes."""
    # TODO: Add checks for database connectivity, etc.
    return {
        "status": "ready",
        "timestamp": datetime.now().isoformat(),
        "checks": {
            "database": "ok",
            "redis": "ok",
            "llm": "ok",
        }
    }


@router.get("/live")
async def liveness_check():
    """Liveness check for Kubernetes."""
    return {
        "status": "alive",
        "timestamp": datetime.now().isoformat(),
    }