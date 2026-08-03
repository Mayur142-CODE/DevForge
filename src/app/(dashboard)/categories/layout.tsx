import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories',
}

export default function CategoriesPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
