/**
 * AI Engine Database Configuration
 * PostgreSQL connection settings for AI/ML operations
 */

const config = {
  // PostgreSQL connection for AI Engine
  postgresql: {
    // Development configuration
    development: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'supplygraph',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: false,
      max: 20, // connection pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      statement_timeout: 10000,
      query_timeout: 10000,
    },

    // Production configuration
    production: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'supplygraph',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
      max: 50,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 5000,
      statement_timeout: 30000,
      query_timeout: 30000,
    }
  },

  // Connection string for different environments
  getConnectionString: function(env = 'development') {
    const config = this.postgresql[env];
    return `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`;
  },

  // Tables relevant for AI operations
  aiTables: {
    procurement: 'procurement_request',
    items: 'procurement_item',
    vendors: 'vendor',
    quotes: 'quote',
    quoteItems: 'quote_item',
    threads: 'langgraph_thread',
    suggestions: 'ai_suggestion',
    audit: 'audit_log',
    organizations: 'organization',
    users: 'user',
    products: 'product'
  },

  // Key queries for AI operations
  queries: {
    // Get procurement requests for AI processing
    getPendingRequests: `
      SELECT pr.*, o.name as org_name, u.name as user_name, d.name as dept_name
      FROM procurement_request pr
      JOIN organization o ON pr.organizationId = o.id
      JOIN "user" u ON pr.requesterId = u.id
      LEFT JOIN department d ON pr.departmentId = d.id
      WHERE pr.status IN ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW')
      ORDER BY pr.priority DESC, pr.createdAt ASC
    `,

    // Get vendor suggestions based on category
    getVendorSuggestions: `
      SELECT v.*, COUNT(q.id) as quote_count, AVG(q.totalAmount) as avg_quote_amount
      FROM vendor v
      LEFT JOIN quote q ON v.id = q.vendorId
      WHERE v.organizationId = $1 AND v.isActive = true
      GROUP BY v.id
      ORDER BY v.rating DESC, quote_count DESC
    `,

    // Get historical data for price optimization
    getHistoricalPricing: `
      SELECT
        pi.name as item_name,
        AVG(qi.unitPrice) as avg_price,
        MIN(qi.unitPrice) as min_price,
        MAX(qi.unitPrice) as max_price,
        COUNT(qi.id) as quote_count,
        DATE_TRUNC('month', q.createdAt) as month
      FROM quote_item qi
      JOIN quote q ON qi.quoteId = q.id
      JOIN procurement_item pi ON qi.requestItemId = pi.id
      WHERE qi.name ILIKE $1
        AND q.status = 'ACCEPTED'
        AND q.createdAt >= NOW() - INTERVAL '12 months'
      GROUP BY pi.name, month
      ORDER BY month DESC
    `,

    // Get LangGraph threads for active workflows
    getActiveThreads: `
      SELECT lt.*, pr.title as request_title, pr.status as request_status
      FROM langgraph_thread lt
      LEFT JOIN procurement_request pr ON lt.requestId = pr.id
      WHERE lt.status = 'active'
      ORDER BY lt.updatedAt DESC
    `,

    // Create AI suggestion
    createSuggestion: `
      INSERT INTO ai_suggestion (
        type, organizationId, requestId, threadId, title, description, data, confidence, reasoning, model, version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,

    // Log AI activities
    logActivity: `
      INSERT INTO audit_log (
        organizationId, userId, action, resourceType, resourceId, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `
  },

  // Pool configuration for different use cases
  pools: {
    // For AI inference (lightweight, many connections)
    inference: {
      min: 5,
      max: 30,
      acquireTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    },

    // For data analysis (heavy queries)
    analytics: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 60000
    },

    // For real-time operations
    realtime: {
      min: 10,
      max: 50,
      acquireTimeoutMillis: 5000,
      idleTimeoutMillis: 15000
    }
  }
};

module.exports = config;