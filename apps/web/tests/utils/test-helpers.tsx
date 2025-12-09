import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock user session
export const mockUserSession = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  image: 'https://example.com/avatar.jpg',
  organizations: [
    { id: 'org-1', name: 'Acme Corp', role: 'admin' },
    { id: 'org-2', name: 'Beta Inc', role: 'member' }
  ],
  currentOrganization: { id: 'org-1', name: 'Acme Corp', role: 'admin' }
}

// Mock WebSocket message helper
export const createWebSocketMessage = (type: 'ui_render' | 'user_action', data: any) => ({
  type,
  ...data
})

// Mock AGUI event creator
export const createAGUIEvent = (component: string, props: any) => ({
  type: 'ui_render',
  component,
  props
})

// Mock fetch helper
export const mockFetch = (response: any, options?: { ok?: boolean; status?: number }) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: options?.ok ?? true,
    status: options?.status ?? 200,
    json: async () => response,
    text: async () => JSON.stringify(response),
  } as Response)
}

// Wait for component update
export const waitForComponentUpdate = async (ms = 100) => {
  await new Promise(resolve => setTimeout(resolve, ms))
}

// Create mock items for QuoteApprovalCard
export const createMockItems = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    name: `Test Item ${i + 1}`,
    quantity: (i + 1) * 5,
    unit: 'units',
    unit_price: 10.99 * (i + 1),
    total_price: 10.99 * (i + 1) * ((i + 1) * 5)
  }))

// Re-export testing library utilities
export * from '@testing-library/react'
export { customRender as render }

// Vitest utilities
export { vi } from 'vitest'