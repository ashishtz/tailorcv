'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { FileText, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GenerateResumeModal } from '@/components/documents/generate-resume-modal'
import { DocumentsTable } from '@/components/documents/documents-table'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { Resume } from '@/lib/types/database'
import { rowToResume } from '@/lib/utils/normalize-resume'

function DocumentsPageInner() {
  const searchParams = useSearchParams()
  const [resumes, setResumes] = useState<Resume[]>([])
  // Deep link: /dashboard/documents?new=1 opens the generate modal on arrival
  const [isModalOpen, setIsModalOpen] = useState(() => searchParams.get('new') === '1')
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const toast = useToast()
  const supabase = createClient()

  const fetchResumes = useCallback(async (): Promise<Resume[] | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
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

  // Clean the ?new=1 marker out of the URL once consumed
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams, router, pathname])

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
        <PageHeader
          title="Documents"
          description="Every resume you've generated, ready to view, edit, or export."
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus aria-hidden />
              Generate resume
            </Button>
          }
        />

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
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus aria-hidden />
                  Generate resume
                </Button>
              }
            />
          </Card>
        ) : (
          <DocumentsTable resumes={resumes} onResumeDeleted={handleDeleted} />
        )}

        <GenerateResumeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          existingResumes={resumes}
        />
      </div>
    </div>
  )
}

export default function DocumentsPage() {
  return (
    <Suspense>
      <DocumentsPageInner />
    </Suspense>
  )
}
