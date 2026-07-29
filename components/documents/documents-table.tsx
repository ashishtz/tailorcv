'use client'

import React from 'react'
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
import { Resume } from '@/lib/types/database'
import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, Eye, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { createClient } from '@/lib/supabase/client'

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
  const supabase = createClient()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resume.id)

      if (error) throw error

      onDelete(resume.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting resume:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Link
          href={`/dashboard/documents/${resume.id}`}
          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
          title="View Resume"
        >
          <Eye className="h-4 w-4" />
        </Link>
        <Link
          href={`/dashboard/documents/${resume.id}/edit`}
          className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
          title="Edit Resume"
        >
          <Edit className="h-4 w-4" />
        </Link>
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete Resume"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Resume"
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
  const columns = [
    columnHelper.accessor('job_title', {
      header: 'Job Title',
      cell: (info) => (
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-600 mr-3" />
          <span className="font-medium text-gray-900">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('template_id', {
      header: 'Template',
      cell: (info) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('mode', {
      header: 'Mode',
      cell: (info) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          info.getValue() === 'strict' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {info.getValue() === 'strict' ? 'Strict' : 'Free'}
        </span>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created',
      cell: (info) => new Date(info.getValue()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => <ActionsCell resume={info.row.original} onDelete={onResumeDeleted} />,
    }),
  ]
  const [sorting, setSorting] = useState<SortingState>([])
  const [filtering, setFiltering] = useState('')

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
    <div className="bg-white shadow-sm rounded-lg">
      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-hidden focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search resumes..."
              />
            </div>
            <select
              onChange={(e) => {
                const value = e.target.value
                table.getColumn('mode')?.setFilterValue(value === 'all' ? '' : value)
              }}
              className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white"
            >
              <option value="all">All Modes</option>
              <option value="strict">Strict Mode</option>
              <option value="free">Free Mode</option>
            </select>
          </div>
          <div className="text-sm text-gray-700">
            Showing {table.getRowModel().rows.length} of {resumes.length} resumes
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      <span>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())
                        }
                      </span>
                      {header.column.getCanSort() && (
                        <span className="flex flex-col">
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <div className="flex flex-col">
                              <ChevronUp className="h-2 w-2 text-gray-400" />
                              <ChevronDown className="h-2 w-2 text-gray-400 -mt-0.5" />
                            </div>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 bg-white"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>
      </div>
    </div>
  )
}