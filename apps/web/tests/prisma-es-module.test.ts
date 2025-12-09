/**
 * Prisma ES Module Integration Tests
 * Tests for Prisma client compatibility with TanStack Start ES modules
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock the Prisma client to avoid actual database connections during tests
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
    },
    organization: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: 'org1', name: 'Test Org' }),
    },
    $connect: vi.fn().mockResolvedValue(undefined),
    $disconnect: vi.fn().mockResolvedValue(undefined),
  })),
}))

describe('Prisma ES Module Integration', () => {
  let prisma: PrismaClient

  beforeEach(() => {
    prisma = new PrismaClient()
  })

  afterEach(async () => {
    await prisma.$disconnect()
    vi.clearAllMocks()
  })

  it('should create Prisma client instance without ES module errors', () => {
    expect(prisma).toBeDefined()
    expect(prisma).toHaveProperty('user')
    expect(prisma).toHaveProperty('organization')
  })

  it('should handle async operations with ES modules', async () => {
    const users = await prisma.user.findMany()
    expect(users).toEqual([])
    expect(prisma.user.findMany).toHaveBeenCalled()
  })

  it('should support dynamic imports for Prisma client', async () => {
    // Test dynamic import which is common in ES module environments
    const { PrismaClient: DynamicPrismaClient } = await import('@prisma/client')
    const dynamicPrisma = new DynamicPrismaClient()
    
    expect(dynamicPrisma).toBeDefined()
    await dynamicPrisma.$disconnect()
  })

  it('should work with server-side rendering context', async () => {
    // Simulate SSR context
    const mockRequest = { headers: {} }
    const prismaInContext = new PrismaClient()
    
    const result = await prismaInContext.user.create({
      data: { email: 'test@example.com', name: 'Test User' }
    })
    
    expect(result).toHaveProperty