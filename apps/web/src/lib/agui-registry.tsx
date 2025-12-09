import React from 'react'
import {
  QuoteApprovalCard,
  ThinkingLoader,
  InventoryCheck,
  QuoteFetcher,
  PaymentProcessor,
  PaymentSuccess,
  ErrorCard
} from '@supplygraph/ui-components'

export interface AGUIComponent {
  name: string
  component: React.ComponentType<any>
}

export interface AGUIEvent {
  type: 'ui_render' | 'user_action'
  component?: string
  props?: Record<string, any>
  action?: string
  threadId?: string
}

// AGUI Component Registry - maps component names to React components
export const AGUI_COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  'thinking_loader': ThinkingLoader,
  'inventory_check': InventoryCheck,
  'quote_fetcher': QuoteFetcher,
  'quote_approval_card': QuoteApprovalCard,
  'payment_processor': PaymentProcessor,
  'payment_success': PaymentSuccess,
  'error_card': ErrorCard,
}

// Default fallback component for unknown components
export const DefaultComponent = ({ message }: { message: string }) => (
  <div className="p-4 bg-muted rounded-lg">{message}</div>
)

export function getAGUIComponent(componentName: string): React.ComponentType<any> {
  return AGUI_COMPONENT_REGISTRY[componentName] || DefaultComponent
}