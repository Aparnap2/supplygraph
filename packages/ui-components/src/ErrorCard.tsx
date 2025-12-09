import React from 'react'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'
import { AGUIComponentProps } from './types'

interface ErrorCardProps extends AGUIComponentProps {
  error: string
  type: 'payment_error' | 'quote_error' | 'approval_error' | 'general_error'
  retryAllowed?: boolean
}

export default function ErrorCard({ error, type, retryAllowed = false, onAction }: ErrorCardProps) {
  const getErrorIcon = () => {
    switch (type) {
      case 'payment_error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'quote_error':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'approval_error':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getErrorTitle = () => {
    switch (type) {
      case 'payment_error':
        return 'Payment Processing Error'
      case 'quote_error':
        return 'Quote Fetching Error'
      case 'approval_error':
        return 'Approval Process Error'
      default:
        return 'Error'
    }
  }

  const getErrorDescription = () => {
    switch (type) {
      case 'payment_error':
        return 'There was an issue processing your payment. Please check your payment details and try again.'
      case 'quote_error':
        return 'We encountered an issue fetching vendor quotes. The system will retry automatically.'
      case 'approval_error':
        return 'There was an error during the approval process. Please try again or contact support.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getErrorIcon()}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getErrorTitle()}</h3>
            <p className="text-sm text-gray-600">Something went wrong</p>
          </div>
        </div>
        <button
          onClick={() => onAction?.('dismiss')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Error Details */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-red-800 font-medium">{error}</p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-gray-700">{getErrorDescription()}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {retryAllowed && (
          <button
            onClick={() => onAction?.('retry')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        )}
        <button
          onClick={() => onAction?.('contact_support')}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Contact Support
        </button>
      </div>

      {/* Additional Help */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check your internet connection</li>
          <li>• Verify your payment information</li>
          <li>• Contact our support team at support@supplygraph.com</li>
          <li>• Check system status at status.supplygraph.com</li>
        </ul>
      </div>
    </div>
  )
}