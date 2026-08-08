import { createClient } from '@/lib/supabase/client'
import { formatDateKey, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, format, getStreakFromDates, getLongestStreak } from '@/lib/date-utils'

const supabase = createClient()

export interface CategoryStat {
  completedDays: number
  currentStreak: number
  longestStreak: number
}

export interface OverviewStats {
  totalCategories: number
  activeCategories: number
  longestStreak: number
  totalCompletedDays: number
  completedCategoriesCount: number
  todayCompleted: number
  todayTotal: number
  overallConsistency: number
  totalJournalEntries: number
  categoryStatsMap: Record<string, CategoryStat>
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Parallel fetch: categories and completed entries
  const [catResult, entriesResult] = await Promise.all([
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
  ])

  const categories = catResult.data
  const allCompletedEntries = entriesResult.data

  const today = formatDateKey(new Date())
  const todayEntries = (allCompletedEntries || []).filter(e => e.entry_date === today)

  if (!categories || categories.length === 0) {
    return {
      totalCategories: 0,
      activeCategories: 0,
      longestStreak: 0,
      totalCompletedDays: 0,
      completedCategoriesCount: 0,
      todayCompleted: 0,
      todayTotal: 0,
      overallConsistency: 0,
      totalJournalEntries: 0,
      categoryStatsMap: {},
    }
  }

  // Count unique calendar dates where user completed at least 1 category
  const uniqueDates = new Set((allCompletedEntries || []).map(e => e.entry_date))
  const totalCompletedDays = uniqueDates.size

  const categoryStatsMap: Record<string, CategoryStat> = {}

  // Calculate streaks & unique completed days dynamically per category
  const categoryStreaks = categories.map(c => {
    const catEntries = (allCompletedEntries || []).filter(e => e.category_id === c.id).map(e => e.entry_date)
    const uniqueCatDates = new Set(catEntries)
    const current = getStreakFromDates(Array.from(uniqueCatDates))
    const longest = Math.max(getLongestStreak(Array.from(uniqueCatDates)), c.longest_streak || 0)

    categoryStatsMap[c.id] = {
      completedDays: uniqueCatDates.size,
      currentStreak: current,
      longestStreak: longest,
    }

    return { current, longest }
  })

  const activeCategoriesCount = categoryStreaks.filter(s => s.current > 0).length
  const longestStreak = Math.max(...categoryStreaks.map(s => s.longest), 0)

  // Total journal entries (entries with title or description)
  const journalEntries = (allCompletedEntries || []).filter(e => e.title || e.description)
  const completedCategoriesCount = new Set((allCompletedEntries || []).map(e => e.category_id)).size

  return {
    totalCategories: categories.length,
    activeCategories: activeCategoriesCount,
    longestStreak,
    totalCompletedDays,
    completedCategoriesCount,
    todayCompleted: new Set(todayEntries.map(e => e.category_id)).size,
    todayTotal: categories.length,
    overallConsistency: categories.length > 0
      ? Math.round((totalCompletedDays / (categories.length * 365)) * 100)
      : 0,
    totalJournalEntries: journalEntries.length,
    categoryStatsMap,
  }
}

export interface WeeklyData {
  day: string
  completed: number
  total: number
}

export async function getWeeklyStats(): Promise<WeeklyData[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Calculate date range for last 7 days
  const endDate = formatDateKey(new Date())
  const startDate = formatDateKey(subDays(new Date(), 6))

  // Parallel fetch: categories count and entries in range
  const [catResult, entriesResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('daily_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .eq('completed', true),
  ])

  const totalCategories = catResult.data?.length || 0
  const entries = entriesResult.data || []

  // Group entries by date in memory
  const entriesByDate = new Map<string, number>()
  entries.forEach(e => {
    entriesByDate.set(e.entry_date, (entriesByDate.get(e.entry_date) || 0) + 1)
  })

  const days: WeeklyData[] = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateKey = formatDateKey(date)
    days.push({
      day: format(date, 'EEE'),
      completed: entriesByDate.get(dateKey) || 0,
      total: totalCategories,
    })
  }

  return days
}

export interface MonthlyData {
  month: string
  completed: number
  total: number
  percentage: number
}

export async function getMonthlyStats(): Promise<MonthlyData[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Calculate date range for last 12 months
  const now = new Date()
  const startMonth = new Date(now)
  startMonth.setMonth(startMonth.getMonth() - 11)
  const rangeStart = formatDateKey(startOfMonth(startMonth))
  const rangeEnd = formatDateKey(endOfMonth(now))

  // Parallel fetch: categories and all entries in the 12-month range
  const [catResult, entriesResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true),
    supabase
      .from('daily_entries')
      .select('entry_date')
      .eq('user_id', user.id)
      .gte('entry_date', rangeStart)
      .lte('entry_date', rangeEnd)
      .eq('completed', true),
  ])

  const totalCategories = catResult.data?.length || 0
  const entries = entriesResult.data || []

  // Group entries by year-month in memory
  const entriesByMonth = new Map<string, number>()
  entries.forEach(e => {
    const monthKey = e.entry_date.substring(0, 7) // 'YYYY-MM'
    entriesByMonth.set(monthKey, (entriesByMonth.get(monthKey) || 0) + 1)
  })

  const months: MonthlyData[] = []
  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const total = totalCategories * daysInMonth
    const completed = entriesByMonth.get(monthKey) || 0

    months.push({
      month: format(date, 'MMM'),
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    })
  }

  return months
}

export async function getYearlyStats() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const now = new Date()
  const start = formatDateKey(startOfYear(now))
  const end = formatDateKey(endOfYear(now))

  const { data: entries } = await supabase
    .from('daily_entries')
    .select('entry_date')
    .eq('user_id', user.id)
    .gte('entry_date', start)
    .lte('entry_date', end)
    .eq('completed', true)

  return entries || []
}
