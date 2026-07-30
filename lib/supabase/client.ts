import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database_types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Reads the signed-in user from the LOCAL session - no network round-trip,
 * unlike auth.getUser(). Safe in the browser: authorization is enforced
 * server-side by RLS, the id here only scopes queries. Auto-refreshes an
 * expired token.
 */
export async function getSessionUser(
  supabase: ReturnType<typeof createClient>
): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user ?? null
}

/**
 * Set just before a deliberate sign-out so the session watchdog sends the user
 * to a clean /auth/login instead of one carrying a next= back to the page they
 * chose to leave.
 */
let signingOut = false
export function markSigningOut() {
  signingOut = true
}
export function isSigningOut() {
  return signingOut
}

/** Login URL that returns the user to wherever they were. */
export function loginUrlForCurrentPage(): string {
  const next = window.location.pathname + window.location.search
  return next && next !== '/' ? `/auth/login?next=${encodeURIComponent(next)}` : '/auth/login'
}

/**
 * Same read as getSessionUser, but sends the user to the login page when the
 * session is gone (refresh token expired or revoked) instead of leaving the
 * caller stuck with a null user. Full page load, not a router push, so no
 * stale client state survives. Use in every authenticated client data path;
 * use getSessionUser only where signed-out is a valid state (e.g. the
 * marketing header).
 */
export async function requireSessionUser(
  supabase: ReturnType<typeof createClient>
): Promise<User | null> {
  const user = await getSessionUser(supabase)
  if (!user) window.location.assign(loginUrlForCurrentPage())
  return user
}
