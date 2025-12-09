-- Seed data for SupplyGraph database
-- This script creates demo organizations, users, and sample data

-- Insert demo organizations
INSERT INTO "organization" ("id", "name", "slug", "description", "logo", "website", "createdAt", "updatedAt") VALUES
  ('org_001', 'SupplyGraph Demo', 'demo', 'Demo organization for SupplyGraph', 'https://ui-avatars.com/api/?name=SupplyGraph&background=0d1117&color=fff', 'https://supplygraph.demo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('org_002', 'Test Company', 'test-company', 'Test organization for development', 'https://ui-avatars.com/api/?name=TestCo&background=0d1117&color=fff', 'https://testco.example', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert organization settings for demo org
INSERT INTO "organization_settings" ("id", "organizationId", "approvalRequired", "approvalAmount", "autoVendorMatching", "emailNotifications", "currency", "timezone", "createdAt", "updatedAt") VALUES
  ('settings_001', 'org_001', true, 1000.00, true, true, 'USD', 'UTC', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('settings_002', 'org_002', true, 500.00, false, false, 'USD', 'America/New_York', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert demo users
INSERT INTO "user" ("id", "name", "email", "role", "createdAt", "updatedAt") VALUES
  ('user_001', 'Admin User', 'admin@demo.com', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('user_002', 'Manager User', 'manager@demo.com', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('user_003', 'Employee User', 'employee@demo.com', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('user_004', 'Viewer User', 'viewer@demo.com', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('user_005', 'Test User', 'test@testco.com', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert members (organization memberships)
INSERT INTO "member" ("id", "organizationId", "userId", "role", "joinedAt") VALUES
  ('member_001', 'org_001', 'user_001', 'OWNER', CURRENT_TIMESTAMP),
  ('member_002', 'org_001', 'user_002', 'ADMIN', CURRENT_TIMESTAMP),
  ('member_003', 'org_001', 'user_003', 'MEMBER', CURRENT_TIMESTAMP),
  ('member_004', 'org_001', 'user_004', 'VIEWER', CURRENT_TIMESTAMP),
  ('member_005', 'org_002', 'user_005', 'OWNER', CURRENT_TIMESTAMP);

-- Insert departments for demo org
INSERT INTO "department" ("id", "name", "description", "code", "organizationId", "budget", "managerId", "createdAt", "updatedAt") VALUES
  ('dept_001', 'IT Department', 'Information Technology and Development', 'IT', 'org_001', 50000.00, 'member_002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dept_002', 'Operations', 'Business Operations and Support', 'OPS', 'org_001', 30000.00, 'member_002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dept_003', 'Marketing', 'Marketing and Communications', 'MKT', 'org_001', 25000.00, 'member_002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dept_004', 'Finance', 'Finance and Accounting', 'FIN', 'org_001', 20000.00, 'member_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert categories for demo org
INSERT INTO "category" ("id", "name", "description", "slug", "organizationId", "createdAt", "updatedAt") VALUES
  ('cat_001', 'Electronics', 'Electronic devices and components', 'electronics', 'org_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_002', 'Office Supplies', 'Stationery and office equipment', 'office-supplies', 'org_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_003', 'Furniture', 'Office furniture and fixtures', 'furniture', 'org_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_004', 'Software', 'Software licenses and subscriptions', 'software', 'org_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_005', 'Hardware', 'Computer hardware and peripherals', 'hardware', 'org_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert vendors for demo org
INSERT INTO "vendor" ("id", "name", "email", "phone", "website", "description", "addressLine1", "city", "state", "country", "postalCode", "taxId", "paymentTerms", "rating", "organizationId", "tags", "createdAt", "updatedAt") VALUES
  ('vendor_001', 'TechCorp Solutions', 'sales@techcorp.com', '+1-555-0101', 'https://techcorp.com', 'Enterprise technology solutions provider', '123 Tech Street', 'San Francisco', 'CA', 'USA', '94105', 'TX123456789', 'Net 30', 4.5, 'org_001', ARRAY['reliable', 'premium'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vendor_002', 'Office Supplies Plus', 'info@officesupplies.com', '+1-555-0102', 'https://officesupplies.com', 'One-stop office supplies and furniture', '456 Office Park Blvd', 'Chicago', 'IL', 'USA', '60601', 'IL987654321', 'Net 15', 4.2, 'org_001', ARRAY['fast-shipping', 'comprehensive'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vendor_003', 'Furniture Experts', 'quotes@furniture-experts.com', '+1-555-0103', 'https://furniture-experts.com', 'Premium office furniture and ergonomic solutions', '789 Furniture Ave', 'New York', 'NY', 'USA', '10001', 'NY112233445', 'Net 30', 4.8, 'org_001', ARRAY['premium', 'ergonomic'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vendor_004', 'Software Hub', 'licensing@softwarehub.com', '+1-555-0104', 'https://softwarehub.com', 'Software licensing and subscription services', '321 Digital Lane', 'Seattle', 'WA', 'USA', '98101', 'WA556677889', 'Net 30', 4.0, 'org_001', ARRAY['software', 'enterprise'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('vendor_005', 'Global Hardware', 'sales@globalhardware.com', '+1-555-0105', 'https://globalhardware.com', 'Computer hardware and IT infrastructure', '654 Hardware Drive', 'Austin', 'TX', 'USA', '78701', 'TX998877665', 'Net 45', 3.9, 'org_001', ARRAY['hardware', 'budget-friendly'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert vendor contacts
INSERT INTO "vendor_contact" ("id", "vendorId", "name", "title", "email", "phone", "isPrimary") VALUES
  ('contact_001', 'vendor_001', 'John Smith', 'Account Manager', 'john.smith@techcorp.com', '+1-555-0111', true),
  ('contact_002', 'vendor_002', 'Sarah Johnson', 'Sales Director', 'sarah.j@officesupplies.com', '+1-555-0112', true),
  ('contact_003', 'vendor_003', 'Michael Brown', 'Sales Rep', 'michael@furniture-experts.com', '+1-555-0113', true),
  ('contact_004', 'vendor_004', 'Lisa Davis', 'Licensing Manager', 'lisa@softwarehub.com', '+1-555-0114', true),
  ('contact_005', 'vendor_005', 'Robert Wilson', 'Regional Sales', 'robert@globalhardware.com', '+1-555-0115', true);

-- Insert products for demo org
INSERT INTO "product" ("id", "sku", "name", "description", "categoryId", "organizationId", "unit", "unitPrice", "currentStock", "minStock", "reorderPoint", "specifications", "tags", "createdAt", "updatedAt") VALUES
  ('product_001', 'LP-001', 'Laptop Pro', 'High-performance laptop for development', 'cat_001', 'org_001', 'each', 1200.00, 15, 3, 5, '{"brand": "TechCorp", "warranty": "2 years", "color": "Silver", "specs": {"cpu": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}}', ARRAY['essential', 'premium'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_002', 'WM-001', 'Wireless Mouse', 'Ergonomic wireless mouse', 'cat_001', 'org_001', 'each', 45.00, 50, 10, 15, '{"brand": "TechCorp", "warranty": "1 year", "color": "Black", "connectivity": "Bluetooth"}', ARRAY['accessory', 'essential'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_003', 'OC-001', 'Office Chair', 'Ergonomic office chair with lumbar support', 'cat_003', 'org_001', 'each', 350.00, 8, 2, 4, '{"brand": "Furniture Experts", "warranty": "5 years", "color": "Gray", "adjustable": true}', ARRAY['furniture', 'ergonomic'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_004', 'SD-001', 'Standing Desk', 'Electric adjustable standing desk', 'cat_003', 'org_001', 'each', 800.00, 5, 1, 2, '{"brand": "Furniture Experts", "warranty": "3 years", "color": "White", "features": ["Electric", "Height Memory"]}', ARRAY['furniture', 'premium'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_005', 'AD-001', 'Adobe License', 'Adobe Creative Cloud annual license', 'cat_004', 'org_001', 'license', 199.00, 0, 0, 1, '{"type": "Software License", "duration": "1 year", "features": ["Photoshop", "Illustrator", "Premiere Pro"]}', ARRAY['software', 'subscription'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_006', 'NS-001', 'Notebook Set', 'Premium notebook and pen set', 'cat_002', 'org_001', 'set', 25.00, 100, 20, 30, '{"brand": "Office Supplies Plus", "items": ["Notebook", "Pen", "Pencil"], "quality": "Premium"}', ARRAY['stationery', 'budget-friendly'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_007', 'MO-001', 'Monitor 27"', '27-inch 4K computer monitor', 'cat_005', 'org_001', 'each', 450.00, 20, 4, 8, '{"brand": "Global Hardware", "warranty": "3 years", "resolution": "4K", "screenSize": "27 inch"}', ARRAY['hardware', 'essential'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_008', 'KB-001', 'Keyboard Mechanical', 'Mechanical keyboard with RGB lighting', 'cat_005', 'org_001', 'each', 150.00, 30, 6, 10, '{"brand": "Global Hardware", "warranty": "2 years", "switchType": "Mechanical", "features": ["RGB", "Programmable"]}', ARRAY['hardware', 'premium'], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert procurement requests
INSERT INTO "procurement_request" ("id", "requestNumber", "title", "description", "organizationId", "requesterId", "departmentId", "status", "priority", "threadId", "totalAmount", "currency", "requiresApproval", "neededBy", "createdAt", "updatedAt") VALUES
  ('req_001', 'REQ-2024-001', 'New Laptops for IT Team', 'Need 5 new laptops for the IT development team to replace aging equipment', 'org_001', 'user_002', 'dept_001', 'SUBMITTED', 'HIGH', 'thread_req_001', 6000.00, 'USD', true, CURRENT_DATE + INTERVAL '14 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('req_002', 'REQ-2024-002', 'Office Furniture Replacement', 'Replace old chairs in the main office area with ergonomic chairs', 'org_001', 'user_003', 'dept_002', 'UNDER_REVIEW', 'MEDIUM', 'thread_req_002', 3500.00, 'USD', true, CURRENT_DATE + INTERVAL '30 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('req_003', 'REQ-2024-003', 'Software Licenses for Q4', 'Annual renewal of Adobe Creative Cloud licenses for design team', 'org_001', 'user_001', 'dept_004', 'APPROVED', 'URGENT', 'thread_req_003', 2388.00, 'USD', true, CURRENT_DATE + INTERVAL '7 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert procurement items
INSERT INTO "procurement_item" ("id", "requestId", "productId", "name", "description", "quantity", "unit", "unitPrice", "totalPrice", "status", "createdAt", "updatedAt") VALUES
  ('item_001', 'req_001', 'product_001', 'Laptop Pro', 'High-performance laptop for development team', 5, 'each', 1200.00, 6000.00, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('item_002', 'req_002', 'product_003', 'Office Chair', 'Ergonomic office chair with lumbar support', 10, 'each', 350.00, 3500.00, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('item_003', 'req_003', 'product_005', 'Adobe Creative Cloud', 'Annual license for creative suite', 12, 'license', 199.00, 2388.00, 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert quotes
INSERT INTO "quote" ("id", "quoteNumber", "requestId", "vendorId", "organizationId", "status", "validUntil", "subtotal", "tax", "totalAmount", "currency", "terms", "notes", "responseDate", "receivedVia", "aiGenerated", "confidence", "createdAt", "updatedAt") VALUES
  ('quote_001', 'Q-2024-001', 'req_001', 'vendor_001', 'org_001', 'RECEIVED', CURRENT_DATE + INTERVAL '30 days', 5800.00, 464.00, 6264.00, 'USD', 'Payment terms: Net 30 days\nWarranty: 2 years\nDelivery: 5-7 business days', 'Quote includes setup and configuration services', CURRENT_TIMESTAMP, 'Email', false, 0.85, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('quote_002', 'Q-2024-002', 'req_001', 'vendor_005', 'org_001', 'UNDER_REVIEW', CURRENT_DATE + INTERVAL '30 days', 5750.00, 460.00, 6210.00, 'USD', 'Payment terms: Net 45 days\nWarranty: 1 year\nDelivery: 7-10 business days', 'Budget-friendly alternative with slightly longer delivery', CURRENT_TIMESTAMP, 'Email', false, 0.78, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert quote items
INSERT INTO "quote_item" ("id", "quoteId", "requestItemId", "name", "description", "quantity", "unit", "unitPrice", "totalPrice", "productId", "specifications", "createdAt", "updatedAt") VALUES
  ('quote_item_001', 'quote_001', 'item_001', 'Laptop Pro - Development Model', 'Customized development laptop with additional RAM', 5, 'each', 1160.00, 5800.00, 'product_001', '{"ram": "32GB", "storage": "1TB SSD", "warranty": "3 years"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('quote_item_002', 'quote_002', 'item_001', 'Laptop Pro - Standard Model', 'Standard configuration laptop', 5, 'each', 1150.00, 5750.00, 'product_001', '{"ram": "16GB", "storage": "512GB SSD", "warranty": "1 year"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert activities
INSERT INTO "activity" ("id", "organizationId", "type", "title", "description", "resourceType", "resourceId", "userId", "isPublic", "data", "createdAt") VALUES
  ('activity_001', 'org_001', 'PROCUREMENT_CREATED', 'New procurement request submitted', 'IT team requested new laptops', 'procurement_request', 'req_001', 'user_002', false, '{"requestNumber": "REQ-2024-001", "amount": 6000.00}', CURRENT_TIMESTAMP),
  ('activity_002', 'org_001', 'QUOTE_RECEIVED', 'New quote received from TechCorp Solutions', 'Quote received for laptop procurement request', 'quote', 'quote_001', 'user_001', false, '{"quoteNumber": "Q-2024-001", "vendor": "TechCorp Solutions"}', CURRENT_TIMESTAMP),
  ('activity_003', 'org_001', 'PROCUREMENT_APPROVED', 'Software licenses approved', 'Adobe licenses for Q4 have been approved and ready for purchase', 'procurement_request', 'req_003', 'user_001', true, '{"requestNumber": "REQ-2024-003", "licenses": 12}', CURRENT_TIMESTAMP);

-- Insert AI suggestions
INSERT INTO "ai_suggestion" ("id", "type", "organizationId", "requestId", "title", "description", "data", "confidence", "reasoning", "status", "model", "version", "createdAt", "updatedAt") VALUES
  ('suggestion_001', 'VENDOR_MATCH', 'org_001', 'req_001', 'Alternative vendor found', 'Found a more cost-effective vendor for office supplies with good ratings', '{"vendor": "Global Hardware", "potentialSavings": 15, "currentVendor": "TechCorp Solutions", "rating": 3.9}', 0.78, 'Based on historical pricing data and vendor performance metrics, Global Hardware offers competitive pricing with acceptable quality ratings', 'PENDING', 'gpt-4', '1.0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('suggestion_002', 'BULK_PURCHASE', 'org_001', 'req_001', 'Bulk purchase discount opportunity', 'Ordering 10+ laptops may qualify for volume discount', '{"currentQuantity": 5, "recommendedQuantity": 10, "discountPercentage": 8, "potentialSavings": 960.00}', 0.85, 'Vendor pricing tiers indicate volume discounts for orders over 10 units, potentially saving $960 on the laptop procurement', 'PENDING', 'gpt-4', '1.0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert LangGraph threads
INSERT INTO "langgraph_thread" ("id", "threadId", "organizationId", "requestId", "state", "status", "currentNode", "metadata", "confidence", "createdAt", "updatedAt") VALUES
  ('thread_001', 'thread_req_001', 'org_001', 'req_001', '{"messages": [{"role": "user", "content": "Need 5 new laptops for IT team"}], "current_step": "quote_comparison"}', 'active', 'human_review', '{"priority": "high", "auto_vendor_match": true}', 0.92, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('thread_002', 'thread_req_002', 'org_001', 'req_002', '{"messages": [{"role": "user", "content": "Replace old office chairs"}], "current_step": "vendor_selection"}', 'active', 'vendor_matching', '{"priority": "medium", "auto_vendor_match": true}', 0.87, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('thread_003', 'thread_req_003', 'org_001', 'req_003', '{"messages": [{"role": "user", "content": "Renew Adobe licenses"}], "current_step": "completed"}', 'completed', 'payment_processing', '{"priority": "urgent", "auto_renewal": true}', 0.95, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update AI suggestions with thread references
UPDATE "ai_suggestion" SET "threadId" = 'thread_001' WHERE "id" = 'suggestion_001';

COMMIT;