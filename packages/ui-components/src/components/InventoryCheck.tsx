import React from 'react';
import { Package, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { InventoryCheckProps } from '@supplygraph/shared-types';
import { cn } from '../utils/cn';

export const InventoryCheck: React.FC<InventoryCheckProps> = ({
  items,
  status
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'unavailable':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'unavailable':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking inventory...';
      case 'completed':
        return 'All items available';
      case 'unavailable':
        return 'Some items unavailable';
      default:
        return 'Status unknown';
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-4",
      getStatusColor()
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white">
          {getStatusIcon()}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-3">
            Inventory Check
          </h3>

          <div className="space-y-2 mb-4">
            {items.map((item, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} {item.unit}
                  </p>
                  {item.specifications && (
                    <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                  )}
                </div>
                {item.category && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {item.category}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className={cn(
              "inline-flex items-center gap-2 text-sm font-medium",
              status === 'checking' && "text-blue-700",
              status === 'completed' && "text-green-700",
              status === 'unavailable' && "text-red-700"
            )}>
              {getStatusIcon()}
              {getStatusText()}
            </span>
            <span className="text-xs text-gray-500">
              {items.length} item{items.length !== 1 ? 's' : ''} checked
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};