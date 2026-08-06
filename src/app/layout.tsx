import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import '@/lib/ensure-icons'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  themeColor: '#09090B',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'StreakHub',
    template: '%s | StreakHub',
  },
  description: 'Build consistency. One day at a time.',
  applicationName: 'StreakHub',
  keywords: [
    'streak tracker',
    'discipline dashboard',
    'habit tracker',
    'developer tools',
    'learning consistency',
    'contribution heatmap',
  ],
  authors: [{ name: 'StreakHub' }],
  creator: 'StreakHub',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/svg+xml' },
      { url: '/icon-512.png', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'StreakHub',
    description: 'Build consistency. One day at a time.',
    siteName: 'StreakHub',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'StreakHub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreakHub',
    description: 'Build consistency. One day at a time.',
    images: ['/logo.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
