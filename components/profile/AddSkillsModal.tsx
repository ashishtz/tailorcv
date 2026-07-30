'use client'

import { useState, useCallback, useId } from 'react'
import { createClient, requireSessionUser } from '@/lib/supabase/client'
import { Plus, X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Field } from '@/components/ui/field'
import { useToast } from '@/components/ui/toast'
import { SuggestInput } from '@/components/forms/suggest-input'
import { ensureCategoryId, ensureSkillId, searchNames } from '@/lib/repositories/onboarding.repository'

interface AddSkillsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddSkillsModal({ isOpen, onClose, onSuccess }: AddSkillsModalProps) {
  const [category, setCategory] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const submitHintId = useId()
  const addChipHintId = useId()
  const supabase = createClient()
  const toast = useToast()

  const searchTable = useCallback(
    async (table: 'skills' | 'skill_categories', term: string): Promise<string[]> => {
      try {
        return await searchNames(supabase, table, term)
      } catch (error) {
        toast.error('Search failed', error instanceof Error ? error.message : 'Please try again.')
        return []
      }
    },
    [supabase, toast]
  )
  const searchCategories = useCallback(
    (term: string) => searchTable('skill_categories', term),
    [searchTable]
  )
  const searchSkills = useCallback((term: string) => searchTable('skills', term), [searchTable])

  /** Skills staged for submit, including any text still sitting in the input. */
  const stagedSkills = () => {
    const pending = skillInput.trim()
    const all = pending ? [...skills, pending] : skills
    return Array.from(new Map(all.map((name) => [name.toLowerCase(), name])).values())
  }

  const addSkillChip = () => {
    const name = skillInput.trim()
    if (!name) return
    if (!skills.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
      setSkills([...skills, name])
    }
    setSkillInput('')
  }

  const removeSkillChip = (name: string) => {
    setSkills(skills.filter((existing) => existing !== name))
  }

  const resetAndClose = () => {
    setCategory('')
    setSkills([])
    setSkillInput('')
    onClose()
  }

  const canSubmit = category.trim().length > 0 && stagedSkills().length > 0

  const handleSubmit = async () => {
    const names = stagedSkills()
    const categoryName = category.trim()
    if (!categoryName || names.length === 0) return
    setSaving(true)

    try {
      const user = await requireSessionUser(supabase)
      if (!user) throw new Error('You are signed out. Sign in again to add skills.')

      // Find-or-create the category and every skill by name.
      const categoryId = await ensureCategoryId(supabase, categoryName)
      const rows: Array<{ user_id: string; skill_id: string; category_id: string }> = []
      for (const name of names) {
        rows.push({
          user_id: user.id,
          skill_id: await ensureSkillId(supabase, name),
          category_id: categoryId,
        })
      }

      // A user links each skill once (PK user_id + skill_id); upserting moves
      // an already-linked skill into the chosen category instead of erroring.
      const { error } = await supabase
        .from('user_skills')
        .upsert(rows, { onConflict: 'user_id,skill_id' })
      if (error) throw new Error(error.message)

      toast.success(`${rows.length} skill${rows.length === 1 ? '' : 's'} added to ${categoryName}`)
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
            disabled={!canSubmit}
            aria-describedby={!canSubmit ? submitHintId : undefined}
          >
            Add skills
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field
          label="Category"
          hint="Start typing to search existing categories or create a new one."
        >
          <SuggestInput
            value={category}
            onChange={setCategory}
            search={searchCategories}
            placeholder="Search or create a category…"
            disabled={saving}
          />
        </Field>

        <Field label="Skills" hint="Add several at once - pick from the list or create new ones.">
          <div className="flex gap-2">
            <SuggestInput
              value={skillInput}
              onChange={setSkillInput}
              search={searchSkills}
              placeholder="Search or create skills…"
              disabled={saving}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkillChip()
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addSkillChip}
              disabled={saving || !skillInput.trim()}
              aria-label="Add skill to the list"
              aria-describedby={addChipHintId}
            >
              <Plus aria-hidden />
            </Button>
            <span id={addChipHintId} className="sr-only">
              Type a skill name to add
            </span>
          </div>
        </Field>

        {!canSubmit && (
          <p id={submitHintId} className="text-xs text-stone-500">
            Enter a category and at least one skill to enable saving.
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((name) => (
              <Badge key={name} variant="brand" className="gap-1 py-1 pr-1">
                {name}
                <button
                  type="button"
                  onClick={() => removeSkillChip(name)}
                  aria-label={`Remove ${name}`}
                  className="rounded-full p-0.5 text-brand-600 transition-colors hover:bg-brand-100 hover:text-brand-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
