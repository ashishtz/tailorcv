import { CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/brand/logo'

const HIGHLIGHTS = [
  'AI-tailored content for every job posting',
  'Six professional, ATS-friendly templates',
  'Instant PDF export that recruiters can read',
]

interface AuthShellProps {
  title: string
  subtitle: React.ReactNode
  children: React.ReactNode
}

/** Split-panel layout shared by all auth pages. */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <Logo tone="light" className="relative" />
        <div className="relative">
          <p className="font-display text-3xl font-bold leading-tight text-white">
            Craft resumes
            <br />
            that get read.
          </p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-brand-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-400" aria-hidden />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-300/70">
          © {new Date().getFullYear()} tailorcv
        </p>
      </div>

      {/* Form panel */}
      <main className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 font-display text-2xl font-bold tracking-tight text-stone-900 lg:mt-0">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-stone-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
