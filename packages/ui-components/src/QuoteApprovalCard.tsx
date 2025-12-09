import React from 'react'
import { CheckCircle, XCircle, Clock, DollarSign, Truck, AlertTriangle } from 'lucide-react'
import { AGUIComponentProps } from './types'

interface QuoteApprovalCardProps extends AGUIComponentProps {
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

export default function QuoteApprovalCard({
  vendor,
  items,
  totalAmount,
  savings,
  deliveryTime,
  quoteId,
  isInterrupt = false,
  onAction,
  threadId,
  orgId
}: QuoteApprovalCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quote Approval Required</h3>
          <p className="text-sm text-gray-600">Review and approve this vendor quote</p>
        </div>
        {isInterrupt && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
            <span>Waiting for your approval...</span>
          </div>
        )}
      </div>

      {/* Vendor Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-blue-900">{vendor}</h4>
          <div className="text-right">
            <div className="text-sm text-gray-500">Quote ID: {quoteId.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Quote Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Quote Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Time:</span>
              <span className="font-medium text-gray-900">{deliveryTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Savings:</span>
              <span className="font-semibold text-green-600">{savings}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-3">Items ({items.length})</h4>
          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-700">Item</th>
                  <th className="text-right py-2 font-medium text-gray-700">Qty</th>
                  <th className="text-right py-2 font-medium text-gray-700">Unit Price</th>
                  <th className="text-right py-2 font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{item.name}</td>
                    <td className="py-2 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-2 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => onAction?.('reject', { quoteId, threadId, orgId })}
          className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject Quote
        </button>
        <button
          onClick={() => onAction?.('approve', { quoteId, threadId, orgId, totalAmount, vendor })}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve & Pay
        </button>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-blue-600 mt-1" />
          <div className="text-sm text-gray-600">
            <strong>Payment Processing:</strong> Upon approval, the system will process payment via Stripe and send confirmation to the vendor. You'll receive a receipt and tracking information once the order is confirmed.
          </div>
        </div>
        <div className="flex items-start gap-2 mt-3">
          <Truck className="h-4 w-4 text-green-600 mt-1" />
          <div className="text-sm text-gray-600">
            <strong>Delivery:</strong> Estimated delivery time is {deliveryTime}. You'll receive tracking information once the order is shipped.
          </div>
        </div>
      </div>
    </div>
  )
}