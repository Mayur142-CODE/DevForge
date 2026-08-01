import { createClient } from '@/lib/supabase/client'
import { formatDateKey, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from '@/lib/date-utils'

const supabase = createClient()

export interface OverviewStats {
  totalCategories: number
  activeCategories: number
  longestStreak: number
  totalCompletedDays: number
  todayCompleted: number
  todayTotal: number
  overallConsistency: number
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const today = formatDateKey(new Date())
  const { data: todayEntries } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_date', today)
    .eq('completed', true)

  if (!categories) {
    return {
      totalCategories: 0,
      activeCategories: 0,
      longestStreak: 0,
      totalCompletedDays: 0,
      todayCompleted: 0,
      todayTotal: 0,
      overallConsistency: 0,
    }
  }

  const longestStreak = Math.max(...categories.map((c) => c.longest_streak), 0)
  const totalCompletedDays = categories.reduce((sum, c) => sum + c.total_completed_days, 0)

  return {
    totalCategories: categories.length,
    activeCategories: categories.filter((c) => c.current_streak > 0).length,
    longestStreak,
    totalCompletedDays,
    todayCompleted: todayEntries?.length || 0,
    todayTotal: categories.length,
    overallConsistency: categories.length > 0
      ? Math.round((totalCompletedDays / (categories.length * 365)) * 100)
      : 0,
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

  const days: WeeklyData[] = []
  const { data: categories } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const totalCategories = categories?.length || 0

  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateKey = formatDateKey(date)

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('id')
      .eq('user_id', user.id)
      .eq('entry_date', dateKey)
      .eq('completed', true)

    days.push({
      day: format(date, 'EEE'),
      completed: entries?.length || 0,
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

  const months: MonthlyData[] = []

  for (let i = 11; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const start = formatDateKey(startOfMonth(date))
    const end = formatDateKey(endOfMonth(date))

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('id')
      .eq('user_id', user.id)
      .gte('entry_date', start)
      .lte('entry_date', end)
      .eq('completed', true)

    const { data: categories } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const total = (categories?.length || 0) * daysInMonth
    const completed = entries?.length || 0

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
