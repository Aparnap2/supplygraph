-- Enable Row-Level Security on all tables
-- This file should be run after database creation

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
-- These policies ensure users can only access data from their own organization

CREATE POLICY tenant_isolation_organizations ON organizations 
    FOR ALL TO authenticated 
    USING (id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_users ON users 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_vendors ON vendors 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_procurement_requests ON procurement_requests 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_quotes ON quotes 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_payments ON payments 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_audit_logs ON audit_logs 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_email_threads ON email_threads 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_email_messages ON email_messages 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

CREATE POLICY tenant_isolation_workflow_executions ON workflow_executions 
    FOR ALL TO authenticated 
    USING (org_id = current_setting('app.current_tenant', true)::text);

-- Create a role for authenticated users
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated;
    END IF;
END
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated;