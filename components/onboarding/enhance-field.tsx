'use client'

import EnhanceTextarea from '@/components/ui/EnhanceTextarea'

/* Mirrors the Field kit's control styles so the AI-enhanceable textarea
 * reads as part of the same form system. The control is wrapped in its
 * <label> element (valid implicit association) because EnhanceTextarea
 * renders its own textarea and cannot receive an external id for htmlFor. */
const CONTROL_CLASSES =
  'block w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:outline-hidden focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 disabled:bg-stone-50'

interface EnhanceFieldProps {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  enhanceType: 'work_experience' | 'project'
}

/** Labelled EnhanceTextarea used by the work-experience and project steps. */
export function EnhanceField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
  enhanceType,
}: EnhanceFieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      <EnhanceTextarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={CONTROL_CLASSES}
        enhanceType={enhanceType}
      />
      {hint && <span className="block text-xs text-stone-500">{hint}</span>}
    </label>
  )
}
