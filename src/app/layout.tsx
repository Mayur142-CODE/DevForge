import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'StreakHub — Build consistency. One day at a time.',
  description:
    'StreakHub is a modern discipline and streak tracking platform that helps you stay consistent with coding, learning, and personal growth through GitHub-style contribution heatmaps, daily streaks, analytics, and achievements.',
  keywords: [
    'streak tracker',
    'discipline dashboard',
    'habit tracker',
    'developer tools',
    'learning consistency',
    'contribution heatmap',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
