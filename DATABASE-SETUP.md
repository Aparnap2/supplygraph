# SupplyGraph Database Setup Guide

## Overview

SupplyGraph uses PostgreSQL with manual setup for multi-tenant procurement management. The database is configured for high availability, performance, and AI integration with LangGraph.

## 📋 Database Status

- **✅ PostgreSQL Container**: `agentstack-db-test:5432` (Running)
- **✅ Database**: `supplygraph` (Created)
- **✅ Tables**: 22 tables created with proper relationships
- **✅ Indexes**: 45 indexes for performance optimization
- **✅ Constraints**: 40 foreign key constraints for data integrity
- **✅ Triggers**: Automatic timestamp updates enabled

## 🏗️ Architecture

### Multi-Tenancy Core
- **Organizations**: Central tenant management
- **Users & Memberships**: Role-based access control
- **Settings**: Organization-specific configurations

### Procurement Workflow
- **Requests**: Complete procurement lifecycle management
- **Items & Products**: Inventory and catalog management
- **Departments & Categories**: Organizational structure
- **Templates**: Reusable procurement workflows

### Vendor Management
- **Vendors**: Supplier information and contacts
- **Quotes**: Bid management and comparison
- **Contracts**: Vendor agreement tracking

### AI Integration
- **LangGraph Threads**: AI workflow state management
- **AI Suggestions**: Automated vendor matching and optimization
- **Confidence Scoring**: AI recommendation reliability

### Audit & Analytics
- **Audit Logs**: Complete activity tracking
- **Activity Feed**: Real-time event streaming
- **Performance Metrics**: Usage and efficiency analytics

## 🔗 Connection Configuration

### Database Connection Details
- **Host**: `localhost` (development) / `agentstack-db-test` (container network)
- **Port**: `5432`
- **Database**: `supplygraph`
- **Username**: `postgres`
- **Password**: `postgres`
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/supplygraph`

### Frontend Configuration
- **File**: `/config/frontend-db-config.js`
- **API Base URL**: `http://localhost:3000/api`
- **Real-time WebSocket**: `ws://localhost:3001`
- **Endpoints**: Complete CRUD operations for all entities

### AI Engine Configuration
- **File**: `/config/ai-engine-db-config.js`
- **Connection Pooling**: Optimized for AI workloads
- **Query Timeout**: 10-30 seconds depending on complexity
- **Specialized Pools**: Inference, analytics, and real-time operations

## 📊 Database Schema

### Core Tables (Multi-Tenancy)

#### `organization`
```sql
- id (UUID, Primary Key)
- name (TEXT, Required)
- slug (TEXT, Unique, Required)
- description (TEXT)
- logo (TEXT)
- website (TEXT)
- createdAt/updatedAt (TIMESTAMP)
```

#### `user`
```sql
- id (UUID, Primary Key)
- name (TEXT)
- email (TEXT, Unique, Required)
- role (ADMIN|USER)
- emailVerified (TIMESTAMP)
- image (TEXT)
- createdAt/updatedAt (TIMESTAMP)
```

#### `member`
```sql
- id (UUID, Primary Key)
- organizationId (FK → organization)
- userId (FK → user)
- role (OWNER|ADMIN|MANAGER|MEMBER|VIEWER)
- joinedAt (TIMESTAMP)
- lastLoginAt (TIMESTAMP)
```

### Procurement Tables

#### `procurement_request`
```sql
- id (UUID, Primary Key)
- requestNumber (TEXT, Unique)
- title (TEXT, Required)
- description (TEXT)
- organizationId (FK → organization)
- requesterId (FK → user)
- departmentId (FK → department)
- status (DRAFT|SUBMITTED|APPROVED|REJECTED|COMPLETED)
- priority (LOW|MEDIUM|HIGH|URGENT)
- threadId (TEXT, Unique) // LangGraph integration
- totalAmount (DECIMAL)
- needsBy (TIMESTAMP)
- createdAt/updatedAt (TIMESTAMP)
```

