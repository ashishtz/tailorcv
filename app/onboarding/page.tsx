import type { Metadata } from 'next'
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'

export const metadata: Metadata = {
  title: 'Personal details',
}

export default function OnboardingPersonalInfoPage() {
  return <PersonalInfoStep />
}
