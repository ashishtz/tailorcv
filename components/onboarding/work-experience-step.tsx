'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Edit2 } from 'lucide-react'

export function WorkExperienceStep() {
  const { data, addWorkExperience, updateWorkExperience, removeWorkExperience, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    location: '',
    job_type: 'Full-Time' as 'Part-Time' | 'Full-Time' | 'Contract',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  })

  const resetForm = () => {
    setFormData({
      company_name: '',
      position_title: '',
      location: '',
      job_type: 'Full-Time',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
    })
    setIsAdding(false)
    setEditingIndex(null)
  }

  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingIndex !== null) {
      updateWorkExperience(editingIndex, formData)
    } else {
      addWorkExperience(formData)
    }
    
    resetForm()
  }

  const handleEdit = (index: number) => {
    const experience = data.workExperiences[index]
    setFormData({
      company_name: experience.company_name,
      position_title: experience.position_title,
      location: experience.location || '',
      job_type: experience.job_type || 'Full-Time',
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      is_current: experience.is_current,
      description: experience.description || '',
    })
    setEditingIndex(index)
    setIsAdding(true)
  }

  const handleNext = () => {
    setCurrentStep(4)
    router.push('/onboarding/education')
  }

  const handleBack = () => {
    setCurrentStep(2)
    router.push('/onboarding/skills')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.workExperiences.map((experience, index) => (
          <div key={experience.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{experience.position_title}</h4>
                <p className="text-gray-600">{experience.company_name}</p>
                <p className="text-sm text-gray-500">
                  {experience.location} • {experience.job_type}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(experience.start_date)} - {
                    experience.is_current ? 'Present' : formatDate(experience.end_date || '')
                  }
                </p>
                {experience.description && (
                  <p className="mt-2 text-gray-700">{experience.description}</p>
                )}
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
                  onClick={() => removeWorkExperience(index)}
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
        <form onSubmit={handleSubmitExperience} className="space-y-4 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="position_title" className="block text-sm font-medium text-gray-700">
                Position Title *
              </label>
              <input
                type="text"
                id="position_title"
                required
                value={formData.position_title}
                onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
                Job Type *
              </label>
              <select
                id="job_type"
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value as 'Part-Time' | 'Full-Time' | 'Contract' })}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
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
                End Date
              </label>
              <input
                type="month"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.is_current}
                className="mt-1 block w-full"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: '' })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">I currently work here</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Describe your responsibilities and achievements..."
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
              {editingIndex !== null ? 'Update' : 'Add'} Experience
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
          Add Work Experience
        </button>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}