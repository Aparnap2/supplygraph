import React, { useState, useCallback } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'

interface CSVUploadProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number // in MB
}

export function CSVUpload({ onUpload, accept = '.csv,.xlsx,.xls', maxSize = 10 }: CSVUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const handleFile = async (file: File) => {
    setError(null)
    setSuccess(false)

    // File size validation
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // File type validation
    const fileTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!fileTypes.some(type => type.includes(fileExtension))) {
      setError(`Invalid file type. Please upload ${accept.join(' or ')} files`)
      return
    }

    setUploading(true)

    try {
      await onUpload(file)
      setSuccess(true)
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : success
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="flex flex-col items-center justify-center p-8 text-center">
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-gray-600">Uploading and processing file...</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
              <p className="text-sm font-medium text-green-600">Upload successful!</p>
              <p className="text-xs text-gray-500 mt-1">Your procurement data is being processed</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drop your CSV or Excel file here
              </p>
              <p className="text-xs text-gray-500 mb-4">or click to browse</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FileText className="h-3 w-3" />
                <span>Supports: CSV, XLSX, XLS (max {maxSize}MB)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Expected CSV Format:</h4>
        <div className="text-xs text-blue-700 space-y-1 font-mono">
          <div>item_name, category, quantity, unit_price, priority, description</div>
          <div>Office Chairs, Furniture, 10, 150.00, HIGH, Ergonomic chairs</div>
          <div>Laptops, IT Equipment, 5, 1200.00, MEDIUM, Dell Latitude</div>
        </div>
      </div>
    </div>
  )
}