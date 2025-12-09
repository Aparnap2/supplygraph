import React from 'react';
import { CheckCircle, DollarSign, Receipt, Calendar } from 'lucide-react';
import { PaymentSuccessProps } from '@supplygraph/shared-types';

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  vendor,
  amount,
  confirmation
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">
            Payment Successful
          </h3>
          <p className="text-sm text-green-700">
            Transaction completed
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white rounded border border-green-100">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Amount</span>
          </div>
          <span className="font-semibold text-green-900">
            {formatCurrency(amount)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-white rounded border border-green-100">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">Vendor</span>
          </div>
          <span className="font-medium text-gray-900">
            {vendor}
          </span>
        </div>

        {confirmation && (
          <div className="p-3 bg-white rounded border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Confirmation</span>
            </div>
            <p className="font-mono text-xs text-gray-700 bg-green-50 p-2 rounded">
              {confirmation}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-green-200">
        <p className="text-xs text-green-700 text-center">
          A receipt has been sent to your email
        </p>
      </div>
    </div>
  );
};