import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume preview',
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children
}
