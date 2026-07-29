import type { Metadata } from 'next'
import { WorkExperienceStep } from '@/components/onboarding/work-experience-step'

export const metadata: Metadata = {
  title: 'Work experience',
}

export default function OnboardingWorkExperiencePage() {
  return <WorkExperienceStep />
}
