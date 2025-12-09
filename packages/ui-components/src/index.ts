/**
 * SupplyGraph UI Components
 * AGUI (Agent-Generated UI) components for procurement workflow
 */

export { default as QuoteApprovalCard } from './QuoteApprovalCard'
export { default as ThinkingLoader } from './ThinkingLoader'
export { default as InventoryCheck } from './InventoryCheck'
export { default as QuoteFetcher } from './QuoteFetcher'
export { default as PaymentProcessor } from './PaymentProcessor'
export { default as PaymentSuccess } from './PaymentSuccess'
export { default as ErrorCard } from './ErrorCard'

// Component types for AGUI system
export interface AGUIComponentProps {
  onAction?: (action: string, data?: any) => void
  threadId?: string
  orgId?: string
}

// Re-export common component types
export type { AGUIEvent } from '../types'