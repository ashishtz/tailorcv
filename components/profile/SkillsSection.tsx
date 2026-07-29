'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Tags, Trash2, X } from 'lucide-react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import type { SingleValue } from 'react-select'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { AddSkillsModal } from './AddSkillsModal'
import { compactSelectStyles, type SkillOption } from './select-styles'
import { ensureSkillId, searchNamedRows } from './skills-data'

interface SkillRow {
  id: string
  name: string
}

interface CategoryRow {
  id: string
  name: string
}

interface CategorizedSkills {
  category: CategoryRow
  skills: SkillRow[]
}

/** Shape of a user_skills row with its joined lookup rows. Supabase returns
 * joined relations as an object or an array depending on FK inference. */
interface UserSkillJoinRow {
  skill_id: string
  category_id: string | null
  skills: SkillRow | SkillRow[] | null
  skill_categories: CategoryRow | CategoryRow[] | null
}

function firstRow<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const SEARCH_DEBOUNCE_MS = 300

export default function SkillsSection() {
  const [categorizedSkills, setCategorizedSkills] = useState<CategorizedSkills[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quickAddBusy, setQuickAddBusy] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()
  const toast = useToast()

  const fetchUserSkills = useCallback(async (): Promise<CategorizedSkills[]> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('user_skills')
      .select('skill_id, category_id, skills(id, name), skill_categories(id, name)')
      .eq('user_id', user.id)

    if (error) {
      toast.error('Could not load skills', error.message)
      return []
    }

    const categoryMap = new Map<string, CategorizedSkills>()
    for (const row of (data ?? []) as UserSkillJoinRow[]) {
      const skill = firstRow(row.skills)
      const category = firstRow(row.skill_categories)
      if (!skill || !category) continue

      const entry = categoryMap.get(category.id) ?? { category, skills: [] }
      entry.skills.push(skill)
      categoryMap.set(category.id, entry)
    }

    const list = Array.from(categoryMap.values())
    list.sort((a, b) => a.category.name.localeCompare(b.category.name))
    for (const entry of list) {
      entry.skills.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [supabase, toast])

  const loadUserSkills = useCallback(async () => {
    setCategorizedSkills(await fetchUserSkills())
  }, [fetchUserSkills])

  useEffect(() => {
    let active = true
    fetchUserSkills().then((list) => {
      if (!active) return
      setCategorizedSkills(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchUserSkills])

  const searchSkills = useCallback(
    async (term: string): Promise<SkillOption[]> => {
      try {
        const rows = await searchNamedRows(supabase, 'skills', term)
        return rows.map((row) => ({ value: row.id, label: row.name }))
      } catch (error) {
        toast.error(
          'Skill search failed',
          error instanceof Error ? error.message : 'Please try again.'
        )
        return []
      }
    },
    [supabase, toast]
  )

  // Debounced so a keystroke burst issues a single query. Only the promise of
  // the latest keystroke resolves, which is exactly what react-select expects.
  const loadSkillOptions = useCallback(
    (term: string) =>
      new Promise<SkillOption[]>((resolve) => {
        if (searchTimer.current) clearTimeout(searchTimer.current)
        searchTimer.current = setTimeout(() => {
          searchSkills(term).then(resolve)
        }, SEARCH_DEBOUNCE_MS)
      }),
    [searchSkills]
  )

  const handleQuickAdd = async (category: CategoryRow, option: SingleValue<SkillOption>) => {
    if (!option) return
    setQuickAddBusy(category.id)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You are signed out. Sign in again to add skills.')

      const skillId = option.__isNew__
        ? await ensureSkillId(supabase, option.label)
        : option.value

      // A user links each skill at most once (PK user_id + skill_id), so the
      // existence check ignores the category and must tolerate zero rows.
      const { data: existingRow, error: existingError } = await supabase
        .from('user_skills')
        .select('category_id')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle()
      if (existingError) throw new Error(existingError.message)
      const existing = existingRow as { category_id: string | null } | null

      if (existing && existing.category_id === category.id) {
        toast.info('Already added', `"${option.label}" is already in ${category.name}.`)
        return
      }

      const { error } = await supabase
        .from('user_skills')
        .upsert(
          { user_id: user.id, skill_id: skillId, category_id: category.id },
          { onConflict: 'user_id,skill_id' }
        )
      if (error) throw new Error(error.message)

      toast.success(
        existing
          ? `"${option.label}" moved to ${category.name}`
          : `"${option.label}" added to ${category.name}`
      )
      await loadUserSkills()
    } catch (error) {
      toast.error(
        'Could not add the skill',
        error instanceof Error ? error.message : 'Please try again.'
      )
    } finally {
      setQuickAddBusy(null)
    }
  }

  const handleRemoveSkill = async (skill: SkillRow, category: CategoryRow) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You are signed out', 'Sign in again to remove skills.')
      return
    }

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', user.id)
      .eq('skill_id', skill.id)
      .eq('category_id', category.id)

    if (error) {
      toast.error('Could not remove the skill', error.message)
      return
    }

    toast.success(`"${skill.name}" removed`)
    await loadUserSkills()
  }

  const handleRemoveCategory = async () => {
    if (!deleteTarget) return
    setDeletingCategory(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setDeletingCategory(false)
      toast.error('You are signed out', 'Sign in again to remove the category.')
      return
    }

    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', user.id)
      .eq('category_id', deleteTarget.id)

    setDeletingCategory(false)
    if (error) {
      toast.error('Could not remove the category', error.message)
      return
    }

    toast.success(`"${deleteTarget.name}" removed`)
    setDeleteTarget(null)
    await loadUserSkills()
  }

  return (
    <Card>
      <CardHeader
        title="Skills"
        description="Grouped into categories, the way they appear on resumes."
        actions={
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus aria-hidden />
            Add skills
          </Button>
        }
      />

      {loading ? (
        <CardBody>
          <SkeletonRows rows={2} />
        </CardBody>
      ) : categorizedSkills.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No skills yet"
          description="Create a category like Languages or Frameworks, then add skills to it."
          action={
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus aria-hidden />
              Add skills
            </Button>
          }
        />
      ) : (
        <CardBody className="space-y-4">
          {categorizedSkills.map(({ category, skills }) => (
            <div key={category.id} className="rounded-lg border border-stone-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-stone-800">{category.name}</h3>
                <Button
                  variant="danger-ghost"
                  size="icon-sm"
                  aria-label={`Remove category ${category.name}`}
                  onClick={() => setDeleteTarget(category)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>

              {skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill.id} variant="brand" className="gap-1 py-1 pr-1">
                      {skill.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill, category)}
                        aria-label={`Remove ${skill.name} from ${category.name}`}
                        className="rounded-full p-0.5 text-brand-600 transition-colors hover:bg-brand-100 hover:text-brand-800 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600"
                      >
                        <X className="h-3 w-3" aria-hidden />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-3 max-w-xs">
                <AsyncCreatableSelect<SkillOption, false>
                  loadOptions={loadSkillOptions}
                  onChange={(option) => handleQuickAdd(category, option)}
                  value={null}
                  placeholder="Add a skill…"
                  aria-label={`Add a skill to ${category.name}`}
                  formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue ? 'No matching skills' : 'Type to search skills…'
                  }
                  styles={compactSelectStyles}
                  menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
                  isDisabled={quickAddBusy === category.id}
                  isLoading={quickAddBusy === category.id}
                />
              </div>
            </div>
          ))}
        </CardBody>
      )}

      <AddSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadUserSkills}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleRemoveCategory}
        title="Remove category"
        message={`"${deleteTarget?.name}" and all the skills inside it will be removed from your profile.`}
        confirmText="Remove"
        type="danger"
        loading={deletingCategory}
      />
    </Card>
  )
}
