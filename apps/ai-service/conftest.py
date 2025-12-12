"""Pytest configuration and fixtures for AI service tests."""

import pytest
import asyncio
import sys
sys.path.insert(0, '.')  # Add current directory to path for generated client

from unittest.mock import AsyncMock, patch

# Import Prisma from generated client to avoid "Client hasn't been generated" error
try:
    from prisma_client import Prisma as GeneratedPrisma
    # Make Prisma available in this module's namespace
    Prisma = GeneratedPrisma
except ImportError as e:
    print(f"Warning: Could not import Prisma from generated client: {e}")
    raise

from src.database import get_db_client
from src.services.email_service import EmailService
from src.services.gmail_service import GmailService
# from src.services.payment_service import PaymentService  # Not implemented yet


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
async def db_client():
    """Fixture for database client."""
    client = await get_db_client()
    yield client
    await client.disconnect()


@pytest.fixture
def mock_email_service():
    """Fixture for mock email service."""
    with patch('src.services.email_service.EmailService') as mock:
        mock_instance = AsyncMock()
        mock.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def mock_gmail_service():
    """Fixture for mock Gmail service."""
    with patch('src.services.gmail_service.GmailService') as mock:
        mock_instance = AsyncMock()
        mock.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def mock_payment_service():
    """Fixture for mock payment service."""
    with patch('src.services.payment_service.PaymentService') as mock:
        mock_instance = AsyncMock()
        mock.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def test_workflow_state():
    """Fixture for test workflow state."""
    return {
        "workflow_id": "test-workflow-123",
        "org_id": "test-org-456",
        "entity_id": "test-request-789",
        "entity_type": "procurement_request",
        "current_step": "START",
        "data": {
            "title": "Test Office Supplies",
            "items": [{"name": "Chairs", "quantity": 10}],
            "orgId": "test-org-456",
            "createdBy": "test-user-001"
        }
    }