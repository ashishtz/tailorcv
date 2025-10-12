'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GenerateResumeModal } from '@/components/documents/generate-resume-modal'
import { DocumentsTable } from '@/components/documents/documents-table'
import { FileText, Plus } from 'lucide-react'
import { Resume } from '@/lib/types/database'

export default function DocumentsPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setResumes(data)
        }
      } catch (error) {
        console.error('Error fetching resumes:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchResumeData()
  }, [supabase])

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Generate New Resume
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by generating your first resume.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Generate Resume
              </button>
            </div>
          </div>
        ) : (
          <DocumentsTable
            resumes={resumes}
            onResumeDeleted={(resumeId) => {
              setResumes(prev => prev.filter(resume => resume.id !== resumeId))
            }}
          />
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