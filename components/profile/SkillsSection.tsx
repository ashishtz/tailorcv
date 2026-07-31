'use client'

import { useState, useEffect, useCallback, useId } from 'react'
import { createClient, requireSessionUser } from '@/lib/supabase/client'
import { Plus, Tags, Trash2, X } from 'lucide-react'
import { Card, CardHeader, CardBody } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { SkeletonRows } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { SuggestInput } from '@/components/forms/suggest-input'
import { ensureSkillId, searchNames } from '@/lib/repositories/onboarding.repository'
import { AddSkillsModal } from './AddSkillsModal'

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

/** Search-or-create input that adds one skill to a category on submit. */
function QuickAddSkill({
  category,
  busy,
  search,
  onAdd,
}: {
  category: CategoryRow
  busy: boolean
  search: (term: string) => Promise<string[]>
  onAdd: (name: string) => Promise<void>
}) {
  const [name, setName] = useState('')
  const hintId = useId()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setName('')
    await onAdd(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex max-w-xs gap-2">
      <SuggestInput
        value={name}
        onChange={setName}
        search={search}
        placeholder="Add a skill…"
        aria-label={`Add a skill to ${category.name}`}
        disabled={busy}
      />
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        disabled={busy || !name.trim()}
        aria-describedby={hintId}
      >
        Add
      </Button>
      <span id={hintId} className="sr-only">
        Type a skill name to add
      </span>
    </form>
  )
}

export default function SkillsSection() {
  const [categorizedSkills, setCategorizedSkills] = useState<CategorizedSkills[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quickAddBusy, setQuickAddBusy] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null)
  const [deletingCategory, setDeletingCategory] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const fetchUserSkills = useCallback(async (): Promise<CategorizedSkills[]> => {
    const user = await requireSessionUser(supabase)
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
    async (term: string): Promise<string[]> => {
      try {
        return await searchNames(supabase, 'skills', term)
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

  const handleQuickAdd = async (category: CategoryRow, name: string) => {
    setQuickAddBusy(category.id)
    try {
      const user = await requireSessionUser(supabase)
      if (!user) throw new Error('You are signed out. Sign in again to add skills.')

      // Find-or-create by name, so picking a suggestion and typing a brand
      // new skill go through the same path.
      const skillId = await ensureSkillId(supabase, name)

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
        toast.info('Already added', `"${name}" is already in ${category.name}.`)
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
        existing ? `"${name}" moved to ${category.name}` : `"${name}" added to ${category.name}`
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
    const user = await requireSessionUser(supabase)
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

    const user = await requireSessionUser(supabase)
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

              <QuickAddSkill
                category={category}
                busy={quickAddBusy === category.id}
                search={searchSkills}
                onAdd={(name) => handleQuickAdd(category, name)}
              />
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
        loading={deletingCategory}
      />
    </Card>
  )
}
