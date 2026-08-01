import type { Metadata } from 'next'

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
