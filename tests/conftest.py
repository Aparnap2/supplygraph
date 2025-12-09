"""
Pytest configuration and shared fixtures for SupplyGraph testing
"""
import pytest
import asyncio
import uuid
from typing import Dict, Any, AsyncGenerator
from datetime import datetime, timedelta
import prisma
from prisma import Prisma
import httpx
import redis.asyncio as redis
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_database() -> AsyncGenerator[Prisma, None]:
    """Initialize test database connection and cleanup."""
    # Use the existing agentstack-db-test container
    db = Prisma(
        datasource={
            'url': 'postgresql://postgres:password@localhost:5432/agentstack'
        }
    )

    try:
        await db.connect()
        print("✅ Connected to test database")

        # Create supplygraph schema if it doesn't exist
        await db.execute_raw('CREATE SCHEMA IF NOT EXISTS supplygraph;')

        yield db

    except Exception as e:
        print(f"❌ Database connection error: {e}")
        raise
    finally:
        await db.disconnect()
        print("✅ Disconnected from test database")


@pytest.fixture(scope="session")
async def test_redis() -> AsyncGenerator[redis.Redis, None]:
    """Initialize test Redis connection."""
    try:
        redis_client = redis.from_url(
            'redis://localhost:6379',
            decode_responses=True,
            db=1  # Use different DB for tests
        )
        await redis_client.ping()
        print("✅ Connected to test Redis")

        yield redis_client

    except Exception as e:
        print(f"❌ Redis connection error: {e}")
        raise
    finally:
        await redis_client.close()
        print("✅ Disconnected from test Redis")


