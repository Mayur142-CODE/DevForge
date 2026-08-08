"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategories } from '@/features/categories/api/use-categories'
import { useDailyEntries, useToggleDailyEntry } from '@/features/daily-entries/api/use-daily-entries'
import { useAchievementStats } from '@/hooks/use-achievements'
import { DynamicIcon } from '@/components/achievements/dynamic-icon'
import { ProgressBar } from '@/components/shared/progress-bar'
import { RARITY_COLORS } from '@/lib/achievement-definitions'
import { Check, Flame, Trophy, Calendar, Sparkles, Loader2, Target, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { CategoryCard } from '@/components/categories/category-card'
import { DashboardSkeleton } from '@/components/shared/skeletons'
import { formatDateKey, getLongestStreak } from '@/lib/date-utils'

import { useOverviewStats } from '@/hooks/use-statistics'
import { evaluateAchievement } from '@/lib/achievement-definitions'

export default function DashboardPage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const { data: dailyEntries, isLoading: isEntriesLoading } = useDailyEntries()
  const { data: overviewStats } = useOverviewStats()
  const { recentAchievement, nextAchievement, unlockedCount, totalCount } = useAchievementStats()
  const toggleEntry = useToggleDailyEntry()

  const today = formatDateKey(new Date())

  if (isCategoriesLoading || isEntriesLoading) {
    return <DashboardSkeleton />
  }

  const activeCategories = categories?.filter(c => c.is_active) || []
  const completedEntries = dailyEntries?.filter(e => e.completed) || []
  const totalCompletedDays = new Set(completedEntries.map(e => e.entry_date)).size
  const longestStreak = Math.max(
    ...activeCategories.map(c => {
      const catDates = completedEntries.filter(e => e.category_id === c.id).map(e => e.entry_date)
      return Math.max(getLongestStreak(catDates), c.longest_streak || 0)
    }),
    0
  )
  const todayCompleted = new Set(completedEntries.filter(e => e.entry_date === today).map(e => e.category_id)).size

  const { current: currentProgressVal, max: nextReqValue, ratio: nextProgressRatio } = nextAchievement
    ? evaluateAchievement(nextAchievement, overviewStats)
    : { current: 0, max: 1, ratio: 0 }

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your daily learning consistency.</p>
        </div>
      </div>

      {/* Top Stats - 4 Column Glassy Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Categories", value: activeCategories.length, icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Current Longest Streak", value: `${longestStreak} days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Total Completed Days", value: totalCompletedDays, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { title: "Today's Progress", value: `${todayCompleted} / ${activeCategories.length}`, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden relative group rounded-2xl">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-4">
                  <p className="text-sm font-medium text-muted-foreground tracking-tight">{stat.title}</p>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold tracking-tighter">{stat.value}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Spotlight Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Achievement Card */}
        <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl relative">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{ backgroundColor: recentAchievement?.badge_color || '#f59e0b' }}
              >
                <DynamicIcon name={recentAchievement?.icon || 'Trophy'} className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Recent Achievement</span>
                <h4 className="font-bold text-sm tracking-tight text-foreground mt-0.5">
                  {recentAchievement?.name || recentAchievement?.title || 'First Step'}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {recentAchievement?.description || 'Keep building your daily streak!'}
                </p>
              </div>
            </div>
            <Link
              href="/achievements"
              className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'text-xs rounded-lg shrink-0' })}
            >
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Next Achievement Progress Card */}
        <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-2xl">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Milestone</span>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {currentProgressVal} / {nextReqValue}
              </span>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">
                {nextAchievement?.name || nextAchievement?.title || '3 Day Streak'}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {nextAchievement?.description || 'Maintain a 3-day streak to unlock.'}
              </p>
            </div>
            <ProgressBar value={nextProgressRatio} max={100} color="#3b82f6" size="sm" className="rounded-full" />
          </CardContent>
        </Card>
      </div>

      {/* Category Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {activeCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed rounded-2xl">
            <h3 className="text-lg font-medium">No active categories</h3>
            <p className="text-muted-foreground mt-1">Create your first category to start tracking your progress.</p>
            <Link href="/categories" className={buttonVariants({ variant: "default", className: "mt-4" })}>
              Manage Categories
            </Link>
          </div>
        ) : (
          activeCategories.map((category, index) => {
            const categoryEntries = dailyEntries?.filter(e => e.category_id === category.id) || []
            
            return (
              <CategoryCard 
                key={category.id}
                category={category}
                dailyEntries={categoryEntries}
                onToggleEntry={(categoryId, date, completed, journal) =>
                  toggleEntry.mutate({
                    categoryId,
                    date,
                    completed,
                    title: journal?.title,
                    description: journal?.description,
                    resource_url: journal?.resource_url,
                  })
                }
                isTogglePending={toggleEntry.isPending}
                index={index}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
