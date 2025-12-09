-- Create the complete SupplyGraph database schema

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- Multi-Tenancy Core Models (Better Auth Integration)
-- ====================================================================

-- Account table for authentication
CREATE TABLE "account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,

  CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- Session table for authentication
CREATE TABLE "session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- User table
CREATE TABLE "user" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT,
  "email" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',

  CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- Verification token table
CREATE TABLE "verification_token" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

-- Organization table
CREATE TABLE "organization" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "logo" TEXT,
  "website" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- Member table for organization memberships
CREATE TABLE "member" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "organizationId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'MEMBER',
  "invitedBy" TEXT,
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLoginAt" TIMESTAMP(3),

  CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- Organization settings table
CREATE TABLE "organization_settings" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "organizationId" TEXT NOT NULL,
  "approvalRequired" BOOLEAN NOT NULL DEFAULT true,
  "approvalAmount" DOUBLE PRECISION NOT NULL DEFAULT 1000.00,
  "autoVendorMatching" BOOLEAN NOT NULL DEFAULT true,
  "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
  "slackWebhook" TEXT,
  "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
  "stripeAccountId" TEXT,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "organization_settings_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- Supply Management Models
-- ====================================================================

-- Category table
CREATE TABLE "category" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "slug" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "parentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- Department table
CREATE TABLE "department" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "code" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "budget" DOUBLE PRECISION,
  "managerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- Product table
CREATE TABLE "product" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "categoryId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "unit" TEXT NOT NULL DEFAULT 'each',
  "unitPrice" DOUBLE PRECISION,
  "currentStock" INTEGER NOT NULL DEFAULT 0,
  "minStock" INTEGER NOT NULL DEFAULT 0,
  "maxStock" INTEGER,
  "reorderPoint" INTEGER,
  "supplier" TEXT,
  "specifications" JSONB,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- Vendor table
CREATE TABLE "vendor" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "website" TEXT,
  "description" TEXT,
  "addressLine1" TEXT,
  "addressLine2" TEXT,
  "city" TEXT,
  "state" TEXT,
  "country" TEXT,
  "postalCode" TEXT,
  "taxId" TEXT,
  "paymentTerms" TEXT,
  "rating" DECIMAL(3, 2),
  "organizationId" TEXT NOT NULL,
  "tags" TEXT[],
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- Vendor contact table
CREATE TABLE "vendor_contact" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "vendorId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "title" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,

  CONSTRAINT "vendor_contact_pkey" PRIMARY KEY ("id")
);

-- Vendor contract table
CREATE TABLE "vendor_contract" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "vendorId" TEXT NOT NULL,
  "contractNumber" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "terms" TEXT,
  "autoRenew" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "vendor_contract_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- Procurement Workflow Models
-- ====================================================================

-- Procurement request table
CREATE TABLE "procurement_request" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "requestNumber" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "organizationId" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "departmentId" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
  "threadId" TEXT NOT NULL,
  "workflowState" JSONB,
  "totalAmount" DECIMAL(10, 2),
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
  "approverId" TEXT,
  "approvedAt" TIMESTAMP(3),
  "approvedBy" TEXT,
  "neededBy" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),

  CONSTRAINT "procurement_request_pkey" PRIMARY KEY ("id")
);

-- Procurement item table
CREATE TABLE "procurement_item" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "requestId" TEXT NOT NULL,
  "productId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "quantity" INTEGER NOT NULL,
  "unit" TEXT NOT NULL DEFAULT 'each',
  "unitPrice" DOUBLE PRECISION,
  "totalPrice" DOUBLE PRECISION,
  "specifications" JSONB,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "procurement_item_pkey" PRIMARY KEY ("id")
);

-- Procurement template table
CREATE TABLE "procurement_template" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "organizationId" TEXT NOT NULL,
  "departmentId" TEXT,
  "categoryId" TEXT,
  "items" JSONB NOT NULL,
  "workflow" JSONB,
  "approvalRules" JSONB,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "procurement_template_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- Quote Management Models
