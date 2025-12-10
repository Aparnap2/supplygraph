"""
SupplyGraph AI Service - FastAPI backend with LangGraph workflow orchestration

This service handles:
- Procurement workflow state management via LangGraph
- Email processing and quote extraction via Docling
- Vendor communication automation
- Quote normalization and comparison
"""

import asyncio
import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from .config import get_settings
from .database import get_db_client, close_db_client
from .workflows import WorkflowManager
from .routers import procurement, quotes, workflows, health

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager for startup and shutdown tasks."""
    settings = get_settings()
    
    logger.info("🚀 Starting SupplyGraph AI Service", environment=settings.environment)
    
    # Initialize database connection
    await get_db_client()
    
    # Initialize workflow manager
    workflow_manager = WorkflowManager()
    app.state.workflow_manager = workflow_manager
    
    logger.info("✅ AI Service startup complete")
    
    yield
    
    # Cleanup
    logger.info("🛑 Shutting down AI Service")
    await close_db_client()
    logger.info("✅ AI Service shutdown complete")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    
    app = FastAPI(
        title="SupplyGraph AI Service",
        description="LangGraph-powered procurement workflow automation",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.environment == "development" else None,
        redoc_url="/redoc" if settings.environment == "development" else None,
    )
    
    # Add middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.allowed_hosts,
    )
    
    # Include routers
    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(procurement.router, prefix="/api/v1/procurement", tags=["procurement"])
    app.include_router(quotes.router, prefix="/api/v1/quotes", tags=["quotes"])
    app.include_router(workflows.router, prefix="/api/v1/workflows", tags=["workflows"])
    
    return app


# Create the app instance
app = create_app()


@app.get("/")
async def root():
    """Root endpoint with service information."""
    return {
        "service": "SupplyGraph AI Service",
        "version": "0.1.0",
        "status": "operational",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
        log_level=settings.log_level.lower(),
    )