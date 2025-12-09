/**
 * Server-side Prisma utilities
 * These should only be used in server functions or API routes
 */

import { createServerFn } from '@tanstack/react-start'
import { getPrisma } from './prisma'

// Create a server function for database operations
export const withPrisma = createServerFn()
  .validator((input: any) => input)
  .handler(async ({ input }) => {
    const prisma = await getPrisma()
    return { prisma, input }
  })

// Helper to create server functions with Prisma
export function createPrismaServerFn<TInput, TResult>(
  handler: (args: { input: TInput; prisma: any }) => Promise<TResult>
) {
  return createServerFn<TInput, TResult>()
    .validator((input: TInput) => input)
    .handler(async ({ input }) => {
      const prisma = await getPrisma()
      return handler({ input, prisma })
    })
}

// Example server functions
export const getUser = createPrismaServerFn<{ id: string }, any | null>(
  async ({ input: { id }, prisma }) => {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            organization: true
          }
        }
      }
    })
  }
)

export const getOrganizations = createPrismaServerFn<{ userId: string }, any[]>(
  async ({ input: { userId }, prisma }) => {
    const memberships = await prisma.member.findMany({
      where: { userId },
      include: {
        organization: true
      }
    })

    return memberships.map(m => m.organization)
  }
)