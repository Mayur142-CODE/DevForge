"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useAchievementStats } from '@/hooks/use-achievements'
import { AchievementsSkeleton } from '@/components/shared/skeletons'
import { DynamicIcon } from '@/components/achievements/dynamic-icon'
import { RARITY_COLORS } from '@/lib/achievement-definitions'
import { ProgressBar } from '@/components/shared/progress-bar'
import { Loader2, Lock, Sparkles, Trophy, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const CATEGORY_FILTERS = [
  'All',
  'Unlocked',
  'Locked',
  'Streak',
  'Total Days',
  'Consistency',
  'Milestones',
  'Journal',
  'Category',
  'Explorer',
]

export default function AchievementsPage() {
  const {
    evaluatedList,
    unlockedCount,
    totalCount,
    percentage: unlockedPercentage,
    isLoading: isAchLoading,
  } = useAchievementStats()
  const [selectedFilter, setSelectedFilter] = React.useState('All')

  if (isAchLoading) {
    return <AchievementsSkeleton />
  }

  // Filter list
  const filteredAchievements = (evaluatedList || []).filter((item) => {
    if (selectedFilter === 'All') return true
    if (selectedFilter === 'Unlocked') return item.isUnlocked
    if (selectedFilter === 'Locked') return !item.isUnlocked
    return item.achievement.category === selectedFilter
  })

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto w-full">
      {/* Hero Stats Card */}
      <Card className="border-border/40 shadow-lg bg-card/50 backdrop-blur-md rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 -mr-20 -mt-20 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                <Trophy className="w-4 h-4" />
                <span>StreakHub Achievements</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Hall of Fame</h1>
              <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                Stay consistent, hit daily milestones, and unlock exclusive badges.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-secondary/30 p-4 rounded-2xl border border-border/30">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground tracking-tight">{unlockedCount} / {totalCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Unlocked</p>
              </div>
              <div className="h-10 w-px bg-border/40" />
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500 tracking-tight">{unlockedPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Completion</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/20">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-muted-foreground">Overall Achievement Progress</span>
              <span className="text-foreground font-semibold">{unlockedCount} of {totalCount} Completed</span>
            </div>
            <ProgressBar value={unlockedPercentage} max={100} color="#f59e0b" size="md" className="rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2 custom-scrollbar">
        {CATEGORY_FILTERS.map((filter) => {
          const isActive = selectedFilter === filter
          return (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-foreground text-background shadow-md scale-105'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/30'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {/* Grid of Achievements */}
      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {filteredAchievements.map((item, index) => {
            const { achievement, current, max, ratio, isUnlocked, unlockedAt } = item
            const rarity = (achievement.rarity || 'Common') as keyof typeof RARITY_COLORS
            const colors = RARITY_COLORS[rarity] || RARITY_COLORS.Common

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                key={achievement.id}
                className="h-full"
              >
                <Card
                  className={`h-full flex flex-col justify-between border-border/40 shadow-sm transition-all duration-300 rounded-2xl overflow-hidden relative group ${
                    isUnlocked
                      ? 'bg-card/70 hover:shadow-md hover:border-primary/30'
                      : 'bg-card/30 opacity-70 hover:opacity-90 grayscale-[40%]'
                  }`}
                >
                  {/* Glowing Edge Header */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: isUnlocked ? (achievement.badge_color || colors.hex) : 'var(--muted)' }}
                  />

                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Bar: Rarity Tag & Category */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors.bg} ${colors.border} ${colors.text}`}
                        >
                          {rarity}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {achievement.category || 'General'}
                        </span>
                      </div>

                      {/* Badge Icon & Name */}
                      <div className="flex items-start gap-3.5 mb-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: isUnlocked
                              ? achievement.badge_color || colors.hex
                              : 'var(--secondary)',
                          }}
                        >
                          {isUnlocked ? (
                            <DynamicIcon name={achievement.icon} className="w-6 h-6 text-white" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm tracking-tight leading-snug text-foreground">
                            {achievement.name || achievement.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress or Unlock Date */}
                    <div className="pt-2 border-t border-border/20">
                      {isUnlocked ? (
                        <div className="flex items-center text-xs font-medium text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                          Unlocked {unlockedAt ? format(new Date(unlockedAt), 'MMM d, yyyy') : 'Complete'}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>Progress</span>
                            <span className="font-medium text-foreground">
                              {current} / {max}
                            </span>
                          </div>
                          <ProgressBar
                            value={ratio}
                            max={100}
                            color={colors.hex}
                            size="sm"
                            className="rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
