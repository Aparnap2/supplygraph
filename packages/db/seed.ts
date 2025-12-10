import { PrismaClient } from './generated/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test organization
  const testOrg = await prisma.organization.upsert({
    where: { slug: 'test-org' },
    update: {},
    create: {
      name: 'Test Organization',
      slug: 'test-org',
      metadata: {
        industry: 'Technology',
        size: 'Small',
      },
    },
  })

  console.log('✅ Created test organization:', testOrg.name)

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: 'admin@test-org.com' },
    update: {},
    create: {
      email: 'admin@test-org.com',
      name: 'Test Admin',
      role: 'OWNER',
      orgId: testOrg.id,
      metadata: {
        source: 'seed',
      },
    },
  })

  console.log('✅ Created test user:', testUser.email)

  // Create test vendors
  const vendors = await Promise.all([
    prisma.vendor.upsert({
      where: { id: 'vendor-1' },
      update: {},
      create: {
        id: 'vendor-1',
        name: 'Acme Supplies',
        email: 'sales@acme-supplies.com',
        phone: '+1-555-0123',
        website: 'https://acme-supplies.com',
        orgId: testOrg.id,
        metadata: {
          specialties: ['Office Supplies', 'Electronics'],
          rating: 4.5,
        },
      },
    }),
    prisma.vendor.upsert({
      where: { id: 'vendor-2' },
      update: {},
      create: {
        id: 'vendor-2',
        name: 'Global Tech Solutions',
        email: 'quotes@globaltech.com',
        phone: '+1-555-0456',
        website: 'https://globaltech.com',
        orgId: testOrg.id,
        metadata: {
          specialties: ['IT Equipment', 'Software'],
          rating: 4.2,
        },
      },
    }),
  ])

  console.log('✅ Created test vendors:', vendors.map(v => v.name).join(', '))

  // Create sample procurement request
  const sampleRequest = await prisma.procurementRequest.create({
    data: {
      title: 'Office Laptop Purchase',
      description: 'Need 10 laptops for new employees',
      items: [
        {
          name: 'Business Laptop',
          quantity: 10,
          specifications: {
            cpu: 'Intel i7 or equivalent',
            ram: '16GB',
            storage: '512GB SSD',
            screen: '14-15 inch',
          },
        },
      ],
      status: 'CREATED',
      priority: 'MEDIUM',
      orgId: testOrg.id,
      createdBy: testUser.id,
      requestedBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  })

  console.log('✅ Created sample procurement request:', sampleRequest.title)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })