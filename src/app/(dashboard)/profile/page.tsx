'use client'

import { PageTransition } from '@/components/shared/page-transition'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useCategories } from '@/hooks/use-categories'
import { useOverviewStats } from '@/hooks/use-statistics'
import { useUserAchievements } from '@/hooks/use-achievements'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import { CalendarDays, Flame, Trophy, Target, Mail, Clock } from 'lucide-react'
import { format } from '@/lib/date-utils'

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { data: categories } = useCategories()
  const { data: stats, isLoading: loadingStats } = useOverviewStats()
  const { data: achievements } = useUserAchievements()

  const isLoading = authLoading || loadingStats
  const initials = user?.user_metadata?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const profileStats = [
    { label: 'Total Streaks', value: categories?.reduce((sum, c) => sum + c.current_streak, 0) ?? 0, icon: Flame },
    { label: 'Learning Days', value: stats?.totalCompletedDays ?? 0, icon: CalendarDays },
    { label: 'Achievements', value: achievements?.length ?? 0, icon: Trophy },
    { label: 'Categories', value: stats?.totalCategories ?? 0, icon: Target },
  ]

  return (
    <PageTransition>
      <PageHeader title="Profile" />

      <div className="max-w-2xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl bg-foreground text-background">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
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
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          {profileStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <AnimatedCounter
                      value={stat.value}
                      className="text-2xl font-bold"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Achievements */}
        {achievements && achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.slice(0, 5).map((ua: any) => (
                <div key={ua.id} className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                    style={{ backgroundColor: `${ua.achievements?.badge_color}15` }}
                  >
                    <Trophy className="h-3.5 w-3.5" style={{ color: ua.achievements?.badge_color }} />
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{ua.achievements?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(ua.unlocked_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
