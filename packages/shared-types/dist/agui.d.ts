/**
 * AGUI (Agent-User Interface) type definitions for SupplyGraph
 * This bridges LangGraph events to React components
 */
export interface AGUIEvent<T = any> {
    id: string;
    type: 'ui_render' | 'ui_update' | 'ui_remove';
    component: string;
    props: T;
    timestamp: number;
    thread_id?: string;
    metadata?: Record<string, any>;
}
export interface WorkflowAGUIEvent extends AGUIEvent {
    thread_id: string;
    workflow_state: string;
    org_id: string;
    user_id: string;
}
export interface ThinkingLoaderProps {
    status: string;
    stage: 'parsing' | 'analyzing' | 'fetching' | 'processing';
    progress?: number;
}
export interface InventoryCheckProps {
    items: Array<{
        name: string;
        quantity: number;
        unit: string;
        specifications?: string;
        category?: string;
    }>;
    status: 'checking' | 'completed' | 'unavailable';
}
export interface QuoteFetcherProps {
    items: Array<{
        name: string;
        quantity: number;
        unit: string;
    }>;
    status: 'contacting_vendors' | 'fetching' | 'completed';
    estimated_time: string;
    vendors_count?: number;
}
export interface QuoteApprovalCardProps {
    vendor: string;
    items: Array<{
        name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }>;
    total_amount: number;
    savings: string;
    delivery_time: string;
    quote_id: string;
    org_id: string;
    valid_until?: string;
}
export interface PaymentProcessorProps {
    status: 'processing_payment' | 'payment_complete' | 'payment_failed';
    amount: number;
    vendor: string;
    payment_method?: string;
}
export interface PaymentSuccessProps {
    vendor: string;
    amount: number;
    confirmation: string;
    estimated_delivery: string;
    order_id?: string;
}
export interface ErrorCardProps {
    error: string;
    type: 'parsing_error' | 'quote_error' | 'payment_error' | 'general_error';
    retryable?: boolean;
    thread_id?: string;
}
export declare const AGUI_COMPONENTS: {
    readonly thinking_loader: "ThinkingLoader";
    readonly inventory_check: "InventoryCheck";
    readonly quote_fetcher: "QuoteFetcher";
    readonly quote_approval_card: "QuoteApprovalCard";
    readonly payment_processor: "PaymentProcessor";
    readonly payment_success: "PaymentSuccess";
    readonly error_card: "ErrorCard";
};
export type AGUIComponentName = keyof typeof AGUI_COMPONENTS;
export type AGUIComponentProps = {
    [K in AGUIComponentName]: K extends 'thinking_loader' ? ThinkingLoaderProps : K extends 'inventory_check' ? InventoryCheckProps : K extends 'quote_fetcher' ? QuoteFetcherProps : K extends 'quote_approval_card' ? QuoteApprovalCardProps : K extends 'payment_processor' ? PaymentProcessorProps : K extends 'payment_success' ? PaymentSuccessProps : K extends 'error_card' ? ErrorCardProps : never;
};
export interface WebSocketMessage {
    type: 'ui_component' | 'message' | 'error' | 'connection_established';
    data: any;
    timestamp?: number;
    workflow_state?: string;
    thread_id?: string;
}
export interface UIComponentMessage extends WebSocketMessage {
    type: 'ui_component';
    data: AGUIEvent;
}
export interface ChatMessage extends WebSocketMessage {
    type: 'message';
    data: {
        content: string;
        type: 'human' | 'ai' | 'system';
        timestamp: string;
    };
}
export interface ErrorMessage extends WebSocketMessage {
    type: 'error';
    data: {
        error: string;
        timestamp: string;
    };
}
export interface WorkflowState {
    thread_id: string;
    status: 'PENDING' | 'ANALYZING' | 'FETCHING_QUOTES' | 'APPROVAL_PENDING' | 'APPROVED' | 'PAID' | 'ERROR';
    progress: number;
    items: any[];
    quotes: any[];
    selected_quote?: any;
    ui_components: AGUIEvent[];
    messages: Array<{
        content: string;
        type: 'human' | 'ai' | 'system';
        timestamp: string;
    }>;
}
export interface ChatRequest {
    message: string;
    org_id: string;
    user_id: string;
}
export interface ChatResponse {
    success: boolean;
    message: string;
    thread_id: string;
    data?: {
        status: string;
        thread_id: string;
    };
}
export interface WorkflowResumeRequest {
    thread_id: string;
    action: 'approve' | 'reject' | 'modify';
    data?: Record<string, any>;
}
export interface WorkflowResumeResponse {
    success: boolean;
    message: string;
    thread_id: string;
    data?: {
        action: string;
        status: string;
    };
}
//# sourceMappingURL=agui.d.ts.map