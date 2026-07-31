import type { Metadata } from 'next'
import { ProjectsStep } from '@/components/onboarding/projects-step'

export const metadata: Metadata = {
  title: 'Projects',
}

export default function OnboardingProjectsPage() {
  return <ProjectsStep />
}
