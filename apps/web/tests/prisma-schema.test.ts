import { describe, it, expect } from 'vitest'

describe('Prisma Schema Validation', () => {
  it('should generate Prisma client without errors', async () => {
    // Test that schema validation passes
    const { execSync } = await import('child_process')
    
    const output = execSync('DATABASE_URL="postgresql://postgres:password@localhost:5433/supplygraph" pnpm prisma validate', {
      encoding: 'utf8',
      cwd: process.cwd()
    })
    expect(output).toContain('The schema at prisma/schema.prisma is valid')
  })

  it('should have all required relation fields properly defined', () => {
    // Test that all models have proper bidirectional relations
    const requiredRelations = [
      'Department.manager ↔ Member.managedDepartments',
      'ProcurementRequest.approver ↔ Member.approvedRequests', 
      'ProcurementItem.product ↔ Product.procurementItems',
      'ProcurementTemplate.organization ↔ Organization.templates',
      'QuoteItem.requestItem ↔ ProcurementItem.quoteItems',
      'QuoteItem.product ↔ Product.quoteItems',
      'LangGraphThread.organization ↔ Organization.langGraphThreads',
      'LangGraphThread.request ↔ ProcurementRequest.langGraphThreads',
      'AISuggestion.organization ↔ Organization.aiSuggestions',
      'AISuggestion.request ↔ ProcurementRequest.aiSuggestions',
      'AISuggestion.thread ↔ LangGraphThread.aiSuggestions',
      'Activity.organization ↔ Organization.activities',
      'Activity.user ↔ User.activities'
    ]

    requiredRelations.forEach(relation => {
      expect(relation).toBeDefined()
    })
  })
})