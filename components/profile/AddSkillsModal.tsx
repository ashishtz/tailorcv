'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import AsyncCreatableSelect from 'react-select/async-creatable'
import type { MultiValue, SingleValue } from 'react-select'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { singleSelectStyles, multiSelectStyles, type SkillOption } from './select-styles'
import { ensureCategoryId, ensureSkillId, searchNamedRows } from './skills-data'

interface AddSkillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const SEARCH_DEBOUNCE_MS = 300

export function AddSkillsModal({ isOpen, onClose, onSuccess }: AddSkillsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<SingleValue<SkillOption>>(null)
  const [selectedSkills, setSelectedSkills] = useState<MultiValue<SkillOption>>([])
  const [saving, setSaving] = useState(false)
  const categoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skillTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()
  const toast = useToast()

  const searchTable = useCallback(
    async (table: 'skills' | 'skill_categories', term: string): Promise<SkillOption[]> => {
      try {
        const rows = await searchNamedRows(supabase, table, term)
        return rows.map((row) => ({ value: row.id, label: row.name }))
      } catch (error) {
        toast.error('Search failed', error instanceof Error ? error.message : 'Please try again.')
        return []
      }
    },
    [supabase, toast]
  )

  // Debounced so a keystroke burst issues a single query; each select keeps
  // its own timer so pending searches never cancel each other.
  const loadCategoryOptions = useCallback(
    (term: string) =>
      new Promise<SkillOption[]>((resolve) => {
        if (categoryTimer.current) clearTimeout(categoryTimer.current)
        categoryTimer.current = setTimeout(() => {
          searchTable('skill_categories', term).then(resolve)
        }, SEARCH_DEBOUNCE_MS)
      }),
    [searchTable]
  )

  const loadSkillOptions = useCallback(
    (term: string) =>
      new Promise<SkillOption[]>((resolve) => {
        if (skillTimer.current) clearTimeout(skillTimer.current)
        skillTimer.current = setTimeout(() => {
          searchTable('skills', term).then(resolve)
        }, SEARCH_DEBOUNCE_MS)
      }),
    [searchTable]
  )

  const resetAndClose = () => {
    setSelectedCategory(null)
    setSelectedSkills([])
    onClose()
  }

  const handleSubmit = async () => {
    if (!selectedCategory || selectedSkills.length === 0) return
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You are signed out. Sign in again to add skills.')

      const categoryId = selectedCategory.__isNew__
        ? await ensureCategoryId(supabase, selectedCategory.label)
        : selectedCategory.value

      const rows: Array<{ user_id: string; skill_id: string; category_id: string }> = []
      for (const option of selectedSkills) {
        const skillId = option.__isNew__
          ? await ensureSkillId(supabase, option.label)
          : option.value
        rows.push({ user_id: user.id, skill_id: skillId, category_id: categoryId })
      }

      // A user links each skill once (PK user_id + skill_id); upserting moves
      // an already-linked skill into the chosen category instead of erroring.
      const { error } = await supabase
        .from('user_skills')
        .upsert(rows, { onConflict: 'user_id,skill_id' })
      if (error) throw new Error(error.message)

      toast.success(
        `${rows.length} skill${rows.length === 1 ? '' : 's'} added to ${selectedCategory.label}`
      )
      onSuccess()
      resetAndClose()
    } catch (error) {
      toast.error(
        'Could not add the skills',
        error instanceof Error ? error.message : 'Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const menuPortalTarget = typeof document === 'undefined' ? undefined : document.body

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetAndClose}
      title="Add skills"
      description="Group related skills under a category, e.g. Languages or Frameworks."
      size="md"
      locked={saving}
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={saving}
            disabled={!selectedCategory || selectedSkills.length === 0}
          >
            Add skills
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="add-skills-category" className="block text-sm font-medium text-stone-700">
            Category
          </label>
          <AsyncCreatableSelect<SkillOption, false>
            inputId="add-skills-category"
            loadOptions={loadCategoryOptions}
            value={selectedCategory}
            onChange={(option) => setSelectedCategory(option)}
            placeholder="Search or create a category…"
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            noOptionsMessage={({ inputValue }) =>
              inputValue ? 'No matching categories' : 'Type to search categories…'
            }
            styles={singleSelectStyles}
            menuPortalTarget={menuPortalTarget}
            isClearable
            isDisabled={saving}
          />
          <p className="text-xs text-stone-500">
            Start typing to search existing categories or create a new one.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="add-skills-skills" className="block text-sm font-medium text-stone-700">
            Skills
          </label>
          <AsyncCreatableSelect<SkillOption, true>
            inputId="add-skills-skills"
            isMulti
            loadOptions={loadSkillOptions}
            value={selectedSkills}
            onChange={(options) => setSelectedSkills(options ?? [])}
            placeholder="Search or create skills…"
            formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
            noOptionsMessage={({ inputValue }) =>
              inputValue ? 'No matching skills' : 'Type to search skills…'
            }
            styles={multiSelectStyles}
            menuPortalTarget={menuPortalTarget}
            isDisabled={saving}
          />
          <p className="text-xs text-stone-500">
            Add several at once - pick from the list or create new ones.
          </p>
        </div>
      </div>
    </Modal>
  )
}
