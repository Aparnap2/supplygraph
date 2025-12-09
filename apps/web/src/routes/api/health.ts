import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/health')({
  component: () => null,
  loader: async () => {
    return {
      status: 'healthy',
      database: 'PostgreSQL',
      organizations: 0,
      timestamp: new Date().toISOString()
    }
  }
})