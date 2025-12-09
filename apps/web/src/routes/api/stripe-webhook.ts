// Stripe webhook endpoint for TanStack Start
// Handles payment events from Stripe

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/stripe-webhook')({
  component: () => null,
  loader: async () => {
    return {
      status: 'healthy',
      service: 'Stripe Webhooks',
      version: '1.0.0',
      description: 'Webhook endpoint for processing Stripe payment events',
      supportedEvents: [
        'checkout.session.completed',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted'
      ],
      timestamp: new Date().toISOString()
    }
  }
})

