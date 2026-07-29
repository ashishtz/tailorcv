'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types/database'
import { Save, Upload } from 'lucide-react'
import { LinkedInIcon, GitHubIcon, StackOverflowIcon } from '@/components/icons/SocialIcons'
import SkillsSection from '@/components/profile/SkillsSection'
import WorkExperienceSection from '@/components/profile/WorkExperienceSection'
import EducationSection from '@/components/profile/EducationSection'
import ProjectsSection from '@/components/profile/ProjectsSection'
import { ImportResumeModal } from '@/components/profile/ImportResumeModal'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const supabase = createClient()

  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return data && !error ? data : null
    } catch (error) {
      console.error('Error fetching profile data:', error)
      return null
    }
  }, [supabase])

  const loadProfileData = useCallback(async () => {
    const data = await fetchProfile()
    if (data) setProfile(data)
    setLoading(false)
  }, [fetchProfile])

  useEffect(() => {
    let active = true
    fetchProfile().then((data) => {
      if (!active) return
      if (data) setProfile(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchProfile])

  const handleImportSuccess = () => {
    // Reload the profile data after successful import
    loadProfileData()
  }


  const updateProfile = async (updates: Partial<Profile>) => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (!error) {
        setProfile(prev => prev ? { ...prev, ...updates } : null)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      alert('Password updated successfully!')
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Error updating password')
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import from Resume
          </button>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="first_name"
                  value={profile?.first_name || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, first_name: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={profile?.last_name || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, last_name: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile?.email || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={profile?.location || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                  Birthday
                </label>
                <input
                  type="date"
                  id="birthday"
                  value={profile?.birthday || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, birthday: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="linkedin_url" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    placeholder="https://linkedin.com/in/username"
                    value={profile?.linkedin_url || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, linkedin_url: e.target.value } : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="github_url" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <GitHubIcon className="w-4 h-4 text-gray-900" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    id="github_url"
                    placeholder="https://github.com/username"
                    value={profile?.github_url || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, github_url: e.target.value } : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="stackoverflow_url" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <StackOverflowIcon className="w-4 h-4 text-[#F48024]" />
                    StackOverflow
                  </label>
                  <input
                    type="url"
                    id="stackoverflow_url"
                    placeholder="https://stackoverflow.com/users/id"
                    value={profile?.stackoverflow_url || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, stackoverflow_url: e.target.value } : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => updateProfile(profile!)}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Skills Section */}
          <SkillsSection />

          {/* Work Experience Section */}
          <WorkExperienceSection />

          {/* Education Section */}
          <EducationSection />

          {/* Projects Section */}
          <ProjectsSection />

          {/* Password Change */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const newPassword = formData.get('newPassword') as string
              const confirmPassword = formData.get('confirmPassword') as string
              
              if (newPassword !== confirmPassword) {
                alert('Passwords do not match')
                return
              }
              
              handlePasswordChange('', newPassword)
            }} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-red-600 hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>

        <ImportResumeModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={handleImportSuccess}
        />
      </div>
    </div>
  )
}