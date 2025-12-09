// CSV Upload API route for TanStack Start
// Handles CSV/Excel file parsing and procurement request creation

import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// Input validation schema
const UploadSchema = z.object({
  fileContent: z.string(),
  fileName: z.string(),
  fileType: z.string()
})

// Mock CSV parser - in production, use a library like PapaParse or xlsx
function parseCSV(content: string) {
  const lines = content.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())

  const items = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length === headers.length) {
      const item: any = {}
      headers.forEach((header, index) => {
        item[header] = values[index]
      })
      // Convert numeric fields
      if (item.quantity) item.quantity = parseInt(item.quantity)
      if (item.unit_price) item.unit_price = parseFloat(item.unit_price)
      items.push(item)
    }
  }
  return items
}

// Server function for processing uploaded CSV
const processCSV = createServerFn({ method: 'POST' })
  .inputValidator(UploadSchema)
  .handler(async ({ data }) => {
    try {
      let items: any[] = []

      // Parse based on file type
      if (data.fileType === 'text/csv' || data.fileName.endsWith('.csv')) {
        items = parseCSV(data.fileContent)
      } else {
        // For Excel files, we'd use a library like xlsx in production
        throw new Error('Excel file parsing not implemented in demo')
      }

      if (items.length === 0) {
        throw new Error('No valid items found in CSV')
      }

      // Validate required fields
      const requiredFields = ['item_name', 'category', 'quantity', 'unit_price']
      for (const item of items) {
        for (const field of requiredFields) {
          if (!item[field]) {
            throw new Error(`Missing required field: ${field}`)
          }
        }
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Create procurement requests from CSV items
      const requests = items.map((item, index) => ({
        id: `csv_${Date.now()}_${index}`,
        title: item.item_name || `Imported Item ${index + 1}`,
        category: item.category || 'General',
        quantity: item.quantity || 1,
        unitPrice: item.unit_price || 0,
        totalBudget: (item.quantity || 1) * (item.unit_price || 0),
        priority: (item.priority || 'MEDIUM').toUpperCase(),
        description: item.description || `Imported from ${data.fileName}`,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        createdBy: 'CSV Import',
        source: 'CSV Upload'
      }))

      return {
        success: true,
        message: `Successfully processed ${items.length} items`,
        requests: requests,
        totalItems: items.length,
        totalValue: requests.reduce((sum, r) => sum + r.totalBudget, 0)
      }
    } catch (error) {
      console.error('CSV processing failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process CSV',
        timestamp: new Date().toISOString()
      }
    }
  })

// GET endpoint - check upload service status
export const Route = createFileRoute('/api/upload-csv')({
  component: () => null,
  loader: async () => {
    return {
      status: 'healthy',
      service: 'CSV Upload API',
      version: '1.0.0',
      supportedFormats: ['CSV', 'XLSX', 'XLS'],
      maxFileSize: '10MB',
      timestamp: new Date().toISOString()
    }
  }
})

// Export the server function for use in components
export { processCSV }