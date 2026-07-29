'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Resume } from '@/lib/types/database'
import { rowToResume } from '@/lib/utils/normalize-resume'

/**
 * Loads the signed-in user's resume by id (client side).
 * `failed` = auth/query error; `!loading && !failed && !resume` = not found.
 */
export function useResume(id: string) {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    const supabase = createClient()
    const fetchResume = async (): Promise<Resume | null | 'failed'> => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return 'failed'

        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) throw error
        return data ? rowToResume(data) : null
      } catch (error) {
        console.error('Error fetching resume:', error)
        return 'failed'
      }
    }
    fetchResume().then((result) => {
      if (!active) return
      if (result === 'failed') setFailed(true)
      else setResume(result)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  return { resume, loading, failed }
}
