// Shared database client and utilities
export { PrismaClient } from './generated/client'
export * from './generated/client'

// Re-export types for use across the monorepo
export type {
  Organization,
  User,
  UserRole,
  Vendor,
  ProcurementRequest,
  RequestStatus,
  RequestPriority,
  Quote,
  QuoteSource,
  QuoteStatus,
  Payment,
  PaymentStatus,
  AuditLog,
  EmailThread,
  EmailMessage,
  WorkflowExecution,
  WorkflowStatus,
} from './generated/client'

// Utility functions for multi-tenant operations
export const createTenantContext = (orgId: string) => ({
  orgId,
})

export const withTenant = <T extends { orgId: string }>(
  orgId: string,
  data: Omit<T, 'orgId'>
): T => ({
  ...data,
  orgId,
} as T)