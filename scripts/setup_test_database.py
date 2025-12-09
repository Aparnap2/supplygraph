#!/usr/bin/env python3
"""
Setup script for SupplyGraph test database
Creates the database schema and test data
"""
import asyncio
import sys
import os
import subprocess
from pathlib import Path

# Add the parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

import psycopg2
from psycopg2.extras import RealDictCursor


async def setup_database():
    """Set up the test database with the SupplyGraph schema"""

    # Database connection details
    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'agentstack',
        'user': 'postgres',
        'password': 'password'
    }

    print("🔄 Setting up SupplyGraph test database...")

    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(**db_config)
        conn.autocommit = True
        cursor = conn.cursor()

        print("✅ Connected to PostgreSQL")

        # Create supplygraph schema
        try:
            cursor.execute('CREATE SCHEMA IF NOT EXISTS supplygraph;')
            print("✅ Created supplygraph schema")
        except Exception as e:
            print(f"⚠️  Schema creation warning: {e}")

        # Create tables manually based on the Prisma schema
        create_tables_sql = """
        -- Core Tables
        DROP TABLE IF EXISTS supplygraph.user CASCADE;
        CREATE TABLE supplygraph.user (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT,
            email VARCHAR(191) UNIQUE NOT NULL,
            emailVerified TIMESTAMP(3),
            image TEXT,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            role TEXT NOT NULL DEFAULT 'USER'
        );

        DROP TABLE IF EXISTS supplygraph.account CASCADE;
        CREATE TABLE supplygraph.account (
            id VARCHAR(191) PRIMARY KEY,
            userId VARCHAR(191) NOT NULL,
            type VARCHAR(191) NOT NULL,
            provider VARCHAR(191) NOT NULL,
            providerAccountId VARCHAR(191) NOT NULL,
            refresh_token TEXT,
            access_token TEXT,
            expires_at INTEGER,
            token_type TEXT,
            scope TEXT,
            id_token TEXT,
            session_state TEXT,
            FOREIGN KEY (userId) REFERENCES supplygraph.user(id) ON DELETE CASCADE,
            UNIQUE(provider, providerAccountId)
        );

        DROP TABLE IF EXISTS supplygraph.session CASCADE;
        CREATE TABLE supplygraph.session (
            id VARCHAR(191) PRIMARY KEY,
            sessionToken VARCHAR(191) UNIQUE NOT NULL,
            userId VARCHAR(191) NOT NULL,
            expires TIMESTAMP(3) NOT NULL,
            FOREIGN KEY (userId) REFERENCES supplygraph.user(id) ON DELETE CASCADE
        );

        DROP TABLE IF EXISTS supplygraph.verificationToken CASCADE;
        CREATE TABLE supplygraph.verificationToken (
            identifier TEXT NOT NULL,
            token VARCHAR(191) NOT NULL,
            expires TIMESTAMP(3) NOT NULL,
            UNIQUE(identifier, token)
        );

        -- Organization Tables
        DROP TABLE IF EXISTS supplygraph.organization CASCADE;
        CREATE TABLE supplygraph.organization (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT NOT NULL,
            slug VARCHAR(191) UNIQUE NOT NULL,
            description TEXT,
            logo TEXT,
            website TEXT,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        DROP TABLE IF EXISTS supplygraph.member CASCADE;
        CREATE TABLE supplygraph.member (
            id VARCHAR(191) PRIMARY KEY,
            organizationId VARCHAR(191) NOT NULL,
            userId VARCHAR(191) NOT NULL,
            role TEXT NOT NULL DEFAULT 'MEMBER',
            invitedBy VARCHAR(191),
            joinedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            lastLoginAt TIMESTAMP(3),
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES supplygraph.user(id) ON DELETE CASCADE,
            UNIQUE(organizationId, userId)
        );

        DROP TABLE IF EXISTS supplygraph.organizationSettings CASCADE;
        CREATE TABLE supplygraph.organizationSettings (
            id VARCHAR(191) PRIMARY KEY,
            organizationId VARCHAR(191) UNIQUE NOT NULL,
            approvalRequired BOOLEAN NOT NULL DEFAULT true,
            approvalAmount DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
            autoVendorMatching BOOLEAN NOT NULL DEFAULT true,
            emailNotifications BOOLEAN NOT NULL DEFAULT true,
            slackWebhook TEXT,
            stripeEnabled BOOLEAN NOT NULL DEFAULT false,
            stripeAccountId VARCHAR(191),
            currency TEXT NOT NULL DEFAULT 'USD',
            timezone TEXT NOT NULL DEFAULT 'UTC',
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE
        );

        -- Category Tables
        DROP TABLE IF EXISTS supplygraph.category CASCADE;
        CREATE TABLE supplygraph.category (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            slug VARCHAR(191) NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            parentId VARCHAR(191),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (parentId) REFERENCES supplygraph.category(id),
            UNIQUE(organizationId, slug)
        );

        -- Department Tables
        DROP TABLE IF EXISTS supplygraph.department CASCADE;
        CREATE TABLE supplygraph.department (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            code TEXT NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            budget DECIMAL(10, 2),
            managerId VARCHAR(191),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (managerId) REFERENCES supplygraph.member(id),
            UNIQUE(organizationId, code)
        );

        -- Product Tables
        DROP TABLE IF EXISTS supplygraph.product CASCADE;
        CREATE TABLE supplygraph.product (
            id VARCHAR(191) PRIMARY KEY,
            sku TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            categoryId VARCHAR(191) NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            unit TEXT NOT NULL DEFAULT 'each',
            unitPrice DECIMAL(10, 2),
            currentStock INTEGER NOT NULL DEFAULT 0,
            minStock INTEGER NOT NULL DEFAULT 0,
            maxStock INTEGER,
            reorderPoint INTEGER,
            supplier TEXT,
            specifications JSONB,
            images TEXT[],
            tags TEXT[],
            createdBy VARCHAR(191),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (categoryId) REFERENCES supplygraph.category(id),
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            UNIQUE(organizationId, sku)
        );

        -- Vendor Tables
        DROP TABLE IF EXISTS supplygraph.vendor CASCADE;
        CREATE TABLE supplygraph.vendor (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT NOT NULL,
            email VARCHAR(191) UNIQUE,
            phone TEXT,
            website TEXT,
            description TEXT,
            addressLine1 TEXT,
            addressLine2 TEXT,
            city TEXT,
            state TEXT,
            country TEXT,
            postalCode TEXT,
            taxId TEXT,
            paymentTerms TEXT,
            rating DECIMAL(3, 2),
            organizationId VARCHAR(191) NOT NULL,
            tags TEXT[],
            isActive BOOLEAN NOT NULL DEFAULT true,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE
        );

        DROP TABLE IF EXISTS supplygraph.vendorContact CASCADE;
        CREATE TABLE supplygraph.vendorContact (
            id VARCHAR(191) PRIMARY KEY,
            vendorId VARCHAR(191) NOT NULL,
            name TEXT NOT NULL,
            title TEXT,
            email TEXT NOT NULL,
            phone TEXT,
            isPrimary BOOLEAN NOT NULL DEFAULT false,
            FOREIGN KEY (vendorId) REFERENCES supplygraph.vendor(id) ON DELETE CASCADE
        );

        DROP TABLE IF EXISTS supplygraph.vendorContract CASCADE;
        CREATE TABLE supplygraph.vendorContract (
            id VARCHAR(191) PRIMARY KEY,
            vendorId VARCHAR(191) NOT NULL,
            contractNumber TEXT UNIQUE NOT NULL,
            startDate TIMESTAMP(3) NOT NULL,
            endDate TIMESTAMP(3),
            terms TEXT,
            autoRenew BOOLEAN NOT NULL DEFAULT false,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vendorId) REFERENCES supplygraph.vendor(id) ON DELETE CASCADE
        );

        -- Procurement Tables
        DROP TABLE IF EXISTS supplygraph.procurementRequest CASCADE;
        CREATE TABLE supplygraph.procurementRequest (
            id VARCHAR(191) PRIMARY KEY,
            requestNumber TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            organizationId VARCHAR(191) NOT NULL,
            requesterId VARCHAR(191) NOT NULL,
            departmentId VARCHAR(191),
            status TEXT NOT NULL DEFAULT 'DRAFT',
            priority TEXT NOT NULL DEFAULT 'MEDIUM',
            threadId TEXT UNIQUE NOT NULL,
            workflowState JSONB,
            totalAmount DECIMAL(10, 2),
            currency TEXT NOT NULL DEFAULT 'USD',
            requiresApproval BOOLEAN NOT NULL DEFAULT false,
            approverId VARCHAR(191),
            approvedAt TIMESTAMP(3),
            approvedBy TEXT,
            neededBy TIMESTAMP(3),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completedAt TIMESTAMP(3),
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (requesterId) REFERENCES supplygraph.user(id),
            FOREIGN KEY (departmentId) REFERENCES supplygraph.department(id),
            FOREIGN KEY (approverId) REFERENCES supplygraph.member(id)
        );

        DROP TABLE IF EXISTS supplygraph.procurementItem CASCADE;
        CREATE TABLE supplygraph.procurementItem (
            id VARCHAR(191) PRIMARY KEY,
            requestId VARCHAR(191) NOT NULL,
            productId VARCHAR(191),
            name TEXT NOT NULL,
            description TEXT,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL DEFAULT 'each',
            unitPrice DECIMAL(10, 2),
            totalPrice DECIMAL(10, 2),
            specifications JSONB,
            status TEXT NOT NULL DEFAULT 'PENDING',
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requestId) REFERENCES supplygraph.procurementRequest(id) ON DELETE CASCADE,
            FOREIGN KEY (productId) REFERENCES supplygraph.product(id)
        );

        DROP TABLE IF EXISTS supplygraph.procurementTemplate CASCADE;
        CREATE TABLE supplygraph.procurementTemplate (
            id VARCHAR(191) PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            organizationId VARCHAR(191) NOT NULL,
            departmentId VARCHAR(191),
            categoryId VARCHAR(191),
            items JSONB NOT NULL,
            workflow JSONB,
            approvalRules JSONB,
            isActive BOOLEAN NOT NULL DEFAULT true,
            createdBy VARCHAR(191),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (departmentId) REFERENCES supplygraph.department(id),
            FOREIGN KEY (categoryId) REFERENCES supplygraph.category(id)
        );

        -- Quote Tables
        DROP TABLE IF EXISTS supplygraph.quote CASCADE;
        CREATE TABLE supplygraph.quote (
            id VARCHAR(191) PRIMARY KEY,
            quoteNumber TEXT UNIQUE NOT NULL,
            requestId VARCHAR(191) NOT NULL,
            vendorId VARCHAR(191) NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            status TEXT NOT NULL DEFAULT 'DRAFT',
            validUntil TIMESTAMP(3),
            subtotal DECIMAL(10, 2) NOT NULL,
            tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
            shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
            totalAmount DECIMAL(10, 2) NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            terms TEXT,
            notes TEXT,
            attachments TEXT[],
            responseDate TIMESTAMP(3),
            respondedBy TEXT,
            receivedVia TEXT,
            aiGenerated BOOLEAN NOT NULL DEFAULT false,
            confidence DECIMAL(5, 2),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (requestId) REFERENCES supplygraph.procurementRequest(id) ON DELETE CASCADE,
            FOREIGN KEY (vendorId) REFERENCES supplygraph.vendor(id),
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE
        );

        DROP TABLE IF EXISTS supplygraph.quoteItem CASCADE;
        CREATE TABLE supplygraph.quoteItem (
            id VARCHAR(191) PRIMARY KEY,
            quoteId VARCHAR(191) NOT NULL,
            requestItemId VARCHAR(191),
            name TEXT NOT NULL,
            description TEXT,
            quantity INTEGER NOT NULL,
            unit TEXT NOT NULL,
            unitPrice DECIMAL(10, 2) NOT NULL,
            totalPrice DECIMAL(10, 2) NOT NULL,
            productId VARCHAR(191),
            specifications JSONB,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (quoteId) REFERENCES supplygraph.quote(id) ON DELETE CASCADE,
            FOREIGN KEY (requestItemId) REFERENCES supplygraph.procurementItem(id),
            FOREIGN KEY (productId) REFERENCES supplygraph.product(id)
        );

        -- AI and Workflow Tables
        DROP TABLE IF EXISTS supplygraph.langGraphThread CASCADE;
        CREATE TABLE supplygraph.langGraphThread (
            id VARCHAR(191) PRIMARY KEY,
            threadId TEXT UNIQUE NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            requestId VARCHAR(191) UNIQUE,
            state JSONB NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            currentNode TEXT,
            metadata JSONB,
            sentiment DECIMAL(5, 2),
            confidence DECIMAL(5, 2),
            riskScore DECIMAL(5, 2),
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completedAt TIMESTAMP(3),
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (requestId) REFERENCES supplygraph.procurementRequest(id)
        );

        DROP TABLE IF EXISTS supplygraph.aiSuggestion CASCADE;
        CREATE TABLE supplygraph.aiSuggestion (
            id VARCHAR(191) PRIMARY KEY,
            type TEXT NOT NULL,
            organizationId VARCHAR(191) NOT NULL,
            requestId VARCHAR(191),
            threadId VARCHAR(191),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            data JSONB NOT NULL,
            confidence DECIMAL(3, 2) NOT NULL,
            reasoning TEXT,
            status TEXT NOT NULL DEFAULT 'PENDING',
            appliedAt TIMESTAMP(3),
            appliedBy TEXT,
            model TEXT,
            version TEXT,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (requestId) REFERENCES supplygraph.procurementRequest(id),
            FOREIGN KEY (threadId) REFERENCES supplygraph.langGraphThread(id)
        );

        -- Audit and Analytics Tables
        DROP TABLE IF EXISTS supplygraph.auditLog CASCADE;
        CREATE TABLE supplygraph.auditLog (
            id VARCHAR(191) PRIMARY KEY,
            organizationId VARCHAR(191) NOT NULL,
            userId VARCHAR(191),
            action TEXT NOT NULL,
            resourceType TEXT NOT NULL,
            resourceId VARCHAR(191),
            oldValues JSONB,
            newValues JSONB,
            ipAddress TEXT,
            userAgent TEXT,
            sessionId VARCHAR(191),
            requestId VARCHAR(191),
            threadId VARCHAR(191),
            metadata JSONB,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES supplygraph.user(id)
        );

        DROP TABLE IF EXISTS supplygraph.activity CASCADE;
        CREATE TABLE supplygraph.activity (
            id VARCHAR(191) PRIMARY KEY,
            organizationId VARCHAR(191) NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            resourceType TEXT,
            resourceId VARCHAR(191),
            userId VARCHAR(191),
            data JSONB,
            isPublic BOOLEAN NOT NULL DEFAULT false,
            isVisibleToAll BOOLEAN NOT NULL DEFAULT true,
            createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (organizationId) REFERENCES supplygraph.organization(id) ON DELETE CASCADE,
            FOREIGN KEY (userId) REFERENCES supplygraph.user(id)
        );

        -- Indexes for performance
        CREATE INDEX IF NOT EXISTS idx_audit_log_org_created ON supplygraph.auditLog(organizationId, createdAt);
        CREATE INDEX IF NOT EXISTS idx_audit_log_user_created ON supplygraph.auditLog(userId, createdAt);
        CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON supplygraph.auditLog(resourceType, resourceId);

        CREATE INDEX IF NOT EXISTS idx_activity_org_created ON supplygraph.activity(organizationId, createdAt);
        CREATE INDEX IF NOT EXISTS idx_activity_user_created ON supplygraph.activity(userId, createdAt);
        CREATE INDEX IF NOT EXISTS idx_activity_type_resource ON supplygraph.activity(type, resourceType);
        """

        # Execute table creation
        print("🔄 Creating database tables...")
        cursor.execute(create_tables_sql)
        print("✅ Database tables created successfully")

        # Create some test data
        print("🔄 Creating test data...")

        # Import uuid for generating test IDs
        import uuid

        test_org_id = 'test-org-' + str(uuid.uuid4())
        test_user_id = 'test-user-' + str(uuid.uuid4())
        test_member_id = 'test-member-' + str(uuid.uuid4())

        # Insert test organization
        cursor.execute("""
            INSERT INTO supplygraph.organization (id, name, slug, description)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (test_org_id, 'Test Organization', 'test-org', 'Test organization for development'))

        # Insert test user
        cursor.execute("""
            INSERT INTO supplygraph.user (id, name, email, role)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (test_user_id, 'Test User', 'test@example.com', 'USER'))

        # Insert test membership
        cursor.execute("""
            INSERT INTO supplygraph.member (id, organizationId, userId, role)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (organizationId, userId) DO NOTHING
        """, (test_member_id, test_org_id, test_user_id, 'OWNER'))

        # Insert test category
        cursor.execute("""
            INSERT INTO supplygraph.category (id, name, description, slug, organizationId)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, ('test-category-1', 'Office Supplies', 'Office and administrative supplies', 'office-supplies', test_org_id))

        # Insert test vendor
        cursor.execute("""
            INSERT INTO supplygraph.vendor (id, name, email, organizationId)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, ('test-vendor-1', 'Test Vendor', 'vendor@example.com', test_org_id))

        print("✅ Test data created successfully")

        # Close connection
        cursor.close()
        conn.close()

        print("🎉 Database setup completed successfully!")
        return True

    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False


