'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Plus, Edit2, ExternalLink } from 'lucide-react'

export function ProjectsStep() {
  const { data, addProject, updateProject, removeProject, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    role_title: '',
    description: '',
    link: '',
  })

  const resetForm = () => {
    setFormData({
      project_name: '',
      role_title: '',
      description: '',
      link: '',
    })
    setIsAdding(false)
    setEditingIndex(null)
  }

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingIndex !== null) {
      updateProject(editingIndex, formData)
    } else {
      addProject(formData)
    }
    
    resetForm()
  }

  const handleEdit = (index: number) => {
    const project = data.projects[index]
    setFormData({
      project_name: project.project_name,
      role_title: project.role_title || '',
      description: project.description || '',
      link: project.link || '',
    })
    setEditingIndex(index)
    setIsAdding(true)
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Save all onboarding data to database
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(data.personalInfo)
        .eq('id', user.id)

      if (profileError) throw profileError

      // Save skills
      for (const skill of data.skills) {
        await supabase
          .from('user_skills')
          .insert({ user_id: user.id, skill_id: skill.id })
      }

      // Save work experiences
      for (const experience of data.workExperiences) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, ...exp } = experience
        await supabase
          .from('work_experiences')
          .insert({ ...exp, user_id: user.id })
      }

      // Save education
      for (const edu of data.education) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, ...education } = edu
        await supabase
          .from('education')
          .insert({ ...education, user_id: user.id })
      }

      // Save projects
      for (const proj of data.projects) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, created_at, updated_at, ...project } = proj
        await supabase
          .from('projects')
          .insert({ ...project, user_id: user.id })
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setCurrentStep(4)
    router.push('/onboarding/education')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.projects.map((project, index) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{project.project_name}</h4>
                {project.role_title && (
                  <p className="text-gray-600">{project.role_title}</p>
                )}
                {project.description && (
                  <p className="mt-2 text-gray-700">{project.description}</p>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Project
                    <ExternalLink className="w-3 h-3" />
                  </a>
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
                  onClick={() => removeProject(index)}
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
        <form onSubmit={handleSubmitProject} className="space-y-4 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">
                Project Name *
              </label>
              <input
                type="text"
                id="project_name"
                required
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label htmlFor="role_title" className="block text-sm font-medium text-gray-700">
                Role/Title
              </label>
              <input
                type="text"
                id="role_title"
                value={formData.role_title}
                onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                className="mt-1 block w-full"
                placeholder="e.g., Lead Developer, Contributor"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Describe the project and your contributions..."
              />
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Project Link (Optional)
              </label>
              <input
                type="url"
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="mt-1 block w-full"
                placeholder="https://..."
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
              {editingIndex !== null ? 'Update' : 'Add'} Project
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
          Add Project
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
          onClick={handleFinish}
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Complete Onboarding'}
        </button>
      </div>
    </div>
  )
}