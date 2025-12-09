import React from 'react';
import { AlertTriangle, RefreshCw, X, Info } from 'lucide-react';
import { ErrorCardProps } from '@supplygraph/shared-types';
import { cn } from '../utils/cn';

export const ErrorCard: React.FC<ErrorCardProps> = ({
  error,
  type,
  retryable = false,
  thread_id
}) => {
  const getErrorTypeIcon = () => {
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getErrorTypeColor = () => {
    switch (type) {
      case 'parsing_error':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'quote_error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'payment_error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'general_error':
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getErrorTypeTitle = () => {
    switch (type) {
      case 'parsing_error':
        return 'Parsing Error';
      case 'quote_error':
        return 'Quote Error';
      case 'payment_error':
        return 'Payment Error';
      case 'general_error':
      default:
        return 'Error';
    }
  };

  const getErrorTypeDescription = () => {
    switch (type) {
      case 'parsing_error':
        return 'Failed to understand your request. Please rephrase and try again.';
      case 'quote_error':
        return 'Unable to fetch quotes from vendors. Please try again later.';
      case 'payment_error':
        return 'Payment processing failed. Please check your payment details.';
      case 'general_error':
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleRetry = () => {
    if (thread_id) {
      // Send a retry action via WebSocket or call API
      console.log('Retrying operation for thread:', thread_id);
      // Implementation would depend on your WebSocket/API integration
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-4",
      getErrorTypeColor()
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-full flex-shrink-0",
          type === 'parsing_error' && "bg-orange-100",
          type === 'quote_error' && "bg-red-100",
          type === 'payment_error' && "bg-red-100",
          type === 'general_error' && "bg-gray-100"
        )}>
          <div className={cn(
            type === 'parsing_error' && "text-orange-600",
            type === 'quote_error' && "text-red-600",
            type === 'payment_error' && "text-red-600",
            type === 'general_error' && "text-gray-600"
          )}>
            {getErrorTypeIcon()}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">
            {getErrorTypeTitle()}
          </h3>

          <p className="text-sm text-gray-600 mb-3">
            {getErrorTypeDescription()}
          </p>

          {error && (
            <div className="p-3 bg-white bg-opacity-50 rounded border border-gray-200 mb-3">
              <p className="text-xs text-gray-700 font-mono">
                {error}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            {retryable && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info className="h-3 w-3" />
              <span>
                {retryable ? 'Click retry or modify your request' : 'Please modify your request'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            // Close/dismiss the error card
            console.log('Dismissing error card');
          }}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};