@pytest.fixture
async def test_organization(test_database: Prisma) -> Dict[str, Any]:
    """Create a test organization for testing."""
    org_id = str(uuid.uuid4())
    org_data = {
        'id': org_id,
        'name': 'Test Organization Inc.',
        'slug': 'test-org-' + org_id[:8],
        'description': 'Test organization for CRUD operations',
        'website': 'https://testorg.com',
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    try:
        # Insert using raw SQL since Prisma might not be fully set up
        await test_database.execute_raw("""
            INSERT INTO supplygraph.organization (id, name, slug, description, website, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, org_data['id'], org_data['name'], org_data['slug'],
            org_data['description'], org_data['website'],
            org_data['createdAt'], org_data['updatedAt'])

        print(f"✅ Created test organization: {org_data['id']}")
        return org_data

    except Exception as e:
        print(f"❌ Failed to create test organization: {e}")
        raise


@pytest.fixture
async def test_user(test_database: Prisma, test_organization: Dict[str, Any]) -> Dict[str, Any]:
    """Create a test user for testing."""
    user_id = str(uuid.uuid4())
    user_data = {
        'id': user_id,
        'name': 'Test User',
        'email': f'test-user-{user_id[:8]}@testorg.com',
        'role': 'USER',
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    membership_data = {
        'id': str(uuid.uuid4()),
        'organizationId': test_organization['id'],
        'userId': user_id,
        'role': 'OWNER',
        'joinedAt': datetime.utcnow()
    }

    try:
        # Create user
        await test_database.execute_raw("""
            INSERT INTO supplygraph.user (id, name, email, role, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, user_data['id'], user_data['name'], user_data['email'],
            user_data['role'], user_data['createdAt'], user_data['updatedAt'])

        # Create organization membership
        await test_database.execute_raw("""
            INSERT INTO supplygraph.member (id, organizationId, userId, role, joinedAt)
            VALUES ($1, $2, $3, $4, $5)
        """, membership_data['id'], membership_data['organizationId'],
            membership_data['userId'], membership_data['role'], membership_data['joinedAt'])

        print(f"✅ Created test user: {user_data['email']}")
        return user_data

    except Exception as e:
        print(f"❌ Failed to create test user: {e}")
        raise


@pytest.fixture
async def test_vendor(test_database: Prisma, test_organization: Dict[str, Any]) -> Dict[str, Any]:
    """Create a test vendor for testing."""
    vendor_id = str(uuid.uuid4())
    vendor_data = {
        'id': vendor_id,
        'name': 'Test Vendor Corp',
        'email': f'contact-{vendor_id[:8]}@testvendor.com',
        'phone': '+1-555-0123',
        'website': 'https://testvendor.com',
        'description': 'Test vendor for procurement testing',
        'organizationId': test_organization['id'],
        'isActive': True,
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    try:
        await test_database.execute_raw("""
            INSERT INTO supplygraph.vendor
            (id, name, email, phone, website, description, organizationId, isActive, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """, vendor_data['id'], vendor_data['name'], vendor_data['email'],
            vendor_data['phone'], vendor_data['website'], vendor_data['description'],
            vendor_data['organizationId'], vendor_data['isActive'],
            vendor_data['createdAt'], vendor_data['updatedAt'])

        print(f"✅ Created test vendor: {vendor_data['name']}")
        return vendor_data

    except Exception as e:
        print(f"❌ Failed to create test vendor: {e}")
        raise


@pytest.fixture
async def test_category(test_database: Prisma, test_organization: Dict[str, Any]) -> Dict[str, Any]:
    """Create a test category for testing."""
    category_id = str(uuid.uuid4())
    category_data = {
        'id': category_id,
        'name': 'Office Supplies',
        'description': 'Office and administrative supplies',
        'slug': 'office-supplies',
        'organizationId': test_organization['id'],
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    try:
        await test_database.execute_raw("""
            INSERT INTO supplygraph.category
            (id, name, description, slug, organizationId, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """, category_data['id'], category_data['name'], category_data['description'],
            category_data['slug'], category_data['organizationId'],
            category_data['createdAt'], category_data['updatedAt'])

        print(f"✅ Created test category: {category_data['name']}")
        return category_data

    except Exception as e:
        print(f"❌ Failed to create test category: {e}")
        raise


@pytest.fixture
async def cleanup_test_data(test_database: Prisma):
    """Cleanup fixture to remove test data after each test."""
    yield  # This runs after the test completes

    try:
        # Clean up in reverse order of dependencies
        await test_database.execute_raw("""
            DELETE FROM supplygraph.audit_log WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.activity WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.quote_item WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.quote WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.procurement_item WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.procurement_request WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.product WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.vendor_contact WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.vendor_contract WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.vendor WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.department WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.category WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.member WHERE joinedAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.user WHERE createdAt > NOW() - INTERVAL '1 hour';
            DELETE FROM supplygraph.organization WHERE createdAt > NOW() - INTERVAL '1 hour';
        """)
        print("✅ Cleaned up test data")

    except Exception as e:
        print(f"❌ Cleanup error: {e}")


# Test utility functions
async def create_test_procurement_request(
    test_database: Prisma,
    org_id: str,
    user_id: str,
    **kwargs
) -> Dict[str, Any]:
    """Helper to create a test procurement request."""
    request_id = str(uuid.uuid4())
    request_data = {
        'id': request_id,
        'requestNumber': f'PR-{datetime.now().strftime("%Y%m%d")}-{request_id[:8]}',
        'title': kwargs.get('title', 'Test Procurement Request'),
        'description': kwargs.get('description', 'Test procurement request for CRUD testing'),
        'organizationId': org_id,
        'requesterId': user_id,
        'status': kwargs.get('status', 'DRAFT'),
        'priority': kwargs.get('priority', 'MEDIUM'),
        'threadId': str(uuid.uuid4()),
        'currency': kwargs.get('currency', 'USD'),
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    try:
        await test_database.execute_raw("""
            INSERT INTO supplygraph.procurement_request
            (id, requestNumber, title, description, organizationId, requesterId, status, priority, threadId, currency, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        """, *[value for value in request_data.values()])

        return request_data

    except Exception as e:
        print(f"❌ Failed to create procurement request: {e}")
        raise


async def create_test_product(
    test_database: Prisma,
    org_id: str,
    category_id: str,
    **kwargs
) -> Dict[str, Any]:
    """Helper to create a test product."""
    product_id = str(uuid.uuid4())
    product_data = {
        'id': product_id,
        'sku': kwargs.get('sku', f'TEST-{product_id[:8]}'),
        'name': kwargs.get('name', 'Test Product'),
        'description': kwargs.get('description', 'Test product for CRUD testing'),
        'categoryId': category_id,
        'organizationId': org_id,
        'unit': kwargs.get('unit', 'each'),
        'unitPrice': kwargs.get('unitPrice', 99.99),
        'currentStock': kwargs.get('currentStock', 100),
        'minStock': kwargs.get('minStock', 10),
        'createdAt': datetime.utcnow(),
        'updatedAt': datetime.utcnow()
    }

    try:
        await test_database.execute_raw("""
            INSERT INTO supplygraph.product
            (id, sku, name, description, categoryId, organizationId, unit, unitPrice, currentStock, minStock, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        """, *[value for value in product_data.values()])

        return product_data

    except Exception as e:
        print(f"❌ Failed to create product: {e}")
        raise