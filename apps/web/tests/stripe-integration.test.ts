import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock modules inline to avoid hoisting issues
vi.mock('stripe', () => {
  const mockPaymentIntents = {
    create: vi.fn(),
    retrieve: vi.fn(),
  }
  
  return {
    default: vi.fn(() => ({
      paymentIntents: mockPaymentIntents,
    })),
  }
})

vi.mock('@prisma/client', () => {
  const mockPrisma = {
    procurementRequest: {
      update: vi.fn(),
    },
    organizationSettings: {
      findUnique: vi.fn(),
    },
  }
  
  return {
    PrismaClient: vi.fn(() => mockPrisma),
  }
})

// Import after mocking
import { createPaymentIntent, confirmCardPayment, processPayment, validatePaymentAmount, handleStripeWebhook } from '../src/lib/stripe'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

describe('Stripe Payment Integration', () => {
  let mockStripe: any
  let mockPrisma: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Get fresh mock instances
    mockStripe = new Stripe('sk_test_123')
    mockPrisma = new PrismaClient()
  })

  it('should create payment intent with correct amount', async () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret_test',
      amount: 10000, // $100 in cents
    }

    mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent)

    const result = await createPaymentIntent(100, 'usd', 'order_123', 'org_123')

    expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 10000,
      currency: 'usd',
      metadata: {
        order_id: 'order_123',
        organization_id: 'org_123',
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    })

    expect(result).toEqual({
      client_secret: 'pi_test_123_secret_test',
    })
  })

  it('should confirm card payment and update procurement status', async () => {
    const mockPaymentIntent = {
      id: 'pi_test_123',
      status: 'succeeded',
    }

    mockStripe.paymentIntents.retrieve.mockResolvedValue(mockPaymentIntent)
    mockPrisma.procurementRequest.update.mockResolvedValue({
      id: 'proc_123',
      status: 'PAID',
    })

    const result = await confirmCardPayment('pi_test_123', 'proc_123')

    expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_test_123')
    expect(mockPrisma.procurementRequest.update).toHaveBeenCalledWith({
      where: { id: 'proc_123' },
      data: {
        status: 'PAID',
        completedAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    })

    expect(result).toEqual({
      paymentIntent: {
        status: 'succeeded',
        id: 'pi_test_123',
      },
    })
  })

  it('should handle payment failures gracefully', async () => {
    mockStripe.paymentIntents.retrieve.mockRejectedValue(
      new Error('Payment failed')
    )

    await expect(confirmCardPayment('pi_test_123', 'proc_123')).rejects.toThrow(
      'Failed to confirm payment: Error: Payment failed'
    )
  })

  it('should update procurement request status after successful payment', async () => {
    mockPrisma.procurementRequest.update.mockResolvedValue({
      id: 'proc_123',
      status: 'PAID',
    })

    await processPayment('proc_123', 'pi_test_123', 'succeeded', 10000)

    expect(mockPrisma.procurementRequest.update).toHaveBeenCalledWith({
      where: { id: 'proc_123' },
      data: {
        status: 'PAID',
        totalAmount: 100, // $100 converted from cents
        updatedAt: expect.any(Date),
        completedAt: expect.any(Date),
      },
    })
  })

  it('should validate payment amount against approval limits', async () => {
    mockPrisma.organizationSettings.findUnique.mockResolvedValue({
      organizationId: 'org_123',
      approvalAmount: 5000, // $50 limit
    })

    const result = await validatePaymentAmount(2500, 'org_123') // $25

    expect(result).toEqual({
      valid: true,
      requiresApproval: false,
      message: 'Payment amount within approval limits',
    })
  })

  it('should reject payments exceeding approval limits', async () => {
    mockPrisma.organizationSettings.findUnique.mockResolvedValue({
      organizationId: 'org_123',
      approvalAmount: 5000, // $50 limit
    })

    const result = await validatePaymentAmount(7500, 'org_123') // $75

    expect(result).toEqual({
      valid: true,
      requiresApproval: true,
      message: 'Payment amount $75 requires approval (limit: $5000)',
    })
  })

  it('should handle Stripe webhook events correctly', async () => {
    const mockSucceededPaymentIntent = {
      id: 'pi_test_123',
      metadata: { order_id: 'order_123' },
      amount: 10000,
    }

    const mockFailedPaymentIntent = {
      id: 'pi_test_456',
      metadata: { order_id: 'order_456' },
      amount: 5000,
    }

    // Test successful payment
    mockPrisma.procurementRequest.update.mockResolvedValue({})

    await handleStripeWebhook('payment_intent.succeeded', {
      object: mockSucceededPaymentIntent
    })

    expect(mockPrisma.procurementRequest.update).toHaveBeenCalledWith({
      where: { id: 'order_123' },
      data: {
        status: 'PAID',
        totalAmount: 100,
        updatedAt: expect.any(Date),
        completedAt: expect.any(Date),
      },
    })

    // Test failed payment
    await handleStripeWebhook('payment_intent.payment_failed', {
      object: mockFailedPaymentIntent
    })

    expect(mockPrisma.procurementRequest.update).toHaveBeenCalledWith({
      where: { id: 'order_456' },
      data: {
        status: 'PAYMENT_FAILED',
        totalAmount: 50,
        updatedAt: expect.any(Date),
        completedAt: undefined,
      },
    })
  })
})