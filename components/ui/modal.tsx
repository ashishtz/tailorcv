'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  xl: 'max-w-4xl',
} as const

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  size?: keyof typeof SIZES
  /** Prevent closing via backdrop / Esc (e.g. while submitting) */
  locked?: boolean
  footer?: React.ReactNode
  children: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  locked = false,
  footer,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // showModal() provides focus trap, Escape handling and the top layer for
  // free; we add body scroll lock (dialog doesn't) and focus restore.
  useEffect(() => {
    if (!isOpen) return
    const restoreFocus = document.activeElement as HTMLElement | null
    dialogRef.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      restoreFocus?.focus?.()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onCancel={(e) => {
        // Escape: keep React state the source of truth for open/closed.
        e.preventDefault()
        if (!locked) onClose()
      }}
      onClick={(e) => {
        // Clicks on the ::backdrop target the dialog but land outside its box.
        if (locked) return
        const r = e.currentTarget.getBoundingClientRect()
        const inside =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
        if (!inside) onClose()
      }}
      className={cn(
        'mx-auto mt-4 w-full max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-stone-200 bg-white p-0 shadow-xl animate-scale-in sm:mt-8 sm:max-h-[calc(100vh-4rem)]',
        'backdrop:bg-stone-950/40 backdrop:backdrop-blur-[2px]',
        SIZES[size]
      )}
    >
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
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4">
          {footer}
        </div>
      )}
    </dialog>
  )
}
