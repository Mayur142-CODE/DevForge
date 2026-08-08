'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAchievementDefinitions, getUserAchievements } from '@/services/achievements'
import {
  GLOBAL_ACHIEVEMENT_DEFINITIONS,
  generateCategoryAchievements,
  evaluateAchievement,
  AchievementDef,
  EvaluatedAchievement,
} from '@/lib/achievement-definitions'
import { useCategories } from '@/features/categories/api/use-categories'
import { useOverviewStats } from '@/hooks/use-statistics'

export function useUserAchievements() {
  return useQuery({
    queryKey: ['user_achievements'],
    queryFn: getUserAchievements,
  })
}

export function useAchievementStats() {
  const { data: categories, isLoading: loadingCats } = useCategories()
  const { data: userAchievements, isLoading: loadingUser } = useUserAchievements()
  const { data: overviewStats, isLoading: loadingStats } = useOverviewStats()

  const isLoading = loadingCats || loadingUser || loadingStats

  // Generate achievement definitions purely in memory (no Supabase call)
  const activeCategories = useMemo(
    () => (categories || []).filter((c) => c.is_active),
    [categories]
  )

  const activeCatIds = useMemo(
    () => new Set(activeCategories.map((c) => c.id)),
    [activeCategories]
  )

  // All definitions: global + dynamic category achievements
  const allList = useMemo(
    () => getAchievementDefinitions(activeCategories),
    [activeCategories]
  )

  // Create unlocked map (id -> unlocked_at)
  const unlockedMap = useMemo(() => {
    const map = new Map<string, string>()
    ;(userAchievements || []).forEach((ua: any) => {
      if (ua.achievement_id) {
        map.set(ua.achievement_id, ua.unlocked_at)
      }
    })
    return map
  }, [userAchievements])

  // Filter available achievements: global + active categories only
  const availableAchievements = useMemo(
    () =>
      allList.filter((a) => {
        if (!a.category_id) return true
        return activeCatIds.has(a.category_id)
      }),
    [allList, activeCatIds]
  )

  // Evaluate every achievement using evaluateAchievement (single source of truth)
  const evaluatedList: EvaluatedAchievement[] = useMemo(
    () =>
      availableAchievements.map((ach) =>
        evaluateAchievement(ach, overviewStats, unlockedMap)
      ),
    [availableAchievements, overviewStats, unlockedMap]
  )

  // Derived computed values
  const { unlockedList, lockedList, totalCount, unlockedCount, percentage } = useMemo(() => {
    const unlocked = evaluatedList.filter((item) => item.isUnlocked)
    const locked = evaluatedList.filter((item) => !item.isUnlocked)
    const total = evaluatedList.length
    const count = unlocked.length
    return {
      unlockedList: unlocked,
      lockedList: locked,
      totalCount: total,
      unlockedCount: count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }
  }, [evaluatedList])

  // Recent unlocked achievement (most recent by unlocked_at)
  const recentItem = useMemo(() => {
    if (unlockedList.length === 0) return null
    return [...unlockedList].sort((a, b) => {
      const timeA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0
      const timeB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0
      return timeB - timeA
    })[0]
  }, [unlockedList])

  // Rarest unlocked achievements (top 5)
  const rarestUnlocked = useMemo(() => {
    const rarityRank: Record<string, number> = {
      Legendary: 5,
      Epic: 4,
      Rare: 3,
      Uncommon: 2,
      Common: 1,
    }
    return [...unlockedList]
      .sort((a, b) => {
        const rankA = rarityRank[a.achievement.rarity || 'Common'] || 1
        const rankB = rarityRank[b.achievement.rarity || 'Common'] || 1
        if (rankB !== rankA) return rankB - rankA
        const timeA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0
        const timeB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0
        return timeB - timeA
      })
      .slice(0, 5)
  }, [unlockedList])

  // Find nearest incomplete achievement based on progress ratio
  const nextItem = useMemo(() => {
    if (lockedList.length === 0) return null
    return [...lockedList].sort((a, b) => {
      if (b.ratio !== a.ratio) return b.ratio - a.ratio
      return a.max - b.max
    })[0]
  }, [lockedList])

  return {
    isLoading,
    totalCount,
    unlockedCount,
    percentage,
    evaluatedList,
    recentAchievement: recentItem?.achievement || null,
    recentUnlockedAt: recentItem?.unlockedAt || null,
    rarestUnlocked,
    nextAchievement: nextItem?.achievement || null,
    unlockedMap,
  }
}
