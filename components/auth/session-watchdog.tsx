'use client'

import { useEffect } from 'react'
import { createClient, isSigningOut, loginUrlForCurrentPage } from '@/lib/supabase/client'

/**
 * Sends the user to the login page the moment their session dies, even if they
 * are sitting idle on a page and never trigger a fetch. supabase-js emits
 * SIGNED_OUT when a token refresh fails (expired or revoked refresh token),
 * which is exactly the case that used to leave pages loading forever.
 * Mounted inside the authenticated layouts.
 */
export function SessionWatchdog() {
  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isSigningOut()) return // the sign-out handler owns that navigation
      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        window.location.assign(loginUrlForCurrentPage())
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return null
}
