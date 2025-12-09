import { PrismaClient, Role, OrganizationRole, ProcurementStatus, Priority } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean database
  await prisma.auditLog.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.aiSuggestion.deleteMany()
  await prisma.langGraphThread.deleteMany()
  await prisma.quoteItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.procurementItem.deleteMany()
  await prisma.procurementTemplate.deleteMany()
  await prisma.procurementRequest.deleteMany()
  await prisma.vendorContract.deleteMany()
  await prisma.vendorContact.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.department.deleteMany()
  await prisma.organizationSettings.deleteMany()
  await prisma.member.deleteMany()
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Database cleaned')

  // Create demo organizations
  const demoOrg = await prisma.organization.create({
    data: {
      name: 'SupplyGraph Demo',
      slug: 'demo',
      description: 'Demo organization for SupplyGraph',
      logo: 'https://ui-avatars.com/api/?name=SupplyGraph&background=0d1117&color=fff',
      website: 'https://supplygraph.demo',
      settings: {
        create: {
          approvalRequired: true,
          approvalAmount: 1000.00,
          autoVendorMatching: true,
          emailNotifications: true,
          currency: 'USD',
          timezone: 'UTC'
        }
      }
    },
    include: {
      settings: true
    }
  })

  const testOrg = await prisma.organization.create({
    data: {
      name: 'Test Company',
      slug: 'test-company',
      description: 'Test organization for development',
      logo: 'https://ui-avatars.com/api/?name=TestCo&background=0d1117&color=fff',
      website: 'https://testco.example',
      settings: {
        create: {
          approvalRequired: true,
          approvalAmount: 500.00,
          autoVendorMatching: false,
          emailNotifications: false,
          currency: 'USD',
          timezone: 'America/New_York'
        }
      }
    },
    include: {
      settings: true
    }
  })

  console.log('🏢 Organizations created:', demoOrg.name, testOrg.name)

  // Create demo users
  const demoUsers = [
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      role: Role.ADMIN,
      orgRole: OrganizationRole.OWNER
    },
    {
      name: 'Manager User',
      email: 'manager@demo.com',
      role: Role.USER,
      orgRole: OrganizationRole.ADMIN
    },
    {
      name: 'Employee User',
      email: 'employee@demo.com',
      role: Role.USER,
      orgRole: OrganizationRole.MEMBER
    },
    {
      name: 'Viewer User',
      email: 'viewer@demo.com',
      role: Role.USER,
      orgRole: OrganizationRole.VIEWER
    }
  ]

  const createdUsers = []
  for (const userData of demoUsers) {
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    })

    await prisma.member.create({
      data: {
        organizationId: demoOrg.id,
        userId: user.id,
        role: userData.orgRole
      }
    })

    createdUsers.push(user)
  }

  console.log('👥 Demo users created:', createdUsers.length)

  // Create test organization user
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@testco.com',
      role: Role.USER
    }
  })

  await prisma.member.create({
    data: {
      organizationId: testOrg.id,
      userId: testUser.id,
      role: OrganizationRole.OWNER
    }
  })

  console.log('👥 Test user created')

  // Create departments
  const departments = [
    { name: 'IT Department', code: 'IT', budget: 50000, manager: createdUsers[1] },
    { name: 'Operations', code: 'OPS', budget: 30000, manager: createdUsers[1] },
    { name: 'Marketing', code: 'MKT', budget: 25000, manager: createdUsers[1] },
    { name: 'Finance', code: 'FIN', budget: 20000, manager: createdUsers[0] }
  ]

  const createdDepartments = []
  for (const dept of departments) {
    const member = await prisma.member.findFirst({
      where: {
        organizationId: demoOrg.id,
        userId: dept.manager.id,
        role: OrganizationRole.ADMIN
      }
    })

    const department = await prisma.department.create({
      data: {
        name: dept.name,
        code: dept.code,
        budget: dept.budget,
        managerId: member?.id,
        organizationId: demoOrg.id
      }
    })
    createdDepartments.push(department)
  }

  console.log('🏢 Departments created:', createdDepartments.length)

  // Create categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and components' },
    { name: 'Office Supplies', slug: 'office-supplies', description: 'Stationery and office equipment' },
    { name: 'Furniture', slug: 'furniture', description: 'Office furniture and fixtures' },
    { name: 'Software', slug: 'software', description: 'Software licenses and subscriptions' },
    { name: 'Hardware', slug: 'hardware', description: 'Computer hardware and peripherals' }
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        organizationId: demoOrg.id
      }
    })
    createdCategories.push(category)
  }

  console.log('📁 Categories created:', createdCategories.length)

  // Create products
  const products = [
    { name: 'Laptop Pro', sku: 'LP-001', categoryId: createdCategories[0].id, unitPrice: 1200, currentStock: 15 },
    { name: 'Wireless Mouse', sku: 'WM-001', categoryId: createdCategories[0].id, unitPrice: 45, currentStock: 50 },
    { name: 'Office Chair', sku: 'OC-001', categoryId: createdCategories[2].id, unitPrice: 350, currentStock: 8 },
    { name: 'Standing Desk', sku: 'SD-001', categoryId: createdCategories[2].id, unitPrice: 800, currentStock: 5 },
    { name: 'Adobe License', sku: 'AD-001', categoryId: createdCategories[3].id, unitPrice: 199, currentStock: 0 },
    { name: 'Notebook Set', sku: 'NS-001', categoryId: createdCategories[1].id, unitPrice: 25, currentStock: 100 },
    { name: 'Monitor 27"', sku: 'MO-001', categoryId: createdCategories[4].id, unitPrice: 450, currentStock: 20 },
    { name: 'Keyboard Mechanical', sku: 'KB-001', categoryId: createdCategories[4].id, unitPrice: 150, currentStock: 30 }
  ]

  const createdProducts = []
  for (const prod of products) {
    const product = await prisma.product.create({
      data: {
        name: prod.name,
        sku: prod.sku,
        categoryId: prod.categoryId,
        organizationId: demoOrg.id,
        unitPrice: prod.unitPrice,
        currentStock: prod.currentStock,
        minStock: Math.floor(prod.currentStock * 0.2),
        specifications: {
          brand: faker.company.name(),
          warranty: '2 years',
          color: faker.color.human()
        },
        tags: [faker.helpers.arrayElement(['essential', 'premium', 'budget', 'eco-friendly'])]
      }
    })
    createdProducts.push(product)
  }

  console.log('📦 Products created:', createdProducts.length)

  // Create vendors
  const vendors = [
    { name: 'TechCorp Solutions', email: 'sales@techcorp.com', rating: 4.5 },
    { name: 'Office Supplies Plus', email: 'info@officesupplies.com', rating: 4.2 },
    { name: 'Furniture Experts', email: 'quotes@furniture-experts.com', rating: 4.8 },
    { name: 'Software Hub', email: 'licensing@softwarehub.com', rating: 4.0 },
    { name: 'Global Hardware', email: 'sales@globalhardware.com', rating: 3.9 }
  ]

  const createdVendors = []
  for (const vendorData of vendors) {
    const vendor = await prisma.vendor.create({
      data: {
        name: vendorData.name,
        email: vendorData.email,
        phone: faker.phone.number(),
        website: `https://${vendorData.name.toLowerCase().replace(' ', '')}.com`,
        description: faker.company.catchPhrase(),
        addressLine1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        taxId: faker.finance.accountNumber(),
        paymentTerms: 'Net 30',
        rating: vendorData.rating,
        organizationId: demoOrg.id,
        tags: faker.helpers.arrayElements(['reliable', 'fast-shipping', 'premium', 'budget-friendly'], 2)
      }
    })

    // Add contacts for each vendor
    await prisma.vendorContact.create({
      data: {
        vendorId: vendor.id,
        name: faker.person.fullName(),
        title: faker.person.jobTitle(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        isPrimary: true
      }
    })

    createdVendors.push(vendor)
  }

  console.log('🏭 Vendors created:', createdVendors.length)

  // Create procurement requests
  const procurementRequests = [
    {
      title: 'New Laptops for IT Team',
      description: 'Need 5 new laptops for the IT development team',
      departmentId: createdDepartments[0].id,
      requesterId: createdUsers[1].id,
      priority: Priority.HIGH,
      neededBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      totalAmount: 6000,
      status: ProcurementStatus.SUBMITTED
    },
    {
      title: 'Office Furniture Replacement',
      description: 'Replace old chairs in the main office area',
      departmentId: createdDepartments[1].id,
      requesterId: createdUsers[2].id,
      priority: Priority.MEDIUM,
      neededBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      totalAmount: 3500,
      status: ProcurementStatus.UNDER_REVIEW
    },
    {
      title: 'Software Licenses for Q4',
      description: 'Annual renewal of Adobe Creative Cloud licenses',
      departmentId: createdDepartments[3].id,
      requesterId: createdUsers[0].id,
      priority: Priority.URGENT,
      neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      totalAmount: 2388,
      status: ProcurementStatus.APPROVED
    }
  ]

  const createdRequests = []
  for (const req of procurementRequests) {
    const request = await prisma.procurementRequest.create({
      data: {
        title: req.title,
        description: req.description,
        departmentId: req.departmentId,
        requesterId: req.requesterId,
        priority: req.priority,
        neededBy: req.neededBy,
        totalAmount: req.totalAmount,
        status: req.status,
        organizationId: demoOrg.id,
        requestNumber: `REQ-${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`,
        threadId: `thread_${faker.string.uuid()}`
      }
    })

    // Add items to each request
    if (req.title.includes('Laptops')) {
      await prisma.procurementItem.create({
        data: {
          requestId: request.id,
          productId: createdProducts[0].id,
          name: 'Laptop Pro',
          description: 'High-performance laptop for development',
          quantity: 5,
          unit: 'each',
          unitPrice: 1200,
          totalPrice: 6000,
          status: 'PENDING'
        }
      })
    } else if (req.title.includes('Furniture')) {
      await prisma.procurementItem.create({
        data: {
          requestId: request.id,
          productId: createdProducts[2].id,
          name: 'Office Chair',
          description: 'Ergonomic office chair with lumbar support',
          quantity: 10,
          unit: 'each',
          unitPrice: 350,
          totalPrice: 3500,
          status: 'PENDING'
        }
      })
    } else if (req.title.includes('Software')) {
      await prisma.procurementItem.create({
        data: {
          requestId: request.id,
          productId: createdProducts[4].id,
          name: 'Adobe Creative Cloud',
          description: 'Annual license for creative suite',
          quantity: 12,
          unit: 'license',
          unitPrice: 199,
          totalPrice: 2388,
          status: 'APPROVED'
        }
      })
    }

    createdRequests.push(request)
  }

  console.log('📋 Procurement requests created:', createdRequests.length)

  // Create quotes for some requests
  if (createdRequests[0]) {
    const quotes = [
      {
        vendorId: createdVendors[0].id,
        subtotal: 5800,
        tax: 464,
        totalAmount: 6264,
        status: 'RECEIVED'
      },
      {
        vendorId: createdVendors[4].id,
        subtotal: 5750,
        tax: 460,
        totalAmount: 6210,
        status: 'UNDER_REVIEW'
      }
    ]

    for (const quoteData of quotes) {
      const quote = await prisma.quote.create({
        data: {
          requestId: createdRequests[0].id,
          vendorId: quoteData.vendorId,
          organizationId: demoOrg.id,
          quoteNumber: `Q-${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`,
          subtotal: quoteData.subtotal,
          tax: quoteData.tax,
          totalAmount: quoteData.totalAmount,
          status: quoteData.status,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          terms: 'Payment terms: Net 30 days\nWarranty: 2 years\nDelivery: 5-7 business days',
          notes: 'Quote includes setup and configuration services',
          receivedVia: 'Email',
          responseDate: new Date(),
          aiGenerated: false,
          confidence: 0.85
        }
      })

      // Add quote items
      await prisma.quoteItem.create({
        data: {
          quoteId: quote.id,
          requestItemId: createdRequests[0].id ? createdRequests[0].id : undefined,
          name: 'Laptop Pro - Development Model',
          description: 'Customized development laptop with additional RAM',
          quantity: 5,
          unit: 'each',
          unitPrice: quoteData.vendorId === createdVendors[0].id ? 1160 : 1150,
          totalPrice: quoteData.subtotal,
          productId: createdProducts[0].id
        }
      })
    }
  }

  console.log('💰 Quotes created')

  // Create some activities for the demo organization
  const activities = [
    {
      type: 'PROCUREMENT_CREATED',
      title: 'New procurement request submitted',
      description: 'IT team requested new laptops',
      resourceType: 'procurement_request',
      resourceId: createdRequests[0]?.id,
      userId: createdUsers[1].id
    },
    {
      type: 'QUOTE_RECEIVED',
      title: 'New quote received from TechCorp Solutions',
      description: 'Quote received for laptop procurement',
      resourceType: 'quote',
      userId: createdUsers[0].id
    },
    {
      type: 'PROCUREMENT_APPROVED',
      title: 'Software licenses approved',
      description: 'Adobe licenses for Q4 have been approved',
      resourceType: 'procurement_request',
      resourceId: createdRequests[2]?.id,
      userId: createdUsers[0].id,
      isPublic: true
    }
  ]

  for (const activityData of activities) {
    await prisma.activity.create({
      data: {
        organizationId: demoOrg.id,
        type: activityData.type as any,
        title: activityData.title,
        description: activityData.description,
        resourceType: activityData.resourceType,
        resourceId: activityData.resourceId,
        userId: activityData.userId,
        isPublic: activityData.isPublic || false,
        data: {
          timestamp: new Date().toISOString(),
          userAgent: 'seed-script'
        }
      }
    })
  }

  console.log('📊 Activities created')

  // Create some AI suggestions
  await prisma.aISuggestion.createMany({
    data: [
      {
        type: 'VENDOR_MATCH',
        organizationId: demoOrg.id,
        title: 'Alternative vendor found',
        description: 'Found a more cost-effective vendor for office supplies',
        data: {
          vendor: 'Budget Supplies Co',
          potentialSavings: 15,
          currentVendor: 'Office Supplies Plus'
        },
        confidence: 0.78,
        reasoning: 'Based on historical pricing data and vendor performance metrics',
        status: 'PENDING',
        model: 'gpt-4',
        version: '1.0'
      },
      {
        type: 'BULK_PURCHASE',
        organizationId: demoOrg.id,
        requestId: createdRequests[0]?.id,
        title: 'Bulk purchase discount opportunity',
        description: 'Ordering 10+ laptops may qualify for volume discount',
        data: {
          currentQuantity: 5,
          recommendedQuantity: 10,
          discountPercentage: 8,
          potentialSavings: 960
        },
        confidence: 0.85,
        reasoning: 'Vendor pricing tiers indicate volume discounts for orders over 10 units',
        status: 'PENDING',
        model: 'gpt-4',
        version: '1.0'
      }
    ]
  })

  console.log('🤖 AI suggestions created')

  console.log('\n✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Organizations: ${2}`)
  console.log(`   Users: ${demoUsers.length + 1}`)
  console.log(`   Departments: ${departments.length}`)
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Products: ${products.length}`)
  console.log(`   Vendors: ${vendors.length}`)
  console.log(`   Procurement Requests: ${procurementRequests.length}`)
  console.log(`   Activities: ${activities.length}`)
  console.log(`   AI Suggestions: 2`)

  console.log('\n🔐 Login credentials:')
  console.log('   Admin: admin@demo.com')
  console.log('   Manager: manager@demo.com')
  console.log('   Employee: employee@demo.com')
  console.log('   Viewer: viewer@demo.com')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })