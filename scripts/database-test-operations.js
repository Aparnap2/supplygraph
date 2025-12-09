/**
 * SupplyGraph Database Test Operations
 * Comprehensive CRUD operations for testing the manual PostgreSQL setup
 */

const { Client } = require('pg');

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'supplygraph',
  user: 'postgres',
  password: 'postgres',
};

async function createConnection() {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

async function testConnection() {
  const client = await createConnection();
  try {
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Database Connection Successful');
    console.log('📅 Current Time:', result.rows[0].current_time);
    console.log('📊 PostgreSQL Version:', result.rows[0].version.split(' ')[1]);
    return true;
  } catch (error) {
    console.error('❌ Database Connection Failed:', error.message);
    return false;
  } finally {
    await client.end();
  }
}

async function createTestData() {
  const client = await createConnection();
  try {
    await client.query('BEGIN');

    // Create test organization
    const orgResult = await client.query(`
      INSERT INTO organization (id, name, slug, description, website)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `, [
      'test-org-1',
      'Test Supply Company',
      'test-supply-company',
      'A test company for procurement management',
      'https://testsupply.com'
    ]);

    const organization = orgResult.rows[0];

    // Create test user
    const userResult = await client.query(`
      INSERT INTO "user" (id, name, email, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `, [
      'test-user-1',
      'John Doe',
      'john.doe@testsupply.com',
      'ADMIN'
    ]);

    const user = userResult.rows[0];

    // Create membership
    const memberResult = await client.query(`
      INSERT INTO member (organizationId, userId, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (organizationId, userId) DO NOTHING
      RETURNING *
    `, [organization.id, user.id, 'OWNER']);

    // Create test department
    const deptResult = await client.query(`
      INSERT INTO department (id, name, code, organizationId, budget)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `, [
      'test-dept-1',
      'Information Technology',
      'IT',
      organization.id,
      50000.00
    ]);

    const department = deptResult.rows[0];

    // Create test category
    const catResult = await client.query(`
      INSERT INTO category (id, name, slug, organizationId)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING
      RETURNING *
    `, [
      'test-cat-1',
      'Computer Hardware',
      'computer-hardware',
      organization.id
    ]);

    const category = catResult.rows[0];

    // Create test products
    const products = [
      {
        id: 'test-prod-1',
        sku: 'LAPTOP-001',
        name: 'Business Laptop',
        description: 'High-performance laptop for business use',
        unitPrice: 1299.99,
        currentStock: 25,
        minStock: 5
      },
      {
        id: 'test-prod-2',
        sku: 'MOUSE-001',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        unitPrice: 29.99,
        currentStock: 100,
        minStock: 20
      }
    ];

    for (const product of products) {
      await client.query(`
        INSERT INTO product (id, sku, name, description, categoryId, organizationId, unitPrice, currentStock, minStock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING
      `, [
        product.id,
        product.sku,
        product.name,
        product.description,
        category.id,
        organization.id,
        product.unitPrice,
        product.currentStock,
        product.minStock
      ]);
    }

    // Create test vendors
    const vendors = [
      {
        id: 'test-vendor-1',
        name: 'TechSupply Inc.',
        email: 'sales@techsupply.com',
        phone: '555-0101',
        website: 'https://techsupply.com',
        rating: 4.5
      },
      {
        id: 'test-vendor-2',
        name: 'OfficeDepot',
        email: 'business@officedepot.com',
        phone: '555-0102',
        website: 'https://officedepot.com',
        rating: 4.2
      }
    ];

    for (const vendor of vendors) {
      await client.query(`
        INSERT INTO vendor (id, name, email, phone, website, rating, organizationId)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING
      `, [
        vendor.id,
        vendor.name,
        vendor.email,
        vendor.phone,
        vendor.website,
        vendor.rating,
        organization.id
      ]);
    }

    await client.query('COMMIT');

    console.log('✅ Test Data Created Successfully');
    console.log(`🏢 Organization: ${organization.name} (${organization.slug})`);
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🏭 Department: ${department.name}`);
    console.log(`📦 Category: ${category.name}`);
    console.log(`💻 Products: ${products.length} items`);
    console.log(`🏪 Vendors: ${vendors.length} vendors`);

    return { organization, user, department, category, products, vendors };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Test Data Creation Failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function testProcurementWorkflow(organization, user, department, products, vendors) {
  const client = await createConnection();
  try {
    await client.query('BEGIN');

    // Create procurement request
    const requestResult = await client.query(`
      INSERT INTO procurement_request (
        id, requestNumber, title, description, organizationId, requesterId,
        departmentId, status, priority, threadId, needsBy, totalAmount
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      'test-request-1',
      'PR-2024-001',
      'IT Equipment Purchase',
      'Purchase laptops and accessories for new team members',
      organization.id,
      user.id,
      department.id,
      'SUBMITTED',
      'HIGH',
      'thread-test-001',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      2659.97
    ]);

    const request = requestResult.rows[0];
    console.log(`📋 Created procurement request: ${request.requestNumber}`);

    // Add items to the request
    const items = [
      {
        id: 'test-item-1',
        requestId: request.id,
        productId: products[0].id,
        name: 'Business Laptop',
        quantity: 2,
        unit: 'each',
        unitPrice: 1299.99,
        totalPrice: 2599.98
      },
      {
        id: 'test-item-2',
        requestId: request.id,
        productId: products[1].id,
        name: 'Wireless Mouse',
        quantity: 2,
        unit: 'each',
        unitPrice: 29.99,
        totalPrice: 59.98
      }
    ];

    for (const item of items) {
      await client.query(`
        INSERT INTO procurement_item (id, requestId, productId, name, quantity, unit, unitPrice, totalPrice)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        item.id,
        item.requestId,
        item.productId,
        item.name,
        item.quantity,
        item.unit,
        item.unitPrice,
        item.totalPrice
      ]);
    }

    console.log(`📦 Added ${items.length} items to procurement request`);

    // Create quotes from vendors
    for (const vendor of vendors) {
      const quoteResult = await client.query(`
        INSERT INTO quote (
          id, quoteNumber, requestId, vendorId, organizationId, status,
          subtotal, tax, shipping, totalAmount
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        `test-quote-${vendor.id}`,
        `Q-2024-${vendor.id}`,
        request.id,
        vendor.id,
        organization.id,
        'RECEIVED',
        2659.97,
        212.80,
        25.00,
        2897.77
      ]);

      const quote = quoteResult.rows[0];
      console.log(`💰 Created quote ${quote.quoteNumber} from ${vendor.name}`);

      // Add quote items
      for (const item of items) {
        await client.query(`
          INSERT INTO quote_item (quoteId, requestItemId, name, quantity, unit, unitPrice, totalPrice)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          quote.id,
          item.id,
          item.name,
          item.quantity,
          item.unit,
          item.unitPrice,
          item.totalPrice
        ]);
      }
    }

    // Create LangGraph thread
    await client.query(`
      INSERT INTO langgraph_thread (id, threadId, organizationId, requestId, state, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'test-thread-1',
      'thread-test-001',
      organization.id,
      request.id,
      JSON.stringify({ node: 'vendor_matching', data: { status: 'processing' } }),
      'active'
    ]);

    // Create AI suggestion
    await client.query(`
      INSERT INTO ai_suggestion (
        id, type, organizationId, requestId, threadId, title, description, data, confidence
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      'test-suggestion-1',
      'VENDOR_MATCH',
      organization.id,
      request.id,
      'thread-test-001',
      'Alternative Vendor Suggestion',
      'Consider TechSupply Inc. for better pricing on bulk orders',
      JSON.stringify({
        vendorId: vendors[0].id,
        potentialSavings: 150.00,
        reasoning: 'Historical bulk discount available'
      }),
      0.85
    ]);

    await client.query('COMMIT');

    console.log('✅ Procurement Workflow Test Completed Successfully');
    return request;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Procurement Workflow Test Failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function testReadOperations() {
  const client = await createConnection();
  try {
    console.log('\n🔍 Testing Read Operations...');

    // Test organization queries
    const orgs = await client.query('SELECT * FROM organization');
    console.log(`📊 Found ${orgs.rows.length} organizations`);

    // Test procurement requests
    const requests = await client.query(`
      SELECT pr.*, o.name as org_name, u.name as requester_name
      FROM procurement_request pr
      JOIN organization o ON pr.organizationId = o.id
      JOIN "user" u ON pr.requesterId = u.id
    `);
    console.log(`📋 Found ${requests.rows.length} procurement requests`);

    // Test quotes with vendor info
    const quotes = await client.query(`
      SELECT q.*, v.name as vendor_name, pr.requestNumber
      FROM quote q
      JOIN vendor v ON q.vendorId = v.id
      JOIN procurement_request pr ON q.requestId = pr.id
    `);
    console.log(`💰 Found ${quotes.rows.length} quotes`);

    // Test AI suggestions
    const suggestions = await client.query(`
      SELECT ais.*, pr.requestNumber
      FROM ai_suggestion ais
      LEFT JOIN procurement_request pr ON ais.requestId = pr.id
    `);
    console.log(`🤖 Found ${suggestions.rows.length} AI suggestions`);

    // Test activity logs
    const activities = await client.query('SELECT * FROM activity ORDER BY createdAt DESC LIMIT 10');
    console.log(`📝 Found ${activities.rows.length} recent activities`);

    return {
      organizations: orgs.rows,
      requests: requests.rows,
      quotes: quotes.rows,
      suggestions: suggestions.rows,
      activities: activities.rows
    };
  } catch (error) {
    console.error('❌ Read Operations Test Failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function cleanupTestData() {
  const client = await createConnection();
  try {
    await client.query('BEGIN');

    // Delete in order to respect foreign key constraints
    const tables = [
      'audit_log',
      'activity',
      'ai_suggestion',
      'langgraph_thread',
      'quote_item',
      'quote',
      'procurement_item',
      'procurement_request',
      'product',
      'vendor',
      'category',
      'department',
      'member',
      'verification_token',
      'session',
      'account',
      "user",
      'organization'
    ];

    let totalDeleted = 0;
    for (const table of tables) {
      const result = await client.query(`DELETE FROM ${table} WHERE id LIKE 'test-%'`);
      if (result.rowCount > 0) {
        console.log(`🗑️  Deleted ${result.rowCount} test records from ${table}`);
        totalDeleted += result.rowCount;
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Cleanup completed. Deleted ${totalDeleted} test records`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup Failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function generateReport() {
  const client = await createConnection();
  try {
    console.log('\n📊 Generating Database Report...');

    // Get table counts
    const tables = await client.query(`
      SELECT schemaname, tablename, n_tup_ins as inserts, n_tup_upd as updates, n_tup_del as deletes
      FROM pg_stat_user_tables
      ORDER BY tablename
    `);

    console.log('\n📋 Database Statistics:');
    tables.rows.forEach(table => {
      console.log(`  ${table.tablename}: ${table.inserts} inserts, ${table.updates} updates, ${table.deletes} deletes`);
    });

    // Get row counts for main tables
    const mainTables = [
      'organization',
      '"user"',
      'member',
      'procurement_request',
      'vendor',
      'quote',
      'product',
      'ai_suggestion'
    ];

    console.log('\n📊 Current Row Counts:');
    for (const table of mainTables) {
      const result = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  ${table}: ${result.rows[0].count} rows`);
    }

    // Test a complex query
    const complexQuery = await client.query(`
      SELECT
        o.name as org_name,
        COUNT(DISTINCT pr.id) as request_count,
        COUNT(DISTINCT v.id) as vendor_count,
        COUNT(DISTINCT q.id) as quote_count,
        SUM(pr.totalAmount) as total_spend
      FROM organization o
      LEFT JOIN procurement_request pr ON o.id = pr.organizationId
      LEFT JOIN quote q ON pr.id = q.requestId
      LEFT JOIN vendor v ON o.id = v.organizationId
      GROUP BY o.id, o.name
      ORDER BY total_spend DESC NULLS LAST
    `);

    console.log('\n💰 Organization Summary:');
    complexQuery.rows.forEach(row => {
      console.log(`  ${row.org_name}: ${row.request_count} requests, ${row.vendor_count} vendors, $${row.total_spend || '0'} total spend`);
    });

  } catch (error) {
    console.error('❌ Report Generation Failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting SupplyGraph Database Tests...\n');

  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      return;
    }

    // Create test data
    const testData = await createTestData();

    // Test procurement workflow
    await testProcurementWorkflow(
      testData.organization,
      testData.user,
      testData.department,
      testData.products,
      testData.vendors
    );

    // Test read operations
    await testReadOperations();

    // Generate report
    await generateReport();

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Export functions for individual testing
module.exports = {
  testConnection,
  createTestData,
  testProcurementWorkflow,
  testReadOperations,
  cleanupTestData,
  generateReport,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}