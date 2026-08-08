import { createClient } from '@/lib/supabase/client'
import {
  GLOBAL_ACHIEVEMENT_DEFINITIONS,
  generateCategoryAchievements,
  evaluateAchievement,
  AchievementDef,
} from '@/lib/achievement-definitions'
import { getStreakFromDates, getLongestStreak } from '@/lib/date-utils'
import type { Category } from '@/types/database'

const supabase = createClient()

/**
 * Returns achievement definitions purely in-memory.
 * No Supabase call needed — definitions are generated from code + user categories.
 */
export function getAchievementDefinitions(categories: Category[] = []): AchievementDef[] {
  const dynamicCatDefs = generateCategoryAchievements(categories)
  return [...GLOBAL_ACHIEVEMENT_DEFINITIONS, ...dynamicCatDefs]
}

/**
 * Fetches the user's unlocked achievements from the database.
 */
export async function getUserAchievements() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Ensures achievement rows exist in the `achievements` table for foreign key constraints.
 * Uses batch upsert instead of sequential per-definition upserts.
 */
async function ensureAchievementsInDb(allDefs: AchievementDef[]) {
  try {
    const { data: existing } = await supabase
      .from('achievements')
      .select('id, requirement_type, requirement_value, name')

    const existingMap = new Map((existing || []).map((a) => [a.id, a]))

    const toUpsert = allDefs.filter((def) => {
      const item = existingMap.get(def.id)
      return (
        !item ||
        item.requirement_type !== def.requirement_type ||
        item.requirement_value !== def.requirement_value ||
        item.name !== def.name
      )
    })

    if (toUpsert.length > 0) {
      // Batch upsert all missing/changed definitions at once
      await supabase.from('achievements').upsert(
        toUpsert.map((def) => ({
          id: def.id,
          name: def.name,
          title: def.name,
          description: def.description,
          icon: def.icon,
          badge_color: def.badge_color,
          category: def.category,
          requirement_type: def.requirement_type,
          requirement_value: def.requirement_value,
          category_filter: def.category_id || null,
          rarity: def.rarity,
        }))
      )
    }
  } catch (err) {
    console.error('Error seeding achievements:', err)
  }
}

/**
 * Checks all achievements and unlocks any that meet requirements.
 * Parallelizes independent Supabase fetches.
 */
export async function checkAndUnlockAchievements(): Promise<AchievementDef[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  // Parallel fetch: categories, entries, and already-unlocked achievements
  const [catResult, entriesResult, unlockedResult] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id),
  ])

  const userCats = (catResult.data || []) as Category[]
  const completedEntries = entriesResult.data || []
  const unlocked = unlockedResult.data || []

  // Generate all definitions in memory
  const achievements = getAchievementDefinitions(userCats)

  // Ensure DB rows exist for FK constraints (batch upsert)
  await ensureAchievementsInDb(achievements)

  const unlockedIds = new Set(unlocked.map((u) => u.achievement_id))

  // Metrics calculation
  const uniqueCompletedDates = Array.from(new Set(completedEntries.map((e) => e.entry_date))).sort()
  const totalCompletedDays = uniqueCompletedDates.length

  let maxCurrentStreak = getStreakFromDates(uniqueCompletedDates)
  let maxLongestStreak = getLongestStreak(uniqueCompletedDates)

  const categoryStatsMap: Record<string, { completedDays: number; currentStreak: number; longestStreak: number }> = {}

  userCats.forEach((cat) => {
    const catDates = completedEntries.filter((e) => e.category_id === cat.id).map((e) => e.entry_date)
    const uniqueCatDates = new Set(catDates)
    const current = getStreakFromDates(Array.from(uniqueCatDates))
    const longest = Math.max(getLongestStreak(Array.from(uniqueCatDates)), cat.longest_streak || 0)

    categoryStatsMap[cat.id] = {
      completedDays: uniqueCatDates.size,
      currentStreak: current,
      longestStreak: longest,
    }

    maxCurrentStreak = Math.max(maxCurrentStreak, current)
    maxLongestStreak = Math.max(maxLongestStreak, longest)
  })

  const bestStreak = Math.max(maxCurrentStreak, maxLongestStreak)

  const journalEntriesCount = completedEntries.filter(
    (e) => (e.title && e.title.trim() !== '') || (e.description && e.description.trim() !== '')
  ).length
  const uniqueCategoriesCompletedCount = new Set(completedEntries.map((e) => e.category_id)).size
  const totalCategories = userCats.length

  const overviewStats = {
    totalCompletedDays,
    longestStreak: bestStreak,
    totalCategories,
    completedCategoriesCount: uniqueCategoriesCompletedCount,
    totalJournalEntries: journalEntriesCount,
    categoryStatsMap,
  }

  const newlyUnlockedObjects: AchievementDef[] = []

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue

    const evalRes = evaluateAchievement(achievement, overviewStats)

    if (evalRes.isUnlocked) {
      const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievement.id })

      if (!error) {
        newlyUnlockedObjects.push(achievement)
      }
    }
  }

  return newlyUnlockedObjects
}
