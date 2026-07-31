import type { Metadata } from 'next'
import { EducationStep } from '@/components/onboarding/education-step'

export const metadata: Metadata = {
  title: 'Education',
}

export default function OnboardingEducationPage() {
  return <EducationStep />
}
