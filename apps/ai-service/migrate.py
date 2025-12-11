#!/usr/bin/env python3
"""
Alembic configuration for SupplyGraph MVP
"""

import asyncio
import os
from prisma import Prisma

async def main():
    """Initialize database schema"""
    
    database_url = os.getenv("DATABASE_URL", "postgresql://supplygraph:supplygraph123@localhost:5432/supplygraph")
    
    prisma = Prisma()
    await prisma.connect()
    
    try:
        # Create database schema using Prisma
        # This is a simplified approach - in production you'd use proper migrations
        await prisma._engine._execute_raw("""
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        -- Create Organization table
        CREATE TABLE IF NOT EXISTS "Organization" (
            "id" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
        );
        
        -- Create User table
        CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "passwordHash" TEXT,
            "orgId" TEXT NOT NULL,
            "role" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        );
        
        -- Create Vendor table
        CREATE TABLE IF NOT EXISTS "Vendor" (
            "id" TEXT NOT NULL,
            "orgId" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "metadata" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
        );
        
        -- Create ProcurementRequest table
        CREATE TABLE IF NOT EXISTS "ProcurementRequest" (
            "id" TEXT NOT NULL,
            "orgId" TEXT NOT NULL,
            "createdBy" TEXT NOT NULL,
            "status" TEXT NOT NULL DEFAULT 'CREATED',
            "items" JSONB NOT NULL,
            "selectedVendorId" TEXT,
            "paymentInfo" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "ProcurementRequest_pkey" PRIMARY KEY ("id")
        );
        
        -- Create Quote table
        CREATE TABLE IF NOT EXISTS "Quote" (
            "id" TEXT NOT NULL,
            "requestId" TEXT NOT NULL,
            "vendorId" TEXT NOT NULL,
            "unitPrice" DOUBLE PRECISION NOT NULL,
            "totalPrice" DOUBLE PRECISION NOT NULL,
            "deliveryETA" INTEGER,
            "terms" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS "User_orgId_idx" ON "User"("orgId");
        CREATE INDEX IF NOT EXISTS "Vendor_orgId_idx" ON "Vendor"("orgId");
        CREATE INDEX IF NOT EXISTS "ProcurementRequest_orgId_idx" ON "ProcurementRequest"("orgId");
        CREATE INDEX IF NOT EXISTS "Quote_requestId_idx" ON "Quote"("requestId");
        CREATE INDEX IF NOT EXISTS "Quote_vendorId_idx" ON "Quote"("vendorId");
        
        -- Create foreign key constraints
        ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_orgId_fkey" FOREIGN KEY("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_orgId_fkey" FOREIGN KEY("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "ProcurementRequest" ADD CONSTRAINT "ProcurementRequest_createdBy_fkey" FOREIGN KEY("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "Quote" ADD CONSTRAINT "Quote_requestId_fkey" FOREIGN KEY("requestId") REFERENCES "ProcurementRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "Quote" ADD CONSTRAINT "Quote_vendorId_fkey" FOREIGN KEY("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        """)
        
        print("✓ Database schema created successfully")
        
    except Exception as e:
        print(f"❌ Error creating schema: {e}")
        raise
    finally:
        await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())