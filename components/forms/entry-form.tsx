'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Open / add / edit / close state machine shared by the profile sections and
 * the onboarding steps. `form` is null while closed; `editKey` is null while
 * adding and the entry's key (row id or list index) while editing.
 */
export function useEntryForm<F, K = string>() {
  const [form, setForm] = useState<F | null>(null)
  const [editKey, setEditKey] = useState<K | null>(null)

  return {
    form,
    editKey,
    isOpen: form !== null,
    open(next: F, key: K | null = null) {
      setForm(next)
      setEditKey(key)
    },
    close() {
      setForm(null)
      setEditKey(null)
    },
    patch(partial: Partial<F>) {
      setForm((current) => (current ? { ...current, ...partial } : current))
    },
  }
}

/** "YYYY-MM" strings compare correctly as plain strings. */
export function endBeforeStart(start: string, end: string): boolean {
  return Boolean(start && end && end < start)
}

/** Full-width dashed "Add another …" button used below onboarding entry lists. */
export function AddEntryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3.5 text-sm font-medium text-stone-600 transition-colors duration-150 hover:border-brand-400 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {label}
    </button>
  )
}

interface EntryRowProps {
  title: string
  /** Rendered inline after the title (badges, link icons). */
  titleExtra?: ReactNode
  subtitle?: string
  meta?: string
  description?: string
  /** Clamp the description to two lines (onboarding list style). */
  clampDescription?: boolean
  editLabel: string
  deleteLabel: string
  onEdit: () => void
  onDelete: () => void
  disabled?: boolean
  /** Extra content rendered between meta and description. */
  children?: ReactNode
}

/**
 * List-row body for a saved entry: title/subtitle/meta plus ghost edit and
 * danger-ghost delete buttons. The caller supplies the flex row container
 * (plain <li> on profile, <Card> on onboarding).
 */
export function EntryRow({
  title,
  titleExtra,
  subtitle,
  meta,
  description,
  clampDescription,
  editLabel,
  deleteLabel,
  onEdit,
  onDelete,
  disabled,
  children,
}: EntryRowProps) {
  return (
    <>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-stone-900">{title}</p>
          {titleExtra}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-stone-600">{subtitle}</p>}
        {meta && <p className="mt-0.5 text-xs text-stone-500">{meta}</p>}
        {children}
        {description && (
          <p
            className={cn(
              'mt-2 text-sm text-stone-600',
              clampDescription ? 'line-clamp-2' : 'whitespace-pre-wrap'
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label={editLabel} onClick={onEdit} disabled={disabled}>
          <Pencil aria-hidden />
        </Button>
        <Button
          variant="danger-ghost"
          size="icon-sm"
          aria-label={deleteLabel}
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
    </>
  )
}
