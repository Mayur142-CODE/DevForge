import type { Metadata } from 'next'
import { Flame } from 'lucide-react'

export const metadata: Metadata = {
  title: 'DevForge — Authentication',
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
          <h1 className="text-2xl font-bold text-background tracking-tight">
            DevForge
          </h1>
        </div>
        
        {/* Added Center Logo Content */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-6 text-background opacity-90">
            <Flame className="h-32 w-32" strokeWidth={1} />
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">Forge Your Discipline</h2>
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
