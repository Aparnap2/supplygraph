import React, { useState } from 'react'
import { X, CheckCircle, FileSpreadsheet } from 'lucide-react'
import { CSVUpload } from './CSVUpload'
import { processCSV } from '../routes/api/upload-csv'

interface CSVUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => Promise<void>
  onSuccess?: (requests: any[]) => void
}

export function CSVUploadModal({ isOpen, onClose, onUpload, onSuccess }: CSVUploadModalProps) {
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleUpload = async (file: File) => {
    setIsProcessing(true)
    setUploadResult(null)

    try {
      await onUpload(file)
      setUploadResult({
        success: true,
        message: 'Upload successful! Your procurement requests are being processed.'
      })
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing) {
      setUploadResult(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Import Procurement Requests
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {!uploadResult ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Upload a CSV or Excel file to bulk import procurement requests.
                  The AI will automatically process and create requests with vendor recommendations.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">AI-Powered Features:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Automatic vendor discovery and negotiation</li>
                    <li>• Smart categorization and prioritization</li>
                    <li>• Cost optimization recommendations</li>
                    <li>• Duplicate detection and consolidation</li>
                  </ul>
                </div>
              </div>

              <CSVUpload onUpload={handleUpload} />
            </>
          ) : uploadResult.success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                {uploadResult.message}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Items Processed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {uploadResult.totalItems || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${((uploadResult.totalValue || 0) / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Requests
                </button>
                <button
                  onClick={() => {
                    setUploadResult(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Upload More
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Failed
              </h3>
              <p className="text-gray-600 mb-6">
                {uploadResult.error}
              </p>
              <button
                onClick={() => setUploadResult(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}