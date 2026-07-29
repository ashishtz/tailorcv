import { createClient } from '@supabase/supabase-js'
import { landingSampleResume } from '../../lib/data/landing-sample'

/**
 * Demo account the whole suite signs in as. Seeded idempotently by
 * global.setup.ts via the service-role key (local stack only - never point
 * E2E at a production project).
 */
export const DEMO_USER = {
  email: process.env.E2E_EMAIL || 'demo@resume.test',
  password: process.env.E2E_PASSWORD || 'demo-password-123!',
}

export const SEEDED_RESUME_TITLE = 'Demo Seed Resume'
export const EDITOR_RESUME_TITLE = 'Editor Playground'

export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'E2E seed needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local ' +
        '(get both from `supabase status` while the local stack is running).'
    )
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

/** Create-or-fetch the demo user; returns its id. */
export async function ensureDemoUser(): Promise<string> {
  const admin = adminClient()

  const { data: created, error } = await admin.auth.admin.createUser({
    email: DEMO_USER.email,
    password: DEMO_USER.password,
    email_confirm: true,
  })
  if (created?.user) return await seedUserData(created.user.id)

  // Already exists - look it up. ponytail: listUsers scan, fine for a dev stack
  if (error && /already/i.test(error.message)) {
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const existing = data?.users.find((u) => u.email === DEMO_USER.email)
    if (existing) return await seedUserData(existing.id)
  }
  throw new Error(`Could not create or find demo user: ${error?.message}`)
}

/** Idempotent data seed: completed profile, some skills/experience, 2 resumes. */
async function seedUserData(userId: string): Promise<string> {
  const admin = adminClient()

  await admin.from('profiles').upsert({
    id: userId,
    email: DEMO_USER.email,
    first_name: 'Demo',
    last_name: 'User',
    phone: '555-010-0100',
    location: 'Testville, TS',
    onboarding_completed: true,
  })

  // One work experience so profile/generate specs have real content.
  const { data: existingExp } = await admin
    .from('work_experiences')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
  if (!existingExp?.length) {
    await admin.from('work_experiences').insert({
      user_id: userId,
      company_name: 'Seed Corp',
      position_title: 'Software Engineer',
      location: 'Remote',
      job_type: 'Full-Time',
      start_date: '2022-01-01',
      is_current: true,
      description: 'Built seeded features for end-to-end tests.',
    })
  }

  // Two resumes: one stable (view/preview/documents specs), one the editor
  // spec is free to mutate.
  for (const title of [SEEDED_RESUME_TITLE, EDITOR_RESUME_TITLE]) {
    const { data: existing } = await admin
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .eq('job_title', title)
      .limit(1)
    if (!existing?.length) {
      await admin.from('resumes').insert({
        user_id: userId,
        job_title: title,
        job_description: 'Seeded job description for E2E tests.',
        mode: 'strict',
        template_id: 'classic',
        generated_data: JSON.parse(JSON.stringify(landingSampleResume)),
        generation_settings: {
          summary_format: 'paragraph',
          work_experience_format: 'bullets',
          projects_format: 'bullets',
          highlight_important_content: false,
        },
      })
    }
  }

  return userId
}

/** Fetch a seeded resume id by title (for direct navigation in specs). */
export async function seededResumeId(title: string): Promise<string> {
  const admin = adminClient()
  const { data } = await admin
    .from('resumes')
    .select('id, user_id, job_title')
    .eq('job_title', title)
    .limit(1)
  if (!data?.length) throw new Error(`Seeded resume "${title}" not found - run the setup project first`)
  return data[0].id
}
