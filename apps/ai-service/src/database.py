"""Database client management for the AI Service."""

import asyncio
from typing import Optional

import structlog
from prisma import Prisma

from .config import get_settings

logger = structlog.get_logger(__name__)

# Global database client instance
_db_client: Optional[Prisma] = None


async def get_db_client() -> Prisma:
    """Get or create the database client instance."""
    global _db_client
    
    if _db_client is None:
        settings = get_settings()
        
        logger.info("🔌 Connecting to database", url=settings.database_url.split("@")[-1])
        
        _db_client = Prisma()
        await _db_client.connect()
        
        logger.info("✅ Database connection established")
    
    return _db_client


async def close_db_client() -> None:
    """Close the database client connection."""
    global _db_client
    
    if _db_client is not None:
        logger.info("🔌 Closing database connection")
        await _db_client.disconnect()
        _db_client = None
        logger.info("✅ Database connection closed")


async def get_db() -> Prisma:
    """Dependency to get database client for FastAPI routes."""
    return await get_db_client()


class TenantContext:
    """Context manager for multi-tenant database operations."""
    
    def __init__(self, org_id: str):
        self.org_id = org_id
    
    async def __aenter__(self):
        """Set tenant context for RLS."""
        db = await get_db_client()
        # Set the tenant context for Row-Level Security
        await db.execute_raw(f"SET app.current_tenant = '{self.org_id}'")
        return db
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Reset tenant context."""
        db = await get_db_client()
        await db.execute_raw("RESET app.current_tenant")


def with_tenant(org_id: str) -> TenantContext:
    """Create a tenant context for database operations."""
    return TenantContext(org_id)