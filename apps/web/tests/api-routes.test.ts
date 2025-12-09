/**
 * API Routes Tests
 * Tests for TanStack Start file-based routing with POST handlers
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createFileRoute } from '@tanstack/react-router'

// Mock request object
const createMockRequest = (body?: any, headers?: Record<string, string>) => ({
  url: 'http://localhost:3000/api/test',
  method: 'POST',
  headers: headers || {},
  body: body ? JSON.stringify(body) : undefined,
})

describe('API Routes - POST Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle POST requests to email endpoint', async () => {
    // Mock email service
    const mockSendEmail = vi.fn().mockResolvedValue({ success: true, messageId: 'msg_123' })
    vi.doMock('../src/lib/email-service', () => ({
      sendEmail: mockSendEmail
    }))

    // Create test route
    const mockRoute = createFileRoute('/api/email')({
      server: {
        handlers: {
          POST: async ({ request }) => {
            const body = await request.json()
            const result = await mockSendEmail(body)
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }
      }
    })

    // Test POST request
    const request = createMockRequest({
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'Test body'
    })

    const response = await mockRoute.server?.handlers?.POST?.(request)
    const responseData = await response?.json()

    expect(response?.status).toBe(200)
    expect(responseData.success).toBe(true)
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'Test body'
    })
  })

  it('should handle POST requests to Stripe webhook endpoint', async () => {
    // Mock Stripe service
    const mockProcessWebhook = vi.fn().mockResolvedValue({ success: true })
    vi.doMock('../src/lib/stripe', () => ({
      processWebhook: mockProcessWebhook
    }))

    // Create test route
    const mockRoute = createFileRoute('/api/stripe-webhook')({
      server: {
        handlers: {
          POST: async ({ request }) => {
            const body = await request.json()
            const signature = request.headers.get('stripe-signature')
            const result = await mockProcessWebhook(body, signature)
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }
      }
    })

    // Test Stripe webhook
    const webhookBody = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          amount: 2000,
          currency: 'usd'
        }
      }
    }

    const request = createMockRequest(webhookBody, {
      'stripe-signature': 'test_signature'
    })

    const response = await mockRoute.server?.handlers?.POST?.(request)
    const responseData = await response?.json()

    expect(response?.status).toBe(200)
    expect(responseData.success).toBe(true)
    expect(mockProcessWebhook).toHaveBeenCalledWith(webhookBody, 'test_signature')
  })

  it('should handle CORS preflight requests', async () => {
    const mockRoute = createFileRoute('/api/test')({
      server: {
        handlers: {
          POST: async ({ request }) => {
            return new Response(JSON.stringify({ message: 'OK' }), {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            })
          },
          OPTIONS: async () => {
            return new Response(null, {
              status: 200,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            })
          }
        }
      }
    })

    // Test OPTIONS request
    const optionsRequest = new Request('http://localhost:3000/api/test', {
      method: 'OPTIONS',
      headers: { 'Origin': 'http://localhost:3001' }
    })

    const optionsResponse = await mockRoute.server?.handlers?.OPTIONS?.(optionsRequest)

    expect(optionsResponse?.status).toBe(200)
    expect(optionsResponse?.headers?.['Access-Control-Allow-Origin']).toBe('*')
  })

  it('should handle authentication middleware', async () => {
    // Mock auth service
    const mockGetSession = vi.fn().mockResolvedValue({
      user: { id: 'user_123', email: 'test@example.com' },
      organization: { id: 'org_123', name: 'Test Org' }
    })

    vi.doMock('../src/lib/auth.server', () => ({
      getServerSession: mockGetSession
    }))

    // Create protected route
    const mockRoute = createFileRoute('/api/protected')({
      server: {
        handlers: {
          GET: async ({ request }) => {
            const session = await mockGetSession(request)
            if (!session?.user) {
              return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
              })
            }

            return new Response(JSON.stringify({ 
              user: session.user,
              organization: session.organization 
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }
      }
    })

    // Test unauthenticated request
    const unauthRequest = createMockRequest()
    const unauthResponse = await mockRoute.server?.handlers?.GET?.(unauthRequest)
    const unauthData = await unauthResponse?.json()

    expect(unauthResponse?.status).toBe(401)
    expect(unauthData.error).toBe('Unauthorized')

    // Test authenticated request
    const authRequest = createMockRequest()
    mockGetSession.mockResolvedValueOnce({
      user: { id: 'user_123', email: 'test@example.com' },
      organization: { id: 'org_123', name: 'Test Org' }
    })

    const authResponse = await mockRoute.server?.handlers?.GET?.(authRequest)
    const authData = await authResponse?.json()

    expect(authResponse?.status).toBe(200)
    expect(authData.user.id).toBe('user_123')
    expect(authData.organization.id).toBe('org_123')
  })
})