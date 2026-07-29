'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

interface EnhanceTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  enhanceType: 'work_experience' | 'project'
}

export default function EnhanceTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
  enhanceType
}: EnhanceTextareaProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [showEnhanceButton, setShowEnhanceButton] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 })

  useEffect(() => {
    const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length
    setShowEnhanceButton(wordCount >= 10)
  }, [value])

  useEffect(() => {
    if (textareaRef.current && showEnhanceButton) {
      // const rect = textareaRef.current.getBoundingClientRect() // Unused variable removed
      setButtonPosition({
        top: 8,
        right: 8
      })
    }
  }, [showEnhanceButton])

  const handleEnhance = async () => {
    if (isEnhancing || !value.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: value,
          type: enhanceType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to enhance text')
      }

      const data = await response.json()
      if (data.enhancedText) {
        onChange(data.enhancedText)
      }
    } catch (error) {
      console.error('Error enhancing text:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={className}
        disabled={isEnhancing}
      />

      {showEnhanceButton && (
        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing}
          className="absolute z-10 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          style={{
            top: `${buttonPosition.top}px`,
            right: `${buttonPosition.right}px`,
          }}
        >
          <Sparkles className={`w-3 h-3 mr-1 ${isEnhancing ? 'animate-spin' : ''}`} />
          {isEnhancing ? 'Enhancing...' : 'Enhance'}
        </button>
      )}

      {showEnhanceButton && (
        <div className="mt-1 text-xs text-gray-500">
          Click &ldquo;Enhance&rdquo; to improve this description for your resume
        </div>
      )}
    </div>
  )
}