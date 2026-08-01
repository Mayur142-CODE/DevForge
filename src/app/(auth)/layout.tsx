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
      <div className="relative hidden h-full flex-col bg-zinc-950 text-white lg:flex lg:w-1/2 p-10 justify-between overflow-hidden border-r border-border/20">
        <div className="absolute inset-0 bg-zinc-950">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/40 to-zinc-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950/0 to-zinc-950/0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
        
        <div className="relative z-20 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white to-zinc-400 shadow-xl">
            <Flame className="h-6 w-6 text-zinc-950" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            DevForge
          </h1>
        </div>
        
        <div className="relative z-20">
          <blockquote className="space-y-4">
            <p className="text-xl leading-relaxed text-zinc-300">
              &ldquo;Discipline is the bridge between goals and accomplishment. Forge your habits today to shape your tomorrow.&rdquo;
            </p>
            <footer className="text-sm font-medium text-zinc-500">— Jim Rohn</footer>
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
