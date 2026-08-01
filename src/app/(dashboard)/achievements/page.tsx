"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Achievement, UserAchievement } from '@/types/database'
import { Loader2, Lock, Unlock } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

export default function AchievementsPage() {
  const supabase = createClient()

  const { data: achievements, isLoading: isAchLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('achievements').select('*')
      if (error) throw error
      return data as Achievement[]
    },
  })

  const { data: userAchievements, isLoading: isUserAchLoading } = useQuery({
    queryKey: ['user_achievements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_achievements').select('*')
      if (error) throw error
      return data as UserAchievement[]
    },
  })

  if (isAchLoading || isUserAchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground mt-2">Unlock badges by staying consistent.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {achievements?.map((achievement, index) => {
          const userAch = userAchievements?.find(ua => ua.achievement_id === achievement.id)
          const isUnlocked = !!userAch

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              key={achievement.id}
            >
              <Card className={`h-full flex flex-col transition-all ${isUnlocked ? 'border-primary/50 bg-primary/5' : 'opacity-70 grayscale'}`}>
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm" style={{ backgroundColor: isUnlocked ? achievement.badge_color : 'var(--muted)' }}>
                    {isUnlocked ? (
                      <Unlock className="w-8 h-8 text-white" />
                    ) : (
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center flex-1 flex flex-col justify-between">
                  <CardDescription className="mb-4">{achievement.description}</CardDescription>
                  {isUnlocked && userAch?.unlocked_at && (
                    <div className="text-xs text-primary font-medium mt-auto">
                      Unlocked on {format(new Date(userAch.unlocked_at), 'MMM d, yyyy')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