-- ====================================================================

-- Quote table
CREATE TABLE "quote" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "quoteNumber" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "vendorId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "validUntil" TIMESTAMP(3),
  "subtotal" DECIMAL(10, 2) NOT NULL,
  "tax" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "shipping" DECIMAL(10, 2) NOT NULL DEFAULT 0,
  "totalAmount" DECIMAL(10, 2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "terms" TEXT,
  "notes" TEXT,
  "attachments" TEXT[],
  "responseDate" TIMESTAMP(3),
  "respondedBy" TEXT,
  "receivedVia" TEXT,
  "aiGenerated" BOOLEAN NOT NULL DEFAULT false,
  "confidence" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "quote_pkey" PRIMARY KEY ("id")
);

-- Quote item table
CREATE TABLE "quote_item" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "quoteId" TEXT NOT NULL,
  "requestItemId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "quantity" INTEGER NOT NULL,
  "unit" TEXT NOT NULL,
  "unitPrice" DECIMAL(10, 2) NOT NULL,
  "totalPrice" DECIMAL(10, 2) NOT NULL,
  "productId" TEXT,
  "specifications" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "quote_item_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- AI and Workflow Models
-- ====================================================================

-- LangGraph thread table
CREATE TABLE "langgraph_thread" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "threadId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "requestId" TEXT,
  "state" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "currentNode" TEXT,
  "metadata" JSONB,
  "sentiment" DOUBLE PRECISION,
  "confidence" DOUBLE PRECISION,
  "riskScore" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),

  CONSTRAINT "langgraph_thread_pkey" PRIMARY KEY ("id")
);

-- AI suggestion table
CREATE TABLE "ai_suggestion" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "type" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "requestId" TEXT,
  "threadId" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "confidence" DECIMAL(3, 2),
  "reasoning" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "appliedAt" TIMESTAMP(3),
  "appliedBy" TEXT,
  "model" TEXT,
  "version" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ai_suggestion_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- Audit and Analytics Models
-- ====================================================================

-- Audit log table
CREATE TABLE "audit_log" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "organizationId" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "resourceId" TEXT,
  "oldValues" JSONB,
  "newValues" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "sessionId" TEXT,
  "requestId" TEXT,
  "threadId" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- Activity table
