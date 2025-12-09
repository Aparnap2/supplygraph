# SupplyGraph CRUD Operations Testing Plan

## Environment Setup
- [x] Check existing Docker containers (PostgreSQL: agentstack-db-test:5432, Redis: supplygraph-redis:6379)
- [ ] Configure database connection for supplygraph database
- [ ] Set up Prisma client and run migrations
- [ ] Start AI Engine container
- [ ] Verify WebSocket capabilities

## Database CRUD Operations Testing

### 1. Organization Management
- [ ] Test organization creation
- [ ] Test organization read operations (single, list, filter)
- [ ] Test organization updates
- [ ] Test organization deletion (soft delete with audit)
- [ ] Test organization settings management

### 2. User Management
- [ ] Test user creation and registration
- [ ] Test user authentication flows
- [ ] Test user role assignments
- [ ] Test organization membership management
- [ ] Test user profile updates

### 3. Procurement Requests
- [ ] Test procurement request creation
- [ ] Test request workflow states (DRAFT → SUBMITTED → APPROVED → COMPLETED)
- [ ] Test request item management
- [ ] Test request approval workflows
- [ ] Test request filtering and pagination

### 4. Vendor Management
- [ ] Test vendor creation
- [ ] Test vendor contact management
- [ ] Test vendor contract management
- [ ] Test vendor rating system
- [ ] Test vendor status management

### 5. Quote Management
- [ ] Test quote creation
- [ ] Test quote item management
- [ ] Test quote status workflows
- [ ] Test quote acceptance/rejection
- [ ] Test AI-generated quotes

### 6. Product & Inventory
- [ ] Test product creation
- [ ] Test category management
- [ ] Test inventory tracking
- [ ] Test stock management
- [ ] Test product specifications

## API Endpoints Testing

### FastAPI AI Engine
- [ ] Test health check endpoints
- [ ] Test chat initiation endpoint (/api/chat)
- [ ] Test workflow resumption (/api/workflow/resume)
- [ ] Test workflow status retrieval (/api/workflow/{thread_id}/status)
- [ ] Test WebSocket connections (/ws/{thread_id})

### Authentication & Authorization
- [ ] Test JWT token generation/validation
- [ ] Test role-based access control
- [ ] Test organization-based data isolation
- [ ] Test session management

## Real-time Communication Testing

### WebSocket Functionality
- [ ] Test WebSocket connection establishment
- [ ] Test message broadcasting to threads
- [ ] Test real-time workflow updates
- [ ] Test connection handling on disconnect
- [ ] Test concurrent WebSocket connections

## Error Handling & Edge Cases

### Database Constraints
- [ ] Test unique constraint violations
- [ ] Test foreign key constraint handling
- [ ] Test required field validation
- [ ] Test data type validation
- [ ] Test transaction rollback on errors

### API Error Responses
- [ ] Test 400 Bad Request responses
- [ ] Test 401 Unauthorized responses
- [ ] Test 403 Forbidden responses
- [ ] Test 404 Not Found responses
- [ ] Test 500 Internal Server Error handling
- [ ] Test rate limiting (if implemented)

## Data Consistency Testing

### Referential Integrity
- [ ] Test cascade delete operations
- [ ] Test orphaned record prevention
- [ ] Test data consistency across related tables
- [ ] Test concurrent modification handling

### Audit & Logging
- [ ] Test audit log creation for all operations
- [ ] Test activity feed updates
- [ ] Test user action tracking
- [ ] Test timestamp consistency

## Performance & Load Testing

### Database Performance
- [ ] Test query performance with large datasets
- [ ] Test indexing effectiveness
- [ ] Test connection pooling
- [ ] Test transaction performance

### API Performance
- [ ] Test response times under load
- [ ] Test concurrent request handling
- [ ] Test WebSocket connection limits
- [ ] Test memory usage patterns

## Integration Testing

### End-to-End Workflows
- [ ] Test complete procurement workflow
- [ ] Test AI-powered vendor matching
- [ ] Test approval workflow automation
- [ ] Test quote generation and acceptance

### External Service Integration
- [ ] Test email notifications (via Mailpit)
- [ ] Test Redis caching operations
- [ ] Test AI model integration (if external)
- [ ] Test file upload/download (if implemented)

## Security Testing

### Input Validation
- [ ] Test SQL injection prevention
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Test file upload security

### Access Control
- [ ] Test privilege escalation prevention
- [ ] Test data access boundaries
- [ ] Test API endpoint security
- [ ] Test WebSocket authentication

## Test Environment Cleanup
- [ ] Clean up test data after testing
- [ ] Reset database state
- [ ] Document any persistent issues
- [ ] Generate test report summary