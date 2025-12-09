import React from 'react';
import { Search, CheckCircle, Clock, Users } from 'lucide-react';
import { QuoteFetcherProps } from '@supplygraph/shared-types';
import { cn } from '../utils/cn';

export const QuoteFetcher: React.FC<QuoteFetcherProps> = ({
  items,
  status,
  estimated_time,
  vendors_count
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'contacting_vendors':
        return <Users className="h-5 w-5 animate-pulse" />;
      case 'fetching':
        return <Search className="h-5 w-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'contacting_vendors':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fetching':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'contacting_vendors':
        return 'Contacting vendors...';
      case 'fetching':
        return 'Fetching quotes...';
      case 'completed':
        return 'Quotes received';
      default:
        return 'Pending';
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-4",
      getStatusColor()
    )}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-white">
          <div className={cn(
            status === 'contacting_vendors' && "text-blue-600",
            status === 'fetching' && "text-orange-600",
            status === 'completed' && "text-green-600"
          )}>
            {getStatusIcon()}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-3">
            Quote Request
          </h3>

          <div className="space-y-2 mb-4">
            {items.map((item, index: number) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white bg-opacity-60 rounded">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {vendors_count && (
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>Contacing {vendors_count} vendors</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Estimated time: {estimated_time}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className={cn(
              "inline-flex items-center gap-2 text-sm font-medium",
              status === 'contacting_vendors' && "text-blue-700",
              status === 'fetching' && "text-orange-700",
              status === 'completed' && "text-green-700"
            )}>
              {getStatusIcon()}
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};