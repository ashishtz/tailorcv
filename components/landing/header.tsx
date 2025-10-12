'use client'

import Link from 'next/link'
import { FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  isAuthenticated: boolean
}

export function LandingHeader({ isAuthenticated }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-soft">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg shadow-medium group-hover:shadow-large transition-all duration-200">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-poppins">
              Resume Builder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 font-inter">
            <Link href="#features" className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
              How it Works
            </Link>
            <Link href="#templates" className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
              Templates
            </Link>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-medium hover:shadow-large transform hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-primary-600 font-semibold transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-medium hover:shadow-large transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            <Link
              href="#features"
              className="block text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="block text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="#templates"
              className="block text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="block w-full px-6 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full px-6 py-3 text-center border-2 border-primary-600 text-primary-600 rounded-lg font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full px-6 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
