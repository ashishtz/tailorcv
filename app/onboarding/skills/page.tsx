import { OnboardingStepper } from '@/components/onboarding/stepper'
import { SkillsStep } from '@/components/onboarding/skills-step'
import { Sparkles } from 'lucide-react'

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 shadow-large mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Select Your Skills
          </h1>
          <p className="text-gray-600 text-lg">Choose skills that best represent your expertise</p>
        </div>

        <OnboardingStepper />

        <div className="bg-white shadow-large rounded-lg p-8 animate-scale-in mt-8">
          <SkillsStep />
        </div>
      </div>
    </div>
  )
}