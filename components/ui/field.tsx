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
}

const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldContext() {
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
    () => ({ id, errorId: `${id}-error`, hintId: `${id}-hint`, invalid: Boolean(error) }),
    [id, error]
  )

  return (
    <FieldContext.Provider value={value}>
      <div className={cn('space-y-1.5', className)}>
        <label htmlFor={id} className="block text-sm font-medium text-stone-700">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden>
              *
            </span>
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
  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:outline-hidden focus:ring-2 disabled:opacity-50 disabled:bg-stone-50'

const controlStates = (invalid: boolean) =>
  invalid
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : 'border-stone-300 focus:border-brand-500 focus:ring-brand-500/20'

function useControlProps(invalid?: boolean) {
  const ctx = useFieldContext()
  const isInvalid = invalid ?? ctx?.invalid ?? false
  return {
    id: ctx?.id,
    'aria-invalid': isInvalid || undefined,
    'aria-describedby': ctx ? (ctx.invalid ? ctx.errorId : ctx.hintId) : undefined,
    isInvalid,
  }
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps(invalid)
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

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps(invalid)
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

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    const { isInvalid, ...wired } = useControlProps(invalid)
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
