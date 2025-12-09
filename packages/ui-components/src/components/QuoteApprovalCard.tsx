import React, { useState } from 'react';
import { Check, X, Clock, DollarSign, Package, Calendar } from 'lucide-react';
import { QuoteApprovalCardProps } from '@supplygraph/shared-types';
import { cn } from '../utils/cn';

export const QuoteApprovalCard: React.FC<QuoteApprovalCardProps> = ({
  vendor,
  items,
  total_amount,
  savings,
  delivery_time,
  quote_id,
  org_id,
  valid_until
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Call API to approve and resume workflow
      const response = await fetch('/api/workflow/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: quote_id,
          action: 'approve',
          data: {
            approved_quote_id: quote_id,
            org_id,
          }
        })
      });

      if (response.ok) {
        console.log('Quote approved successfully');
      } else {
        console.error('Failed to approve quote');
      }
    } catch (error) {
      console.error('Error approving quote:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/workflow/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: quote_id,
          action: 'reject',
          data: {
            rejected_quote_id: quote_id,
            reason: 'User rejected'
          }
        })
      });

      if (response.ok) {
        console.log('Quote rejected successfully');
      } else {
        console.error('Failed to reject quote');
      }
    } catch (error) {
      console.error('Error rejecting quote:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Quote for Approval</h3>
          <p className="text-sm text-gray-600">Vendor: {vendor}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(total_amount)}
          </div>
          {savings && (
            <div className="text-sm text-green-600">
              Save {savings} compared to other quotes
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Items ({items.length})
        </h4>
        <div className="space-y-2">
          {items.map((item, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.unit_price)} each
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.total_price)} total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Delivery: {delivery_time}</span>
        </div>
        {valid_until && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Valid until: {new Date(valid_until).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
            isProcessing
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          )}
        >
          <Check className="h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Approve Quote'}
        </button>

        <button
          onClick={handleReject}
          disabled={isProcessing}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors border",
            isProcessing
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-red-600 border-red-300 hover:bg-red-50"
          )}
        >
          <X className="h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Reject Quote'}
        </button>
      </div>
    </div>
  );
};