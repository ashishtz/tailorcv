'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, User, LogOut, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Documents', href: '/dashboard/documents', icon: FileText },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-primary-900 to-primary-950 shadow-large">
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b border-primary-800/50">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-accent-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Resume Builder</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-medium'
                  : 'text-primary-100 hover:bg-primary-800/50 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-primary-300 group-hover:text-white group-hover:scale-110'
                }`}
              />
              <span className={isActive ? 'font-semibold' : ''}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t border-primary-800/50">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-primary-100 hover:bg-primary-800/50 hover:text-white transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-primary-300 group-hover:text-white transition-transform duration-200 group-hover:-translate-x-1" />
          Sign out
        </button>
      </div>
    </div>
  )
}