// Database client library for SupplyGraph
// This provides a simple interface to interact with the PostgreSQL database

import { Pool } from 'pg'

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/supplygraph',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Helper function to execute SQL queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(sql, params)
    return result.rows
  } finally {
    client.release()
  }
}

// Helper function for single row queries
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

// Organizations
export const db = {
  // Organizations
  organizations: {
    findAll: () => query('SELECT * FROM "organization"'),
    findById: (id: string) => queryOne('SELECT * FROM "organization" WHERE id = $1', [id]),
    findBySlug: (slug: string) => queryOne('SELECT * FROM "organization" WHERE slug = $1', [slug]),
    create: (data: any) => queryOne(
      'INSERT INTO "organization" (name, slug, description, logo, website, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.name, data.slug, data.description, data.logo, data.website]
    )
  },

  // Users
  users: {
    findAll: () => query('SELECT id, name, email, role, "createdAt", "updatedAt" FROM "user"'),
    findById: (id: string) => queryOne('SELECT id, name, email, role, "createdAt", "updatedAt" FROM "user" WHERE id = $1', [id]),
    findByEmail: (email: string) => queryOne('SELECT * FROM "user" WHERE email = $1', [email]),
    create: (data: any) => queryOne(
      'INSERT INTO "user" (name, email, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.name, data.email, data.role]
    )
  },

  // Memberships
  members: {
    findByOrgId: (orgId: string) => query(`
      SELECT m.*, u.name, u.email, u."role" as user_role
      FROM "member" m
      JOIN "user" u ON m."userId" = u.id
      WHERE m."organizationId" = $1
    `, [orgId]),
    findByUserId: (userId: string) => query(`
      SELECT m.*, o.name as org_name, o.slug as org_slug
      FROM "member" m
      JOIN "organization" o ON m."organizationId" = o.id
      WHERE m."userId" = $1
    `, [userId]),
    create: (data: any) => queryOne(
      'INSERT INTO "member" ("organizationId", "userId", role, "joinedAt") VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
      [data.organizationId, data.userId, data.role]
    )
  },

  // Categories
  categories: {
    findByOrgId: (orgId: string) => query('SELECT * FROM "category" WHERE "organizationId" = $1 ORDER BY name', [orgId]),
    findById: (id: string) => queryOne('SELECT * FROM "category" WHERE id = $1', [id]),
    create: (data: any) => queryOne(
      'INSERT INTO "category" (name, description, slug, "organizationId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.name, data.description, data.slug, data.organizationId]
    )
  },

  // Products
  products: {
    findByOrgId: (orgId: string) => query(`
      SELECT p.*, c.name as category_name
      FROM "product" p
      JOIN "category" c ON p."categoryId" = c.id
      WHERE p."organizationId" = $1
      ORDER BY p.name
    `, [orgId]),
    findById: (id: string) => queryOne('SELECT * FROM "product" WHERE id = $1', [id]),
    findBySku: (sku: string) => queryOne('SELECT * FROM "product" WHERE sku = $1', [sku]),
    create: (data: any) => queryOne(
      'INSERT INTO "product" (sku, name, description, "categoryId", "organizationId", unit, "unitPrice", "currentStock", "minStock", "reorderPoint", specifications, tags, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.sku, data.name, data.description, data.categoryId, data.organizationId, data.unit, data.unitPrice, data.currentStock, data.minStock, data.reorderPoint, JSON.stringify(data.specifications || {}), data.tags]
    ),
    updateStock: (id: string, stock: number) => queryOne(
      'UPDATE "product" SET "currentStock" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [stock, id]
    )
  },

  // Departments
  departments: {
    findByOrgId: (orgId: string) => query(`
      SELECT d.*, u.name as manager_name
      FROM "department" d
      LEFT JOIN "member" m ON d."managerId" = m.id
      LEFT JOIN "user" u ON m."userId" = u.id
      WHERE d."organizationId" = $1
      ORDER BY d.name
    `, [orgId]),
    findById: (id: string) => queryOne('SELECT * FROM "department" WHERE id = $1', [id]),
    create: (data: any) => queryOne(
      'INSERT INTO "department" (name, description, code, "organizationId", budget, "managerId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.name, data.description, data.code, data.organizationId, data.budget, data.managerId]
    )
  },

  // Vendors
  vendors: {
    findByOrgId: (orgId: string) => query('SELECT * FROM "vendor" WHERE "organizationId" = $1 AND "isActive" = true ORDER BY name', [orgId]),
    findById: (id: string) => queryOne('SELECT * FROM "vendor" WHERE id = $1', [id]),
    create: (data: any) => queryOne(
      'INSERT INTO "vendor" (name, email, phone, website, description, "addressLine1", "addressLine2", city, state, country, "postalCode", "taxId", "paymentTerms", rating, "organizationId", tags, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.name, data.email, data.phone, data.website, data.description, data.addressLine1, data.addressLine2, data.city, data.state, data.country, data.postalCode, data.taxId, data.paymentTerms, data.rating, data.organizationId, data.tags]
    )
  },

  // Vendor contacts
  vendorContacts: {
    findByVendorId: (vendorId: string) => query('SELECT * FROM "vendor_contact" WHERE "vendorId" = $1', [vendorId]),
    create: (data: any) => queryOne(
      'INSERT INTO "vendor_contact" ("vendorId", name, title, email, phone, "isPrimary") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.vendorId, data.name, data.title, data.email, data.phone, data.isPrimary]
    )
  },

  // Procurement requests
  procurementRequests: {
    findByOrgId: (orgId: string, options?: { limit?: number; offset?: number }) => {
      const sql = `
        SELECT pr.*, u.name as requester_name, d.name as department_name, d.code as department_code
        FROM "procurement_request" pr
        JOIN "user" u ON pr."requesterId" = u.id
        LEFT JOIN "department" d ON pr."departmentId" = d.id
        WHERE pr."organizationId" = $1
        ORDER BY pr."createdAt" DESC
        ${options?.limit ? `LIMIT ${options.limit}` : ''}
        ${options?.offset ? `OFFSET ${options.offset}` : ''}
      `
      return query(sql, [orgId])
    },
    findById: (id: string) => queryOne(`
      SELECT pr.*, u.name as requester_name, d.name as department_name, d.code as department_code
      FROM "procurement_request" pr
      JOIN "user" u ON pr."requesterId" = u.id
      LEFT JOIN "department" d ON pr."departmentId" = d.id
      WHERE pr.id = $1
    `, [id]),
    create: (data: any) => queryOne(`
      INSERT INTO "procurement_request" ("requestNumber", title, description, "organizationId", "requesterId", "departmentId", status, priority, "threadId", "totalAmount", currency, "requiresApproval", "neededBy", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, [
      data.requestNumber, data.title, data.description, data.organizationId, data.requesterId,
      data.departmentId, data.status, data.priority, data.threadId, data.totalAmount,
      data.currency, data.requiresApproval, data.neededBy
    ]),
    updateStatus: (id: string, status: string, approverId?: string, approvedBy?: string) => queryOne(
      'UPDATE "procurement_request" SET status = $1, "approverId" = $2, "approvedBy" = $3, "approvedAt" = CASE WHEN $3 IS NOT NULL THEN CURRENT_TIMESTAMP ELSE "approvedAt" END, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [status, approverId, approvedBy, id]
    )
  },

  // Procurement items
  procurementItems: {
    findByRequestId: (requestId: string) => query(`
      SELECT pi.*, p.name as product_name, p.sku as product_sku, c.name as category_name
      FROM "procurement_item" pi
      LEFT JOIN "product" p ON pi."productId" = p.id
      LEFT JOIN "category" c ON p."categoryId" = c.id
      WHERE pi."requestId" = $1
    `, [requestId]),
    create: (data: any) => queryOne(
      'INSERT INTO "procurement_item" ("requestId", "productId", name, description, quantity, unit, "unitPrice", "totalPrice", specifications, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.requestId, data.productId, data.name, data.description, data.quantity, data.unit, data.unitPrice, data.totalPrice, JSON.stringify(data.specifications || {}), data.status]
    ),
    updateStatus: (id: string, status: string) => queryOne(
      'UPDATE "procurement_item" SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    )
  },

  // Quotes
  quotes: {
    findByOrgId: (orgId: string) => query(`
      SELECT q.*, v.name as vendor_name, pr."requestNumber", pr.title as request_title
      FROM "quote" q
      JOIN "vendor" v ON q."vendorId" = v.id
      JOIN "procurement_request" pr ON q."requestId" = pr.id
      WHERE q."organizationId" = $1
      ORDER BY q."createdAt" DESC
    `, [orgId]),
    findByRequestId: (requestId: string) => query(`
      SELECT q.*, v.name as vendor_name
      FROM "quote" q
      JOIN "vendor" v ON q."vendorId" = v.id
      WHERE q."requestId" = $1
      ORDER BY q."totalAmount" ASC
    `, [requestId]),
    create: (data: any) => queryOne(
      'INSERT INTO "quote" ("quoteNumber", "requestId", "vendorId", "organizationId", status, "validUntil", subtotal, tax, shipping, "totalAmount", currency, terms, notes, attachments, "responseDate", "respondedBy", "receivedVia", "aiGenerated", confidence, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [
        data.quoteNumber, data.requestId, data.vendorId, data.organizationId, data.status, data.validUntil,
        data.subtotal, data.tax, data.shipping, data.totalAmount, data.currency, data.terms, data.notes,
        data.attachments, data.responseDate, data.respondedBy, data.receivedVia, data.aiGenerated, data.confidence
      ]
    ),
    updateStatus: (id: string, status: string) => queryOne(
      'UPDATE "quote" SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    )
  },

  // LangGraph threads
  langGraphThreads: {
    findByOrgId: (orgId: string) => query(`
      SELECT lgt.*, pr."requestNumber", pr.title as request_title
      FROM "langgraph_thread" lgt
      LEFT JOIN "procurement_request" pr ON lgt."requestId" = pr.id
      WHERE lgt."organizationId" = $1
      ORDER BY lgt."createdAt" DESC
    `, [orgId]),
    findByThreadId: (threadId: string) => queryOne('SELECT * FROM "langgraph_thread" WHERE "threadId" = $1', [threadId]),
    create: (data: any) => queryOne(
      'INSERT INTO "langgraph_thread" ("threadId", "organizationId", "requestId", state, status, "currentNode", metadata, sentiment, confidence, "riskScore", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.threadId, data.organizationId, data.requestId, JSON.stringify(data.state), data.status, data.currentNode, JSON.stringify(data.metadata || {}), data.sentiment, data.confidence, data.riskScore]
    ),
    updateState: (id: string, state: any, status?: string, currentNode?: string) => queryOne(
      'UPDATE "langgraph_thread" SET state = $1, status = COALESCE($2, status), "currentNode" = COALESCE($3, "currentNode"), "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [JSON.stringify(state), status, currentNode, id]
    )
  },

  // Activities
  activities: {
    findByOrgId: (orgId: string, options?: { limit?: number; offset?: number }) => {
      const sql = `
        SELECT a.*, u.name as user_name
        FROM "activity" a
        LEFT JOIN "user" u ON a."userId" = u.id
        WHERE a."organizationId" = $1
        ORDER BY a."createdAt" DESC
        ${options?.limit ? `LIMIT ${options.limit}` : ''}
        ${options?.offset ? `OFFSET ${options.offset}` : ''}
      `
      return query(sql, [orgId])
    },
    create: (data: any) => queryOne(
      'INSERT INTO "activity" ("organizationId", type, title, description, "resourceType", "resourceId", "userId", data, "isPublic", "isVisibleToAll", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP) RETURNING *',
      [data.organizationId, data.type, data.title, data.description, data.resourceType, data.resourceId, data.userId, JSON.stringify(data.data || {}), data.isPublic, data.isVisibleToAll]
    )
  },

  // AI Suggestions
  aiSuggestions: {
    findByOrgId: (orgId: string) => query(`
      SELECT ais.*, pr."requestNumber", pr.title as request_title
      FROM "ai_suggestion" ais
      LEFT JOIN "procurement_request" pr ON ais."requestId" = pr.id
      WHERE ais."organizationId" = $1
      ORDER BY ais."createdAt" DESC
    `, [orgId]),
    create: (data: any) => queryOne(
      'INSERT INTO "ai_suggestion" (type, "organizationId", "requestId", "threadId", title, description, data, confidence, reasoning, status, model, version, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
      [data.type, data.organizationId, data.requestId, data.threadId, data.title, data.description, JSON.stringify(data.data), data.confidence, data.reasoning, data.status, data.model, data.version]
    ),
    updateStatus: (id: string, status: string, appliedAt?: Date, appliedBy?: string) => queryOne(
      'UPDATE "ai_suggestion" SET status = $1, "appliedAt" = COALESCE($2, "appliedAt"), "appliedBy" = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [status, appliedAt, appliedBy, id]
    )
  },

  // Audit logs
  auditLogs: {
    findByOrgId: (orgId: string, options?: { limit?: number; offset?: number }) => {
      const sql = `
        SELECT al.*, u.name as user_name
        FROM "audit_log" al
        LEFT JOIN "user" u ON al."userId" = u.id
        WHERE al."organizationId" = $1
        ORDER BY al."createdAt" DESC
        ${options?.limit ? `LIMIT ${options.limit}` : ''}
        ${options?.offset ? `OFFSET ${options.offset}` : ''}
      `
      return query(sql, [orgId])
    },
    create: (data: any) => queryOne(
      'INSERT INTO "audit_log" ("organizationId", "userId", action, "resourceType", "resourceId", "oldValues", "newValues", "ipAddress", "userAgent", "sessionId", "requestId", "threadId", metadata, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, CURRENT_TIMESTAMP) RETURNING *',
      [data.organizationId, data.userId, data.action, data.resourceType, data.resourceId, JSON.stringify(data.oldValues || {}), JSON.stringify(data.newValues || {}), data.ipAddress, data.userAgent, data.sessionId, data.requestId, data.threadId, JSON.stringify(data.metadata || {})]
    )
  }
}

// Transaction helper
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Multi-tenant helper
export async function withOrgAccess<T>(orgId: string, callback: (client: any) => Promise<T>): Promise<T> {
  const org = await db.organizations.findById(orgId)
  if (!org) {
    throw new Error(`Organization ${orgId} not found`)
  }
  return await withTransaction(callback)
}

// Health check
export async function healthCheck(): Promise<{ status: string; database: string }> {
  try {
    await query('SELECT 1')
    return {
      status: 'healthy',
      database: 'connected'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      database: `error: ${error instanceof Error ? error.message : 'unknown error'}`
    }
  }
}

export default db