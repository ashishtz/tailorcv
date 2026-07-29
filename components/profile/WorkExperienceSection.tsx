'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import EnhanceTextarea from '@/components/ui/EnhanceTextarea'

interface WorkExperience {
  id: string
  user_id: string
  company_name: string
  position_title: string
  location: string | null
  job_type: 'Part-Time' | 'Full-Time' | 'Contract' | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
}

export default function WorkExperienceSection() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<WorkExperience>>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fetchWorkExperiences = useCallback(async (): Promise<WorkExperience[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('work_experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

      return !error && data ? data : []
    } catch (error) {
      console.error('Error loading work experiences:', error)
      return []
    }
  }, [supabase])

  const loadWorkExperiences = useCallback(async () => {
    setExperiences(await fetchWorkExperiences())
  }, [fetchWorkExperiences])

  useEffect(() => {
    let active = true
    fetchWorkExperiences().then((list) => {
      if (active) setExperiences(list)
    })
    return () => {
      active = false
    }
  }, [fetchWorkExperiences])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (editingId) {
        const { error } = await supabase
          .from('work_experiences')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .eq('user_id', user.id)

        if (!error) {
          await loadWorkExperiences()
          setEditingId(null)
        }
      } else {
        const { error } = await supabase
          .from('work_experiences')
          .insert({
            ...formData,
            user_id: user.id
          })

        if (!error) {
          await loadWorkExperiences()
          setIsAdding(false)
        }
      }

      setFormData({})
    } catch (error) {
      console.error('Error saving work experience:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('work_experiences')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (!error) {
        setExperiences(experiences.filter(exp => exp.id !== id))
      }
    } catch (error) {
      console.error('Error deleting work experience:', error)
    }
  }

  const startEdit = (exp: WorkExperience) => {
    setFormData(exp)
    setEditingId(exp.id)
    setIsAdding(false)
  }

  const startAdd = () => {
    setFormData({
      company_name: '',
      position_title: '',
      location: '',
      job_type: 'Full-Time',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
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
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Experience
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company_name || ''}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position Title *
              </label>
              <input
                type="text"
                required
                value={formData.position_title || ''}
                onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                value={formData.job_type || 'Full-Time'}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value as 'Part-Time' | 'Full-Time' | 'Contract' | null })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.is_current}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm disabled:bg-gray-100"
              />
              <label className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    is_current: e.target.checked,
                    end_date: e.target.checked ? null : formData.end_date
                  })}
                  className="rounded-sm border-gray-300 text-blue-600 shadow-xs focus:border-slate-400 focus:ring-slate-300"
                />
                <span className="ml-2 text-sm text-gray-700">Currently working here</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <EnhanceTextarea
                value={formData.description || ''}
                onChange={(value) => setFormData({ ...formData, description: value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
                placeholder="Describe your responsibilities and achievements..."
                enhanceType="work_experience"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
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
        {experiences.length === 0 ? (
          <p className="text-gray-500 text-sm">No work experience added yet</p>
        ) : (
          experiences.map(exp => (
            <div key={exp.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{exp.position_title}</h3>
                  <p className="text-gray-700">{exp.company_name}</p>
                  {exp.location && (
                    <p className="text-sm text-gray-600">{exp.location}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {exp.job_type} • {new Date(exp.start_date).toLocaleDateString()} - {
                      exp.is_current ? 'Present' : exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'
                    }
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(exp)}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
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