#### `procurement_item`
```sql
- id (UUID, Primary Key)
- requestId (FK → procurement_request)
- productId (FK → product)
- name (TEXT, Required)
- quantity (INTEGER)
- unitPrice (DECIMAL)
- totalPrice (DECIMAL)
- status (PENDING|QUOTED|APPROVED|RECEIVED)
```

### Vendor Tables

#### `vendor`
```sql
- id (UUID, Primary Key)
- name (TEXT, Required)
- email (TEXT, Unique)
- phone (TEXT)
- website (TEXT)
- organizationId (FK → organization)
- rating (DECIMAL 3,2)
- isActive (BOOLEAN)
- tags (TEXT[])
```

#### `quote`
```sql
- id (UUID, Primary Key)
- quoteNumber (TEXT, Unique)
- requestId (FK → procurement_request)
- vendorId (FK → vendor)
- organizationId (FK → organization)
- status (DRAFT|SENT|RECEIVED|ACCEPTED|REJECTED)
- subtotal/tax/shipping/totalAmount (DECIMAL)
- validUntil (TIMESTAMP)
- aiGenerated (BOOLEAN)
- confidence (DECIMAL 3,2)
```

### AI Integration Tables

#### `langgraph_thread`
```sql
- id (UUID, Primary Key)
- threadId (TEXT, Unique)
- organizationId (FK → organization)
- requestId (FK → procurement_request)
- state (JSONB)
- status (active|paused|completed|failed)
- currentNode (TEXT)
- sentiment/confidence/riskScore (DECIMAL)
```

#### `ai_suggestion`
```sql
- id (UUID, Primary Key)
- type (VENDOR_MATCH|PRICE_OPTIMIZATION|BULK_PURCHASE|RISK_MITIGATION)
- organizationId (FK → organization)
- requestId (FK → procurement_request)
- threadId (FK → langgraph_thread)
- title/description (TEXT)
- data (JSONB)
- confidence (DECIMAL)
- status (PENDING|ACCEPTED|REJECTED)
```

### Audit Tables

#### `audit_log`
```sql
- id (UUID, Primary Key)
- organizationId (FK → organization)
- userId (FK → user)
- action/resourceType/resourceId (TEXT)
- oldValues/newValues (JSONB)
- ipAddress/userAgent (TEXT)
- metadata (JSONB)
- createdAt (TIMESTAMP)
```

#### `activity`
```sql
- id (UUID, Primary Key)
- organizationId (FK → organization)
- type (PROCUREMENT_CREATED|QUOTE_RECEIVED|AI_SUGGESTION|etc.)
- title/description (TEXT)
- resourceType/resourceId (TEXT)
- userId (FK → user)
- data (JSONB)
- createdAt (TIMESTAMP)
```

## 🚀 Getting Started

### 1. Verify Container is Running
```bash
docker ps | grep agentstack-db-test
```

### 2. Test Database Connection
```bash
docker exec agentstack-db-test psql -U postgres -d supplygraph -c "SELECT NOW()"
```

### 3. Run Validation Tests
```bash
docker cp scripts/simple-db-test.sql agentstack-db-test:/tmp/test.sql
docker exec agentstack-db-test psql -U postgres -d supplygraph -f /tmp/test.sql
```

### 4. Frontend Integration
```javascript
// Import frontend config
import dbConfig from './config/frontend-db-config.js';

// Use API endpoints
const response = await fetch(`${dbConfig.api.baseURL}/procurement/requests`);
```

### 5. AI Engine Integration
```javascript
// Import AI config
import aiConfig from './config/ai-engine-db-config.js';

// Connect to database
const client = new Client({
  connectionString: aiConfig.getConnectionString('development')
});
```

## 🔧 Manual Database Operations

### Create Test Organization
```sql
INSERT INTO organization (id, name, slug, description)
VALUES ('org-1', 'Test Company', 'test-company', 'Test for development');
```

