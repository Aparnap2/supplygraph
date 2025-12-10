-- Initialize SupplyGraph database with RLS policies

-- Enable Row Level Security extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to get current tenant from session
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_tenant', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: RLS policies will be created automatically by Prisma migrations
-- This file is for any additional database setup needed