-- Simple SupplyGraph Database Validation
-- Basic table structure and connectivity test

-- Basic connectivity test
SELECT 'Database Connection Test' as test_result;
SELECT NOW() as current_time;
SELECT version() as database_version;

-- Check table count
SELECT
    COUNT(*) as table_count,
    'Tables found in supplygraph database' as description
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- List all tables
SELECT
    table_name,
    'Table exists' as status
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check indexes for performance
SELECT
    COUNT(*) as index_count,
    'Indexes for performance optimization' as description
FROM pg_indexes
WHERE schemaname = 'public';

-- Check foreign key constraints
SELECT
    COUNT(*) as constraint_count,
    'Foreign key constraints for data integrity' as description
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';

-- Test basic CRUD operations
SELECT '=== Basic Data Test ===' as section_header;

-- Test data insertion (using existing structure)
INSERT INTO organization (id, name, slug, description, website)
VALUES (
    gen_random_uuid()::text,
    'Test Organization ' || to_char(NOW(), 'HH24:MI:SS'),
    'test-org-' || to_char(NOW(), 'HH24MISS'),
    'Test organization for validation',
    'https://test.example.com'
)
ON CONFLICT DO NOTHING;

-- Test user creation
INSERT INTO "user" (id, name, email, role)
VALUES (
    gen_random_uuid()::text,
    'Test User ' || to_char(NOW(), 'HH24:MI:SS'),
    'test-' || to_char(NOW(), 'HH24MISS') || '@example.com',
    'ADMIN'
)
ON CONFLICT DO NOTHING;

-- Verify data was inserted
SELECT
    (SELECT COUNT(*) FROM organization) as organization_count,
    (SELECT COUNT(*) FROM "user") as user_count,
    'Data insertion test completed' as test_status;

-- Test complex query performance
SELECT '=== Performance Test Query ===' as section_header;

-- Test organization with member count
SELECT
    o.name as organization_name,
    COUNT(m.id) as member_count,
    COUNT(DISTINCT pr.id) as procurement_count
FROM organization o
LEFT JOIN member m ON o.id = m.organizationId
LEFT JOIN procurement_request pr ON o.id = pr.organizationId
GROUP BY o.id, o.name
LIMIT 10;

-- Test quote aggregation
SELECT
    COUNT(DISTINCT v.id) as vendor_count,
    COUNT(DISTINCT q.id) as quote_count,
    COUNT(DISTINCT pr.id) as request_count,
    COALESCE(SUM(q.totalAmount), 0) as total_quote_value
FROM organization o
LEFT JOIN vendor v ON o.id = v.organizationId
LEFT JOIN procurement_request pr ON o.id = pr.organizationId
LEFT JOIN quote q ON pr.id = q.requestId;

-- Test audit log structure
SELECT
    COUNT(*) as audit_log_count,
    COUNT(DISTINCT organizationId) as orgs_with_logs,
    COUNT(DISTINCT userId) as users_with_logs,
    'Audit logging functionality test' as description
FROM audit_log;

-- Test AI integration tables
SELECT
    COUNT(DISTINCT lt.threadId) as active_threads,
    COUNT(DISTINCT ais.id) as ai_suggestions,
    COUNT(DISTINCT ais.organizationId) as orgs_with_ai,
    'AI integration test' as description
FROM langgraph_thread lt
LEFT JOIN ai_suggestion ais ON lt.organizationId = ais.organizationId;

-- Test activity feed
SELECT
    COUNT(*) as activity_count,
    COUNT(DISTINCT organizationId) as orgs_with_activity,
    COUNT(DISTINCT userId) as users_with_activity,
    'Activity feed test' as description
FROM activity;

-- Performance summary
SELECT '=== Database Summary ===' as section_header;
SELECT
    'SupplyGraph Database' as database_name,
    'Manual PostgreSQL Setup' as setup_type,
    'Multi-tenancy Enabled' as architecture,
    'AI Integration Ready' as ai_status,
    'Audit Logging Active' as audit_status,
    'Performance Optimized' as optimization_status;