async def verify_setup():
    """Verify that the database was set up correctly"""

    db_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'agentstack',
        'user': 'postgres',
        'password': 'password'
    }

    try:
        conn = psycopg2.connect(**db_config)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        print("🔍 Verifying database setup...")

        # Check if schema exists
        cursor.execute("""
            SELECT schema_name FROM information_schema.schemata
            WHERE schema_name = 'supplygraph'
        """)

        schemas = cursor.fetchall()
        if not schemas:
            print("❌ SupplyGraph schema not found")
            return False

        print("✅ SupplyGraph schema exists")

        # Check if tables exist
        cursor.execute("""
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'supplygraph'
            ORDER BY table_name
        """)

        tables = cursor.fetchall()
        table_names = [t['table_name'] for t in tables]

        expected_tables = [
            'user', 'organization', 'member', 'category', 'vendor',
            'product', 'procurementRequest', 'procurementItem', 'quote',
            'auditLog', 'activity'
        ]

        missing_tables = [t for t in expected_tables if t not in table_names]
        if missing_tables:
            print(f"❌ Missing tables: {missing_tables}")
            return False

        print(f"✅ All expected tables exist ({len(tables)} tables)")

        # Check test data
        cursor.execute("SELECT COUNT(*) as count FROM supplygraph.organization")
        org_count = cursor.fetchone()['count']

        cursor.execute("SELECT COUNT(*) as count FROM supplygraph.user")
        user_count = cursor.fetchone()['count']

        print(f"✅ Test data verified: {org_count} organizations, {user_count} users")

        cursor.close()
        conn.close()

        return True

    except Exception as e:
        print(f"❌ Database verification failed: {e}")
        return False


def main():
    """Main setup function"""
    print("🚀 SupplyGraph Database Setup")
    print("=" * 50)

    # Check if PostgreSQL is running
    try:
        import psycopg2
        conn = psycopg2.connect(
            host='localhost',
            port=5432,
            database='agentstack',
            user='postgres',
            password='password'
        )
        conn.close()
        print("✅ PostgreSQL connection verified")
    except Exception as e:
        print(f"❌ Cannot connect to PostgreSQL: {e}")
        print("   Make sure the agentstack-db-test container is running:")
        print("   docker ps | grep agentstack-db-test")
        return False

    # Run setup
    setup_success = asyncio.run(setup_database())

    if setup_success:
        verify_success = asyncio.run(verify_setup())

        if verify_success:
            print("\n🎉 Database setup completed successfully!")
            print("   You can now run the tests:")
            print("   python -m pytest tests/test_database_crud.py -v")
            print("   python -m pytest tests/test_api_endpoints.py -v")
            return True
        else:
            print("\n❌ Database verification failed")
            return False
    else:
        print("\n❌ Database setup failed")
        return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)