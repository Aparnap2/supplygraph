"""
Comprehensive database CRUD operations tests for SupplyGraph
"""
import pytest
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any
import asyncio


@pytest.mark.asyncio
class TestOrganizationCRUD:
    """Test organization CRUD operations"""

    async def test_create_organization(self, test_database):
        """Test creating a new organization"""
        org_id = str(uuid.uuid4())
        org_data = {
            'id': org_id,
            'name': 'New Test Organization',
            'slug': f'new-test-org-{org_id[:8]}',
            'description': 'A new organization for testing CRUD operations',
            'website': 'https://newtestorg.com',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }

        try:
            # Create organization
            await test_database.execute_raw("""
                INSERT INTO supplygraph.organization
                (id, name, slug, description, website, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            """, *[value for value in org_data.values()])

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.organization WHERE id = $1
            """, org_id)

            assert result is not None
            assert result['name'] == org_data['name']
            assert result['slug'] == org_data['slug']
            print(f"✅ Successfully created and verified organization: {org_id}")

        except Exception as e:
            pytest.fail(f"Failed to create organization: {e}")

    async def test_read_organization(self, test_database, test_organization):
        """Test reading organization data"""
        try:
            # Read single organization
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.organization WHERE id = $1
            """, test_organization['id'])

            assert result is not None
            assert result['name'] == test_organization['name']
            assert result['slug'] == test_organization['slug']

            # Read all organizations
            results = await test_database.query_raw("""
                SELECT * FROM supplygraph.organization ORDER BY createdAt DESC
            """)

            assert len(results) >= 1
            print(f"✅ Successfully read {len(results)} organization(s)")

        except Exception as e:
            pytest.fail(f"Failed to read organization: {e}")

    async def test_update_organization(self, test_database, test_organization):
        """Test updating organization data"""
        new_name = "Updated Test Organization"
        new_description = "Updated description for testing"

        try:
            # Update organization
            await test_database.execute_raw("""
                UPDATE supplygraph.organization
                SET name = $1, description = $2, updatedAt = $3
                WHERE id = $4
            """, new_name, new_description, datetime.utcnow(), test_organization['id'])

            # Verify update
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.organization WHERE id = $1
            """, test_organization['id'])

            assert result is not None
            assert result['name'] == new_name
            assert result['description'] == new_description
            print(f"✅ Successfully updated organization: {test_organization['id']}")

        except Exception as e:
            pytest.fail(f"Failed to update organization: {e}")

    async def test_delete_organization(self, test_database, test_organization):
        """Test deleting organization (soft delete via audit log)"""
        try:
            # First create an audit log entry before deletion
            audit_id = str(uuid.uuid4())
            await test_database.execute_raw("""
                INSERT INTO supplygraph.audit_log
                (id, organizationId, action, resourceType, resourceId, createdAt)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, audit_id, test_organization['id'], 'DELETE', 'organization',
                test_organization['id'], datetime.utcnow())

            # Delete organization
            await test_database.execute_raw("""
                DELETE FROM supplygraph.organization WHERE id = $1
            """, test_organization['id'])

            # Verify deletion
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.organization WHERE id = $1
            """, test_organization['id'])

            assert result is None

            # Verify audit log exists
            audit_result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.audit_log WHERE id = $1
            """, audit_id)

            assert audit_result is not None
            assert audit_result['action'] == 'DELETE'
            print(f"✅ Successfully deleted organization: {test_organization['id']}")

        except Exception as e:
            pytest.fail(f"Failed to delete organization: {e}")


