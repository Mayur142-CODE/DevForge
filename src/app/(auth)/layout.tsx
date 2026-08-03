import type { Metadata } from 'next'
import { Logo } from '@/components/shared/logo'

export const metadata: Metadata = {
  title: 'StreakHub — Authentication',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-foreground p-12">
        <div>
          <Logo size={36} showText={true} textClassName="text-background text-2xl font-bold" />
        </div>
        
        {/* Center Logo Content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-6 text-background opacity-90">
            <Logo size={128} className="drop-shadow-2xl transition-transform hover:scale-105 duration-300" />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">Build consistency. One day at a time.</h2>
              <p className="text-background/70 max-w-sm">
                Track your habits, maintain your streaks, and level up your consistency every single day.
              </p>
            </div>
          </div>
        </div>

        <div>
          <blockquote className="space-y-2">
            <p className="text-lg text-background/80">
              &ldquo;Discipline is the bridge between goals and accomplishment.&rdquo;
            </p>
            <footer className="text-sm text-background/60">Jim Rohn</footer>
          </blockquote>
        </div>
      </div>
      {/* Right content panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  )
}
