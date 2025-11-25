'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, X, Trash2 } from 'lucide-react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { AddSkillsModal } from './AddSkillsModal'
import { ConfirmDialog } from '../ui/confirm-dialog'
import type { StylesConfig, GroupBase, SingleValue } from 'react-select'

interface Skill {
  id: string
  name: string
}

interface SkillCategory {
  id: string
  name: string
}

interface CategorizedSkill {
  category: SkillCategory
  skills: Skill[]
}

interface OptionType {
  value: string
  label: string
  __isNew__?: boolean
}

// Compact select styles for quick-add inputs
const quickAddStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#94a3b8' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #94a3b8' : 'none',
    '&:hover': {
      borderColor: '#94a3b8',
    },
    minHeight: '32px',
    fontSize: '13px',
    backgroundColor: '#f9fafb',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 8px',
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f1f5f9' : 'white',
    color: '#374151',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '8px 12px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '13px',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    display: 'none',
  }),
}

export default function SkillsSection() {
  const [categorizedSkills, setCategorizedSkills] = useState<CategorizedSkill[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ categoryId: string; categoryName: string } | null>(null)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const supabase = createClient()

  const loadUserSkills = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_skills')
        .select('skill_id, category_id, skills(id, name), skill_categories(id, name)')
        .eq('user_id', user.id)

      if (!error && data) {
        const categoryMap = new Map<string, CategorizedSkill>()

        data.forEach(item => {
          const skill = item.skills as unknown as Skill | null
          const category = item.skill_categories as unknown as SkillCategory | null

          if (skill && category) {
            if (!categoryMap.has(category.id)) {
              categoryMap.set(category.id, {
                category: { id: category.id, name: category.name },
                skills: []
              })
            }
            categoryMap.get(category.id)?.skills.push(skill)
          }
        })

        setCategorizedSkills(Array.from(categoryMap.values()))
      }
    } catch (error) {
      console.error('Error loading user skills:', error)
    }
  }, [supabase])

  useEffect(() => {
    loadUserSkills()
  }, [loadUserSkills])

  const loadSkillsForQuickAdd = useCallback(async (inputValue: string): Promise<OptionType[]> => {
    if (!inputValue || inputValue.length < 1) return []

    const { data } = await supabase
      .from('skills')
      .select('id, name')
      .ilike('name', `%${inputValue}%`)
      .limit(10)

    return data?.map(s => ({ value: s.id, label: s.name })) || []
  }, [supabase])

  const handleQuickAddSkill = async (categoryId: string, option: SingleValue<OptionType>) => {
    if (!option) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let skillId = option.value

      // Create skill if new
      if (option.__isNew__) {
        const { data: newSkill, error: skillError } = await supabase
          .from('skills')
          .insert({ name: option.label })
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
        await loadUserSkills()
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleRemoveSkill = async (skillId: string, categoryId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .eq('category_id', categoryId)

      if (!error) {
        await loadUserSkills()
      }
    } catch (error) {
      console.error('Error removing skill:', error)
    }
  }

  const handleRemoveCategory = async () => {
    if (!deleteConfirm) return

    setDeletingCategory(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('category_id', deleteConfirm.categoryId)

      if (!error) {
        await loadUserSkills()
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Error removing category:', error)
    } finally {
      setDeletingCategory(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </button>
      </div>

      {categorizedSkills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Click &quot;Add Category&quot; to get started
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categorizedSkills.map(({ category, skills }) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-800">{category.name}</h3>
                <button
                  onClick={() => setDeleteConfirm({ categoryId: category.id, categoryName: category.name })}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map(skill => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill.name}
                    <button
                      onClick={() => handleRemoveSkill(skill.id, category.id)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <AsyncCreatableSelect<OptionType, false>
                key={`quick-add-${category.id}`}
                cacheOptions
                loadOptions={loadSkillsForQuickAdd}
                onChange={(option) => handleQuickAddSkill(category.id, option)}
                placeholder="Add skill to this category..."
                formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                styles={quickAddStyles}
                value={null}
                noOptionsMessage={() => 'Type to search skills...'}
              />
            </div>
          ))}
        </div>
      )}

      <AddSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadUserSkills}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleRemoveCategory}
        title="Remove Category"
        message={`Are you sure you want to remove "${deleteConfirm?.categoryName}" and all its skills from your profile?`}
        confirmText="Remove"
        type="danger"
        loading={deletingCategory}
      />
    </div>
  )
}