CREATE TABLE "activity" (
  "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
  "organizationId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "resourceType" TEXT,
  "resourceId" TEXT,
  "userId" TEXT,
  "data" JSONB,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "isVisibleToAll" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- ====================================================================
-- Create Indexes
-- ====================================================================

-- User indexes
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- Verification token indexes
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- Organization indexes
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- Member indexes
CREATE UNIQUE INDEX "member_organizationId_userId_key" ON "member"("organizationId", "userId");

-- Organization settings indexes
CREATE UNIQUE INDEX "organization_settings_organizationId_key" ON "organization_settings"("organizationId");

-- Account indexes
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- Session indexes
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- Category indexes
CREATE UNIQUE INDEX "category_organizationId_slug_key" ON "category"("organizationId", "slug");

-- Department indexes
CREATE UNIQUE INDEX "department_organizationId_code_key" ON "department"("organizationId", "code");

-- Product indexes
CREATE UNIQUE INDEX "product_sku_key" ON "product"("sku");
CREATE UNIQUE INDEX "product_organizationId_sku_key" ON "product"("organizationId", "sku");

-- Vendor indexes
CREATE UNIQUE INDEX "vendor_email_key" ON "vendor"("email");

-- Vendor contract indexes
CREATE UNIQUE INDEX "vendor_contract_contractNumber_key" ON "vendor_contract"("contractNumber");

-- Procurement request indexes
CREATE UNIQUE INDEX "procurement_request_requestNumber_key" ON "procurement_request"("requestNumber");
CREATE UNIQUE INDEX "procurement_request_threadId_key" ON "procurement_request"("threadId");

-- Quote indexes
CREATE UNIQUE INDEX "quote_quoteNumber_key" ON "quote"("quoteNumber");

-- LangGraph thread indexes
CREATE UNIQUE INDEX "langgraph_thread_threadId_key" ON "langgraph_thread"("threadId");

-- Audit log indexes
CREATE INDEX "audit_log_organizationId_createdAt_idx" ON "audit_log"("organizationId", "createdAt");
CREATE INDEX "audit_log_userId_createdAt_idx" ON "audit_log"("userId", "createdAt");
CREATE INDEX "audit_log_resourceType_resourceId_idx" ON "audit_log"("resourceType", "resourceId");

-- Activity indexes
CREATE INDEX "activity_organizationId_createdAt_idx" ON "activity"("organizationId", "createdAt");
CREATE INDEX "activity_userId_createdAt_idx" ON "activity"("userId", "createdAt");
CREATE INDEX "activity_type_resourceType_idx" ON "activity"("type", "resourceType");

-- ====================================================================
-- Create Foreign Key Constraints
-- ====================================================================

-- Account foreign keys
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Session foreign keys
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Member foreign keys
ALTER TABLE "member" ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "member" ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Organization settings foreign keys
ALTER TABLE "organization_settings" ADD CONSTRAINT "organization_settings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Category foreign keys
ALTER TABLE "category" ADD CONSTRAINT "category_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Department foreign keys
ALTER TABLE "department" ADD CONSTRAINT "department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Product foreign keys
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product" ADD CONSTRAINT "product_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product" ADD CONSTRAINT "product_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Vendor foreign keys
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vendor contact foreign keys
ALTER TABLE "vendor_contact" ADD CONSTRAINT "vendor_contact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Vendor contract foreign keys
ALTER TABLE "vendor_contract" ADD CONSTRAINT "vendor_contract_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Procurement request foreign keys
ALTER TABLE "procurement_request" ADD CONSTRAINT "procurement_request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "procurement_request" ADD CONSTRAINT "procurement_request_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "procurement_request" ADD CONSTRAINT "procurement_request_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "procurement_request" ADD CONSTRAINT "procurement_request_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Procurement item foreign keys
ALTER TABLE "procurement_item" ADD CONSTRAINT "procurement_item_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "procurement_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "procurement_item" ADD CONSTRAINT "procurement_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Procurement template foreign keys
ALTER TABLE "procurement_template" ADD CONSTRAINT "procurement_template_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "procurement_template" ADD CONSTRAINT "procurement_template_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "procurement_template" ADD CONSTRAINT "procurement_template_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "procurement_template" ADD CONSTRAINT "procurement_template_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Quote foreign keys
ALTER TABLE "quote" ADD CONSTRAINT "quote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "procurement_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quote" ADD CONSTRAINT "quote_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quote" ADD CONSTRAINT "quote_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Quote item foreign keys
ALTER TABLE "quote_item" ADD CONSTRAINT "quote_item_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "quote_item" ADD CONSTRAINT "quote_item_requestItemId_fkey" FOREIGN KEY ("requestItemId") REFERENCES "procurement_item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "quote_item" ADD CONSTRAINT "quote_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- LangGraph thread foreign keys
ALTER TABLE "langgraph_thread" ADD CONSTRAINT "langgraph_thread_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "langgraph_thread" ADD CONSTRAINT "langgraph_thread_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "procurement_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AI suggestion foreign keys
ALTER TABLE "ai_suggestion" ADD CONSTRAINT "ai_suggestion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_suggestion" ADD CONSTRAINT "ai_suggestion_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "procurement_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ai_suggestion" ADD CONSTRAINT "ai_suggestion_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "langgraph_thread"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Audit log foreign keys
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Activity foreign keys
ALTER TABLE "activity" ADD CONSTRAINT "activity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable row-level security (optional, for multi-tenant security)
ALTER DATABASE supplygraph SET "app.timezone" = 'UTC';

-- Create comment
COMMENT ON DATABASE supplygraph IS 'SupplyGraph Multi-Tenant Procurement Management Database';