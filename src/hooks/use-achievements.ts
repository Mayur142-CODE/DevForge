'use client'

import { useQuery } from '@tanstack/react-query'
import { getAchievements, getUserAchievements } from '@/services/achievements'

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements', 'all'],
    queryFn: getAchievements,
  })
}

export function useUserAchievements() {
  return useQuery({
    queryKey: ['achievements', 'user'],
    queryFn: getUserAchievements,
  })
}
