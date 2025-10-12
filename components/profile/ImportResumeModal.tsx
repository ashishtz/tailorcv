'use client'

import { useState } from 'react'
import { X, Upload, FileText, Loader2 } from 'lucide-react'

interface ImportResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportResumeModal({ isOpen, onClose, onSuccess }: ImportResumeModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const resetModal = () => {
    setSelectedFile(null)
    setError(null)
    setIsUploading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'text/plain') {
        setError('Currently only TXT files are supported. Please convert your resume to plain text.')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB.')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleParseResume = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse resume')
      }

      // Success - resume was parsed and stored in the backend
      onSuccess()
      handleClose()

    } catch (error) {
      console.error('Parse error:', error)
      setError(error instanceof Error ? error.message : 'Failed to parse resume')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Import from Resume</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {!isUploading && (
              <div>
                <p className="text-gray-600 mb-6">
                  Upload your existing resume to automatically import your profile information.
                </p>

                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Select your resume file
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Currently supports TXT files only (PDF and DOCX coming soon)
                    </p>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleParseResume}
                          disabled={isUploading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Parsing...
                            </>
                          ) : (
                            'Parse Resume'
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedFile(null)}
                          disabled={isUploading}
                          className="p-2 text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isUploading && (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-900">Processing your resume...</p>
                <p className="text-gray-600">This may take a few moments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}