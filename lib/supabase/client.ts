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
