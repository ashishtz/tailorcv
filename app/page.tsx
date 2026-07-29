import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Target,
  FileText,
  ArrowRight,
  Layout,
  Palette,
  Bot,
  ClipboardList,
  Download,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LandingHeader } from '@/components/landing/header'
import { TemplateThumbnail } from '@/components/landing/template-thumbnail'
import { Logo } from '@/components/brand/logo'
import { Button } from '@/components/ui/button'
import { RESUME_TEMPLATES } from '@/lib/templates'

const FEATURES = [
  {
    icon: Bot,
    title: 'AI-tailored content',
    description:
      'Paste a job description and get resume content written around its actual requirements and keywords.',
  },
  {
    icon: Sparkles,
    title: 'Smart highlighting',
    description:
      'The skills and experience that matter most for the role are surfaced and emphasized automatically.',
  },
  {
    icon: Layout,
    title: 'Seven real templates',
    description:
      'From understated Classic to LaTeX-style Jake - every template is built for readability first.',
  },
  {
    icon: Target,
    title: 'ATS-friendly output',
    description:
      'Plain-text-parseable structure, standard section names, no icon soup - built to pass tracking systems.',
  },
  {
    icon: Zap,
    title: 'Minutes, not evenings',
    description:
      'Your profile is entered once. Each new application is a paste, a click, and a download.',
  },
  {
    icon: Palette,
    title: 'Your format, your call',
    description:
      'Bullets or paragraphs per section, optional highlighting - you control how dense the page reads.',
  },
]

const STEPS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Build your profile',
    description:
      'Add your experience, education, skills, and projects once - or import them from an existing resume.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Paste the job description',
    description:
      'Drop in the posting you are applying for and choose how strictly the AI should stick to your data.',
  },
  {
    icon: Download,
    step: '03',
    title: 'Generate and export',
    description:
      'Review the tailored resume, pick a template, and download a clean PDF ready to send.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ctaHref = user ? '/dashboard' : '/auth/register'

  return (
    <div className="min-h-screen bg-stone-50">
      <LandingHeader isAuthenticated={!!user} />

      {/* Hero */}
      <section className="px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI-assisted resume writing
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl">
            Craft resumes
            <br />
            that get <span className="text-brand-600">read.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-stone-600">
            One profile. Any job posting. Resume Builder tailors an ATS-friendly resume to each
            application in minutes - with templates recruiters actually enjoy reading.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={ctaHref}>
              <Button size="lg">
                {user ? 'Go to dashboard' : "Start building - it's free"}
                <ArrowRight aria-hidden />
              </Button>
            </Link>
            <a href="#templates">
              <Button size="lg" variant="secondary">
                Browse templates
              </Button>
            </a>
          </div>
        </div>

        {/* Hero preview strip */}
        <div className="mx-auto mt-16 flex max-w-5xl justify-center gap-6 overflow-hidden px-2">
          {['classic', 'modern', 'professional'].map((id, i) => (
            <div
              key={id}
              className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg ${
                i === 1 ? 'hidden sm:block' : i === 2 ? 'hidden lg:block' : ''
              }`}
            >
              <TemplateThumbnail templateId={id} width={288} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Everything the job hunt actually needs
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              No gimmicks - just the tools that turn one profile into strong, targeted applications.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-stone-200 bg-stone-50/50 p-6 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                  <feature.icon className="h-5 w-5 text-white" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Three steps to your next application
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.step} className="relative rounded-xl border border-stone-200 bg-white p-6">
                <span
                  className="font-display text-4xl font-bold text-stone-200"
                  aria-hidden
                >
                  {step.step}
                </span>
                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <step.icon className="h-5 w-5 text-brand-600" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-stone-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-y border-stone-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Templates for every kind of role
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Live previews of the exact documents you can generate - not mockups.
            </p>
          </div>
          <div className="mt-14 grid justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {RESUME_TEMPLATES.map((template) => (
              <div key={template.id} className="w-fit">
                <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm transition-shadow hover:shadow-lg">
                  <TemplateThumbnail templateId={template.id} width={264} />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-stone-900">
                  {template.name}
                </h3>
                <p className="mt-0.5 max-w-[264px] text-sm text-stone-500">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-brand-950 px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your next application, done properly.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-brand-200">
            Free to start. Set up your profile once and generate a tailored resume for the next
            posting you find.
          </p>
          <Link href={ctaHref} className="mt-8 inline-block">
            <Button size="lg" className="bg-white text-brand-900 hover:bg-brand-50 active:bg-brand-100">
              {user ? 'Go to dashboard' : 'Create your account'}
              <ArrowRight aria-hidden />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Logo />
          <nav className="flex gap-6" aria-label="Footer">
            <a href="#features" className="text-sm text-stone-500 hover:text-stone-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-stone-500 hover:text-stone-900">
              How it works
            </a>
            <a href="#templates" className="text-sm text-stone-500 hover:text-stone-900">
              Templates
            </a>
          </nav>
          <p className="flex items-center gap-1.5 text-sm text-stone-400">
            <FileText className="h-4 w-4" aria-hidden />© {new Date().getFullYear()} Resume Builder
          </p>
        </div>
      </footer>
    </div>
  )
}
