'use client'

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from '@tanstack/react-table'
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
import { createClient } from '@/lib/supabase/client'
import { getTemplateDef } from '@/lib/templates'
import { formatMonthYear } from '@/lib/utils'

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
      const { data: { user } } = await supabase.auth.getUser()
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
          className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-brand-700"
        >
          <Eye className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={`/dashboard/documents/${resume.id}/edit`}
          aria-label={`Edit ${resume.job_title}`}
          title="Edit"
          className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-brand-700"
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          aria-label={`Delete ${resume.job_title}`}
          title="Delete"
          className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
        cancelText="Cancel"
        type="danger"
        loading={isDeleting}
      />
    </>
  )
}

const columnHelper = createColumnHelper<Resume>()

export function DocumentsTable({ resumes, onResumeDeleted }: DocumentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtering, setFiltering] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('job_title', {
        header: 'Job title',
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50">
              <FileText className="h-4 w-4 text-brand-600" aria-hidden />
            </div>
            <span className="font-medium text-stone-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('template_id', {
        header: 'Template',
        cell: (info) => <Badge variant="brand">{getTemplateDef(info.getValue()).name}</Badge>,
      }),
      columnHelper.accessor('mode', {
        header: 'Mode',
        cell: (info) => (
          <Badge variant={info.getValue() === 'strict' ? 'success' : 'accent'}>
            {info.getValue() === 'strict' ? 'Strict' : 'Free'}
          </Badge>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: (info) => (
          <span className="text-stone-500">{formatMonthYear(info.getValue())}</span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: (info) => <ActionsCell resume={info.row.original} onDelete={onResumeDeleted} />,
      }),
    ],
    [onResumeDeleted]
  )

  // React Compiler skips memoizing useReactTable (TanStack API returns
  // non-memoizable functions); informational only, behavior is unaffected.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: resumes,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

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
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
            placeholder="Search resumes…"
            aria-label="Search resumes"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-stone-500">
          {table.getFilteredRowModel().rows.length} of {resumes.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-stone-200">
                {headerGroup.headers.map((header) => {
                  const sortable = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:px-5"
                    >
                      {sortable ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1 rounded-sm hover:text-stone-800"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === 'asc' && <ChevronUp className="h-3.5 w-3.5" aria-hidden />}
                          {sorted === 'desc' && <ChevronDown className="h-3.5 w-3.5" aria-hidden />}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-stone-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-stone-500">
                  No resumes match your search.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-stone-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 sm:px-5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 sm:px-5">
          <p className="text-sm text-stone-500">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft aria-hidden />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
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
