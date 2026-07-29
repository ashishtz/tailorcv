'use client'

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lightbulb, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding, type SkillDraft } from '@/lib/contexts/onboarding-context'
import { StepShell, StepSkeleton } from '@/components/onboarding/step-shell'
import { Card, CardBody } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

interface SkillErrors {
  category?: string
  skill?: string
}

export function SkillsStep() {
  const { hydrated } = useOnboarding()
  if (!hydrated) return <StepSkeleton />
  return <SkillsForm />
}

/** Rendered only after the draft has hydrated, so initial state is safe. */
function SkillsForm() {
  const { data, updateData } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()
  const categoryListId = useId()

  const skills = data.skills
  const [category, setCategory] = useState('')
  const [skillName, setSkillName] = useState('')
  const [errors, setErrors] = useState<SkillErrors>({})
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  const fetchCategories = useCallback(async (): Promise<string[]> => {
    const { data: rows, error } = await supabase
      .from('skill_categories')
      .select('name')
      .order('name')
    if (error || !rows) return []
    return (rows as Array<{ name: string | null }>).map((row) => row.name ?? '').filter(Boolean)
  }, [supabase])

  useEffect(() => {
    let active = true
    fetchCategories().then((names) => {
      if (active) setCategoryOptions(names)
    })
    return () => {
      active = false
    }
  }, [fetchCategories])

  const searchSkills = useCallback(
    async (query: string): Promise<string[]> => {
      if (query.length < 2) return []
      const { data: rows, error } = await supabase
        .from('skills')
        .select('name')
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(6)
      if (error || !rows) return []
      return (rows as Array<{ name: string | null }>).map((row) => row.name ?? '').filter(Boolean)
    },
    [supabase]
  )

  // Debounced (300ms) suggestion search against the shared skills table.
  useEffect(() => {
    let active = true
    const query = skillName.trim()
    const timer = window.setTimeout(() => {
      searchSkills(query).then((names) => {
        if (active) setSuggestions(names)
      })
    }, 300)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [skillName, searchSkills])

  const addedNames = useMemo(
    () => new Set(skills.map((skill) => skill.skillName.toLowerCase())),
    [skills]
  )
  const visibleSuggestions = suggestions.filter((name) => !addedNames.has(name.toLowerCase()))

  const groups = useMemo(() => {
    const map = new Map<string, SkillDraft[]>()
    for (const skill of skills) {
      const list = map.get(skill.categoryName)
      if (list) list.push(skill)
      else map.set(skill.categoryName, [skill])
    }
    return Array.from(map.entries())
  }, [skills])

  const addSkill = (rawName: string) => {
    const name = rawName.trim()
    const categoryName = category.trim()
    const nextErrors: SkillErrors = {}
    if (!categoryName) {
      nextErrors.category = 'Add a category so the skill is grouped on your profile.'
    }
    if (!name) {
      nextErrors.skill = 'Type a skill to add.'
    } else if (addedNames.has(name.toLowerCase())) {
      nextErrors.skill = `"${name}" is already in your list.`
    }
    setErrors(nextErrors)
    if (nextErrors.category || nextErrors.skill) return

    updateData({ skills: [...skills, { skillName: name, categoryName }] })
    setSkillName('')
  }

  const removeSkill = (target: SkillDraft) => {
    updateData({
      skills: skills.filter(
        (skill) =>
          !(skill.skillName === target.skillName && skill.categoryName === target.categoryName)
      ),
    })
  }

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addSkill(skillName)
  }

  return (
    <StepShell
      title="Add your skills"
      description="Group skills the way you want them to read on a resume — languages, frameworks, tools."
      backHref="/onboarding"
      onContinue={() => router.push('/onboarding/work-experience')}
    >
      <div className="space-y-4">
        <Card>
          <CardBody>
            <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <Field
                label="Category"
                error={errors.category}
                hint="Pick an existing one or create your own."
              >
                <Input
                  list={categoryListId}
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  placeholder="e.g. Programming languages"
                />
              </Field>
              <Field label="Skill" error={errors.skill}>
                <Input
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  placeholder="e.g. TypeScript"
                />
              </Field>
              <div className="sm:pt-[26px]">
                <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                  <Plus aria-hidden />
                  Add
                </Button>
              </div>
            </form>
            <datalist id={categoryListId}>
              {categoryOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>

            {visibleSuggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-500">Suggestions:</span>
                {visibleSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => addSkill(name)}
                    className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {skills.length === 0 ? (
          <div className="flex items-start gap-3 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-4">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
            <p className="text-sm text-stone-500">
              No skills yet — you can continue and add them later from your profile, but a few
              strong ones help the AI write better resumes.
            </p>
          </div>
        ) : (
          <Card>
            <CardBody className="space-y-5">
              {groups.map(([categoryName, groupSkills]) => (
                <div key={categoryName}>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {categoryName}
                  </h2>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {groupSkills.map((skill) => (
                      <li key={skill.skillName}>
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1.5 text-sm font-medium text-brand-700">
                          {skill.skillName}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove ${skill.skillName}`}
                            className="rounded-full p-0.5 text-brand-500 transition-colors duration-150 hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    </StepShell>
  )
}
