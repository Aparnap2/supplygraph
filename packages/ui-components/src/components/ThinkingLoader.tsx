import React from 'react';
import { Loader2, Brain, Search, CheckCircle } from 'lucide-react';
import { ThinkingLoaderProps } from '@supplygraph/shared-types';
import { cn } from '../utils/cn';

export const ThinkingLoader: React.FC<ThinkingLoaderProps> = ({
  status,
  stage,
  progress
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'parsing':
        return <Loader2 className="h-5 w-5" />;
      case 'analyzing':
        return <Brain className="h-5 w-5" />;
      case 'fetching':
        return <Search className="h-5 w-5" />;
      case 'processing':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Loader2 className="h-5 w-5" />;
    }
  };

  const getStageText = () => {
    switch (stage) {
      case 'parsing':
        return 'Parsing your request...';
      case 'analyzing':
        return 'Analyzing requirements...';
      case 'fetching':
        return 'Fetching vendor quotes...';
      case 'processing':
        return 'Processing your data...';
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex-shrink-0 text-blue-600 animate-spin">
        {getStageIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900">
          {getStageText()}
        </p>
        {status && (
          <p className="text-xs text-blue-700 mt-1">
            {status}
          </p>
        )}
      </div>
      {progress !== undefined && (
        <div className="flex-shrink-0">
          <div className="text-sm font-medium text-blue-900">
            {Math.round(progress)}%
          </div>
          <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};