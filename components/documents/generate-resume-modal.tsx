'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TemplatePreview } from '@/components/resume-templates/template-preview'
import { Resume } from '@/lib/types/database'

interface GenerateResumeModalProps {
  isOpen: boolean
  onClose: () => void
  existingResumes: Resume[]
}

export function GenerateResumeModal({ isOpen, onClose, existingResumes }: GenerateResumeModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contextSource, setContextSource] = useState<'scratch' | 'resume'>('scratch')
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [formData, setFormData] = useState({
    job_title: '',
    job_description: '',
    mode: 'strict' as 'strict' | 'free',
    template: 'classic' as string,
    generation_settings: {
      summary_format: 'paragraph' as 'paragraph' | 'bullets',
      work_experience_format: 'paragraph' as 'paragraph' | 'bullets',
      projects_format: 'paragraph' as 'paragraph' | 'bullets',
      highlight_important_content: false,
    }
  })

  const templates = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
    { id: 'executive', name: 'Executive' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/resumes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          context_source: contextSource,
          base_resume_id: contextSource === 'resume' ? selectedResumeId : undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate resume')

      const { resumeId } = await response.json()
      router.push(`/dashboard/documents/${resumeId}`)
    } catch (error) {
      console.error('Error generating resume:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg max-w-4xl w-full p-8 shadow-large animate-scale-in">
          <div className="absolute top-6 right-6">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate New Resume</h2>
            <p className="text-gray-600">Create a tailored resume for your target position</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Context Source Selection */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Generate From *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                  <input
                    type="radio"
                    name="context_source"
                    value="scratch"
                    checked={contextSource === 'scratch'}
                    onChange={(e) => {
                      setContextSource(e.target.value as 'scratch' | 'resume')
                      setSelectedResumeId('')
                    }}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">From Scratch</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Use your profile information as the base context
                    </span>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                  <input
                    type="radio"
                    name="context_source"
                    value="resume"
                    checked={contextSource === 'resume'}
                    onChange={(e) => setContextSource(e.target.value as 'scratch' | 'resume')}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">From Existing Resume</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Use an existing resume as the base context instead of profile data
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Resume Selector - Only show when 'resume' is selected */}
            {contextSource === 'resume' && (
              <div className="animate-slide-up">
                <label htmlFor="base_resume" className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Base Resume *
                </label>
                <select
                  id="base_resume"
                  required
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-xs text-gray-900 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 transition-all duration-200"
                >
                  <option value="">Select a resume...</option>
                  {existingResumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.job_title} - {new Date(resume.created_at).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="job_title" className="block text-sm font-semibold text-gray-900 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="job_title"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-xs text-gray-900 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 transition-all duration-200"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="job_description" className="block text-sm font-semibold text-gray-900 mb-2">
                Job Description *
              </label>
              <textarea
                id="job_description"
                rows={6}
                required
                value={formData.job_description}
                onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                className="block w-full rounded-lg border-gray-300 shadow-xs text-gray-900 focus:border-primary-500 focus:ring-primary-500 py-3 px-4 transition-all duration-200"
                placeholder="Paste the job description here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Choose Template *
              </label>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {templates.map((template) => (
                  <TemplatePreview
                    key={template.id}
                    templateId={template.id}
                    templateName={template.name}
                    isSelected={formData.template === template.id}
                    onClick={() => setFormData({ ...formData, template: template.id })}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Resume Mode *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                  <input
                    type="radio"
                    name="mode"
                    value="strict"
                    checked={formData.mode === 'strict'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as 'strict' | 'free' })}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">Strict Mode</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Stays strictly within the information you provided during onboarding
                    </span>
                  </div>
                </label>

                <label className="flex items-start p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                  <input
                    type="radio"
                    name="mode"
                    value="free"
                    checked={formData.mode === 'free'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as 'strict' | 'free' })}
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">Free Mode</span>
                    <span className="block text-sm text-gray-600 mt-1">
                      Allows AI to enhance and modify content based on job requirements
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Content Formatting Options */}
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Content Formatting</h3>

              <div className="space-y-6">
                {/* Summary Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Summary Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="summary_format"
                        value="paragraph"
                        checked={formData.generation_settings.summary_format === 'paragraph'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            summary_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Paragraph</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="summary_format"
                        value="bullets"
                        checked={formData.generation_settings.summary_format === 'bullets'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            summary_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Bullet Points</span>
                    </label>
                  </div>
                </div>

                {/* Work Experience Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Work Experience Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="work_experience_format"
                        value="paragraph"
                        checked={formData.generation_settings.work_experience_format === 'paragraph'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            work_experience_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Paragraph</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="work_experience_format"
                        value="bullets"
                        checked={formData.generation_settings.work_experience_format === 'bullets'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            work_experience_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Bullet Points</span>
                    </label>
                  </div>
                </div>

                {/* Projects Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Projects Format
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="projects_format"
                        value="paragraph"
                        checked={formData.generation_settings.projects_format === 'paragraph'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            projects_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Paragraph</span>
                    </label>
                    <label className="flex-1 flex items-center justify-center p-3 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 cursor-pointer has-checked:border-primary-500 has-checked:bg-primary-50">
                      <input
                        type="radio"
                        name="projects_format"
                        value="bullets"
                        checked={formData.generation_settings.projects_format === 'bullets'}
                        onChange={(e) => setFormData({
                          ...formData,
                          generation_settings: {
                            ...formData.generation_settings,
                            projects_format: e.target.value as 'paragraph' | 'bullets'
                          }
                        })}
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Bullet Points</span>
                    </label>
                  </div>
                </div>

                {/* Highlight Important Content */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.generation_settings.highlight_important_content}
                      onChange={(e) => setFormData({
                        ...formData,
                        generation_settings: {
                          ...formData.generation_settings,
                          highlight_important_content: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded-sm focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">Highlight important content</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        This option will be used for future enhancements
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-soft hover:shadow-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group px-6 py-3 border border-transparent rounded-lg text-sm font-semibold text-white bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-medium hover:shadow-large transform hover:-translate-y-0.5 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Resume'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}