import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  ArrowRight,
  Sparkles,
  Plus,
  CircleCheck,
  Circle,
  Layout,
} from 'lucide-react'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button-variants'
import { formatMonthYear } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Real data for real stats - the old page hardcoded "0 resumes" and
  // "Profile Complete" regardless of state.
  const [profileResult, resumesResult, workCount, eduCount, skillCount] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase
      .from('resumes')
      .select('id, job_title, template_id, mode, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('work_experiences').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('education').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('user_skills').select('skill_id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const profile = profileResult.data
  const resumes = resumesResult.data ?? []
  const recentResumes = resumes.slice(0, 4)

  const checklist = [
    {
      label: 'Personal details',
      done: Boolean(profile?.first_name && profile?.last_name),
      href: '/dashboard/profile',
    },
    { label: 'Work experience', done: (workCount.count ?? 0) > 0, href: '/dashboard/profile' },
    { label: 'Education', done: (eduCount.count ?? 0) > 0, href: '/dashboard/profile' },
    { label: 'Skills', done: (skillCount.count ?? 0) > 0, href: '/dashboard/profile' },
  ]
  const completed = checklist.filter((c) => c.done).length
  const profileReady = completed === checklist.length

  const firstName = profile?.first_name ?? null

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-stone-900">
              {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Generate a tailored resume for your next application.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/dashboard/documents/new" className={buttonVariants({})}>
              <Plus aria-hidden />
              New resume
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Resumes created</p>
                <p className="mt-1 font-display text-3xl font-bold text-stone-900">
                  {resumes.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                <FileText className="h-5 w-5 text-brand-600" aria-hidden />
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">Profile readiness</p>
                <p className="mt-1 font-display text-3xl font-bold text-stone-900">
                  {completed}/{checklist.length}
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50">
                <CircleCheck className="h-5 w-5 text-brand-600" aria-hidden />
              </div>
            </CardBody>
          </Card>
          <Card className="border-accent-200 bg-accent-50/60">
            <CardBody className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-800">AI assistance</p>
                <Link
                  href="/dashboard/documents/new"
                  className="mt-1 inline-flex items-center gap-1.5 font-display text-base font-semibold text-accent-900 hover:underline"
                >
                  Generate a resume
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-100">
                <Sparkles className="h-5 w-5 text-accent-700" aria-hidden />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent resumes */}
          <Card className="lg:col-span-3">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
              <h2 className="font-display text-base font-semibold text-stone-900">
                Recent resumes
              </h2>
              {resumes.length > 0 && (
                <Link
                  href="/dashboard/documents"
                  className="text-sm font-medium text-brand-700 hover:underline"
                >
                  View all
                </Link>
              )}
            </div>
            {recentResumes.length === 0 ? (
              <CardBody className="py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
                  <FileText className="h-5 w-5 text-brand-600" aria-hidden />
                </div>
                <p className="mt-3 text-sm font-medium text-stone-900">No resumes yet</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-stone-500">
                  {profileReady
                    ? 'Your profile is ready - generate your first tailored resume.'
                    : 'Finish your profile, then generate your first tailored resume.'}
                </p>
                <Link
                  href={profileReady ? '/dashboard/documents/new' : '/dashboard/profile'}
                  className={`${buttonVariants({ size: 'sm' })} mt-4`}
                >
                  {profileReady ? 'Generate resume' : 'Complete profile'}
                </Link>
              </CardBody>
            ) : (
              <ul className="divide-y divide-stone-100">
                {recentResumes.map((resume) => (
                  <li key={resume.id}>
                    <Link
                      href={`/dashboard/documents/${resume.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-stone-50 sm:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                          <FileText className="h-4 w-4 text-brand-600" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-stone-900">
                            {resume.job_title}
                          </p>
                          <p className="text-xs text-stone-500">
                            {formatMonthYear(resume.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="brand" className="capitalize">
                          {resume.template_id}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-stone-300" aria-hidden />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Profile checklist */}
          <Card className="lg:col-span-2">
            <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
              <h2 className="font-display text-base font-semibold text-stone-900">
                Profile checklist
              </h2>
              <p className="mt-0.5 text-sm text-stone-500">
                {profileReady
                  ? 'Everything the AI needs is in place.'
                  : 'The more complete your profile, the better the resumes.'}
              </p>
            </div>
            <ul className="px-3 py-3">
              {checklist.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-stone-50"
                  >
                    {item.done ? (
                      <CircleCheck className="h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-stone-300" aria-hidden />
                    )}
                    <span className={item.done ? 'text-stone-500 line-through' : 'text-stone-800'}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone-200 px-5 py-4 sm:px-6">
              <div className="flex items-start gap-2.5 text-sm text-stone-600">
                <Layout className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden />
                <p>
                  <span className="font-medium text-stone-800">Strict mode</span> keeps the AI
                  inside your profile data; <span className="font-medium text-stone-800">free mode</span>{' '}
                  lets it embellish for the role.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
