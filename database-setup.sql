-- ====================================================================
-- SupplyGraph Database Setup Script
-- PostgreSQL Manual Setup for Development
-- ====================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database if it doesn't exist
-- Note: This is handled by the container setup

-- ====================================================================
-- Multi-Tenancy Core Tables
-- ====================================================================

-- Organizations table (Multi-tenancy core)
CREATE TABLE IF NOT EXISTS organization (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo TEXT,
    website TEXT,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table (Better Auth integration)
CREATE TABLE IF NOT EXISTS "user" (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified TIMESTAMP(3),
    image TEXT,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
);

-- Organization memberships (multi-tenancy)
CREATE TABLE IF NOT EXISTS member (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'MEMBER', 'VIEWER')),
    invitedBy TEXT,
    joinedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastLoginAt TIMESTAMP(3),
    UNIQUE(organizationId, userId)
);

-- Organization settings
CREATE TABLE IF NOT EXISTS organization_settings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizationId TEXT NOT NULL UNIQUE REFERENCES organization(id) ON DELETE CASCADE,
    approvalRequired BOOLEAN NOT NULL DEFAULT true,
    approvalAmount DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    autoVendorMatching BOOLEAN NOT NULL DEFAULT true,
    emailNotifications BOOLEAN NOT NULL DEFAULT true,
    slackWebhook TEXT,
    stripeEnabled BOOLEAN NOT NULL DEFAULT false,
    stripeAccountId TEXT,
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Supply Management Tables
-- ====================================================================

-- Categories
CREATE TABLE IF NOT EXISTS category (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL,
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    parentId TEXT REFERENCES category(id),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organizationId, slug)
);

-- Departments
CREATE TABLE IF NOT EXISTS department (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    budget DECIMAL(10,2),
    managerId TEXT REFERENCES member(id),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organizationId, code)
);

-- Products/Inventory
CREATE TABLE IF NOT EXISTS product (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    categoryId TEXT NOT NULL REFERENCES category(id),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    unit TEXT NOT NULL DEFAULT 'each',
    unitPrice DECIMAL(10,2),
    currentStock INTEGER NOT NULL DEFAULT 0,
    minStock INTEGER NOT NULL DEFAULT 0,
    maxStock INTEGER,
    reorderPoint INTEGER,
    supplier TEXT,
    specifications JSONB,
    images TEXT[],
    tags TEXT[],
    createdBy TEXT,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organizationId, sku)
);

