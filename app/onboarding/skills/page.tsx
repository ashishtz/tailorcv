import type { Metadata } from 'next'
import { SkillsStep } from '@/components/onboarding/skills-step'

export const metadata: Metadata = {
  title: 'Skills',
}

export default function OnboardingSkillsPage() {
  return <SkillsStep />
}