@pytest.mark.asyncio
class TestUserCRUD:
    """Test user CRUD operations"""

    async def test_create_user(self, test_database):
        """Test creating a new user"""
        user_id = str(uuid.uuid4())
        user_data = {
            'id': user_id,
            'name': 'New Test User',
            'email': f'new-user-{user_id[:8]}@test.com',
            'role': 'USER',
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }

        try:
            # Create user
            await test_database.execute_raw("""
                INSERT INTO supplygraph.user
                (id, name, email, role, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, *[value for value in user_data.values()])

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.user WHERE id = $1
            """, user_id)

            assert result is not None
            assert result['email'] == user_data['email']
            assert result['name'] == user_data['name']
            print(f"✅ Successfully created and verified user: {user_data['email']}")

        except Exception as e:
            pytest.fail(f"Failed to create user: {e}")

    async def test_user_unique_email(self, test_database, test_user):
        """Test that email uniqueness is enforced"""
        user_id = str(uuid.uuid4())

        try:
            # Try to create user with duplicate email
            await test_database.execute_raw("""
                INSERT INTO supplygraph.user
                (id, name, email, role, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, user_id, 'Duplicate User', test_user['email'], 'USER',
                datetime.utcnow(), datetime.utcnow())

            # If we reach here, uniqueness constraint wasn't enforced
            pytest.fail("Email uniqueness constraint not enforced")

        except Exception as e:
            # This is expected - duplicate email should fail
            print(f"✅ Email uniqueness constraint working: {e}")

    async def test_user_organization_membership(self, test_database, test_user, test_organization):
        """Test user membership in organizations"""
        membership_id = str(uuid.uuid4())

        try:
            # Create membership
            await test_database.execute_raw("""
                INSERT INTO supplygraph.member
                (id, organizationId, userId, role, joinedAt)
                VALUES ($1, $2, $3, $4, $5)
            """, membership_id, test_organization['id'], test_user['id'],
                'MANAGER', datetime.utcnow())

            # Verify membership
            result = await test_database.query_first_raw("""
                SELECT m.*, u.name as userName, o.name as orgName
                FROM supplygraph.member m
                JOIN supplygraph.user u ON m.userId = u.id
                JOIN supplygraph.organization o ON m.organizationId = o.id
                WHERE m.id = $1
            """, membership_id)

            assert result is not None
            assert result['role'] == 'MANAGER'
            assert result['userId'] == test_user['id']
            assert result['organizationId'] == test_organization['id']
            print(f"✅ Successfully created membership: {result['userName']} -> {result['orgName']}")

        except Exception as e:
            pytest.fail(f"Failed to create membership: {e}")


@pytest.mark.asyncio
class TestVendorCRUD:
    """Test vendor CRUD operations"""

    async def test_create_vendor(self, test_database, test_organization):
        """Test creating a new vendor"""
        vendor_id = str(uuid.uuid4())
        vendor_data = {
            'id': vendor_id,
            'name': 'New Test Vendor',
            'email': f'vendor-{vendor_id[:8]}@testvendor.com',
            'phone': '+1-555-9876',
            'website': 'https://newtestvendor.com',
            'description': 'A new vendor for testing',
            'organizationId': test_organization['id'],
            'isActive': True,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }

        try:
            # Create vendor
            await test_database.execute_raw("""
                INSERT INTO supplygraph.vendor
                (id, name, email, phone, website, description, organizationId, isActive, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """, *[value for value in vendor_data.values()])

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.vendor WHERE id = $1
            """, vendor_id)

            assert result is not None
            assert result['name'] == vendor_data['name']
            assert result['email'] == vendor_data['email']
            print(f"✅ Successfully created vendor: {vendor_data['name']}")

        except Exception as e:
            pytest.fail(f"Failed to create vendor: {e}")

    async def test_vendor_contacts(self, test_database, test_vendor):
        """Test vendor contact management"""
        contact_id = str(uuid.uuid4())

        try:
            # Create vendor contact
            await test_database.execute_raw("""
                INSERT INTO supplygraph.vendor_contact
                (id, vendorId, name, title, email, phone, isPrimary)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            """, contact_id, test_vendor['id'], 'John Doe', 'Sales Manager',
                'john.doe@testvendor.com', '+1-555-1234', True)

            # Verify contact creation
            result = await test_database.query_first_raw("""
                SELECT vc.*, v.name as vendorName
                FROM supplygraph.vendor_contact vc
                JOIN supplygraph.vendor v ON vc.vendorId = v.id
                WHERE vc.id = $1
            """, contact_id)

            assert result is not None
            assert result['name'] == 'John Doe'
            assert result['email'] == 'john.doe@testvendor.com'
            assert result['isPrimary'] is True
            print(f"✅ Successfully created vendor contact: {result['name']}")

        except Exception as e:
            pytest.fail(f"Failed to create vendor contact: {e}")

    async def test_vendor_contracts(self, test_database, test_vendor):
        """Test vendor contract management"""
        contract_id = str(uuid.uuid4())

        try:
            # Create vendor contract
            await test_database.execute_raw("""
                INSERT INTO supplygraph.vendor_contract
                (id, vendorId, contractNumber, startDate, endDate, terms, autoRenew)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            """, contract_id, test_vendor['id'], 'CONTRACT-001',
                datetime.utcnow(), datetime.utcnow() + timedelta(days=365),
                'Standard terms and conditions', True)

            # Verify contract creation
            result = await test_database.query_first_raw("""
                SELECT vc.*, v.name as vendorName
                FROM supplygraph.vendor_contract vc
                JOIN supplygraph.vendor v ON vc.vendorId = v.id
                WHERE vc.id = $1
            """, contract_id)

            assert result is not None
            assert result['contractNumber'] == 'CONTRACT-001'
            assert result['autoRenew'] is True
            print(f"✅ Successfully created vendor contract: {result['contractNumber']}")

        except Exception as e:
            pytest.fail(f"Failed to create vendor contract: {e}")


@pytest.mark.asyncio
class TestProductCRUD:
    """Test product CRUD operations"""

    async def test_create_product(self, test_database, test_organization, test_category):
        """Test creating a new product"""
        product_id = str(uuid.uuid4())
        product_data = {
            'id': product_id,
            'sku': f'TEST-PROD-{product_id[:8]}',
            'name': 'Test Office Chair',
            'description': 'Ergonomic office chair for testing',
            'categoryId': test_category['id'],
            'organizationId': test_organization['id'],
            'unit': 'each',
            'unitPrice': 299.99,
            'currentStock': 50,
            'minStock': 5,
            'maxStock': 200,
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }

        try:
            # Create product
            await test_database.execute_raw("""
                INSERT INTO supplygraph.product
                (id, sku, name, description, categoryId, organizationId, unit, unitPrice, currentStock, minStock, maxStock, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """, *[value for value in product_data.values()])

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT p.*, c.name as categoryName
                FROM supplygraph.product p
                JOIN supplygraph.category c ON p.categoryId = c.id
                WHERE p.id = $1
            """, product_id)

            assert result is not None
            assert result['sku'] == product_data['sku']
            assert result['name'] == product_data['name']
            assert float(result['unitPrice']) == product_data['unitPrice']
            print(f"✅ Successfully created product: {product_data['name']}")

        except Exception as e:
            pytest.fail(f"Failed to create product: {e}")

    async def test_product_stock_management(self, test_database, test_organization, test_category):
        """Test product stock level management"""
        product_id = str(uuid.uuid4())

        try:
            # Create product with initial stock
            await test_database.execute_raw("""
                INSERT INTO supplygraph.product
                (id, sku, name, categoryId, organizationId, unit, currentStock, minStock, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """, product_id, f'STOCK-TEST-{product_id[:8]}', 'Stock Test Product',
                test_category['id'], test_organization['id'], 'each', 100, 10,
                datetime.utcnow(), datetime.utcnow())

            # Update stock levels
            await test_database.execute_raw("""
                UPDATE supplygraph.product
                SET currentStock = $1, updatedAt = $2
                WHERE id = $3
            """, 85, datetime.utcnow(), product_id)

            # Verify stock update
            result = await test_database.query_first_raw("""
                SELECT currentStock, minStock FROM supplygraph.product WHERE id = $1
            """, product_id)

            assert result is not None
            assert result['currentStock'] == 85
            assert result['minStock'] == 10

            # Check reorder point logic (currentStock < minStock)
            needs_reorder = result['currentStock'] < result['minStock']
            assert needs_reorder is False
            print(f"✅ Stock management working: {result['currentStock']} units, reorder point: {result['minStock']}")

        except Exception as e:
            pytest.fail(f"Failed stock management test: {e}")


@pytest.mark.asyncio
class TestProcurementRequestCRUD:
    """Test procurement request CRUD operations"""

    async def test_create_procurement_request(self, test_database, test_organization, test_user):
        """Test creating a procurement request"""
        try:
            request_data = await create_test_procurement_request(
                test_database,
                test_organization['id'],
                test_user['id'],
                title='Test Laptop Purchase',
                description='High-performance laptops for development team',
                status='DRAFT',
                priority='HIGH'
            )

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT pr.*, u.name as requesterName
                FROM supplygraph.procurement_request pr
                JOIN supplygraph.user u ON pr.requesterId = u.id
                WHERE pr.id = $1
            """, request_data['id'])

            assert result is not None
            assert result['title'] == 'Test Laptop Purchase'
            assert result['status'] == 'DRAFT'
            assert result['priority'] == 'HIGH'
            print(f"✅ Successfully created procurement request: {result['title']}")

        except Exception as e:
            pytest.fail(f"Failed to create procurement request: {e}")

    async def test_procurement_request_items(self, test_database, test_organization, test_user):
        """Test procurement request item management"""
        request_data = await create_test_procurement_request(
            test_database,
            test_organization['id'],
            test_user['id'],
            title='Office Supplies Request'
        )

        item_id = str(uuid.uuid4())

        try:
            # Create procurement request item
            await test_database.execute_raw("""
                INSERT INTO supplygraph.procurement_item
                (id, requestId, name, description, quantity, unit, unitPrice, totalPrice, status, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            """, item_id, request_data['id'], 'Wireless Mouse',
                'Ergonomic wireless mouse with long battery life',
                10, 'each', 25.99, 259.90, 'PENDING',
                datetime.utcnow(), datetime.utcnow())

            # Verify item creation
            result = await test_database.query_first_raw("""
                SELECT pi.*, pr.title as requestTitle
                FROM supplygraph.procurement_item pi
                JOIN supplygraph.procurement_request pr ON pi.requestId = pr.id
                WHERE pi.id = $1
            """, item_id)

            assert result is not None
            assert result['name'] == 'Wireless Mouse'
            assert result['quantity'] == 10
            assert float(result['totalPrice']) == 259.90
            print(f"✅ Successfully created procurement item: {result['name']}")

        except Exception as e:
            pytest.fail(f"Failed to create procurement item: {e}")

    async def test_procurement_workflow_states(self, test_database, test_organization, test_user):
        """Test procurement request workflow state transitions"""
        request_data = await create_test_procurement_request(
            test_database,
            test_organization['id'],
            test_user['id'],
            status='DRAFT'
        )

        try:
            # Test state transitions
            states = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'COMPLETED']

            for state in states:
                await test_database.execute_raw("""
                    UPDATE supplygraph.procurement_request
                    SET status = $1, updatedAt = $2
                    WHERE id = $3
                """, state, datetime.utcnow(), request_data['id'])

                # Verify state
                result = await test_database.query_first_raw("""
                    SELECT status FROM supplygraph.procurement_request WHERE id = $1
                """, request_data['id'])

                assert result['status'] == state
                print(f"✅ State transition successful: {state}")

        except Exception as e:
            pytest.fail(f"Failed workflow state test: {e}")


