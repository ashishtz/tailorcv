'use client'

import { useState } from 'react'
import { X, Upload, FileText, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

interface ImportResumeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ImportResumeModal({ isOpen, onClose, onSuccess }: ImportResumeModalProps) {
  const [step, setStep] = useState<'upload' | 'review' | 'saving'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  if (!isOpen) return null

  const resetModal = () => {
    setStep('upload')
    setSelectedFile(null)
    setParsedData(null)
    setError(null)
    setIsUploading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'text/plain') {
        setError('Currently only TXT files are supported. Please convert your resume to plain text.')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum size is 10MB.')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleParseResume = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', selectedFile)

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse resume')
      }

      setParsedData(result.data)
      setStep('review')

    } catch (error) {
      console.error('Parse error:', error)
      setError(error instanceof Error ? error.message : 'Failed to parse resume')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveToProfile = async () => {
    if (!parsedData) return

    setStep('saving')
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Update profile with contact information
      const [firstName, ...lastNameParts] = parsedData.contact.name.split(' ')
      const lastName = lastNameParts.join(' ')

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: parsedData.contact.email,
          phone: parsedData.contact.phone,
          location: parsedData.contact.location,
          address_1: parsedData.contact.address
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
      if (parsedData.skills.length > 0) {
        const skillNames = parsedData.skills.filter(skill => skill.trim())

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
      if (parsedData.workExperience.length > 0) {
        const workExperiences = parsedData.workExperience
          .filter(exp => exp.company.trim() && exp.position.trim())
          .map(exp => ({
            user_id: user.id,
            company_name: exp.company,
            position_title: exp.position,
            location: exp.location,
            job_type: (exp.type as 'Part-Time' | 'Full-Time' | 'Contract') || 'Full-Time',
            start_date: exp.startDate,
            end_date: exp.endDate === 'Present' ? null : exp.endDate,
            is_current: exp.endDate === 'Present',
            description: exp.description
          }))

        if (workExperiences.length > 0) {
          await supabase.from('work_experiences').insert(workExperiences)
        }
      }

      // Insert education
      if (parsedData.education.length > 0) {
        const educationData = parsedData.education
          .filter(edu => edu.institution.trim() && edu.degree.trim())
          .map(edu => ({
            user_id: user.id,
            institution_name: edu.institution,
            degree: (edu.degree as "Bachelor's" | "Master's") || "Bachelor's",
            field_of_study: edu.field,
            start_date: edu.startDate,
            end_date: edu.endDate
          }))

        if (educationData.length > 0) {
          await supabase.from('education').insert(educationData)
        }
      }

      // Insert projects
      if (parsedData.projects.length > 0) {
        const projectsData = parsedData.projects
          .filter(project => project.name.trim())
          .map(project => ({
            user_id: user.id,
            project_name: project.name,
            role_title: project.role,
            description: project.description,
            link: project.link
          }))

        if (projectsData.length > 0) {
          await supabase.from('projects').insert(projectsData)
        }
      }

      // Success
      onSuccess()
      handleClose()

    } catch (error) {
      console.error('Error saving imported data:', error)
      setError(error instanceof Error ? error.message : 'Failed to save data')
      setStep('review')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Import from Resume</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {step === 'upload' && (
              <div>
                <p className="text-gray-600 mb-6">
                  Upload your existing resume to automatically import your profile information.
                </p>

                {!selectedFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Select your resume file
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Currently supports TXT files only (PDF and DOCX coming soon)
                    </p>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleParseResume}
                          disabled={isUploading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Parsing...
                            </>
                          ) : (
                            'Parse Resume'
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedFile(null)}
                          disabled={isUploading}
                          className="p-2 text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'review' && parsedData && (
              <div>
                <p className="text-gray-600 mb-6">
                  Review the extracted information below. This will replace your existing profile data.
                </p>

                <div className="space-y-6">
                  {/* Contact Info Preview */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p><strong>Name:</strong> {parsedData.contact.name}</p>
                      <p><strong>Email:</strong> {parsedData.contact.email}</p>
                      <p><strong>Phone:</strong> {parsedData.contact.phone}</p>
                      <p><strong>Location:</strong> {parsedData.contact.location}</p>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  {parsedData.skills.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Skills ({parsedData.skills.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {parsedData.skills.slice(0, 10).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                        {parsedData.skills.length > 10 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{parsedData.skills.length - 10} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Work Experience Preview */}
                  {parsedData.workExperience.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Work Experience ({parsedData.workExperience.length})</h3>
                      <div className="space-y-2">
                        {parsedData.workExperience.map((exp, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p className="font-medium">{exp.position} at {exp.company}</p>
                            <p className="text-gray-600">{exp.location} • {exp.type}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education Preview */}
                  {parsedData.education.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Education ({parsedData.education.length})</h3>
                      <div className="space-y-2">
                        {parsedData.education.map((edu, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p className="font-medium">{edu.degree} in {edu.field}</p>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects Preview */}
                  {parsedData.projects.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Projects ({parsedData.projects.length})</h3>
                      <div className="space-y-2">
                        {parsedData.projects.map((project, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p className="font-medium">{project.name}</p>
                            <p className="text-gray-600">{project.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setStep('upload')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveToProfile}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Import to Profile
                  </button>
                </div>
              </div>
            )}

            {step === 'saving' && (
              <div className="text-center py-8">
                <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-900">Importing your data...</p>
                <p className="text-gray-600">This may take a few moments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}