// Server-side Stripe integration
// This file handles Stripe webhook processing

import Stripe from 'stripe'
import { getPrisma } from './db.server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export async function handleStripeWebhook(body: string, signature: string) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  try {
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { received: true }
  } catch (err) {
    console.error('Webhook error:', err)
    throw err
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string
  const userId = session.metadata?.userId
  const orgId = session.metadata?.orgId

  if (!userId || !orgId) {
    console.error('Missing metadata in checkout session')
    return
  }

  // Update user's subscription status
  const prisma = getPrisma()
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      subscriptionId: subscriptionId,
      subscriptionStatus: 'active'
    }
  })

  console.log(`Checkout completed for user ${userId}, org ${orgId}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  // Update subscription status
  const prisma = getPrisma()
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'active',
      lastPaymentAt: new Date()
    }
  })

  console.log(`Payment succeeded for subscription ${subscriptionId}`)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  // Update subscription status
  const prisma = getPrisma()
  await prisma.user.updateMany({
    where: { subscriptionId },
    data: {
      subscriptionStatus: 'past_due'
    }
  })

  console.log(`Payment failed for subscription ${subscriptionId}`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Sync subscription details with database
  const customerId = subscription.customer as string

  const prisma = getPrisma()
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: subscription.status,
      subscriptionId: subscription.id,
      planId: subscription.items.data[0]?.price.id,
      planAmount: subscription.items.data[0]?.price.unit_amount,
      currency: subscription.currency
    }
  })

  console.log(`Subscription created: ${subscription.id}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Update subscription details
  const customerId = subscription.customer as string

  const prisma = getPrisma()
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: subscription.status,
      planId: subscription.items.data[0]?.price.id,
      planAmount: subscription.items.data[0]?.price.unit_amount
    }
  })

  console.log(`Subscription updated: ${subscription.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Cancel subscription in database
  const customerId = subscription.customer as string

  const prisma = getPrisma()
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: {
      subscriptionStatus: 'canceled',
      subscriptionId: null,
      canceledAt: new Date()
    }
  })

  console.log(`Subscription deleted: ${subscription.id}`)
}