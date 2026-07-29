'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Templates', href: '#templates' },
]

function NavLinks({ className, onClick }: { className: string; onClick?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <a key={item.href} href={item.href} onClick={onClick} className={className}>
          {item.label}
        </a>
      ))}
    </>
  )
}

function AuthButtons({ isAuthenticated, mobile }: { isAuthenticated: boolean; mobile?: boolean }) {
  const width = mobile ? 'w-full' : undefined
  return isAuthenticated ? (
    <Link href="/dashboard">
      <Button className={width}>Go to dashboard</Button>
    </Link>
  ) : (
    <>
      <Link href="/auth/login">
        <Button variant={mobile ? 'secondary' : 'ghost'} className={width}>
          Sign in
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button className={width}>Get started</Button>
      </Link>
    </>
  )
}

interface LandingHeaderProps {
  isAuthenticated: boolean
}

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="no-print fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLinks className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900" />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <AuthButtons isAuthenticated={isAuthenticated} />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </nav>

      {/* Mobile nav */}
      {menuOpen && (
        <div id="mobile-nav" className="border-t border-stone-200 bg-stone-50 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLinks
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            />
            <div className="mt-3 flex flex-col gap-2 border-t border-stone-200 pt-4">
              <AuthButtons isAuthenticated={isAuthenticated} mobile />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
