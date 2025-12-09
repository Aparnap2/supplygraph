/**
 * AGUI Component Types
 * Shared types for Agent-Generated UI components
 */

export interface AGUIEvent {
  type: 'ui_render' | 'user_action'
  component?: string
  props?: Record<string, any>
  action?: string
  threadId?: string
  data?: any
}

export interface AGUIComponentProps {
  onAction?: (action: string, data?: any) => void
  threadId?: string
  orgId?: string
}

// Component-specific prop types
export interface QuoteApprovalProps {
  vendor: string
  items: Array<{
    name: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  totalAmount: number
  savings: string
  deliveryTime: string
  quoteId: string
  isInterrupt?: boolean
}

export interface ThinkingLoaderProps {
  status: string
  stage: string
}

export interface ErrorCardProps {
  error: string
  type: 'payment_error' | 'quote_error' | 'approval_error' | 'general_error'
  retryAllowed?: boolean
}

export interface InventoryCheckProps {
  items: Array<{
    name: string
    quantity: number
    currentStock: number
    needsProcurement: boolean
  }>
  status: string
}

export interface QuoteFetcherProps {
  items: Array<{
    name: string
    quantity: number
    unit: string
    specifications?: string
  }>
  status: string
  estimatedTime: string
}

export interface PaymentProcessorProps {
  status: string
  amount: number
}

export interface PaymentSuccessProps {
  vendor: string
  amount: number
  confirmation: string
  paymentIntentId: string
}