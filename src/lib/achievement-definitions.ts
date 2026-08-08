export interface AchievementDef {
  id: string
  name: string
  title?: string
  description: string
  icon: string
  badge_color: string
  category: 'Streak' | 'Total Days' | 'Category' | 'Journal' | 'Consistency' | 'Explorer' | 'Milestones'
  requirement_type:
    | 'first_completion'
    | 'streak'
    | 'total_days'
    | 'consistency'
    | 'categories_count'
    | 'journal_count'
    | 'explorer'
    | 'milestone'
    | 'cat_days'
    | 'cat_streak'
  requirement_value: number
  category_id?: string | null
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
}

export interface EvaluatedAchievement {
  achievement: AchievementDef
  current: number
  max: number
  ratio: number
  isUnlocked: boolean
  unlockedAt?: string | null
}

export const RARITY_COLORS: Record<AchievementDef['rarity'], { bg: string; border: string; text: string; hex: string }> = {
  Common: { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', hex: '#9ca3af' },
  Uncommon: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-500', hex: '#22c55e' },
  Rare: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', hex: '#3b82f6' },
  Epic: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500', hex: '#a855f7' },
  Legendary: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', hex: '#f59e0b' },
}

export const GLOBAL_ACHIEVEMENT_DEFINITIONS: AchievementDef[] = [
  // 1. GENERAL / FIRST ACTION
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first contribution.',
    icon: 'Sparkles',
    badge_color: '#10b981',
    category: 'Streak',
    requirement_type: 'first_completion',
    requirement_value: 1,
    rarity: 'Common',
  },
  {
    id: 'days_3',
    name: 'Getting Started',
    description: 'Complete 3 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#9ca3af',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 3,
    rarity: 'Common',
  },
  {
    id: 'days_7',
    name: 'Building Momentum',
    description: 'Complete 7 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#22c55e',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 7,
    rarity: 'Uncommon',
  },

  // 2. STREAK
  {
    id: 'streak_3',
    name: 'Three Day Flame',
    description: 'Maintain a 3-day streak.',
    icon: 'Flame',
    badge_color: '#22c55e',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 3,
    rarity: 'Uncommon',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak.',
    icon: 'Flame',
    badge_color: '#3b82f6',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 7,
    rarity: 'Rare',
  },
  {
    id: 'streak_14',
    name: 'Fortnight Focus',
    description: 'Maintain a 14-day streak.',
    icon: 'Flame',
    badge_color: '#8b5cf6',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 14,
    rarity: 'Rare',
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak.',
    icon: 'Crown',
    badge_color: '#a855f7',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 30,
    rarity: 'Epic',
  },
  {
    id: 'streak_50',
    name: 'Unstoppable',
    description: 'Maintain a 50-day streak.',
    icon: 'Zap',
    badge_color: '#ec4899',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 50,
    rarity: 'Epic',
  },
  {
    id: 'streak_100',
    name: 'Century',
    description: 'Maintain a 100-day streak.',
    icon: 'ShieldAlert',
    badge_color: '#f59e0b',
    category: 'Streak',
    requirement_type: 'streak',
    requirement_value: 100,
    rarity: 'Legendary',
  },

  // 3. TOTAL DAYS
  {
    id: 'days_10',
    name: '10 Days Strong',
    description: 'Complete 10 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#3b82f6',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 10,
    rarity: 'Rare',
  },
  {
    id: 'days_25',
    name: '25 Days Strong',
    description: 'Complete 25 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#a855f7',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 25,
    rarity: 'Epic',
  },
  {
    id: 'days_50',
    name: '50 Days Strong',
    description: 'Complete 50 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#f59e0b',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 50,
    rarity: 'Legendary',
  },
  {
    id: 'days_100',
    name: '100 Days Strong',
    description: 'Complete 100 unique contribution days.',
    icon: 'CalendarDays',
    badge_color: '#f59e0b',
    category: 'Total Days',
    requirement_type: 'total_days',
    requirement_value: 100,
    rarity: 'Legendary',
  },

  // 4. CONSISTENCY
  {
    id: 'consistency_5',
    name: 'Consistent Learner',
    description: 'Complete contributions on 5 consecutive days.',
    icon: 'Star',
    badge_color: '#3b82f6',
    category: 'Consistency',
    requirement_type: 'consistency',
    requirement_value: 5,
    rarity: 'Rare',
  },
  {
    id: 'consistency_10',
    name: 'Dedicated Learner',
    description: 'Complete contributions on 10 consecutive days.',
    icon: 'Trophy',
    badge_color: '#a855f7',
    category: 'Consistency',
    requirement_type: 'consistency',
    requirement_value: 10,
    rarity: 'Epic',
  },

  // 5. JOURNAL
  {
    id: 'journal_1',
    name: 'First Journal',
    description: 'Complete a contribution with a title and description.',
    icon: 'PenTool',
    badge_color: '#9ca3af',
    category: 'Journal',
    requirement_type: 'journal_count',
    requirement_value: 1,
    rarity: 'Common',
  },
  {
    id: 'journal_10',
    name: 'Knowledge Logger',
    description: 'Complete 10 contributions containing descriptions.',
    icon: 'BookOpen',
    badge_color: '#22c55e',
    category: 'Journal',
    requirement_type: 'journal_count',
    requirement_value: 10,
    rarity: 'Uncommon',
  },

  // 6. EXPLORER
  {
    id: 'explorer_3',
    name: 'Explorer',
    description: 'Create and use 3 different categories with at least one completed contribution each.',
    icon: 'Compass',
    badge_color: '#3b82f6',
    category: 'Explorer',
    requirement_type: 'explorer',
    requirement_value: 3,
    rarity: 'Rare',
  },
  {
    id: 'explorer_5',
    name: 'Multi-Discipline',
    description: 'Complete contributions in 5 different categories.',
    icon: 'Layers',
    badge_color: '#a855f7',
    category: 'Explorer',
    requirement_type: 'explorer',
    requirement_value: 5,
    rarity: 'Epic',
  },

  // 7. MILESTONE
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach a longest streak of at least 14 days.',
    icon: 'Award',
    badge_color: '#f59e0b',
    category: 'Milestones',
    requirement_type: 'milestone',
    requirement_value: 14,
    rarity: 'Rare',
  },
]

