import React from 'react'
import { Package, CheckCircle, AlertTriangle } from 'lucide-react'
import { AGUIComponentProps } from './types'

interface InventoryCheckProps extends AGUIComponentProps {
  items: Array<{
    name: string
    quantity: number
    currentStock: number
    needsProcurement: boolean
  }>
  status: string
}

export default function InventoryCheck({ items, status, onAction }: InventoryCheckProps) {
  const needsProcurementCount = items.filter(item => item.needsProcurement).length
  const inStockCount = items.filter(item => !item.needsProcurement).length

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Check</h3>
          <p className="text-sm text-gray-600">Checking current stock levels for requested items</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
            status.includes('complete') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {status.includes('complete') ? 'Complete' : 'Checking...'}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-blue-600" />
            <div className="text-sm font-medium text-blue-900">Total Items</div>
          </div>
          <div className="text-2xl font-bold text-blue-900">{items.length}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="text-sm font-medium text-green-900">In Stock</div>
          </div>
          <div className="text-2xl font-bold text-green-900">{inStockCount}</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <div className="text-sm font-medium text-orange-900">Needs Procurement</div>
          </div>
          <div className="text-2xl font-bold text-orange-900">{needsProcurementCount}</div>
        </div>
      </div>

      {/* Item Details */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h4 className="font-medium text-gray-900 mb-4">Item Details</h4>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  item.needsProcurement 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.needsProcurement ? 'Procure' : 'In Stock'}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Current: {item.currentStock}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onAction?.('proceed_all')}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Proceed with All Items
        </button>
        <button
          onClick={() => onAction?.('procure_needed')}
          className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Procure Needed Items Only
        </button>
      </div>
    </div>
  )
}