'use client'

import { useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  size?: keyof typeof SIZES
  /** Hide the standard header (title still used for aria-label) */
  hideHeader?: boolean
  /** Prevent closing via backdrop / Esc (e.g. while submitting) */
  locked?: boolean
  footer?: React.ReactNode
  children: React.ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  hideHeader = false,
  locked = false,
  footer,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !locked) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => el.offsetParent !== null)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const active = document.activeElement as HTMLElement | null
        if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [locked, onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    // Focus the panel (or its first focusable) on open
    const panel = panelRef.current
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? panel)?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      restoreFocusRef.current?.focus?.()
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto" role="presentation">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/40 backdrop-blur-[2px] animate-fade-in"
        onClick={locked ? undefined : onClose}
        aria-hidden
      />
      {/* Panel wrapper: padding keeps tall modals scrollable, never clipped */}
      <div className="relative flex min-h-full items-start justify-center p-4 sm:p-8">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={cn(
            'relative w-full rounded-xl bg-white shadow-xl border border-stone-200 animate-scale-in outline-hidden',
            SIZES[size]
          )}
        >
          {!hideHeader && (
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-semibold text-stone-900">{title}</h2>
                {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={locked}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 disabled:opacity-50"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
          )}
          <div className="px-6 py-5">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
