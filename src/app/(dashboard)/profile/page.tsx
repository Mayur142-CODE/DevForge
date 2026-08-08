'use client'

import { PageTransition } from '@/components/shared/page-transition'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useOverviewStats } from '@/hooks/use-statistics'
import { useAchievementStats } from '@/hooks/use-achievements'
import { DynamicIcon } from '@/components/achievements/dynamic-icon'
import { RARITY_COLORS, evaluateAchievement } from '@/lib/achievement-definitions'
import { ProgressBar } from '@/components/shared/progress-bar'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { CalendarDays, Flame, Target, Mail, Clock, BookOpen, Trophy, Sparkles, Lock, ArrowUpRight } from 'lucide-react'
import { format } from '@/lib/date-utils'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { data: stats, isLoading: loadingStats } = useOverviewStats()
  const {
    isLoading: loadingAch,
    totalCount,
    unlockedCount,
    percentage,
    recentAchievement,
    recentUnlockedAt,
    rarestUnlocked,
    nextAchievement,
  } = useAchievementStats()

  const { current: nextCurrent, max: nextMax, ratio: nextRatio } = nextAchievement
    ? evaluateAchievement(nextAchievement, stats)
    : { current: 0, max: 1, ratio: 0 }

  const isLoading = authLoading || loadingStats || loadingAch
  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const profileStats = [
    { label: 'Total Completed Days', value: stats?.totalCompletedDays ?? 0, icon: CalendarDays, suffix: '' },
    { label: 'Current Longest Streak', value: stats?.longestStreak ?? 0, icon: Flame, suffix: ' days' },
    { label: 'Active Categories', value: stats?.activeCategories ?? 0, icon: Target, suffix: '' },
    { label: 'Total Categories', value: stats?.totalCategories ?? 0, icon: Target, suffix: '' },
    { label: 'Total Journal Entries', value: stats?.totalJournalEntries ?? 0, icon: BookOpen, suffix: '' },
  ]

  return (
    <PageTransition>
      <PageHeader title="Profile" />

      <div className="max-w-4xl space-y-6">
        {/* Profile Card */}
        <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-border/50 shadow-md">
                  <AvatarFallback className="text-2xl font-bold bg-foreground text-background">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {user?.user_metadata?.full_name || 'Developer'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Joined {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Achievement Summary Pill */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/30 w-full sm:w-auto">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold">{unlockedCount}</span>
                    <span className="text-xs text-muted-foreground">/ {totalCount} Badges</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-500">{percentage}% Unlocked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profileStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      className="text-2xl font-bold tracking-tight"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Achievement Showcase: Top 5 Rarest Unlocked */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-500" />
                  Rarest Achievements Showcase
                </CardTitle>
                <CardDescription className="text-xs">Your top unlocked badges</CardDescription>
              </div>
              <Link href="/achievements" className="text-xs text-primary font-medium flex items-center hover:underline">
                View All <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {rarestUnlocked.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-2xl">
                  No achievements unlocked yet. Complete your first task!
                </div>
              ) : (
                rarestUnlocked.map((item: any) => {
                  const ach = item.achievement || item
                  const rarity = (ach.rarity || 'Common') as keyof typeof RARITY_COLORS
                  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.Common

                  return (
                    <div
                      key={ach.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/20 transition-all hover:bg-secondary/40"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                          style={{ backgroundColor: ach.badge_color || colors.hex }}
                        >
                          <DynamicIcon name={ach.icon} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground leading-tight">{ach.name || ach.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ach.description}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] uppercase tracking-wider font-bold shrink-0 ${colors.bg} ${colors.border} ${colors.text}`}
                      >
                        {rarity}
                      </Badge>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>

          {/* Next Achievement Progress & Recent Unlock */}
          <div className="space-y-6">
            {/* Recent Achievement Card */}
            {recentAchievement && (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Latest Unlock
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                      style={{ backgroundColor: recentAchievement.badge_color || '#3b82f6' }}
                    >
                      <DynamicIcon name={recentAchievement.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{recentAchievement.name || recentAchievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {recentAchievement.description}
                      </p>
                      {recentUnlockedAt && (
                        <p className="text-[11px] text-amber-500 font-medium mt-1">
                          Unlocked on {format(new Date(recentUnlockedAt), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Achievement Progress Card */}
            {nextAchievement && (
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center">
                    <Target className="w-3.5 h-3.5 mr-1.5 text-primary" />
                    Next Achievement Target
                  </CardTitle>
                  <span className="text-xs font-semibold text-foreground">
                    {nextCurrent} / {nextMax}
                  </span>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center text-muted-foreground shrink-0 border border-border/30">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{nextAchievement.name || nextAchievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{nextAchievement.description}</p>
                    </div>
                  </div>
                  <div className="pt-1">
                    <ProgressBar value={nextRatio} max={100} color="#3b82f6" size="sm" className="rounded-full" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
