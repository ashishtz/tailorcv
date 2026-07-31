import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Generate a resume',
}

export default function NewResumeLayout({ children }: { children: React.ReactNode }) {
  return children
}
