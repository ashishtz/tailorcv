'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X, ArrowLeft, Save } from 'lucide-react'

interface ParsedResumeData {
  contact: {
    name: string
    email: string
    phone: string
    location: string
    address?: string
  }
  summary: string
  skills: string[]
  workExperience: Array<{
    company: string
    position: string
    location: string
    type: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
  }>
  projects: Array<{
    name: string
    role: string
    description: string
    link?: string
  }>
}

interface ImportResumePageProps {
  searchParams: { data?: string }
}

export default function ImportResumePage({ searchParams }: ImportResumePageProps) {
  const router = useRouter()
  const [isLoading, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Parse the data from URL params (in a real app, you'd pass this through state or session)
  const initialData: ParsedResumeData | null = searchParams.data
    ? JSON.parse(decodeURIComponent(searchParams.data))
    : null

  const [formData, setFormData] = useState<ParsedResumeData>(
    initialData || {
      contact: { name: '', email: '', phone: '', location: '', address: '' },
      summary: '',
      skills: [],
      workExperience: [],
      education: [],
      projects: []
    }
  )

  if (!initialData) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No resume data found.</p>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  const handleContactChange = (field: keyof ParsedResumeData['contact'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }))
  }

  const handleSkillChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }))
  }

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }))
  }

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleWorkExperienceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        company: '',
        position: '',
        location: '',
        type: 'Full-Time',
        startDate: '',
        endDate: '',
        description: ''
      }]
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
      }]
    }))
  }

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        role: '',
        description: '',
        link: ''
      }]
    }))
  }

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update profile with contact information
      const [firstName, ...lastNameParts] = formData.contact.name.split(' ')
      const lastName = lastNameParts.join(' ')

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: formData.contact.email,
          phone: formData.contact.phone,
          location: formData.contact.location,
          address_1: formData.contact.address
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Clear existing data
      await Promise.all([
        supabase.from('user_skills').delete().eq('user_id', user.id),
        supabase.from('work_experiences').delete().eq('user_id', user.id),
        supabase.from('education').delete().eq('user_id', user.id),
        supabase.from('projects').delete().eq('user_id', user.id)
      ])

      // Insert new skills
      if (formData.skills.length > 0) {
        // First, insert skills that don't exist
        const skillNames = formData.skills.filter(skill => skill.trim())

        for (const skillName of skillNames) {
          const { data: existingSkill } = await supabase
            .from('skills')
            .select('id')
            .eq('name', skillName.trim())
            .single()

          let skillId = existingSkill?.id

          if (!skillId) {
            const { data: newSkill } = await supabase
              .from('skills')
              .insert({ name: skillName.trim() })
              .select('id')
              .single()

            skillId = newSkill?.id
          }

          if (skillId) {
            await supabase
              .from('user_skills')
              .insert({ user_id: user.id, skill_id: skillId })
          }
        }
      }

      // Insert work experiences
      if (formData.workExperience.length > 0) {
        const workExperiences = formData.workExperience
          .filter(exp => exp.company.trim() && exp.position.trim())
          .map(exp => ({
            user_id: user.id,
            company_name: exp.company,
            position_title: exp.position,
            location: exp.location,
            job_type: exp.type as 'Part-Time' | 'Full-Time' | 'Contract',
            start_date: exp.startDate,
            end_date: exp.endDate === 'Present' ? null : exp.endDate,
            is_current: exp.endDate === 'Present',
            description: exp.description
          }))

        if (workExperiences.length > 0) {
          const { error: workError } = await supabase
            .from('work_experiences')
            .insert(workExperiences)

          if (workError) throw workError
        }
      }

      // Insert education
      if (formData.education.length > 0) {
        const educationData = formData.education
          .filter(edu => edu.institution.trim() && edu.degree.trim())
          .map(edu => ({
            user_id: user.id,
            institution_name: edu.institution,
            degree: edu.degree as "Bachelor's" | "Master's",
            field_of_study: edu.field,
            start_date: edu.startDate,
            end_date: edu.endDate
          }))

        if (educationData.length > 0) {
          const { error: eduError } = await supabase
            .from('education')
            .insert(educationData)

          if (eduError) throw eduError
        }
      }

      // Insert projects
      if (formData.projects.length > 0) {
        const projectsData = formData.projects
          .filter(project => project.name.trim())
          .map(project => ({
            user_id: user.id,
            project_name: project.name,
            role_title: project.role,
            description: project.description,
            link: project.link
          }))

        if (projectsData.length > 0) {
          const { error: projectError } = await supabase
            .from('projects')
            .insert(projectsData)

          if (projectError) throw projectError
        }
      }

      // Redirect back to profile
      router.push('/dashboard/profile')

    } catch (error) {
      console.error('Error saving imported data:', error)
      setError(error instanceof Error ? error.message : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Review Imported Resume Data</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.contact.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.contact.location}
                  onChange={(e) => handleContactChange('location', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.contact.address || ''}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
              <button
                onClick={addSkill}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Skill
              </button>
            </div>
            <div className="space-y-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    onClick={() => removeSkill(index)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
              <button
                onClick={addWorkExperience}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {formData.workExperience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <button
                      onClick={() => removeWorkExperience(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleWorkExperienceChange(index, 'position', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={exp.type}
                        onChange={(e) => handleWorkExperienceChange(index, 'type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Education</h2>
              <button
                onClick={addEducation}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Education
              </button>
            </div>
            <div className="space-y-6">
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <select
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Select Degree</option>
                        <option value="Bachelor's">Bachelor&apos;s</option>
                        <option value="Master's">Master&apos;s</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button
                onClick={addProject}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Project
              </button>
            </div>
            <div className="space-y-6">
              {formData.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Project {index + 1}</h3>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Your Role</label>
                      <input
                        type="text"
                        value={project.role}
                        onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save to Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}