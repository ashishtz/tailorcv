'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'

interface Education {
  id: string
  user_id: string
  institution_name: string
  start_date: string
  end_date: string | null
  degree: "Bachelor's" | "Master's" | null
  field_of_study: string | null
}

export default function EducationSection() {
  const [educationList, setEducationList] = useState<Education[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadEducation()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadEducation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })

      if (!error && data) {
        setEducationList(data)
      }
    } catch (error) {
      console.error('Error loading education:', error)
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
          .from('education')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .eq('user_id', user.id)

        if (!error) {
          await loadEducation()
          setEditingId(null)
        }
      } else {
        const { error } = await supabase
          .from('education')
          .insert({
            ...formData,
            user_id: user.id
          })

        if (!error) {
          await loadEducation()
          setIsAdding(false)
        }
      }

      setFormData({})
    } catch (error) {
      console.error('Error saving education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (!error) {
        setEducationList(educationList.filter(edu => edu.id !== id))
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const startEdit = (edu: Education) => {
    setFormData(edu)
    setEditingId(edu.id)
    setIsAdding(false)
  }

  const startAdd = () => {
    setFormData({
      institution_name: '',
      start_date: '',
      end_date: '',
      degree: "Bachelor's",
      field_of_study: ''
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
        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Education
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={formData.institution_name || ''}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Harvard University"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree
              </label>
              <select
                value={formData.degree || "Bachelor's"}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value as "Bachelor's" | "Master's" | null })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Bachelor's">Bachelor&apos;s</option>
                <option value="Master's">Master&apos;s</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field_of_study || ''}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Computer Science"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date (or Expected)
              </label>
              <input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty if still enrolled</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
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
        {educationList.length === 0 ? (
          <p className="text-gray-500 text-sm">No education added yet</p>
        ) : (
          educationList.map(edu => (
            <div key={edu.id} className="border-l-4 border-green-500 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{edu.institution_name}</h3>
                  {edu.degree && edu.field_of_study && (
                    <p className="text-gray-700">{edu.degree} in {edu.field_of_study}</p>
                  )}
                  {edu.degree && !edu.field_of_study && (
                    <p className="text-gray-700">{edu.degree}</p>
                  )}
                  {!edu.degree && edu.field_of_study && (
                    <p className="text-gray-700">{edu.field_of_study}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(edu.start_date).toLocaleDateString()} - {
                      edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'
                    }
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => startEdit(edu)}
                    className="text-gray-400 hover:text-green-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
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