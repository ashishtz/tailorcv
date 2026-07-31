'use client'

import { useId, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

interface EnhanceTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  enhanceType: 'work_experience' | 'project'
}

const MIN_WORDS = 10

export default function EnhanceTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  className,
  enhanceType,
}: EnhanceTextareaProps) {
  const [isEnhancing, setIsEnhancing] = useState(false)
  // Announced via the role="status" region after a successful AI rewrite.
  const [announcement, setAnnouncement] = useState('')
  const helpId = useId()
  const toast = useToast()

  // Derived directly from the current value - no effect/state needed
  const wordCount = value.trim().split(/\s+/).filter((word) => word.length > 0).length
  const canEnhance = wordCount >= MIN_WORDS

  const handleEnhance = async () => {
    if (isEnhancing || !value.trim()) return

    setIsEnhancing(true)
    setAnnouncement('')
    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, type: enhanceType }),
      })

      const data = (await response.json().catch(() => ({}))) as {
        enhancedText?: string
        error?: string
      }

      if (!response.ok || !data.enhancedText) {
        throw new Error(data.error || 'The AI service did not return a result. Please try again.')
      }

      onChange(data.enhancedText)
      setAnnouncement('Description enhanced')
    } catch (error) {
      toast.error(
        'Could not enhance the text',
        error instanceof Error ? error.message : 'Please try again.'
      )
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={className}
        disabled={isEnhancing}
        aria-describedby={helpId}
      />
      <p role="status" className="sr-only">
        {announcement}
      </p>
      <div className="mt-2 flex min-h-8 flex-wrap items-center justify-between gap-2">
        {canEnhance ? (
          <>
            <p id={helpId} className="text-xs text-stone-500">
              AI rewrites this into concise, resume-ready language.
            </p>
            <Button
              variant="accent"
              size="sm"
              onClick={handleEnhance}
              loading={isEnhancing}
              className="ml-auto"
            >
              {!isEnhancing && <Sparkles aria-hidden />}
              {isEnhancing ? 'Enhancing…' : 'Enhance with AI'}
            </Button>
          </>
        ) : (
          <p id={helpId} className="text-xs text-stone-500">
            Write at least {MIN_WORDS} words to unlock AI enhancement.
          </p>
        )}
      </div>
    </div>
  )
}
