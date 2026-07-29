import { OnboardingStepper } from '@/components/onboarding/stepper'
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'
import { User } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-primary-600 to-accent-500 shadow-large mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Welcome! Let&apos;s set up your profile
          </h1>
          <p className="text-gray-600 text-lg">Build your professional resume in just a few steps</p>
        </div>

        <OnboardingStepper />

        <div className="bg-white shadow-large rounded-lg p-8 animate-scale-in mt-8">
          <div className="animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <PersonalInfoStep />
          </div>
        </div>
      </div>
    </div>
  )
}