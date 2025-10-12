'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react'
import EnhanceTextarea from '@/components/ui/EnhanceTextarea'

interface Project {
  id: string
  user_id: string
  project_name: string
  role_title: string | null
  description: string | null
  link: string | null
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProjects(data)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .eq('user_id', user.id)

        if (!error) {
          await loadProjects()
          setEditingId(null)
        }
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...formData,
            user_id: user.id
          })

        if (!error) {
          await loadProjects()
          setIsAdding(false)
        }
      }

      setFormData({})
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (!error) {
        setProjects(projects.filter(proj => proj.id !== id))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const startEdit = (proj: Project) => {
    setFormData(proj)
    setEditingId(proj.id)
    setIsAdding(false)
  }

  const startAdd = () => {
    setFormData({
      project_name: '',
      role_title: '',
      description: '',
      link: ''
    })
    setIsAdding(true)
    setEditingId(null)
  }

  const cancel = () => {
    setFormData({})
    setIsAdding(false)
    setEditingId(null)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Project
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={formData.project_name || ''}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Role
              </label>
              <input
                type="text"
                value={formData.role_title || ''}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Lead Developer, Designer, Project Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Link
              </label>
              <input
                type="url"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <EnhanceTextarea
                value={formData.description || ''}
                onChange={(value) => setFormData({ ...formData, description: value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe the project, technologies used, and your contributions..."
                enhanceType="project"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-sm">No projects added yet</p>
        ) : (
          projects.map(proj => (
            <div key={proj.id} className="border-l-4 border-purple-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{proj.project_name}</h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {proj.role_title && (
                    <p className="text-gray-700 text-sm">{proj.role_title}</p>
                  )}
                  {proj.description && (
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{proj.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(proj)}
                    className="text-gray-400 hover:text-purple-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}