// Server-side Prisma client for TanStack Start
// This file is excluded from the client bundle via vite.config.ts

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Create a singleton instance for the server
let prisma: PrismaClient | undefined

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/supplygraph",
})

export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  }

  // In development, don't close the connection
  if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = prisma
  }

  return prisma
}

// Export the prisma instance with a more friendly name
export const db = getPrisma()

// Helper for server components
export { prisma }

// Type exports
export type { PrismaClient }