export function generateCategoryAchievements(
  categories: Array<{ id: string; name: string; color?: string }>
): AchievementDef[] {
  const achievements: AchievementDef[] = []

  for (const cat of categories) {
    const color = cat.color || '#3b82f6'

    achievements.push(
      {
        id: `cat_starter_${cat.id}`,
        name: `${cat.name} Starter`,
        title: `${cat.name} Starter`,
        description: `Complete 1 day in ${cat.name}.`,
        icon: 'CheckCircle2',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_days',
        requirement_value: 1,
        category_id: cat.id,
        rarity: 'Common',
      },
      {
        id: `cat_regular_${cat.id}`,
        name: `${cat.name} Regular`,
        title: `${cat.name} Regular`,
        description: `Complete 7 unique days in ${cat.name}.`,
        icon: 'CalendarDays',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_days',
        requirement_value: 7,
        category_id: cat.id,
        rarity: 'Uncommon',
      },
      {
        id: `cat_dedicated_${cat.id}`,
        name: `${cat.name} Dedicated`,
        title: `${cat.name} Dedicated`,
        description: `Complete 30 unique days in ${cat.name}.`,
        icon: 'Trophy',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_days',
        requirement_value: 30,
        category_id: cat.id,
        rarity: 'Rare',
      },
      {
        id: `cat_master_${cat.id}`,
        name: `${cat.name} Master`,
        title: `${cat.name} Master`,
        description: `Complete 100 unique days in ${cat.name}.`,
        icon: 'Crown',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_days',
        requirement_value: 100,
        category_id: cat.id,
        rarity: 'Epic',
      },
      {
        id: `cat_streak_${cat.id}`,
        name: `${cat.name} Streak`,
        title: `${cat.name} Streak`,
        description: `Maintain a 7-day streak in ${cat.name}.`,
        icon: 'Flame',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_streak',
        requirement_value: 7,
        category_id: cat.id,
        rarity: 'Rare',
      },
      {
        id: `cat_legend_${cat.id}`,
        name: `${cat.name} Legend`,
        title: `${cat.name} Legend`,
        description: `Maintain a 30-day streak in ${cat.name}.`,
        icon: 'Zap',
        badge_color: color,
        category: 'Category',
        requirement_type: 'cat_streak',
        requirement_value: 30,
        category_id: cat.id,
        rarity: 'Legendary',
      }
    )
  }

  return achievements
}

