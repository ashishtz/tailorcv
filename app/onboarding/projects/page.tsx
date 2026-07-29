import { OnboardingStepper } from '@/components/onboarding/stepper'
import { ProjectsStep } from '@/components/onboarding/projects-step'
import { Rocket } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-primary-50/20 to-secondary-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-primary-600 to-accent-500 shadow-large mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
            Projects & External Experience
          </h1>
          <p className="text-gray-600 text-lg">Add your projects and external experiences</p>
        </div>

        <OnboardingStepper />

        <div className="bg-white shadow-large rounded-lg p-8 animate-scale-in mt-8">
          <ProjectsStep />
        </div>
      </div>
    </div>
  )
}