@pytest.mark.asyncio
class TestQuoteCRUD:
    """Test quote CRUD operations"""

    async def test_create_quote(self, test_database, test_organization, test_vendor):
        """Test creating a quote"""
        # First create a procurement request for the quote
        user_id = str(uuid.uuid4())
        request_data = await create_test_procurement_request(
            test_database,
            test_organization['id'],
            user_id,
            title='Quote Test Request'
        )

        quote_id = str(uuid.uuid4())

        try:
            # Create quote
            await test_database.execute_raw("""
                INSERT INTO supplygraph.quote
                (id, quoteNumber, requestId, vendorId, organizationId, status, subtotal, tax, shipping, totalAmount, currency, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            """, quote_id, f'QUOTE-{datetime.now().strftime("%Y%m%d")}-{quote_id[:8]}',
                request_data['id'], test_vendor['id'], test_organization['id'],
                'RECEIVED', 500.00, 45.00, 25.00, 570.00, 'USD',
                datetime.utcnow(), datetime.utcnow())

            # Verify creation
            result = await test_database.query_first_raw("""
                SELECT q.*, v.name as vendorName, pr.title as requestTitle
                FROM supplygraph.quote q
                JOIN supplygraph.vendor v ON q.vendorId = v.id
                JOIN supplygraph.procurement_request pr ON q.requestId = pr.id
                WHERE q.id = $1
            """, quote_id)

            assert result is not None
            assert result['status'] == 'RECEIVED'
            assert float(result['totalAmount']) == 570.00
            print(f"✅ Successfully created quote: {result['quoteNumber']}")

        except Exception as e:
            pytest.fail(f"Failed to create quote: {e}")

    async def test_quote_items(self, test_database, test_organization, test_vendor):
        """Test quote item management"""
        # Create quote and related data
        user_id = str(uuid.uuid4())
        request_data = await create_test_procurement_request(
            test_database,
            test_organization['id'],
            user_id,
            title='Quote Items Test Request'
        )

        quote_id = str(uuid.uuid4())
        await test_database.execute_raw("""
            INSERT INTO supplygraph.quote
            (id, quoteNumber, requestId, vendorId, organizationId, status, totalAmount, currency, createdAt, updatedAt)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        """, quote_id, 'QUOTE-ITEMS-TEST', request_data['id'], test_vendor['id'],
            test_organization['id'], 'RECEIVED', 200.00, 'USD',
            datetime.utcnow(), datetime.utcnow())

        item_id = str(uuid.uuid4())

        try:
            # Create quote item
            await test_database.execute_raw("""
                INSERT INTO supplygraph.quote_item
                (id, quoteId, name, description, quantity, unit, unitPrice, totalPrice, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            """, item_id, quote_id, 'USB-C Cable', 'High-quality USB-C charging cable',
                5, 'each', 15.99, 79.95, datetime.utcnow(), datetime.utcnow())

            # Verify item creation
            result = await test_database.query_first_raw("""
                SELECT qi.*, q.quoteNumber
                FROM supplygraph.quote_item qi
                JOIN supplygraph.quote q ON qi.quoteId = q.id
                WHERE qi.id = $1
            """, item_id)

            assert result is not None
            assert result['name'] == 'USB-C Cable'
            assert result['quantity'] == 5
            assert float(result['totalPrice']) == 79.95
            print(f"✅ Successfully created quote item: {result['name']}")

        except Exception as e:
            pytest.fail(f"Failed to create quote item: {e}")


