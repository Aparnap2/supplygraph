#!/usr/bin/env python3
"""
Seed script for SupplyGraph MVP
Creates initial data for testing core procurement workflow
"""

import asyncio
import os
from datetime import datetime
from prisma import Prisma
from prisma.enums import Role, RequestStatus

async def main():
    """Seed the database with initial data"""
    
    # Database connection
    database_url = os.getenv("DATABASE_URL", "postgresql://supplygraph:supplygraph123@localhost:5432/supplygraph")
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Create test organization
        org = await prisma.organization.create({
            'name': 'Test Company Inc',
        })
        print(f"✓ Created organization: {org.name}")
        
        # Create test user
        user = await prisma.user.create({
            'email': 'admin@testcompany.com',
            'passwordHash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', # password: admin123
            'orgId': org.id,
            'role': Role.ADMIN,
        })
        print(f"✓ Created user: {user.email}")
        
        # Create test vendors
        vendors = []
        vendor_data = [
            {'name': 'Office Supplies Co', 'email': 'sales@officesupplies.com'},
            {'name': 'Tech Equipment Ltd', 'email': 'quotes@techequip.com'},
            {'name': 'Furniture Plus', 'email': 'orders@furnitureplus.com'},
        ]
        
        for vendor_info in vendor_data:
            vendor = await prisma.vendor.create({
                'orgId': org.id,
                'name': vendor_info['name'],
                'email': vendor_info['email'],
                'metadata': {'contact': vendor_info['email'], 'rating': 4.5}
            })
            vendors.append(vendor)
            print(f"✓ Created vendor: {vendor.name}")
        
        # Create sample procurement request
        request = await prisma.procurementrequest.create({
            'orgId': org.id,
            'createdBy': user.id,
            'status': RequestStatus.CREATED,
            'items': {
                'items': [
                    {'name': 'Office Chairs', 'quantity': 10, 'specifications': 'Ergonomic, mesh back'},
                    {'name': 'Standing Desks', 'quantity': 5, 'specifications': 'Adjustable height, 120x60cm'},
                    {'name': 'Monitors', 'quantity': 15, 'specifications': '27 inch, 4K, IPS'}
                ]
            }
        })
        print(f"✓ Created procurement request: {request.id}")
        
        print("\n🎉 Database seeded successfully!")
        print("\n📝 Test Data Created:")
        print(f"   • Organization: {org.name}")
        print(f"   • User: {user.email} (password: admin123)")
        print(f"   • Vendors: {len(vendors)} vendors")
        print(f"   • Procurement Request: {request.id}")
        print("\n🔧 Ready to test core workflow:")
        print("   1. Login at http://localhost:3000")
        print("   2. View procurement request")
        print("   3. Send RFQs to vendors")
        print("   4. Process quotes and approve")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())