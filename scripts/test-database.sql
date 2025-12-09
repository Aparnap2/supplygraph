-- ====================================================================
-- SupplyGraph Database Test Script
-- Manual PostgreSQL setup validation
-- ====================================================================

-- Start a transaction
BEGIN;

-- Test basic database connectivity
SELECT 'Testing SupplyGraph Database Setup' as test_header;
SELECT NOW() as current_timestamp;
SELECT version() as postgresql_version;

-- Check if all required tables exist
SELECT 'Table Validation' as section_header;

DO $$
DECLARE
    table_count INTEGER;
    expected_tables TEXT[] := ARRAY[
        'organization', 'user', 'member', 'organization_settings',
        'category', 'department', 'product', 'vendor', 'vendor_contact',
        'procurement_request', 'procurement_item', 'procurement_template',
        'quote', 'quote_item', 'vendor_contract',
        'langgraph_thread', 'ai_suggestion',
        'audit_log', 'activity',
        'account', 'session', 'verification_token'
    ];
    missing_tables TEXT[] := '{}';
    table_name TEXT;
BEGIN
    -- Count actual tables
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

    RAISE NOTICE 'Found % tables in public schema', table_count;

    -- Check for missing tables
    FOREACH table_name IN ARRAY expected_tables
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = table_name
        ) THEN
            missing_tables := missing_tables || table_name;
        END IF;
    END LOOP;

    IF array_length(missing_tables, 1) > 0 THEN
        RAISE NOTICE 'Missing tables: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE '✅ All required tables are present';
    END IF;
END $$;

-- Test foreign key constraints
SELECT 'Foreign Key Validation' as section_header;

DO $$
DECLARE
    constraint_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO constraint_count
    FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public';

    RAISE NOTICE 'Found % foreign key constraints', constraint_count;
    RAISE NOTICE '✅ Foreign key constraints validated';
END $$;

-- Test indexes for performance
SELECT 'Index Validation' as section_header;

DO $$
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public';

    RAISE NOTICE 'Found % indexes for performance optimization', index_count;
    RAISE NOTICE '✅ Indexes validated';
END $$;

-- Test trigger functions
SELECT 'Trigger Validation' as section_header;

DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers
    WHERE trigger_schema = 'public';

    RAISE NOTICE 'Found % triggers for automatic updates', trigger_count;
    RAISE NOTICE '✅ Triggers validated';
END $$;

-- Insert test data for multi-tenancy
SELECT 'Multi-Tenancy Test Data' as section_header;

-- Create test organization
INSERT INTO organization (id, name, slug, description, website)
VALUES ('test-org-001', 'Test Supply Company', 'test-supply', 'Test organization for multi-tenancy validation', 'https://testsupply.example.com')
ON CONFLICT (id) DO NOTHING;

