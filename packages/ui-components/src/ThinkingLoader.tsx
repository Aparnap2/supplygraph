import React from 'react'
import { Loader2 } from 'lucide-react'
import { AGUIComponentProps } from './types'

interface ThinkingLoaderProps extends AGUIComponentProps {
  status: string
  stage: string
}

export default function ThinkingLoader({ status, stage, onAction }: ThinkingLoaderProps) {
  return (
    <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-4">
        <div className="animate-spin">
          <Loader2 className="h-8 w-8 text-blue-600" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          AI Processing...
        </h3>
        <p className="text-blue-700 mb-1">
          {status}
        </p>
        <div className="bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800 inline-block">
          {stage}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
            stage.includes('parsing') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <span className="text-sm text-gray-700">Parsing request</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
            stage.includes('analyzing') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <span className="text-sm text-gray-700">Analyzing requirements</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
            stage.includes('inventory') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
          <span className="text-sm text-gray-700">Checking inventory</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
            stage.includes('quotes') ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            4
          </div>
          <span className="text-sm text-gray-700">Fetching quotes</span>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m0 0l-3-3m3 3v4M3 21h18M5 12H9" />
          </svg>
          <span className="text-sm text-blue-800">Estimated time: 2-5 minutes</span>
        </div>
      </div>
    </div>
  )
}