-- Vendors
CREATE TABLE IF NOT EXISTS vendor (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
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
    rating DECIMAL(3,2),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    tags TEXT[],
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Vendor contacts
CREATE TABLE IF NOT EXISTS vendor_contact (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendorId TEXT NOT NULL REFERENCES vendor(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    isPrimary BOOLEAN NOT NULL DEFAULT false
);

-- Vendor contracts
CREATE TABLE IF NOT EXISTS vendor_contract (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendorId TEXT NOT NULL REFERENCES vendor(id) ON DELETE CASCADE,
    contractNumber TEXT NOT NULL UNIQUE,
    startDate TIMESTAMP(3) NOT NULL,
    endDate TIMESTAMP(3),
    terms TEXT,
    autoRenew BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Procurement Workflow Tables
-- ====================================================================

-- Procurement requests
CREATE TABLE IF NOT EXISTS procurement_request (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    requestNumber TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    requesterId TEXT NOT NULL REFERENCES "user"(id),
    departmentId TEXT REFERENCES department(id),
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEGOTIATING', 'PENDING_PAYMENT', 'PAID', 'COMPLETED', 'CANCELLED')),
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    threadId TEXT NOT NULL UNIQUE,
    workflowState JSONB,
    totalAmount DECIMAL(10,2),
    currency TEXT NOT NULL DEFAULT 'USD',
    requiresApproval BOOLEAN NOT NULL DEFAULT false,
    approverId TEXT REFERENCES member(id),
    approvedAt TIMESTAMP(3),
    approvedBy TEXT,
    neededBy TIMESTAMP(3),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completedAt TIMESTAMP(3)
);

-- Procurement items
CREATE TABLE IF NOT EXISTS procurement_item (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    requestId TEXT NOT NULL REFERENCES procurement_request(id) ON DELETE CASCADE,
    productId TEXT REFERENCES product(id),
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL DEFAULT 'each',
    unitPrice DECIMAL(10,2),
    totalPrice DECIMAL(10,2),
    specifications JSONB,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'QUOTED', 'APPROVED', 'REJECTED', 'ORDERED', 'RECEIVED', 'CANCELLED')),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Procurement templates
CREATE TABLE IF NOT EXISTS procurement_template (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    departmentId TEXT REFERENCES department(id),
    categoryId TEXT REFERENCES category(id),
    items JSONB NOT NULL,
    workflow JSONB,
    approvalRules JSONB,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdBy TEXT,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Quote Management Tables
-- ====================================================================

-- Quotes
CREATE TABLE IF NOT EXISTS quote (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    quoteNumber TEXT NOT NULL UNIQUE,
    requestId TEXT NOT NULL REFERENCES procurement_request(id) ON DELETE CASCADE,
    vendorId TEXT NOT NULL REFERENCES vendor(id),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'RECEIVED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    validUntil TIMESTAMP(3),
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    totalAmount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    terms TEXT,
    notes TEXT,
    attachments TEXT[],
    responseDate TIMESTAMP(3),
    respondedBy TEXT,
    receivedVia TEXT,
    aiGenerated BOOLEAN NOT NULL DEFAULT false,
    confidence DECIMAL(3,2),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quote items
CREATE TABLE IF NOT EXISTS quote_item (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    quoteId TEXT NOT NULL REFERENCES quote(id) ON DELETE CASCADE,
    requestItemId TEXT REFERENCES procurement_item(id),
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    productId TEXT REFERENCES product(id),
    specifications JSONB,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- AI and Workflow Tables
-- ====================================================================

-- LangGraph threads
CREATE TABLE IF NOT EXISTS langgraph_thread (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    threadId TEXT NOT NULL UNIQUE,
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    requestId TEXT REFERENCES procurement_request(id),
    state JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
    currentNode TEXT,
    metadata JSONB,
    sentiment DECIMAL(3,2),
    confidence DECIMAL(3,2),
    riskScore DECIMAL(3,2),
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completedAt TIMESTAMP(3)
);

-- AI suggestions
CREATE TABLE IF NOT EXISTS ai_suggestion (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('VENDOR_MATCH', 'PRICE_OPTIMIZATION', 'BULK_PURCHASE', 'ALTERNATIVE_PRODUCT', 'RISK_MITIGATION', 'WORKFLOW_IMPROVEMENT')),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    requestId TEXT REFERENCES procurement_request(id),
    threadId TEXT REFERENCES langgraph_thread(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    data JSONB NOT NULL,
    confidence DECIMAL(3,2) NOT NULL,
    reasoning TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED')),
    appliedAt TIMESTAMP(3),
    appliedBy TEXT,
    model TEXT,
    version TEXT,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Audit and Analytics Tables
-- ====================================================================

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    userId TEXT REFERENCES "user"(id),
    action TEXT NOT NULL,
    resourceType TEXT NOT NULL,
    resourceId TEXT,
    oldValues JSONB,
    newValues JSONB,
    ipAddress TEXT,
    userAgent TEXT,
    sessionId TEXT,
    requestId TEXT,
    threadId TEXT,
    metadata JSONB,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Activity feed
CREATE TABLE IF NOT EXISTS activity (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizationId TEXT NOT NULL REFERENCES organization(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('PROCUREMENT_CREATED', 'PROCUREMENT_UPDATED', 'PROCUREMENT_APPROVED', 'PROCUREMENT_REJECTED', 'QUOTE_RECEIVED', 'QUOTE_ACCEPTED', 'VENDOR_ADDED', 'PRODUCT_ADDED', 'CONTRACT_SIGNED', 'PAYMENT_PROCESSED', 'AI_SUGGESTION', 'SYSTEM_NOTIFICATION')),
    title TEXT NOT NULL,
    description TEXT,
    resourceType TEXT,
    resourceId TEXT,
    userId TEXT REFERENCES "user"(id),
    data JSONB,
    isPublic BOOLEAN NOT NULL DEFAULT false,
    isVisibleToAll BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- Better Auth Tables (if needed)
-- ====================================================================

-- Account (OAuth, etc.)
CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, providerAccountId)
);

-- Session
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessionToken TEXT NOT NULL UNIQUE,
    userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    expires TIMESTAMP(3) NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Verification tokens
CREATE TABLE IF NOT EXISTS verification_token (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP(3) NOT NULL,
    UNIQUE(identifier, token)
);

-- ====================================================================
-- Indexes for Performance
-- ====================================================================

-- Core search indexes
CREATE INDEX IF NOT EXISTS idx_organization_slug ON organization(slug);
CREATE INDEX IF NOT EXISTS idx_member_org_user ON member(organizationId, userId);
CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);

-- Procurement indexes
CREATE INDEX IF NOT EXISTS idx_procurement_org_status ON procurement_request(organizationId, status);
CREATE INDEX IF NOT EXISTS idx_procurement_requester ON procurement_request(requesterId);
CREATE INDEX IF NOT EXISTS idx_procurement_thread ON procurement_request(threadId);
CREATE INDEX IF NOT EXISTS idx_procurement_item_request ON procurement_item(requestId);

-- Vendor and quote indexes
CREATE INDEX IF NOT EXISTS idx_vendor_org ON vendor(organizationId);
CREATE INDEX IF NOT EXISTS idx_vendor_email ON vendor(email);
CREATE INDEX IF NOT EXISTS idx_quote_request ON quote(requestId);
CREATE INDEX IF NOT EXISTS idx_quote_vendor ON quote(vendorId);

-- Product and category indexes
CREATE INDEX IF NOT EXISTS idx_product_org_sku ON product(organizationId, sku);
CREATE INDEX IF NOT EXISTS idx_product_category ON product(categoryId);
CREATE INDEX IF NOT EXISTS idx_category_org ON category(organizationId, slug);

-- Audit and activity indexes
CREATE INDEX IF NOT EXISTS idx_audit_org_created ON audit_log(organizationId, createdAt);
CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_log(userId, createdAt);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resourceType, resourceId);
CREATE INDEX IF NOT EXISTS idx_activity_org_created ON activity(organizationId, createdAt);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON activity(userId, createdAt);
CREATE INDEX IF NOT EXISTS idx_activity_type ON activity(type, resourceType);

-- AI workflow indexes
CREATE INDEX IF NOT EXISTS idx_langgraph_thread ON langgraph_thread(threadId);
CREATE INDEX IF NOT EXISTS idx_langgraph_org ON langgraph_thread(organizationId);
CREATE INDEX IF NOT EXISTS idx_ai_suggestion_org ON ai_suggestion(organizationId, type);
CREATE INDEX IF NOT EXISTS idx_ai_suggestion_request ON ai_suggestion(requestId);

-- ====================================================================
-- Functions and Triggers
-- ====================================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_organization_updated_at BEFORE UPDATE ON organization FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_settings_updated_at BEFORE UPDATE ON organization_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON category FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_updated_at BEFORE UPDATE ON department FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_updated_at BEFORE UPDATE ON vendor FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendor_contract_updated_at BEFORE UPDATE ON vendor_contract FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procurement_request_updated_at BEFORE UPDATE ON procurement_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procurement_item_updated_at BEFORE UPDATE ON procurement_item FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procurement_template_updated_at BEFORE UPDATE ON procurement_template FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_updated_at BEFORE UPDATE ON quote FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quote_item_updated_at BEFORE UPDATE ON quote_item FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_langgraph_thread_updated_at BEFORE UPDATE ON langgraph_thread FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_suggestion_updated_at BEFORE UPDATE ON ai_suggestion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- Sample Data (for development)
-- ====================================================================

-- Insert sample organization
INSERT INTO organization (id, name, slug, description) VALUES
('demo-org-1', 'Demo Company', 'demo-company', 'Sample organization for testing')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user
INSERT INTO "user" (id, name, email, role) VALUES
('demo-user-1', 'Demo User', 'demo@example.com', 'ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Create membership
INSERT INTO member (organizationId, userId, role) VALUES
('demo-org-1', 'demo-user-1', 'OWNER')
ON CONFLICT (organizationId, userId) DO NOTHING;

-- Create sample department
INSERT INTO department (id, name, code, organizationId) VALUES
('demo-dept-1', 'IT Department', 'IT', 'demo-org-1')
ON CONFLICT (id) DO NOTHING;

-- Create sample category
INSERT INTO category (id, name, slug, organizationId) VALUES
('demo-cat-1', 'Software', 'software', 'demo-org-1')
ON CONFLICT (id) DO NOTHING;

COMMIT;