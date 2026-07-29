'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { Resume } from '@/lib/types/database'
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import Link from 'next/link'

type FormData = {
  contact: {
    name: string
    email: string
    phone: string
    location: string
    address?: string
    socialLinks?: {
      linkedin?: string
      github?: string
      stackoverflow?: string
    }
  }
  skills: string[]
  workExperience: Array<{
    company: string
    position: string
    location: string
    type: string
    duration: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    duration: string
  }>
  projects: Array<{
    name: string
    role: string
    description: string
    link?: string
  }>
}

export default function EditResumePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resume, setResume] = useState<Resume | null>(null)
  const supabase = createClient()

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const [skillsArray, setSkillsArray] = useState<string[]>([])

  const appendSkill = (value: string) => {
    setSkillsArray([...skillsArray, value])
  }

  const removeSkill = (index: number) => {
    setSkillsArray(skillsArray.filter((_, i) => i !== index))
  }

  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control,
    name: 'workExperience'
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  })

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects'
  })

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', params.id)
          .single()

        if (!error && data) {
          setResume(data)
          // Set skills array state
          setSkillsArray(data.generated_data.skills || [])
          // Transform skills array to objects for field array
          const formData: FormData = {
            contact: data.generated_data.contact,
            skills: data.generated_data.skills || [],
            workExperience: data.generated_data.workExperience || [],
            education: data.generated_data.education || [],
            projects: data.generated_data.projects || []
          }
          reset(formData)
        }
      } catch (error) {
        console.error('Error fetching resume:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [params.id, supabase, reset])

  const onSubmit = async (data: FormData) => {
    if (!resume) return

    setSaving(true)
    try {
      const updatedData = {
        generated_data: {
          contact: {
            ...data.contact,
            socialLinks: data.contact.socialLinks
          },
          skills: skillsArray.filter(skill => skill && skill.trim()),
          workExperience: data.workExperience,
          education: data.education,
          projects: data.projects
        }
      }

      const { error } = await supabase
        .from('resumes')
        .update(updatedData)
        .eq('id', resume.id)

      if (!error) {
        router.push(`/dashboard/documents/${resume.id}`)
      } else {
        console.error('Error updating resume:', error)
        alert('Failed to save resume. Please try again.')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Loading resume...</div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Resume not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="bg-white shadow-xs border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-4">
                <Link
                  href={`/dashboard/documents/${params.id}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Resume
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Edit Resume</h1>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/documents/${params.id}`}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    {...register('contact.name', { required: 'Name is required' })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                  {errors.contact?.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('contact.email', { required: 'Email is required' })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                  {errors.contact?.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    {...register('contact.phone', { required: 'Phone is required' })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                  {errors.contact?.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    {...register('contact.location', { required: 'Location is required' })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                  {errors.contact?.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.location.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <input
                    {...register('contact.address')}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn (Optional)
                  </label>
                  <input
                    type="url"
                    {...register('contact.socialLinks.linkedin')}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <GitHubIcon className="w-4 h-4 text-gray-900" />
                    GitHub (Optional)
                  </label>
                  <input
                    type="url"
                    {...register('contact.socialLinks.github')}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <StackOverflowIcon className="w-4 h-4 text-[#F48024]" />
                    StackOverflow (Optional)
                  </label>
                  <input
                    type="url"
                    {...register('contact.socialLinks.stackoverflow')}
                    placeholder="https://stackoverflow.com/users/id"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={() => appendSkill('')}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {skillsArray.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      value={skill}
                      onChange={(e) => {
                        const newSkills = [...skillsArray]
                        newSkills[index] = e.target.value
                        setSkillsArray(newSkills)
                      }}
                      placeholder="Enter skill"
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                <button
                  type="button"
                  onClick={() => appendWork({
                    company: '',
                    position: '',
                    location: '',
                    type: 'Full-Time',
                    duration: '',
                    description: ''
                  })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {workFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Experience #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeWork(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          {...register(`workExperience.${index}.company` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Position
                        </label>
                        <input
                          {...register(`workExperience.${index}.position` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          {...register(`workExperience.${index}.location` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          {...register(`workExperience.${index}.type` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        >
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          {...register(`workExperience.${index}.duration` as const)}
                          placeholder="e.g., Jan 2020 - Present"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          {...register(`workExperience.${index}.description` as const)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
                <button
                  type="button"
                  onClick={() => appendEducation({
                    institution: '',
                    degree: '',
                    field: '',
                    duration: ''
                  })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </button>
              </div>

              <div className="space-y-6">
                {educationFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Education #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution
                        </label>
                        <input
                          {...register(`education.${index}.institution` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Degree
                        </label>
                        <input
                          {...register(`education.${index}.degree` as const)}
                          placeholder="e.g., Bachelor&apos;s, Master&apos;s"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field of Study
                        </label>
                        <input
                          {...register(`education.${index}.field` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          {...register(`education.${index}.duration` as const)}
                          placeholder="e.g., 2016 - 2020"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
                <button
                  type="button"
                  onClick={() => appendProject({
                    name: '',
                    role: '',
                    description: '',
                    link: ''
                  })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Project
                </button>
              </div>

              <div className="space-y-6">
                {projectFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Project #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Name
                        </label>
                        <input
                          {...register(`projects.${index}.name` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Role
                        </label>
                        <input
                          {...register(`projects.${index}.role` as const)}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Link (Optional)
                        </label>
                        <input
                          {...register(`projects.${index}.link` as const)}
                          type="url"
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          {...register(`projects.${index}.description` as const)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 shadow-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-300 text-slate-700 bg-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}