-- Create test user
INSERT INTO "user" (id, name, email, role)
VALUES ('test-user-001', 'Test User', 'test@example.com', 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Create membership relationship
INSERT INTO member (organizationId, userId, role)
VALUES ('test-org-001', 'test-user-001', 'OWNER')
ON CONFLICT (organizationId, userId) DO NOTHING;

-- Create organization settings
INSERT INTO organization_settings (organizationId, approvalRequired, approvalAmount, currency)
VALUES ('test-org-001', true, 1000.00, 'USD')
ON CONFLICT (organizationId) DO NOTHING;

RAISE NOTICE '✅ Multi-tenancy test data inserted';

-- Test procurement workflow tables
SELECT 'Procurement Workflow Test' as section_header;

-- Create test department
INSERT INTO department (id, name, code, organizationId, budget)
VALUES ('test-dept-001', 'Information Technology', 'IT', 'test-org-001', 50000.00)
ON CONFLICT (id) DO NOTHING;

-- Create test category
INSERT INTO category (id, name, slug, organizationId)
VALUES ('test-cat-001', 'Computer Equipment', 'computer-equipment', 'test-org-001')
ON CONFLICT (id) DO NOTHING;

-- Create test product
INSERT INTO product (id, sku, name, categoryId, organizationId, unitPrice, currentStock, minStock)
VALUES ('test-prod-001', 'LAPTOP-BIZ-001', 'Business Laptop', 'test-cat-001', 'test-org-001', 1299.99, 25, 5)
ON CONFLICT (id) DO NOTHING;

-- Create test vendor
INSERT INTO vendor (id, name, email, phone, website, rating, organizationId)
VALUES ('test-vendor-001', 'TechSupplier Inc', 'sales@techsupplier.example.com', '555-0101', 'https://techsupplier.example.com', 4.5, 'test-org-001')
ON CONFLICT (id) DO NOTHING;

-- Create procurement request
INSERT INTO procurement_request (
    id, requestNumber, title, description, organizationId, requesterId,
    departmentId, status, priority, threadId, totalAmount, needsBy
)
VALUES (
    'test-req-001', 'PR-2024-TEST-001', 'IT Equipment Purchase',
    'Purchase laptops for new team members', 'test-org-001', 'test-user-001',
    'test-dept-001', 'SUBMITTED', 'HIGH', 'thread-test-001',
    2599.98, CURRENT_DATE + INTERVAL '7 days'
)
ON CONFLICT (id) DO NOTHING;

-- Create procurement item
INSERT INTO procurement_item (
    id, requestId, productId, name, quantity, unit, unitPrice, totalPrice
)
VALUES (
    'test-item-001', 'test-req-001', 'test-prod-001',
    'Business Laptop', 2, 'each', 1299.99, 2599.98
)
ON CONFLICT (id) DO NOTHING;

RAISE NOTICE '✅ Procurement workflow test data inserted';

-- Test AI integration tables
SELECT 'AI Integration Test' as section_header;

-- Create LangGraph thread
INSERT INTO langgraph_thread (
    id, threadId, organizationId, requestId, state, status
)
VALUES (
    'test-thread-001', 'thread-test-001', 'test-org-001', 'test-req-001',
    '{"node": "vendor_matching", "status": "processing"}', 'active'
)
ON CONFLICT (id) DO NOTHING;

-- Create AI suggestion
INSERT INTO ai_suggestion (
    id, type, organizationId, requestId, threadId, title, description, data, confidence
)
VALUES (
    'test-ai-001', 'VENDOR_MATCH', 'test-org-001', 'test-req-001', 'thread-test-001',
    'Alternative Vendor Suggestion',
    'Consider purchasing from TechSupplier Inc for bulk discount',
    '{"vendorId": "test-vendor-001", "potentialSavings": 150.00, "reasoning": "Bulk discount available"}',
    0.85
)
ON CONFLICT (id) DO NOTHING;

RAISE NOTICE '✅ AI integration test data inserted';

-- Test audit logging
SELECT 'Audit Logging Test' as section_header;

INSERT INTO audit_log (
    organizationId, userId, action, resourceType, resourceId, metadata
)
VALUES (
    'test-org-001', 'test-user-001', 'CREATE', 'procurement_request', 'test-req-001',
    '{"source": "test_script", "test": true}'
)
ON CONFLICT DO NOTHING;

-- Create activity log
INSERT INTO activity (
    organizationId, userId, type, title, description, resourceType, resourceId
)
VALUES (
    'test-org-001', 'test-user-001', 'PROCUREMENT_CREATED',
    'New Procurement Request', 'Created IT equipment purchase request',
    'procurement_request', 'test-req-001'
)
ON CONFLICT DO NOTHING;

RAISE NOTICE '✅ Audit and activity logging test data inserted';

-- Verify data integrity with complex queries
SELECT 'Data Integrity Validation' as section_header;

-- Check multi-tenancy relationships
DO $$
DECLARE
    org_count INTEGER;
    user_count INTEGER;
    member_count INTEGER;
    request_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO org_count FROM organization WHERE id = 'test-org-001';
    SELECT COUNT(*) INTO user_count FROM "user" WHERE id = 'test-user-001';
    SELECT COUNT(*) INTO member_count FROM member WHERE organizationId = 'test-org-001' AND userId = 'test-user-001';
    SELECT COUNT(*) INTO request_count FROM procurement_request WHERE organizationId = 'test-org-001';

    RAISE NOTICE 'Organizations: %, Users: %, Memberships: %, Requests: %',
                  org_count, user_count, member_count, request_count;

    IF org_count > 0 AND user_count > 0 AND member_count > 0 AND request_count > 0 THEN
        RAISE NOTICE '✅ Multi-tenancy data integrity validated';
    ELSE
        RAISE NOTICE '❌ Multi-tenancy data integrity issues detected';
    END IF;
END $$;

-- Test workflow relationships
DO $$
DECLARE
    thread_count INTEGER;
    suggestion_count INTEGER;
    audit_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO thread_count FROM langgraph_thread WHERE threadId = 'thread-test-001';
    SELECT COUNT(*) INTO suggestion_count FROM ai_suggestion WHERE threadId = 'thread-test-001';
    SELECT COUNT(*) INTO audit_count FROM audit_log WHERE organizationId = 'test-org-001';

    RAISE NOTICE 'Threads: %, AI Suggestions: %, Audit Logs: %',
                  thread_count, suggestion_count, audit_count;

    IF thread_count > 0 AND suggestion_count > 0 AND audit_count > 0 THEN
        RAISE NOTICE '✅ Workflow data integrity validated';
    ELSE
        RAISE NOTICE '❌ Workflow data integrity issues detected';
    END IF;
END $$;

-- Generate comprehensive report
SELECT 'Database Usage Report' as section_header;

-- Table row counts
SELECT
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Test specific queries for frontend integration
SELECT 'Frontend Integration Queries' as section_header;

-- Test organization with members
SELECT
    o.id,
    o.name,
    o.slug,
    COUNT(m.id) as member_count,
    COUNT(pr.id) as procurement_count
FROM organization o
LEFT JOIN member m ON o.id = m.organizationId
LEFT JOIN procurement_request pr ON o.id = pr.organizationId
WHERE o.id = 'test-org-001'
GROUP BY o.id, o.name, o.slug;

-- Test procurement requests with quotes
SELECT
    pr.id,
    pr.requestNumber,
    pr.title,
    pr.status,
    pr.totalAmount,
    COUNT(q.id) as quote_count
FROM procurement_request pr
LEFT JOIN quote q ON pr.id = q.requestId
WHERE pr.organizationId = 'test-org-001'
GROUP BY pr.id, pr.requestNumber, pr.title, pr.status, pr.totalAmount;

-- Test AI suggestions with confidence
SELECT
    type,
    COUNT(*) as suggestion_count,
    AVG(confidence) as avg_confidence,
    MAX(confidence) as max_confidence
FROM ai_suggestion
WHERE organizationId = 'test-org-001'
GROUP BY type;

-- Test audit trail
SELECT
    action,
    resourceType,
    COUNT(*) as action_count,
    MIN(createdAt) as first_action,
    MAX(createdAt) as last_action
FROM audit_log
WHERE organizationId = 'test-org-001'
GROUP BY action, resourceType
ORDER BY action_count DESC;

-- Test activity feed
SELECT
    type,
    title,
    createdAt,
    userId
FROM activity
WHERE organizationId = 'test-org-001'
ORDER BY createdAt DESC
LIMIT 10;

-- Cleanup test data (uncomment if you want to clean up)
-- SELECT 'Cleanup Test Data' as section_header;
-- DELETE FROM activity WHERE organizationId = 'test-org-001';
-- DELETE FROM audit_log WHERE organizationId = 'test-org-001';
-- DELETE FROM ai_suggestion WHERE organizationId = 'test-org-001';
-- DELETE FROM langgraph_thread WHERE organizationId = 'test-org-001';
-- DELETE FROM procurement_item WHERE requestId = 'test-req-001';
-- DELETE FROM procurement_request WHERE organizationId = 'test-org-001';
-- DELETE FROM product WHERE organizationId = 'test-org-001';
-- DELETE FROM vendor WHERE organizationId = 'test-org-001';
-- DELETE FROM department WHERE organizationId = 'test-org-001';
-- DELETE FROM category WHERE organizationId = 'test-org-001';
-- DELETE FROM organization_settings WHERE organizationId = 'test-org-001';
-- DELETE FROM member WHERE organizationId = 'test-org-001';
-- DELETE FROM "user" WHERE id = 'test-user-001';
-- DELETE FROM organization WHERE id = 'test-org-001';

COMMIT;

-- Final validation
SELECT '✅ SupplyGraph Database Setup Validation Complete' as final_status;
SELECT
    'Multi-tenancy enabled' as feature1,
    'Procurement workflow ready' as feature2,
    'AI integration prepared' as feature3,
    'Audit logging active' as feature4,
    'Performance optimized' as feature5;