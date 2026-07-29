'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Edit2 } from 'lucide-react'

export function EducationStep() {
  const { data, addEducation, updateEducation, removeEducation, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    institution_name: '',
    start_date: '',
    end_date: '',
    degree: "Bachelor's" as "Bachelor's" | "Master's",
    field_of_study: '',
  })

  const resetForm = () => {
    setFormData({
      institution_name: '',
      start_date: '',
      end_date: '',
      degree: "Bachelor's",
      field_of_study: '',
    })
    setIsAdding(false)
    setEditingIndex(null)
  }

  const handleSubmitEducation = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingIndex !== null) {
      updateEducation(editingIndex, formData)
    } else {
      addEducation(formData)
    }
    
    resetForm()
  }

  const handleEdit = (index: number) => {
    const education = data.education[index]
    setFormData({
      institution_name: education.institution_name,
      start_date: education.start_date,
      end_date: education.end_date || '',
      degree: education.degree || "Bachelor's",
      field_of_study: education.field_of_study || '',
    })
    setEditingIndex(index)
    setIsAdding(true)
  }

  const handleNext = () => {
    setCurrentStep(5)
    router.push('/onboarding/projects')
  }

  const handleBack = () => {
    setCurrentStep(3)
    router.push('/onboarding/work-experience')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{edu.institution_name}</h4>
                <p className="text-gray-600">
                  {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.start_date)} - {formatDate(edu.end_date || '')}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => handleEdit(index)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmitEducation} className="space-y-4 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="institution_name" className="block text-sm font-medium text-gray-700">
                College/University Name *
              </label>
              <input
                type="text"
                id="institution_name"
                required
                value={formData.institution_name}
                onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                Degree *
              </label>
              <select
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value as "Bachelor's" | "Master's" })}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="Bachelor's">Bachelor&apos;s</option>
                <option value="Master's">Master&apos;s</option>
              </select>
            </div>

            <div>
              <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700">
                Field of Study *
              </label>
              <input
                type="text"
                id="field_of_study"
                required
                placeholder="e.g., Computer Science"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="month"
                id="start_date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="month"
                id="end_date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              {editingIndex !== null ? 'Update' : 'Add'} Education
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Education
        </button>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-blue-700"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}