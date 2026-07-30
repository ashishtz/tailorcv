'use client'

import { forwardRef, useId, createContext, useContext, useMemo } from 'react'
import { cn } from '@/lib/utils'

/* ---------------------------------------------------------------- *
 * Field — wires label, control, hint and error together with ids.
 * ---------------------------------------------------------------- */

interface FieldContextValue {
  id: string
  errorId: string
  hintId: string
  invalid: boolean
  required: boolean
  hasHint: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useFieldContext() {
  return useContext(FieldContext)
}

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, required, error, hint, className, children }: FieldProps) {
  const id = useId()
  const value = useMemo(
    () => ({
      id,
      errorId: `${id}-error`,
      hintId: `${id}-hint`,
      invalid: Boolean(error),
      required: Boolean(required),
      hasHint: Boolean(hint),
    }),
    [id, error, required, hint]
  )

  return (
    <FieldContext.Provider value={value}>
      <div className={cn('space-y-1.5', className)}>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
          {required && (
            <>
              <span className="text-red-500 ml-0.5" aria-hidden="true">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
        {children}
        {hint && !error && (
          <p id={value.hintId} className="text-xs text-stone-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={value.errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}

/* ---------------------------------------------------------------- *
 * Controls — usable inside <Field> (auto-wired) or standalone.
 * ---------------------------------------------------------------- */

const controlStyles =
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-500 transition-colors duration-150 focus:outline-hidden focus:ring-2 disabled:opacity-50 disabled:bg-stone-50'

const controlStates = (invalid: boolean) =>
  invalid
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/60'
    : 'border-stone-300 focus:border-brand-500 focus:ring-brand-500/60'

function useControlProps() {
  const ctx = useFieldContext()
  const isInvalid = ctx?.invalid ?? false
  // Only reference ids that actually render: the error when invalid, the hint
  // when a hint exists (the hint is hidden while an error shows).
  const describedBy = ctx
    ? ctx.invalid
      ? ctx.errorId
      : ctx.hasHint
        ? ctx.hintId
        : undefined
    : undefined
  return {
    id: ctx?.id,
    'aria-invalid': isInvalid || undefined,
    'aria-required': ctx?.required || undefined,
    'aria-describedby': describedBy,
    isInvalid,
  }
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps()
    return (
      <input
        ref={ref}
        {...wired}
        className={cn(controlStyles, controlStates(isInvalid), className)}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps()
    return (
      <textarea
        ref={ref}
        {...wired}
        className={cn(controlStyles, controlStates(isInvalid), 'resize-y', className)}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps()
    return (
      <select
        ref={ref}
        {...wired}
        className={cn(controlStyles, controlStates(isInvalid), 'pr-8', className)}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'
