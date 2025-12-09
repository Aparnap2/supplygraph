import { PrismaClient } from '@prisma/client'
import type {
  // Core types
  User, Organization, Member,

  // Supply management
  Product, Category, Department, Vendor, VendorContact, VendorContract,

  // Procurement workflow
  ProcurementRequest, ProcurementItem, ProcurementTemplate,

  // Quote management
  Quote, QuoteItem,

  // AI and workflow
  LangGraphThread, AISuggestion,

  // Audit and analytics
  AuditLog, Activity,

  // Enums
  Role, OrganizationRole, ProcurementStatus, Priority,
  ItemStatus, QuoteStatus, SuggestionType, SuggestionStatus, ActivityType
} from '@prisma/client'

// Export the Prisma Client constructor
export { PrismaClient }

// Export all types for easy importing
export type {
  User, Organization, Member,
  Product, Category, Department, Vendor, VendorContact, VendorContract,
  ProcurementRequest, ProcurementItem, ProcurementTemplate,
  Quote, QuoteItem,
  LangGraphThread, AISuggestion,
  AuditLog, Activity,
  Role, OrganizationRole, ProcurementStatus, Priority,
  ItemStatus, QuoteStatus, SuggestionType, SuggestionStatus, ActivityType
}

// Re-export the generated client with typing
import { Prisma as PrismaNamespace } from '@prisma/client'
export type { PrismaClient as PrismaClientType } from '@prisma/client'
export { PrismaNamespace as Prisma }

// Database connection utilities
export const createDatabaseClient = (url?: string) => {
  return new PrismaClient({
    datasources: {
      db: {
        url: url || process.env.DATABASE_URL
      }
    },
    // Enable logging in development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
}

// Singleton pattern for database client
let globalPrisma: PrismaClient | null = null

export const db = globalPrisma ?? createDatabaseClient()

if (process.env.NODE_ENV !== 'production') {
  globalPrisma = db
}

// Database utility functions
export const withTransaction = async <T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> => {
  return await db.$transaction(callback)
}

export const withOrgAccess = async <T>(
  organizationId: string,
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> => {
  return await db.$transaction(async (tx) => {
    // Verify organization exists and user has access
    const org = await tx.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true }
    })

    if (!org) {
      throw new Error(`Organization ${organizationId} not found`)
    }

    return await callback(tx)
  })
}

// Export database connection
export default db