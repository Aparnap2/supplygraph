import Stripe from 'stripe'
// Database operations should be handled in server-side functions

export interface PaymentIntentRequest {
  amount: number
  currency: string
  orderId: string
  organizationId: string
}

export interface PaymentConfirmation {
  paymentIntent: {
    status: string
    id: string
  }
}

export interface PaymentValidation {
  valid: boolean
  requiresApproval: boolean
  message: string
}

// Initialize Stripe with test key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123', {
  apiVersion: '2023-10-16',
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  orderId: string,
  organizationId: string
): Promise<{ client_secret: string }> {
  try {
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      metadata: {
        order_id: orderId,
        organization_id: organizationId,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    })

    return {
      client_secret: paymentIntent.client_secret!
    }
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error)
    throw new Error(`Failed to create payment intent: ${error}`)
  }
}

export async function confirmCardPayment(
  paymentIntentId: string,
  procurementId: string
): Promise<PaymentConfirmation> {
  try {
    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Database update should be handled by server-side function
    // TODO: Call server action to update procurement status

    return {
      paymentIntent: {
        status: paymentIntent.status!,
        id: paymentIntent.id!
      }
    }
  } catch (error) {
    console.error('Stripe payment confirmation failed:', error)
    throw new Error(`Failed to confirm payment: ${error}`)
  }
}

export async function processPayment(
  procurementId: string,
  paymentIntentId: string,
  status: string,
  amount: number
): Promise<void> {
  try {
    // Database update should be handled by server-side function
    // TODO: Call server action to update procurement status
    console.log(`Payment processed for procurement ${procurementId}:`, {
      status,
      amount: amount / 100
    })
  } catch (error) {
    console.error('Failed to process payment:', error)
    throw new Error(`Failed to process payment: ${error}`)
  }
}

export async function validatePaymentAmount(
  amount: number,
  organizationId: string
): Promise<PaymentValidation> {
  try {
    // Database query should be handled by server-side function
    // For now, return default settings
    const defaultApprovalLimit = 5000 // $50 default
    const approvalRequired = amount > defaultApprovalLimit

    return {
      valid: amount > 0 && amount <= 100000, // Reasonable limits
      requiresApproval: approvalRequired,
      message: approvalRequired
        ? `Payment amount $${amount / 100} requires approval (limit: $${defaultApprovalLimit})`
        : 'Payment amount within approval limits'
    }
    // TODO: Call server action to get organization settings
  } catch (error) {
    console.error('Payment validation failed:', error)
    throw new Error(`Failed to validate payment: ${error}`)
  }
}

export async function handleStripeWebhook(
  eventType: string,
  data: any
): Promise<void> {
  try {
    switch (eventType) {
      case 'payment_intent.succeeded': {
        const succeededPaymentIntent = data.object as Stripe.PaymentIntent
        await processPayment(
          succeededPaymentIntent.metadata.order_id,
          succeededPaymentIntent.id,
          'succeeded',
          succeededPaymentIntent.amount
        )
        break
      }
        
      case 'payment_intent.payment_failed': {
        const failedPaymentIntent = data.object as Stripe.PaymentIntent
        await processPayment(
          failedPaymentIntent.metadata.order_id,
          failedPaymentIntent.id,
          'failed',
          failedPaymentIntent.amount
        )
        break
      }
        
      default:
        console.log(`Unhandled Stripe webhook event: ${eventType}`)
    }
  } catch (error) {
    console.error('Stripe webhook processing failed:', error)
    throw new Error(`Failed to process webhook: ${error}`)
  }
}