'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { createClient, getSessionUser } from '@/lib/supabase/client'
import { DocumentsTable } from '@/components/documents/documents-table'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { Resume } from '@/lib/types/database'
import { rowToResume } from '@/lib/utils/normalize-resume'

export default function DocumentsPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const toast = useToast()
  const supabase = createClient()

  const fetchResumes = useCallback(async (): Promise<Resume[] | null> => {
    try {
      const user = await getSessionUser(supabase)
      if (!user) return null

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching resumes:', error)
        return null
      }
      return (data ?? []).map(rowToResume)
    } catch (error) {
      console.error('Error fetching resumes:', error)
      return null
    }
  }, [supabase])

  useEffect(() => {
    let active = true
    fetchResumes().then((list) => {
      if (!active) return
      if (list === null) setLoadFailed(true)
      else setResumes(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchResumes])

  const reload = useCallback(async () => {
    const list = await fetchResumes()
    if (list !== null) {
      setResumes(list)
      setLoadFailed(false)
    }
  }, [fetchResumes])

  const handleDeleted = useCallback(
    (resumeId: string) => {
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId))
      toast.success('Resume deleted')
    },
    [toast]
  )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
              Documents
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Every resume you&apos;ve generated, ready to view, edit, or export.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/dashboard/documents/new" className={buttonVariants({})}>
              <Plus aria-hidden />
              Generate resume
            </Link>
          </div>
        </div>

        {loading ? (
          <Card className="p-6">
            <SkeletonRows rows={5} />
          </Card>
        ) : loadFailed ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="Couldn't load your resumes"
              description="Something went wrong while loading. Check your connection and try again."
              action={<Button onClick={() => { setLoading(true); reload().then(() => setLoading(false)) }}>Retry</Button>}
            />
          </Card>
        ) : resumes.length === 0 ? (
          <Card>
            <EmptyState
              icon={FileText}
              title="No resumes yet"
              description="Generate your first tailored resume from a job description - it takes about a minute."
              action={
                <Link href="/dashboard/documents/new" className={buttonVariants({})}>
                  <Plus aria-hidden />
                  Generate resume
                </Link>
              }
            />
          </Card>
        ) : (
          <DocumentsTable resumes={resumes} onResumeDeleted={handleDeleted} />
        )}

      </div>
    </div>
  )
}
