import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Adapter for PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

// Create a singleton instance of Prisma Client
declare global {
  var __prisma: PrismaClient | undefined
}

export function getPrisma() {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
    })
  }
  return globalThis.__prisma
}

// Export the singleton instance for backward compatibility
export const prisma = getPrisma()

// Ensure the client is closed when the process exits
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    if (globalThis.__prisma) {
      await globalThis.__prisma.$disconnect()
    }
  })
}