@pytest.mark.asyncio
class TestAuditLogging:
    """Test audit logging functionality"""

    async def test_audit_log_creation(self, test_database, test_organization, test_user):
        """Test audit log creation for various operations"""
        operations = [
            ('CREATE', 'organization', test_organization['id']),
            ('UPDATE', 'user', test_user['id']),
            ('DELETE', 'vendor', str(uuid.uuid4())),
            ('APPROVE', 'procurement_request', str(uuid.uuid4())),
        ]

        for action, resource_type, resource_id in operations:
            audit_id = str(uuid.uuid4())

            try:
                await test_database.execute_raw("""
                    INSERT INTO supplygraph.audit_log
                    (id, organizationId, userId, action, resourceType, resourceId, createdAt)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                """, audit_id, test_organization['id'], test_user['id'],
                    action, resource_type, resource_id, datetime.utcnow())

                # Verify audit log entry
                result = await test_database.query_first_raw("""
                    SELECT * FROM supplygraph.audit_log WHERE id = $1
                """, audit_id)

                assert result is not None
                assert result['action'] == action
                assert result['resourceType'] == resource_type
                print(f"✅ Audit log created: {action} {resource_type}")

            except Exception as e:
                pytest.fail(f"Failed to create audit log for {action}: {e}")


@pytest.mark.asyncio
class TestDataConsistency:
    """Test data consistency across related tables"""

    async def test_referential_integrity(self, test_database):
        """Test foreign key constraints and referential integrity"""
        # Test that we can't create procurement items without a valid request
        invalid_request_id = str(uuid.uuid4())
        item_id = str(uuid.uuid4())

        try:
            await test_database.execute_raw("""
                INSERT INTO supplygraph.procurement_item
                (id, requestId, name, quantity, unit, status, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            """, item_id, invalid_request_id, 'Test Item', 1, 'each',
                'PENDING', datetime.utcnow(), datetime.utcnow())

            # Should not reach here - foreign key constraint should fail
            pytest.fail("Foreign key constraint not enforced for procurement_item")

        except Exception as e:
            print(f"✅ Foreign key constraint working: {e}")

    async def test_cascade_delete_simulation(self, test_database, test_organization):
        """Test cascade delete behavior (simulated)"""
        # Create test data that would be affected by cascade
        vendor_id = str(uuid.uuid4())
        contact_id = str(uuid.uuid4())

        try:
            # Create vendor
            await test_database.execute_raw("""
                INSERT INTO supplygraph.vendor
                (id, name, organizationId, isActive, createdAt, updatedAt)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, vendor_id, 'Test Vendor for Cascade', test_organization['id'],
                True, datetime.utcnow(), datetime.utcnow())

            # Create vendor contact (should be deleted with vendor)
            await test_database.execute_raw("""
                INSERT INTO supplygraph.vendor_contact
                (id, vendorId, name, email, isPrimary)
                VALUES ($1, $2, $3, $4, $5)
            """, contact_id, vendor_id, 'Contact Person', 'contact@test.com', True)

            # Verify both exist
            vendor_result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.vendor WHERE id = $1
            """, vendor_id)
            assert vendor_result is not None

            contact_result = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.vendor_contact WHERE id = $1
            """, contact_id)
            assert contact_result is not None

            # Simulate cascade by deleting contact first, then vendor
            await test_database.execute_raw("""
                DELETE FROM supplygraph.vendor_contact WHERE vendorId = $1
            """, vendor_id)

            await test_database.execute_raw("""
                DELETE FROM supplygraph.vendor WHERE id = $1
            """, vendor_id)

            # Verify both are deleted
            vendor_after = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.vendor WHERE id = $1
            """, vendor_id)
            assert vendor_after is None

            contact_after = await test_database.query_first_raw("""
                SELECT * FROM supplygraph.vendor_contact WHERE id = $1
            """, contact_id)
            assert contact_after is None

            print(f"✅ Cascade delete behavior verified")

        except Exception as e:
            pytest.fail(f"Failed cascade delete test: {e}")


# Helper function import
async def create_test_procurement_request(
    test_database,
    org_id: str,
    user_id: str,
    **kwargs
):
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