export function getAchievementProgress(
  achievement: {
    id: string
    requirement_type: string
    requirement_value: number
    category_id?: string | null
  },
  stats?: {
    totalCompletedDays?: number
    longestStreak?: number
    currentStreak?: number
    totalCategories?: number
    completedCategoriesCount?: number
    totalJournalEntries?: number
    categoryStatsMap?: Record<
      string,
      { completedDays: number; currentStreak: number; longestStreak: number }
    >
  } | null
): { current: number; max: number; ratio: number } {
  const reqVal = achievement.requirement_value || 1
  if (!stats) {
    return { current: 0, max: reqVal, ratio: 0 }
  }

  let current = 0

  switch (achievement.requirement_type) {
    case 'first_completion':
      current = (stats.totalCompletedDays || 0) > 0 ? 1 : 0
      break

    case 'streak':
    case 'consistency':
      current = stats.longestStreak || 0
      if (reqVal === 1 && (stats.totalCompletedDays || 0) >= 1) {
        current = Math.max(current, 1)
      }
      break

    case 'total_days':
      current = stats.totalCompletedDays || 0
      break

    case 'categories_count':
      current = stats.totalCategories || 0
      break

    case 'explorer':
      current = stats.completedCategoriesCount ?? stats.totalCategories ?? 0
      break

    case 'journal_count':
      current = stats.totalJournalEntries || 0
      break

    case 'milestone':
      if (achievement.id === 'rising_star') {
        current = stats.longestStreak || 0
      } else {
        current = stats.totalCompletedDays || 0
      }
      break

    case 'cat_days':
      if (achievement.category_id && stats.categoryStatsMap?.[achievement.category_id]) {
        current = stats.categoryStatsMap[achievement.category_id].completedDays || 0
      }
      break

    case 'cat_streak':
      if (achievement.category_id && stats.categoryStatsMap?.[achievement.category_id]) {
        const catStat = stats.categoryStatsMap[achievement.category_id]
        current = Math.max(catStat.currentStreak || 0, catStat.longestStreak || 0)
      }
      break

    default:
      current = 0
  }

  const ratio = Math.min(Math.round((current / reqVal) * 100), 100)
  return { current, max: reqVal, ratio }
}

export function evaluateAchievement(
  achievement: AchievementDef,
  stats?: {
    totalCompletedDays?: number
    longestStreak?: number
    currentStreak?: number
    totalCategories?: number
    completedCategoriesCount?: number
    totalJournalEntries?: number
    categoryStatsMap?: Record<
      string,
      { completedDays: number; currentStreak: number; longestStreak: number }
    >
  } | null,
  unlockedMap?: Map<string, string>
): EvaluatedAchievement {
  const { current, max, ratio } = getAchievementProgress(achievement, stats)
  const dbUnlockedAt = unlockedMap?.get(achievement.id)

  // Core rule: Unlocked if recorded in DB OR if current progress >= requirement max
  const isUnlocked = !!dbUnlockedAt || current >= max

  return {
    achievement,
    current,
    max,
    ratio: isUnlocked ? 100 : Math.min(ratio, 100),
    isUnlocked,
    unlockedAt: dbUnlockedAt || (isUnlocked ? new Date().toISOString() : null),
  }
}
