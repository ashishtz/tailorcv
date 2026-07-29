'use client'

import { useState, useEffect } from 'react'
import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import { Skill } from '@/lib/types/database'

export function SkillsStep() {
  const { data, updateSkills, setCurrentStep } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()
  
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(data.skills || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadSkills = async () => {
      const { data: skills, error } = await supabase
        .from('skills')
        .select('*')
        .order('name')
      
      if (!error && skills) {
        setAllSkills(skills)
      }
    }
    
    loadSkills()
  }, [supabase])


  const addNewSkill = async (skillName: string) => {
    setLoading(true)
    try {
      const { data: newSkill, error } = await supabase
        .from('skills')
        .insert({ name: skillName })
        .select()
        .single()
      
      if (!error && newSkill) {
        setAllSkills([...allSkills, newSkill])
        setSelectedSkills([...selectedSkills, newSkill])
        setSearchTerm('')
        setIsAddingNew(false)
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skill: Skill) => {
    const isSelected = selectedSkills.some(s => s.id === skill.id)
    if (isSelected) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const removeSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter(s => s.id !== skillId))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSkills(selectedSkills)
    setCurrentStep(3)
    router.push('/onboarding/work-experience')
  }

  const handleBack = () => {
    setCurrentStep(1)
    router.push('/onboarding')
  }

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.some(s => s.id === skill.id)
  )

  const shouldShowAddNew = searchTerm && 
    !allSkills.some(skill => skill.name.toLowerCase() === searchTerm.toLowerCase())

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Skills</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedSkills.length === 0 ? (
            <p className="text-gray-500">No skills selected yet</p>
          ) : (
            selectedSkills.map(skill => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div>
        <label htmlFor="skill-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search or Add Skills
        </label>
        <input
          type="text"
          id="skill-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for skills..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
        {filteredSkills.length > 0 ? (
          <div className="space-y-1">
            {filteredSkills.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill)}
                className="w-full text-left px-3 py-2 rounded-sm hover:bg-gray-100 transition-colors"
              >
                {skill.name}
              </button>
            ))}
          </div>
        ) : searchTerm ? (
          <p className="text-gray-500 text-center py-4">No skills found</p>
        ) : (
          <p className="text-gray-500 text-center py-4">Type to search skills</p>
        )}
        
        {shouldShowAddNew && (
          <div className="mt-2 pt-2 border-t">
            {isAddingNew ? (
              <div className="text-center py-2">
                <p className="text-sm text-gray-600 mb-2">Add &quot;{searchTerm}&quot; as a new skill?</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => addNewSkill(searchTerm)}
                    disabled={loading}
                    className="px-3 py-1 bg-blue-600 text-white rounded-sm text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-sm text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full text-left px-3 py-2 rounded-sm hover:bg-blue-50 text-blue-600"
              >
                + Add &quot;{searchTerm}&quot; as new skill
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-xs hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}