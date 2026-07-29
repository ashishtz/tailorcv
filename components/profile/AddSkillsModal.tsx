'use client'

import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { createClient } from '@/lib/supabase/client'
import type { StylesConfig, GroupBase } from 'react-select'

interface OptionType {
  value: string
  label: string
  __isNew__?: boolean
}

interface AddSkillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Custom styles to match the app's design system
const selectStyles: StylesConfig<OptionType, boolean, GroupBase<OptionType>> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#94a3b8' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #94a3b8' : 'none',
    '&:hover': {
      borderColor: '#94a3b8',
    },
    minHeight: '38px',
    fontSize: '14px',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#dbeafe',
    borderRadius: '9999px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#1e40af',
    fontSize: '14px',
    padding: '2px 8px',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#1e40af',
    borderRadius: '0 9999px 9999px 0',
    '&:hover': {
      backgroundColor: '#bfdbfe',
      color: '#1e40af',
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f1f5f9' : 'white',
    color: '#374151',
    fontSize: '14px',
    cursor: 'pointer',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '14px',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
}

export function AddSkillsModal({ isOpen, onClose, onSuccess }: AddSkillsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<readonly OptionType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const loadCategories = useCallback(async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue || inputValue.length < 1) return []

    const { data } = await supabase
      .from('skill_categories')
      .select('id, name')
      .ilike('name', `%${inputValue}%`)
      .limit(10)

    return data?.map(c => ({ value: c.id, label: c.name })) || []
  }, [supabase])

  const loadSkills = useCallback(async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue || inputValue.length < 1) return []

    const { data } = await supabase
      .from('skills')
      .select('id, name')
      .ilike('name', `%${inputValue}%`)
      .limit(10)

    return data?.map(s => ({ value: s.id, label: s.name })) || []
  }, [supabase])

  const handleSubmit = async () => {
    if (!selectedCategory || selectedSkills.length === 0) {
      setError('Please select a category and at least one skill')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get or create category
      let categoryId = selectedCategory.value
      if (selectedCategory.__isNew__) {
        const { data: newCategory, error: catError } = await supabase
          .from('skill_categories')
          .insert({ name: selectedCategory.label })
          .select()
          .single()

        if (catError) throw catError
        categoryId = newCategory.id
      }

      // Get or create skills, then link to user
      for (const skill of selectedSkills) {
        let skillId = skill.value
        if (skill.__isNew__) {
          const { data: newSkill, error: skillError } = await supabase
            .from('skills')
            .insert({ name: skill.label })
            .select()
            .single()

          if (skillError) throw skillError
          skillId = newSkill.id
        }

        // Check if already exists
        const { data: existing } = await supabase
          .from('user_skills')
          .select('skill_id')
          .eq('user_id', user.id)
          .eq('skill_id', skillId)
          .eq('category_id', categoryId)
          .single()

        if (!existing) {
          const { error: linkError } = await supabase
            .from('user_skills')
            .insert({
              user_id: user.id,
              skill_id: skillId,
              category_id: categoryId,
            })

          if (linkError) throw linkError
        }
      }

      // Reset and close
      setSelectedCategory(null)
      setSelectedSkills([])
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error adding skills:', err)
      setError('Failed to add skills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setSelectedSkills([])
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        <div className="relative bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Skills to Category</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <AsyncCreatableSelect<OptionType, false>
                cacheOptions
                loadOptions={loadCategories}
                value={selectedCategory}
                onChange={(option) => setSelectedCategory(option)}
                placeholder="Type to search or create category..."
                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                styles={selectStyles}
                isClearable
                isDisabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Start typing to search existing categories or create a new one
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <AsyncCreatableSelect<OptionType, true>
                isMulti
                cacheOptions
                loadOptions={loadSkills}
                value={selectedSkills}
                onChange={(options) => setSelectedSkills(options || [])}
                placeholder="Type to search or create skills..."
                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                styles={selectStyles}
                isDisabled={loading}
                noOptionsMessage={() => 'Type to search skills...'}
              />
              <p className="mt-1 text-xs text-gray-500">
                Add multiple skills at once - type and select or create new ones
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedCategory || selectedSkills.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-xs text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Skills'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
