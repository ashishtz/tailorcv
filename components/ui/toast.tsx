'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (kind: ToastKind, title: string, description?: string) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

const KIND_STYLES: Record<ToastKind, { icon: typeof Info; bar: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bar: 'bg-brand-500', iconColor: 'text-brand-600' },
  error: { icon: AlertCircle, bar: 'bg-red-500', iconColor: 'text-red-600' },
  info: { icon: Info, bar: 'bg-sky-500', iconColor: 'text-sky-600' },
}

const AUTO_DISMISS_MS = 5000

const emptySubscribe = () => () => {}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  // Portal only renders after hydration - document doesn't exist during SSR
  // and branching on it directly causes a hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = nextId.current++
      setToasts((list) => [...list.slice(-3), { id, kind, title, description }])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss]
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (t, d) => toast('success', t, d),
      error: (t, d) => toast('error', t, d),
      info: (t, d) => toast('info', t, d),
    }),
    [toast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            className="fixed bottom-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 no-print"
          >
            {toasts.map((t) => {
              const { icon: Icon, bar, iconColor } = KIND_STYLES[t.kind]
              return (
                <div
                  key={t.id}
                  role={t.kind === 'error' ? 'alert' : 'status'}
                  className="relative flex items-start gap-3 overflow-hidden rounded-xl border border-stone-200 bg-white p-4 pr-10 shadow-lg animate-slide-up"
                >
                  <span className={cn('absolute inset-y-0 left-0 w-1', bar)} aria-hidden />
                  <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconColor)} aria-hidden />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-900">{t.title}</p>
                    {t.description && (
                      <p className="mt-0.5 text-sm text-stone-600">{t.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    aria-label="Dismiss notification"
                    className="absolute right-2 top-2 rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              )
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}
