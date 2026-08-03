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
      { url: '/favicon.ico' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
        url: '/icon-512.png',
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
    images: ['/icon-512.png'],
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
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
