import React from 'react';
import { getAGUIComponent } from './apps/web/src/lib/agui-registry';

// Demo data for testing each component
const demoProps = {
  thinking_loader: {
    status: 'Analyzing requirements...',
    stage: 'analyzing' as const,
    progress: 75
  },
  inventory_check: {
    item_name: 'Office Chair A-100',
    requested_quantity: 50,
    available_quantity: 30,
    status: 'Low Stock' as const,
    location: 'Warehouse A'
  },
  quote_fetcher: {
    item_name: 'Standing Desk Pro',
    quantity: 25,
    vendors_contacted: 5,
    status: 'completed' as const,
    quotes_received: 3
  },
  quote_approval_card: {
    vendor: 'Office Supplies Inc.',
    items: [
      {
        name: 'Ergonomic Chair',
        quantity: 10,
        unit: 'pieces',
        unit_price: 299.99,
        total_price: 2999.90
      }
    ],
    total_amount: 2999.90,
    savings: '15%',
    delivery_time: '3-5 business days',
    quote_id: 'quote-123',
    org_id: 'org-456',
    valid_until: '2024-02-15'
  },
  payment_processor: {
    status: 'payment_complete' as const,
    amount: 2999.90,
    vendor: 'Office Supplies Inc.',
    payment_method: 'Credit Card'
  },
  payment_success: {
    vendor: 'Office Supplies Inc.',
    amount: 2999.90,
    confirmation: 'TXN-ABC123-XYZ789'
  },
  error_card: {
    error: 'Failed to connect to vendor API',
    type: 'quote_error' as const,
    retryable: true,
    thread_id: 'thread-789'
  }
};

export function AGUIDemo() {
  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        AGUI Component Registry Demo
      </h1>

      {Object.entries(demoProps).map(([componentName, props]) => {
        const Component = getAGUIComponent(componentName);

        return (
          <div key={componentName} className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Component: {componentName}
            </h2>
            <Component {...props} />
          </div>
        );
      })}
    </div>
  );
}