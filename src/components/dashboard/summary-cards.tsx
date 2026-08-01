'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { Grid3X3, Flame, CalendarDays, Target } from 'lucide-react'
import type { OverviewStats } from '@/services/statistics'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
}

interface SummaryCardsProps {
  stats?: OverviewStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Active Categories',
      value: stats?.totalCategories ?? 0,
      icon: Grid3X3,
      description: `${stats?.activeCategories ?? 0} with active streaks`,
    },
    {
      label: 'Longest Streak',
      value: stats?.longestStreak ?? 0,
      icon: Flame,
      suffix: ' days',
      description: 'Your best streak ever',
    },
    {
      label: 'Total Completed',
      value: stats?.totalCompletedDays ?? 0,
      icon: CalendarDays,
      suffix: ' days',
      description: 'Across all categories',
    },
    {
      label: "Today's Progress",
      value: stats?.todayCompleted ?? 0,
      icon: Target,
      suffix: ` / ${stats?.todayTotal ?? 0}`,
      description: 'Tasks completed today',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-2">
                <AnimatedCounter
                  value={card.value}
                  className="text-2xl font-bold tracking-tight"
                  suffix={card.suffix}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
