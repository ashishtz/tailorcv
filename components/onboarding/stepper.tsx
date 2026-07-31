'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { name: 'Personal', href: '/onboarding' },
  { name: 'Skills', href: '/onboarding/skills' },
  { name: 'Experience', href: '/onboarding/work-experience' },
  { name: 'Education', href: '/onboarding/education' },
  { name: 'Projects', href: '/onboarding/projects' },
] as const

/**
 * Progress indicator for the onboarding flow. The active step derives from
 * the pathname, so it survives reloads and needs no context state.
 * Completed steps are links back to their page.
 */
export function OnboardingStepper() {
  const pathname = usePathname()
  const matched = STEPS.findIndex((step) => step.href === pathname)
  const activeIndex = matched === -1 ? 0 : matched
  const activeStep = STEPS[activeIndex]

  return (
    <nav aria-label="Onboarding progress">
      {/* Small screens: compact summary + progress track */}
      <div className="md:hidden">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Step {activeIndex + 1} of {STEPS.length}
        </p>
        <p className="mt-0.5 font-display text-lg font-semibold text-stone-900">
          {activeStep.name}
        </p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-stone-200" aria-hidden>
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-200 motion-reduce:transition-none"
            style={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 768px+: full horizontal stepper */}
      <ol className="hidden items-center gap-2 md:flex">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive = index === activeIndex
          return (
            <li
              key={step.href}
              className={cn('flex items-center gap-2', index < STEPS.length - 1 && 'flex-1')}
            >
              {isCompleted ? (
                <Link
                  href={step.href}
                  className="group -mx-1.5 flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors duration-150 hover:bg-stone-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">
                    {step.name}
                  </span>
                  <span className="sr-only">(completed, go back to this step)</span>
                </Link>
              ) : (
                <span
                  aria-current={isActive ? 'step' : undefined}
                  className="flex items-center gap-2"
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
                      isActive
                        ? 'border-2 border-brand-600 bg-brand-50 text-brand-700'
                        : 'border border-stone-300 bg-white text-stone-500'
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      'text-sm',
                      isActive ? 'font-semibold text-stone-900' : 'text-stone-500'
                    )}
                  >
                    {step.name}
                  </span>
                </span>
              )}
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'h-px min-w-3 flex-1',
                    index < activeIndex ? 'bg-brand-500' : 'bg-stone-200'
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
