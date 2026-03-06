import type { Metadata } from 'next'

// Root layout metadata - applies to all routes including admin
// Frontend-specific metadata is defined in (frontend)/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Excelsior Creative | Nonprofit AI & Software Engineering Agency',
    template: '%s | Excelsior Creative',
  },
  description: 'Excelsior Creative is a trusted technology partner for national nonprofits, specializing in AI-powered solutions, custom software engineering, and digital strategy to amplify world-changing missions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
