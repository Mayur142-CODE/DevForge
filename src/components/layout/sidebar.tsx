'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import { useUIStore } from '@/stores/ui-store'
import { useAuth } from '@/hooks/use-auth'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Logo } from '@/components/shared/logo'
import {
  LayoutDashboard,
  Grid3X3,
  BarChart3,
  Trophy,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'layout-dashboard': LayoutDashboard,
  'grid-3x3': Grid3X3,
  'bar-chart-3': BarChart3,
  trophy: Trophy,
  user: User,
  settings: Settings,
}

interface SidebarItemProps {
  href?: string
  onClick?: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
  isCollapsed: boolean
}

function SidebarItem({
  href,
  onClick,
  icon: Icon,
  label,
  isActive = false,
  isCollapsed,
}: SidebarItemProps) {
  const content = (
    <div
      className={cn(
        'flex items-center rounded-xl transition-all duration-200 select-none cursor-pointer',
        isCollapsed
          ? 'h-10 w-10 justify-center mx-auto'
          : 'h-10 px-3 gap-3 w-full',
        isActive
          ? 'bg-secondary text-foreground font-semibold'
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )

  const element = href ? (
    <Link href={href} className="block w-full focus:outline-none">
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className="block w-full text-left focus:outline-none">
      {content}
    </button>
  )

  if (isCollapsed) {
    return (
      <Tooltip delay={150}>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="z-50 flex items-center gap-2 bg-popover text-popover-foreground border border-border/50 shadow-md text-xs font-semibold px-3 py-1.5 rounded-xl"
        >
          <Icon className="w-3.5 h-3.5 shrink-0 text-foreground/80" />
          <span>{label}</span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return element
}

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { signOut } = useAuth()

  return (
    <TooltipProvider delay={150}>
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col border-r border-border bg-background h-screen select-none shrink-0"
      >
        {/* Header / Logo */}
        <div
          className={cn(
            'flex h-14 items-center px-4 transition-all duration-200',
            sidebarCollapsed ? 'justify-center px-2' : 'justify-between'
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <Logo size={32} showText={!sidebarCollapsed} />
          </Link>
        </div>

        <Separator />

        {/* Main Navigation Items */}
        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <SidebarItem
                key={item.href}
                href={item.href}
                icon={Icon}
                label={item.label}
                isActive={isActive}
                isCollapsed={sidebarCollapsed}
              />
            )
          })}
        </nav>

        <Separator />

        {/* Footer Actions (Sign Out & Collapse Toggle) */}
        <div className="p-3 space-y-1.5">
          <SidebarItem
            onClick={() => signOut()}
            icon={LogOut}
            label="Sign Out"
            isCollapsed={sidebarCollapsed}
          />

          <SidebarItem
            onClick={toggleSidebar}
            icon={sidebarCollapsed ? ChevronRight : ChevronLeft}
            label={sidebarCollapsed ? 'Expand' : 'Collapse'}
            isCollapsed={sidebarCollapsed}
          />
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
