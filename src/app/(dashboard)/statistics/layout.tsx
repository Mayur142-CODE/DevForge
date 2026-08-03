import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Statistics',
}

export default function StatisticsPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
