'use client'

import { Field, Input, Select } from '@/components/ui/field'
import EnhanceTextarea from '@/components/ui/EnhanceTextarea'
import {
  DEGREES,
  JOB_TYPES,
  type Degree,
  type EducationDraft,
  type JobType,
  type ProjectDraft,
  type WorkExperienceDraft,
} from '@/lib/contexts/onboarding-context'
import { normalizeLink } from '@/lib/repositories/onboarding.repository'

export type FieldErrors<F> = Partial<Record<Extract<keyof F, string>, string>>

interface FieldsProps<F> {
  form: F
  onChange: (patch: Partial<F>) => void
  errors?: FieldErrors<F>
  /** Adds native `required` to required controls (profile sections rely on browser validation). */
  nativeRequired?: boolean
}

/** The work-experience form fields, shared by the profile section and the onboarding step. */
export function WorkFields({
  form,
  onChange,
  errors = {},
  nativeRequired,
}: FieldsProps<WorkExperienceDraft>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Company" required error={errors.company_name}>
        <Input
          required={nativeRequired}
          value={form.company_name}
          onChange={(e) => onChange({ company_name: e.target.value })}
          placeholder="e.g. Acme Corp"
        />
      </Field>
      <Field label="Position" required error={errors.position_title}>
        <Input
          required={nativeRequired}
          value={form.position_title}
          onChange={(e) => onChange({ position_title: e.target.value })}
          placeholder="e.g. Senior Software Engineer"
        />
      </Field>
      <Field label="Location">
        <Input
          value={form.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. Toronto, Canada"
        />
      </Field>
      <Field label="Job type">
        <Select
          value={form.job_type}
          onChange={(e) => onChange({ job_type: e.target.value as JobType | '' })}
        >
          <option value="">Select a type</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Start date" required error={errors.start_date}>
        <Input
          type="month"
          required={nativeRequired}
          value={form.start_date}
          onChange={(e) => onChange({ start_date: e.target.value })}
        />
      </Field>
      <div className="space-y-2.5">
        <Field label="End date" error={errors.end_date}>
          <Input
            type="month"
            value={form.end_date}
            disabled={form.is_current}
            onChange={(e) => onChange({ end_date: e.target.value })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={form.is_current}
            onChange={(e) =>
              onChange({
                is_current: e.target.checked,
                end_date: e.target.checked ? '' : form.end_date,
              })
            }
            className="h-4 w-4 accent-brand-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          />
          I currently work here
        </label>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description">
          <EnhanceTextarea
            value={form.description}
            onChange={(description) => onChange({ description })}
            rows={4}
            placeholder="Describe your responsibilities and achievements…"
            enhanceType="work_experience"
          />
        </Field>
      </div>
    </div>
  )
}

/** The education form fields, shared by the profile section and the onboarding step. */
export function EducationFields({
  form,
  onChange,
  errors = {},
  nativeRequired,
}: FieldsProps<EducationDraft>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Institution" required error={errors.institution_name}>
          <Input
            required={nativeRequired}
            value={form.institution_name}
            onChange={(e) => onChange({ institution_name: e.target.value })}
            placeholder="e.g. University of Toronto"
          />
        </Field>
      </div>
      <Field label="Degree">
        <Select
          value={form.degree}
          onChange={(e) => onChange({ degree: e.target.value as Degree | '' })}
        >
          <option value="">Select a degree</option>
          {DEGREES.map((degree) => (
            <option key={degree} value={degree}>
              {degree}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Field of study">
        <Input
          value={form.field_of_study}
          onChange={(e) => onChange({ field_of_study: e.target.value })}
          placeholder="e.g. Computer Science"
        />
      </Field>
      <Field label="Start date" required error={errors.start_date}>
        <Input
          type="month"
          required={nativeRequired}
          value={form.start_date}
          onChange={(e) => onChange({ start_date: e.target.value })}
        />
      </Field>
      <Field
        label="End date"
        error={errors.end_date}
        hint="Leave empty if you are currently studying."
      >
        <Input
          type="month"
          value={form.end_date}
          onChange={(e) => onChange({ end_date: e.target.value })}
        />
      </Field>
    </div>
  )
}

/** The project form fields, shared by the profile section and the onboarding step. */
export function ProjectFields({
  form,
  onChange,
  errors = {},
  nativeRequired,
}: FieldsProps<ProjectDraft>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Project name" required error={errors.project_name}>
        <Input
          required={nativeRequired}
          value={form.project_name}
          onChange={(e) => onChange({ project_name: e.target.value })}
          placeholder="e.g. E-commerce platform"
        />
      </Field>
      <Field label="Your role">
        <Input
          value={form.role_title}
          onChange={(e) => onChange({ role_title: e.target.value })}
          placeholder="e.g. Lead developer"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Link" hint="The https:// prefix is added for you if missing.">
          <Input
            inputMode="url"
            value={form.link}
            onChange={(e) => onChange({ link: e.target.value })}
            onBlur={() => onChange({ link: normalizeLink(form.link) })}
            placeholder="e.g. github.com/username/project"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Description">
          <EnhanceTextarea
            value={form.description}
            onChange={(description) => onChange({ description })}
            rows={4}
            placeholder="Describe the project, the technologies used and your contribution…"
            enhanceType="project"
          />
        </Field>
      </div>
    </div>
  )
}
