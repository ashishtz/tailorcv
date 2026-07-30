'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Resume } from '@/lib/types/database'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/field'
import { useToast } from '@/components/ui/toast'
import { createClient, requireSessionUser } from '@/lib/supabase/client'
import { getTemplateDef } from '@/lib/templates'
import { formatMonthYear } from '@/lib/utils'

const PAGE_SIZE = 10

const COLUMNS = [
  { key: 'job_title', label: 'Job title' },
  { key: 'template_id', label: 'Template' },
  { key: 'mode', label: 'Mode' },
  { key: 'created_at', label: 'Created' },
] as const

type SortKey = (typeof COLUMNS)[number]['key']

interface DocumentsTableProps {
  resumes: Resume[]
  onResumeDeleted: (resumeId: string) => void
}

interface ActionsCellProps {
  resume: Resume
  onDelete: (resumeId: string) => void
}

function ActionsCell({ resume, onDelete }: ActionsCellProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const user = await requireSessionUser(supabase)
      if (!user) throw new Error('Not signed in')

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id)
        .eq('user_id', user.id)

      if (error) throw error

      setIsDeleteDialogOpen(false)
      onDelete(resume.id)
    } catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('Delete failed', 'The resume could not be deleted. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/dashboard/documents/${resume.id}`}
          aria-label={`View ${resume.job_title}`}
          title="View"
          className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-brand-700"
        >
          <Eye className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={`/dashboard/documents/${resume.id}/edit`}
          aria-label={`Edit ${resume.job_title}`}
          title="Edit"
          className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-brand-700"
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          aria-label={`Delete ${resume.job_title}`}
          title="Delete"
          className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete resume"
        message={`Are you sure you want to delete "${resume.job_title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </>
  )
}

export function DocumentsTable({ resumes, onResumeDeleted }: DocumentsTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    const rows = q
      ? resumes.filter((r) =>
          [r.job_title, getTemplateDef(r.template_id).name, r.mode, formatMonthYear(r.created_at)]
            .join(' ')
            .toLowerCase()
            .includes(q)
        )
      : resumes
    if (!sort) return rows
    const sorted = [...rows].sort((a, b) =>
      String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''))
    )
    return sort.dir === 'desc' ? sorted.reverse() : sorted
  }, [resumes, filter, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    // Cycle asc -> desc -> off, matching the previous table behavior.
    setSort((prev) =>
      prev?.key !== key
        ? { key, dir: 'asc' }
        : prev.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
    )
  }

  return (
    <Card>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 sm:px-5">
        <div className="relative w-full max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
            aria-hidden
          />
          <Input
            type="search"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setPage(0)
            }}
            placeholder="Search resumes…"
            aria-label="Search resumes"
            className="pl-9"
          />
        </div>
        <p role="status" className="text-sm text-stone-500">
          {filtered.length} of {resumes.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Resumes">
          <thead>
            <tr className="border-b border-stone-200">
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  // 'none' (rather than omitting it) marks the column as
                  // sortable-but-unsorted, which is what AT announces.
                  aria-sort={
                    sort?.key === key
                      ? sort.dir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:px-5"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className="inline-flex items-center gap-1 rounded-sm hover:text-stone-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  >
                    {label}
                    {sort?.key === key && sort.dir === 'asc' && (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {sort?.key === key && sort.dir === 'desc' && (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                    )}
                  </button>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 sm:px-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-5 py-10 text-center text-stone-500">
                  No resumes match your search.
                </td>
              </tr>
            ) : (
              pageRows.map((resume) => (
                <tr key={resume.id} className="transition-colors hover:bg-stone-50">
                  <td className="px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                        <FileText className="h-4 w-4 text-brand-600" aria-hidden />
                      </div>
                      <span className="font-medium text-stone-900">{resume.job_title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <Badge variant="brand">{getTemplateDef(resume.template_id).name}</Badge>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <Badge variant={resume.mode === 'strict' ? 'success' : 'accent'}>
                      {resume.mode === 'strict' ? 'Strict' : 'Free'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <span className="text-stone-500">{formatMonthYear(resume.created_at)}</span>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <ActionsCell resume={resume} onDelete={onResumeDeleted} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 sm:px-5">
          <p className="text-sm text-stone-500">
            Page {safePage + 1} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 0}
            >
              <ChevronLeft aria-hidden />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount - 1}
            >
              Next
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
