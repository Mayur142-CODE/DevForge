import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('requirement_value', { ascending: true })

  if (error) throw error
  return data
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

export async function checkAndUnlockAchievements() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get user's categories with streaks
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)

  // Get all achievements
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*')

  // Get already unlocked
  const { data: unlocked } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id)

  if (!categories || !achievements || !unlocked) return []

  const unlockedIds = new Set(unlocked.map((u) => u.achievement_id))
  const newlyUnlocked: string[] = []

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue

    let shouldUnlock = false

    switch (achievement.requirement_type) {
      case 'streak': {
        const relevantCategories = achievement.category_filter
          ? categories.filter((c) => c.name === achievement.category_filter)
          : categories
        shouldUnlock = relevantCategories.some(
          (c) => c.current_streak >= achievement.requirement_value
        )
        break
      }
      case 'total_days': {
        const relevantCategories = achievement.category_filter
          ? categories.filter((c) => c.name === achievement.category_filter)
          : categories
        const totalDays = relevantCategories.reduce(
          (sum, c) => sum + c.total_completed_days,
          0
        )
        shouldUnlock = totalDays >= achievement.requirement_value
        break
      }
      case 'first_completion': {
        shouldUnlock = categories.some((c) => c.total_completed_days > 0)
        break
      }
    }

    if (shouldUnlock) {
      const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievement.id })

      if (!error) {
        newlyUnlocked.push(achievement.name)
      }
    }
  }

  return newlyUnlocked
}
