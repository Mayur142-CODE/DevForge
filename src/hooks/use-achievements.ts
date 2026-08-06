'use client'

import { useQuery } from '@tanstack/react-query'
import { getAchievements, getUserAchievements } from '@/services/achievements'
import { RARITY_COLORS } from '@/lib/achievement-definitions'
import type { Achievement } from '@/types/database'

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  })
}

export function useUserAchievements() {
  return useQuery({
    queryKey: ['user_achievements'],
    queryFn: getUserAchievements,
  })
}

export function useAchievementStats() {
  const { data: achievements, isLoading: loadingAll } = useAchievements()
  const { data: userAchievements, isLoading: loadingUser } = useUserAchievements()

  const isLoading = loadingAll || loadingUser

  const allList = achievements || []
  const userList = userAchievements || []

  const unlockedMap = new Map<string, string>() // achievement_id -> unlocked_at
  userList.forEach((ua: any) => {
    if (ua.achievement_id) {
      unlockedMap.set(ua.achievement_id, ua.unlocked_at)
    }
  })

  const totalCount = allList.length
  const unlockedCount = unlockedMap.size
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  // Recent achievement (most recently unlocked)
  const recentUserAchievement = userList.length > 0 ? userList[0] : null
  const recentAchievement = recentUserAchievement
    ? allList.find((a) => a.id === recentUserAchievement.achievement_id) || recentUserAchievement.achievements
    : null

  // Rarest unlocked achievements (order by rarity: Legendary > Epic > Rare > Uncommon > Common)
  const rarityRank: Record<string, number> = {
    Legendary: 5,
    Epic: 4,
    Rare: 3,
    Uncommon: 2,
    Common: 1,
  }

  const unlockedAchievementsList = userList
    .map((ua: any) => {
      const ach = allList.find((a) => a.id === ua.achievement_id) || ua.achievements
      return {
        ...ach,
        unlocked_at: ua.unlocked_at,
      }
    })
    .filter(Boolean)

  const rarestUnlocked = [...unlockedAchievementsList].sort((a, b) => {
    const rankA = rarityRank[a.rarity || 'Common'] || 1
    const rankB = rarityRank[b.rarity || 'Common'] || 1
    if (rankB !== rankA) return rankB - rankA
    return new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime()
  }).slice(0, 5)

  // Find next closest locked achievement
  const lockedList = allList.filter((a) => !unlockedMap.has(a.id))
  const nextAchievement = lockedList.length > 0 ? lockedList[0] : null

  return {
    isLoading,
    totalCount,
    unlockedCount,
    percentage,
    recentAchievement,
    recentUnlockedAt: recentUserAchievement?.unlocked_at || null,
    rarestUnlocked,
    nextAchievement,
    unlockedMap,
  }
}
