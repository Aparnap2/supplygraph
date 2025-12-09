# SupplyGraph Database Package

This package contains the complete database schema and utilities for SupplyGraph, built with Prisma ORM and PostgreSQL.

## Features

- **Multi-tenancy**: Complete organization-based data isolation
- **Better Auth Integration**: Authentication and authorization schemas
- **Procurement Workflow**: Full request-to-payment lifecycle tracking
- **AI Integration**: LangGraph thread management and AI suggestions
- **Audit Trail**: Complete audit logging and activity tracking
- **Type Safety**: Full TypeScript support with generated types

## Schema Overview

### Core Models

- **Organization**: Multi-tenant workspace management
- **User & Member**: User accounts with organization memberships
- **Department**: Organizational structure with budget tracking

### Supply Management

- **Category & Product**: Product catalog with inventory tracking
- **Vendor**: Supplier management with contacts and contracts
- **ProcurementRequest**: Complete procurement workflow with LangGraph integration
- **Quote**: Vendor quote management with AI analysis

### AI & Workflow

- **LangGraphThread**: AI workflow state management
- **AISuggestion**: AI-powered recommendations and insights

### Audit & Analytics

- **AuditLog**: Complete change tracking with data versioning
- **Activity**: User activity streams and notifications

## Installation

```bash
pnpm add @supplygraph/database
```

## Usage

### Database Client

```typescript
import { db, createDatabaseClient } from '@supplygraph/database'

// Use the default client (recommended for most cases)
const users = await db.user.findMany()

// Create a custom client if needed
const customClient = createDatabaseClient('custom-database-url')
```

### Multi-tenant Operations

```typescript
import { withOrgAccess } from '@supplygraph/database'

// Ensures organization exists and provides transaction scope
const result = await withOrgAccess('org_123', async (tx) => {
  return await tx.procurementRequest.findMany({
    where: { organizationId: 'org_123' },
    include: {
      requester: true,
      department: true,
      items: true
    }
  })
})
```

### Transactions

```typescript
import { withTransaction } from '@supplygraph/database'

const result = await withTransaction(async (tx) => {
  const request = await tx.procurementRequest.create({
    data: { /* request data */ }
  })

  await tx.activity.create({
    data: {
      organizationId: 'org_123',
      type: 'PROCUREMENT_CREATED',
      title: 'New request created',
      resourceId: request.id,
      resourceType: 'procurement_request'
    }
  })

  return request
})
```

## Development

### Setup

```bash
# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/supplygraph"

# Install dependencies
pnpm install

# Generate Prisma client
pnpm generate
```

### Database Operations

```bash
# Push schema to database (development)
pnpm push

# Create and run migrations
pnpm migrate

# Reset database (development)
pnpm migrate:reset

# Open Prisma Studio
pnpm studio

# Seed database with sample data
pnpm seed
```

### Build

```bash
# Build TypeScript and generate client
pnpm build
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development, production)
- `DIRECT_URL`: Optional direct database URL for migrations

## Multi-tenancy Implementation

All data in SupplyGraph is isolated by organization using the following patterns:

1. **Organization ID**: Every data model includes `organizationId`
2. **Row-Level Security**: Application-level filtering enforced in queries
3. **Membership-based Access**: User access controlled through membership model
4. **Audit Trail**: All operations logged with organization context

## LangGraph Integration

The schema includes dedicated support for LangGraph workflows:

- **Thread Management**: Each procurement request has a unique `threadId`
- **Workflow State**: Complete workflow state stored in JSON
- **AI Suggestions**: AI-generated recommendations with confidence scores
- **Checkpointing**: Full state persistence for workflow resumption

## Better Auth Support

The schema includes complete Better Auth integration:

- **User Management**: User accounts with role-based permissions
- **Organization Membership**: Multi-tenant user assignments
- **Session Management**: Secure session handling
- **Account Linking**: OAuth provider integration

## Testing

```bash
# Run database tests
pnpm test

# Test with coverage
pnpm test --coverage
```

## Production Considerations

### Database Performance

- Indexes optimized for common query patterns
- Composite indexes for multi-column filters
- Partitioning strategies for large datasets

### Security

- Row-level security through application code
- Sensitive data encryption in transit
- Audit logging for compliance requirements

### Backup & Recovery

- Regular automated backups
- Point-in-time recovery capabilities
- Migration history preservation

## Schema Visualization

Generate a schema diagram:

```bash
pnpm db:diagram
```

This creates a visual representation of the database schema in `/docs/schema-diagram.html`.

## Contributing

1. Follow Prisma best practices for schema changes
2. Always run migrations in development before committing
3. Update TypeScript types by running `pnpm generate`
4. Test all changes with the seed script
5. Update this README for significant schema changes