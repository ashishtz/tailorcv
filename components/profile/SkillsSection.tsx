'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Search } from 'lucide-react'

interface Skill {
  id: string
  name: string
}

export default function SkillsSection() {
  const [userSkills, setUserSkills] = useState<Skill[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadUserSkills()
    loadAllSkills()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserSkills = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_skills')
        .select('skill_id, skills(id, name)')
        .eq('user_id', user.id)

      if (!error && data) {
        const skills = data
          .map(item => {
            const skillData = item.skills as unknown
            return skillData && typeof skillData === 'object' && skillData !== null && 'id' in skillData && 'name' in skillData
              ? skillData as Skill
              : null
          })
          .filter((skill): skill is Skill => skill !== null)
        setUserSkills(skills)
      }
    } catch (error) {
      console.error('Error loading user skills:', error)
    }
  }

  const loadAllSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name')

      if (!error && data) {
        setAllSkills(data)
      }
    } catch (error) {
      console.error('Error loading all skills:', error)
    }
  }

  const addSkillToUser = async (skill: Skill) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: skill.id })

      if (!error) {
        setUserSkills([...userSkills, skill])
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const removeSkillFromUser = async (skillId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId)

      if (!error) {
        setUserSkills(userSkills.filter(s => s.id !== skillId))
      }
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  const createNewSkill = async () => {
    if (!newSkillName.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert({ name: newSkillName.trim() })
        .select()
        .single()

      if (!error && data) {
        await addSkillToUser(data)
        setAllSkills([...allSkills, data].sort((a, b) => a.name.localeCompare(b.name)))
        setNewSkillName('')
        setIsAddingSkill(false)
        setSearchTerm('')
      }
    } catch (error) {
      console.error('Error creating skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !userSkills.some(us => us.id === skill.id)
  )

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <button
          onClick={() => setIsAddingSkill(!isAddingSkill)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Skill
        </button>
      </div>

      {isAddingSkill && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="mb-3">
            <label htmlFor="skill-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search or Create Skill
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="skill-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search existing skills..."
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
              />
            </div>
          </div>

          {searchTerm && filteredSkills.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Select from existing skills:</p>
              <div className="flex flex-wrap gap-2">
                {filteredSkills.slice(0, 10).map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => {
                      addSkillToUser(skill)
                      setSearchTerm('')
                      setIsAddingSkill(false)
                    }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchTerm && filteredSkills.length === 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">No skills found. Create a new one:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder={searchTerm}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-slate-400 focus:ring-slate-300 sm:text-sm"
                />
                <button
                  onClick={createNewSkill}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create & Add'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              setIsAddingSkill(false)
              setSearchTerm('')
              setNewSkillName('')
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {userSkills.length === 0 ? (
          <p className="text-gray-500 text-sm">No skills added yet</p>
        ) : (
          userSkills.map(skill => (
            <span
              key={skill.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 group"
            >
              {skill.name}
              <button
                onClick={() => removeSkillFromUser(skill.id)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  )
}