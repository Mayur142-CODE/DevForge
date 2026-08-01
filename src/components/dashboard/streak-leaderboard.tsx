'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategories } from '@/hooks/use-categories'
import { StreakBadge } from '@/components/shared/streak-badge'
import { ProgressBar } from '@/components/shared/progress-bar'
import { EmptyState } from '@/components/shared/empty-state'
import { Trophy, Inbox } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export function StreakLeaderboard() {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Streak Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const sorted = [...(categories || [])]
    .filter((c) => c.is_active)
    .sort((a, b) => b.current_streak - a.current_streak)

  if (!sorted.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Streak Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Inbox}
            title="No categories"
            description="Create categories to see your streak leaderboard"
          />
        </CardContent>
      </Card>
    )
  }

  const maxStreak = Math.max(...sorted.map((c) => c.longest_streak), 1)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Streak Leaderboard</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sorted.slice(0, 10).map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/categories/${category.id}`}
                className="block group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono w-5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StreakBadge streak={category.current_streak} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      Best: {category.longest_streak}d
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={category.current_streak}
                  max={maxStreak}
                  color={category.color}
                  size="sm"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
