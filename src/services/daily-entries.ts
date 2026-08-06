import { createClient } from '@/lib/supabase/client'
import { formatDateKey, subDays, getStreakFromDates, getLongestStreak } from '@/lib/date-utils'

const supabase = createClient()

export async function checkIn(
  categoryId: string,
  date?: string,
  journal?: { title: string; description: string; resource_url?: string | null }
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const entryDate = date || formatDateKey(new Date())

  // Upsert the entry
  const { data, error } = await supabase
    .from('daily_entries')
    .upsert(
      {
        category_id: categoryId,
        user_id: user.id,
        entry_date: entryDate,
        completed: true,
        title: journal?.title || '',
        description: journal?.description || '',
        resource_url: journal?.resource_url || null,
      },
      { onConflict: 'category_id,entry_date' }
    )
    .select()
    .single()

  if (error) throw error

  // Update streak after check-in
  await updateStreaks(categoryId)

  return data
}

export async function uncheckIn(categoryId: string, date?: string) {
  const entryDate = date || formatDateKey(new Date())

  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .eq('category_id', categoryId)
    .eq('entry_date', entryDate)

  if (error) throw error

  // Update streak after unchecking
  await updateStreaks(categoryId)
}

export async function updateEntry(
  entryId: string,
  updates: { title?: string; description?: string; resource_url?: string | null }
) {
  const { data, error } = await supabase
    .from('daily_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', entryId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteEntry(entryId: string, categoryId: string) {
  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .eq('id', entryId)

  if (error) throw error

  // Recalculate streaks after deletion
  await updateStreaks(categoryId)
}

export async function getEntryByDate(categoryId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('category_id', categoryId)
    .eq('entry_date', date)
    .eq('completed', true)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getRecentEntries(categoryId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('category_id', categoryId)
    .eq('completed', true)
    .order('entry_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function getEntriesByDateRange(
  categoryId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('category_id', categoryId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .eq('completed', true)
    .order('entry_date', { ascending: true })

  if (error) throw error
  return data
}

export async function getTodayEntries() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const today = formatDateKey(new Date())

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('entry_date', today)
    .eq('completed', true)

  if (error) throw error
  return data
}

export async function getHeatmapData(categoryId: string, year?: number) {
  const startDate = year ? `${year}-01-01` : formatDateKey(subDays(new Date(), 364))
  const endDate = year ? `${year}-12-31` : formatDateKey(new Date())

  const { data, error } = await supabase
    .from('daily_entries')
    .select('entry_date, completed, title, description, resource_url')
    .eq('category_id', categoryId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .eq('completed', true)

  if (error) throw error

  const heatmap: Record<string, number> = {}
  data.forEach((entry) => {
    heatmap[entry.entry_date] = (heatmap[entry.entry_date] || 0) + 1
  })

  return heatmap
}

export async function getHeatmapEntries(categoryId: string, year?: number) {
  const startDate = year ? `${year}-01-01` : formatDateKey(subDays(new Date(), 364))
  const endDate = year ? `${year}-12-31` : formatDateKey(new Date())

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('category_id', categoryId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .eq('completed', true)

  if (error) throw error

  // Build a map of date -> entry for quick lookup
  const entriesMap: Record<string, typeof data[0]> = {}
  data.forEach((entry) => {
    entriesMap[entry.entry_date] = entry
  })

  return entriesMap
}

export async function getAllHeatmapData(year?: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const startDate = year ? `${year}-01-01` : formatDateKey(subDays(new Date(), 364))
  const endDate = year ? `${year}-12-31` : formatDateKey(new Date())

  const { data, error } = await supabase
    .from('daily_entries')
    .select('entry_date, completed')
    .eq('user_id', user.id)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .eq('completed', true)

  if (error) throw error

  const heatmap: Record<string, number> = {}
  data.forEach((entry) => {
    heatmap[entry.entry_date] = (heatmap[entry.entry_date] || 0) + 1
  })

  return heatmap
}

export async function updateStreaks(categoryId: string) {
  // Fetch current category to get existing longest_streak
  const { data: category } = await supabase
    .from('categories')
    .select('longest_streak')
    .eq('id', categoryId)
    .single()

  const existingLongestStreak = category?.longest_streak || 0

  // Fetch all completed entries for this category
  const { data: entries, error } = await supabase
    .from('daily_entries')
    .select('entry_date')
    .eq('category_id', categoryId)
    .eq('completed', true)
    .order('entry_date', { ascending: false })

  if (error) throw error

  const dates = entries ? entries.map((e) => e.entry_date) : []

  // Calculate streaks using single source of truth rules
  const currentStreak = getStreakFromDates(dates)
  const calculatedLongestStreak = getLongestStreak(dates)

  // NEVER decrease longest streak
  const finalLongestStreak = Math.max(calculatedLongestStreak, existingLongestStreak)
  const totalCompletedDays = new Set(dates).size

  // Update the category
  await supabase
    .from('categories')
    .update({
      current_streak: currentStreak,
      longest_streak: finalLongestStreak,
      total_completed_days: totalCompletedDays,
    })
    .eq('id', categoryId)
}

