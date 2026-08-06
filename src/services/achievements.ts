import { createClient } from '@/lib/supabase/client'
import { ACHIEVEMENT_DEFINITIONS } from '@/lib/achievement-definitions'
import { getStreakFromDates, getLongestStreak } from '@/lib/date-utils'
import type { Achievement } from '@/types/database'

const supabase = createClient()

export async function ensureAchievementsSeeded() {
  try {
    const { data: existing } = await supabase.from('achievements').select('id')
    const existingIds = new Set((existing || []).map((a) => a.id))

    const missing = ACHIEVEMENT_DEFINITIONS.filter((def) => !existingIds.has(def.id))

    if (missing.length > 0) {
      for (const def of missing) {
        await supabase.from('achievements').upsert({
          id: def.id,
          name: def.name,
          title: def.name,
          description: def.description,
          icon: def.icon,
          badge_color: def.badge_color,
          category: def.category,
          requirement_type: def.requirement_type,
          requirement_value: def.requirement_value,
          rarity: def.rarity,
        })
      }
    }
  } catch (err) {
    console.error('Error seeding achievements:', err)
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  await ensureAchievementsSeeded()

  const { data, error } = await supabase
    .from('achievements')
    .select('*')

  if (error) throw error

  // Sort according to definition list order
  const idOrder = new Map(ACHIEVEMENT_DEFINITIONS.map((def, idx) => [def.id, idx]))
  return (data as Achievement[]).sort((a, b) => {
    const idxA = idOrder.get(a.id) ?? 999
    const idxB = idOrder.get(b.id) ?? 999
    return idxA - idxB
  })
}

export async function getUserAchievements() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', user.id)
    .order('unlocked_at', { ascending: false })

  if (error) throw error
  return data
}

export async function checkAndUnlockAchievements(): Promise<Achievement[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  await ensureAchievementsSeeded()

  // 1. Fetch user categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)

  // 2. Fetch all completed entries for user
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true)

  // 3. Fetch all definitions
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')

  // 4. Fetch already unlocked
  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id)

  if (!categories || !achievements || !unlocked) return []

  const unlockedIds = new Set(unlocked.map((u) => u.achievement_id))
  const completedEntries = entries || []

  // Pre-calculate user metrics
  const uniqueCompletedDates = Array.from(new Set(completedEntries.map((e) => e.entry_date))).sort()
  const totalCompletedDays = uniqueCompletedDates.length

  // Calculate streaks across categories
  let maxCurrentStreak = 0
  let maxLongestStreak = 0

  categories.forEach((cat) => {
    const catDates = completedEntries.filter((e) => e.category_id === cat.id).map((e) => e.entry_date)
    const current = getStreakFromDates(catDates)
    const longest = Math.max(getLongestStreak(catDates), cat.longest_streak || 0)
    maxCurrentStreak = Math.max(maxCurrentStreak, current)
    maxLongestStreak = Math.max(maxLongestStreak, longest)
  })

  // Highest streak ever achieved or current streak
  const bestStreak = Math.max(maxCurrentStreak, maxLongestStreak, getLongestStreak(uniqueCompletedDates))

  const journalEntriesCount = completedEntries.filter((e) => e.title || e.description).length
  const resourceCount = completedEntries.filter((e) => e.resource_url).length
  const uniqueCategoriesCompletedCount = new Set(completedEntries.map((e) => e.category_id)).size

  // Check Early Bird (< 9 AM) and Night Owl (>= 22 / 10 PM)
  let hasEarlyBird = false
  let hasNightOwl = false

  completedEntries.forEach((e) => {
    if (e.created_at) {
      const date = new Date(e.created_at)
      const hour = date.getHours()
      if (hour < 9) hasEarlyBird = true
      if (hour >= 22) hasNightOwl = true
    }
  })

  const newlyUnlockedObjects: Achievement[] = []

  for (const achievement of achievements as Achievement[]) {
    if (unlockedIds.has(achievement.id)) continue

    let shouldUnlock = false
    const reqValue = achievement.requirement_value

    switch (achievement.requirement_type) {
      case 'streak':
        shouldUnlock = bestStreak >= reqValue || (reqValue === 1 && totalCompletedDays >= 1)
        break

      case 'total_days':
        shouldUnlock = totalCompletedDays >= reqValue
        break

      case 'categories_count':
        shouldUnlock = categories.length >= reqValue
        break

      case 'journal_count':
        shouldUnlock = journalEntriesCount >= reqValue
        break

      case 'perfect_week':
        shouldUnlock = bestStreak >= 7
        break

      case 'perfect_month':
        shouldUnlock = bestStreak >= 30
        break

      case 'explorer':
        shouldUnlock = uniqueCategoriesCompletedCount >= 5
        break

      case 'early_bird':
        shouldUnlock = hasEarlyBird
        break

      case 'night_owl':
        shouldUnlock = hasNightOwl
        break

      case 'resource_count':
        shouldUnlock = resourceCount >= 25
        break

      case 'milestone':
        shouldUnlock = totalCompletedDays >= reqValue
        break
    }

    if (shouldUnlock) {
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
