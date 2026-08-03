'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { useAuth } from '@/hooks/use-auth'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/shared/logo'
import {
  LayoutDashboard,
  Grid3X3,
  BarChart3,
  Trophy,
  User,
  Settings,
  LogOut,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  'grid-3x3': Grid3X3,
  'bar-chart-3': BarChart3,
  trophy: Trophy,
  user: User,
  settings: Settings,
}

export function MobileNavContent() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={32} showText={true} />
        </Link>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export function MobileNav() {
  return null // The mobile nav is triggered via Sheet in TopBar
}