### Create User with Membership
```sql
-- Create user
INSERT INTO "user" (id, name, email, role)
VALUES ('user-1', 'John Doe', 'john@example.com', 'ADMIN');

-- Create membership
INSERT INTO member (organizationId, userId, role)
VALUES ('org-1', 'user-1', 'OWNER');
```

### Create Procurement Request
```sql
INSERT INTO procurement_request (
    id, requestNumber, title, organizationId, requesterId, status, priority, threadId
)
VALUES (
    'req-1', 'PR-2024-001', 'IT Equipment Purchase', 'org-1', 'user-1', 'DRAFT', 'MEDIUM', 'thread-001'
);
```

### Add Items to Request
```sql
INSERT INTO procurement_item (id, requestId, name, quantity, unitPrice)
VALUES ('item-1', 'req-1', 'Laptop', 2, 1299.99);
```

## 📈 Performance Optimizations

### Indexes
- Primary key indexes on all tables
- Foreign key indexes for joins
- Search indexes on email, SKU, request numbers
- Composite indexes for common query patterns

### Connection Pooling
- Frontend: 10-20 connections max
- AI Engine: Separate pools for inference (30), analytics (10), real-time (50)
- Timeout: 5-30 seconds depending on operation complexity

### Query Optimization
- Prepared statements for common operations
- JSONB indexing for AI workflow data
- Partitioning support for large audit tables

## 🛡️ Security Features

### Multi-Tenancy
- Row-level security through organizationId
- Role-based access control
- Data isolation between tenants

### Audit Trail
- Complete CRUD operation logging
- User activity tracking
- IP address and user agent logging
- Data change history (oldValues/newValues)

### Data Integrity
- 40 foreign key constraints
- CHECK constraints on enums and ranges
- NOT NULL constraints on required fields
- Unique constraints on business keys

## 🔍 Monitoring & Maintenance

### Database Health Checks
```sql
-- Connection count
SELECT count(*) FROM pg_stat_activity;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables WHERE schemaname = 'public';

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes ORDER BY idx_scan DESC;
```

### Performance Queries
```sql
-- Slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Lock monitoring
SELECT pid, relation, mode, granted, query_start, query
FROM pg_locks l JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT granted;
```

## 📝 Current Data Status

As of setup completion:
- **Organizations**: 2 (including demo data)
- **Users**: 5 (including test users)
- **Procurement Requests**: 3 (including sample workflows)
- **Vendors**: 5 (including test suppliers)
- **Quotes**: 2 (including sample quotes)

## 🔄 Backup & Recovery

### Manual Backup
```bash
docker exec agentstack-db-test pg_dump -U postgres supplygraph > backup-$(date +%Y%m%d).sql
```

### Restore
```bash
docker exec -i agentstack-db-test psql -U postgres supplygraph < backup-20241201.sql
```

### Automated Backup (TODO)
- Set up cron job for daily backups
- Implement point-in-time recovery
- Configure offsite backup storage

## 🚨 Troubleshooting

### Connection Issues
1. Check container status: `docker ps | grep agentstack-db-test`
2. Verify database exists: `\l` in psql
3. Check network connectivity from application

### Performance Issues
1. Monitor connection pool usage
2. Check slow query log
3. Verify indexes are being used
4. Analyze query execution plans

### Data Issues
1. Verify foreign key constraints
2. Check data types and formats
3. Validate JSON structures
4. Test with sample data

## 📚 Next Steps

### For Frontend Development
1. Implement authentication with Better Auth
2. Build procurement request forms
3. Create vendor management UI
4. Develop quote comparison features
5. Add real-time activity feed

### For AI Engine Development
1. Set up LangGraph workflows
2. Implement vendor matching algorithms
3. Create price optimization models
4. Build risk assessment features
5. Develop suggestion generation

### For Production Deployment
1. Configure SSL/TLS connections
2. Set up read replicas
3. Implement connection pooling
4. Add monitoring and alerting
5. Create backup automation

---

**Database Setup Complete!** 🎉

The SupplyGraph PostgreSQL database is now ready for full-stack development with multi-tenancy, AI integration, and comprehensive audit capabilities.