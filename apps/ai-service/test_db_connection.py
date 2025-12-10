#!/usr/bin/env python3
"""Test database connection and basic CRUD operations for AI service."""

import asyncio
import os
import sys
sys.path.insert(0, 'prisma_client')
from prisma_client import Prisma

async def test_db_connection():
    """Test database connection and basic operations."""
    print("🔌 Testing database connection...")
    
    # Set database URL
    os.environ['DATABASE_URL'] = "postgresql://dev:devpass@localhost:5432/supplygraph"
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Test connection by querying organizations
        print("📊 Querying organizations...")
        organizations = await prisma.organization.find_many()
        print(f"✅ Found {len(organizations)} organizations")
        
        for org in organizations:
            print(f"  - {org.name} (ID: {org.id})")
        
        # Test multi-tenant context by querying users for first org
        if organizations:
            org_id = organizations[0].id
            print(f"👥 Querying users for organization {org_id}...")
            users = await prisma.user.find_many(where={'orgId': org_id})
            print(f"✅ Found {len(users)} users")
            
            for user in users:
                print(f"  - {user.email} (Role: {user.role})")
        
        # Test RLS by setting tenant context
        print("🔐 Testing RLS with tenant context...")
        await prisma.execute_raw(f"SET app.current_tenant = '{org_id}'")
        
        # Query should only return data for this tenant
        orgs_for_tenant = await prisma.organization.find_many()
        print(f"✅ RLS test: Found {len(orgs_for_tenant)} organizations for tenant")
        
        # Reset tenant context
        await prisma.execute_raw("RESET app.current_tenant")
        
        print("🎉 Database connection and basic CRUD operations successful!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        raise
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(test_db_connection())