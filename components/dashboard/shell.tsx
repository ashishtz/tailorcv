'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, FileText, User, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/brand/logo'
import { cn } from '@/lib/utils'

const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

interface DashboardShellProps {
  userEmail: string
  children: React.ReactNode
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Main">
      {NAVIGATION.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-50 text-brand-800'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            )}
          >
            {isActive && (
              <span
                className="absolute inset-y-2 left-0 w-0.75 rounded-full bg-brand-600"
                aria-hidden
              />
            )}
            <item.icon
              className={cn('h-5 w-5 shrink-0', isActive ? 'text-brand-700' : 'text-stone-400')}
              aria-hidden
            />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}

function UserFooter({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="border-t border-stone-200 p-3">
      <div className="flex items-center justify-between gap-2 rounded-lg px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-stone-700">{userEmail}</p>
          <p className="text-xs text-stone-500">Signed in</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
          className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  // showModal() provides focus trap, Escape handling and the top layer for
  // free (mirrors components/ui/modal.tsx); we add body scroll lock and
  // focus restore to the hamburger button.
  useEffect(() => {
    if (!drawerOpen) return
    const restoreFocus = document.activeElement as HTMLElement | null
    drawerRef.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      restoreFocus?.focus?.()
    }
  }, [drawerOpen])

  // The generator page wants every pixel for its live preview - collapse on
  // landing there (initial state covers direct loads, the render-time adjust
  // covers client navigation). The user can re-expand; other routes keep the
  // last state.
  const [collapsed, setCollapsed] = useState(pathname === '/dashboard/documents/new')
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    if (pathname === '/dashboard/documents/new') setCollapsed(true)
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Desktop sidebar. A plain div: the inner nav (aria-label="Main") is
          the landmark, so an unlabeled aside landmark would only add noise. */}
      <div
        className={cn(
          'no-print fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-stone-200 bg-white',
          collapsed ? 'hidden' : 'hidden lg:flex'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <PanelLeftClose className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <NavLinks />
        <UserFooter userEmail={userEmail} />
      </div>

      {/* Collapsed rail: just the expand control */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          title="Expand sidebar"
          className="no-print fixed left-3 top-3 z-40 hidden rounded-lg border border-stone-200 bg-white p-2 text-stone-500 shadow-sm transition-colors hover:bg-stone-100 hover:text-stone-800 lg:flex"
        >
          <PanelLeftOpen className="h-5 w-5" aria-hidden />
        </button>
      )}

      {/* Mobile top bar */}
      <header className="no-print fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <dialog
          ref={drawerRef}
          aria-label="Navigation"
          onCancel={(e) => {
            // Escape: keep React state the source of truth for open/closed.
            e.preventDefault()
            setDrawerOpen(false)
          }}
          onClick={(e) => {
            // Clicks on the ::backdrop target the dialog but land outside its box.
            const r = e.currentTarget.getBoundingClientRect()
            const inside =
              e.clientX >= r.left &&
              e.clientX <= r.right &&
              e.clientY >= r.top &&
              e.clientY <= r.bottom
            if (!inside) setDrawerOpen(false)
          }}
          className="fixed inset-y-0 left-0 m-0 flex h-full max-h-none w-72 max-w-none flex-col bg-white p-0 shadow-xl animate-slide-up backdrop:bg-stone-950/40 lg:hidden"
        >
          <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4">
            <Logo />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation"
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <NavLinks onNavigate={() => setDrawerOpen(false)} />
          <UserFooter userEmail={userEmail} />
        </dialog>
      )}

      {/* Main */}
      <main id="main" className={cn('min-w-0 flex-1 pt-14 lg:pt-0', !collapsed && 'lg:ml-64')}>
        {children}
      </main>
    </div>
  )
}
