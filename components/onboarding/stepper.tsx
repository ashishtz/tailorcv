'use client'

import { useOnboarding } from '@/lib/contexts/onboarding-context'
import { Check } from 'lucide-react'

const steps = [
  { id: 1, name: 'Personal Information' },
  { id: 2, name: 'Skills' },
  { id: 3, name: 'Work Experience' },
  { id: 4, name: 'Education' },
  { id: 5, name: 'Projects' },
]

export function OnboardingStepper() {
  const { currentStep } = useOnboarding()

  return (
    <div className="mb-8">
      <nav aria-label="Progress" className="bg-white rounded-lg shadow-soft p-6">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="flex flex-col items-center flex-1 relative">
              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className={`absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 transition-all duration-500 ${
                    step.id < currentStep
                      ? 'bg-linear-to-r from-primary-600 to-primary-500'
                      : 'bg-gray-200'
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Step Circle */}
              <div className="relative z-10 mb-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-linear-to-br from-primary-600 to-primary-700 shadow-medium'
                      : step.id === currentStep
                      ? 'border-2 border-primary-600 bg-primary-50 shadow-soft'
                      : 'border-2 border-gray-300 bg-white'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-6 w-6 text-white" />
                  ) : (
                    <span
                      className={`text-base font-bold ${
                        step.id === currentStep ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
              </div>

              {/* Step Label */}
              <span
                className={`text-sm font-medium text-center transition-colors duration-200 ${
                  step.id === currentStep
                    ? 'text-primary-600'
                    : step.id < currentStep
                    ? 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.name}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
