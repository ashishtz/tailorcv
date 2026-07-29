'use client'

import { AlertTriangle, Info } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

const TYPE_STYLES = {
  danger: { icon: AlertTriangle, wash: 'bg-red-50', color: 'text-red-600' },
  warning: { icon: AlertTriangle, wash: 'bg-accent-100', color: 'text-accent-700' },
  info: { icon: Info, wash: 'bg-sky-50', color: 'text-sky-600' },
} as const

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  const { icon: Icon, wash, color } = TYPE_STYLES[type]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      hideHeader
      locked={loading}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', wash)}>
          <Icon className={cn('h-5 w-5', color)} aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <h2 className="font-display text-base font-semibold text-stone-900">{title}</h2>
          <p className="mt-1.5 text-sm text-stone-600">{message}</p>
        </div>
      </div>
    </Modal>
  )
}
