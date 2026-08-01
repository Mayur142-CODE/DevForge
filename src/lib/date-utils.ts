import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  subDays,
  subMonths,
  subYears,
  isToday,
  isSameDay,
  differenceInDays,
  getDay,
  addDays,
  parseISO,
} from 'date-fns'

export function getHeatmapDays(year?: number): Date[] {
  const now = new Date()
  const end = year ? new Date(year, 11, 31) : now
  const start = year ? new Date(year, 0, 1) : subDays(now, 364)

  const startDate = startOfWeek(start, { weekStartsOn: 0 })
  const endDate = endOfWeek(end, { weekStartsOn: 0 })

  return eachDayOfInterval({ start: startDate, end: endDate })
}

export function getWeekLabels(): string[] {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
}

export function getMonthLabels(days: Date[]): { label: string; index: number }[] {
  const months: { label: string; index: number }[] = []
  let lastMonth = -1

  days.forEach((day, index) => {
    const month = day.getMonth()
    if (month !== lastMonth && getDay(day) === 0) {
      months.push({ label: format(day, 'MMM'), index: Math.floor(index / 7) })
      lastMonth = month
    }
  })

  return months
}

export function getIntensityLevel(
  count: number,
  maxCount: number
): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (maxCount === 0) return 0
  const ratio = count / maxCount
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

export function formatDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM-dd')
}

export function getDateRangeForPeriod(
  period: 'week' | 'month' | 'year'
): { start: Date; end: Date } {
  const now = new Date()
  switch (period) {
    case 'week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) }
  }
}

export function getStreakFromDates(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const sorted = [...completedDates].sort().reverse()
  const today = formatDateKey(new Date())
  const yesterday = formatDateKey(subDays(new Date(), 1))

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const current = parseISO(sorted[i])
    const previous = parseISO(sorted[i - 1])
    const diff = differenceInDays(previous, current)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export function getLongestStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const sorted = [...completedDates].sort()
  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInDays(parseISO(sorted[i]), parseISO(sorted[i - 1]))
    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else if (diff > 1) {
      current = 1
    }
  }

  return longest
}

export { format, subDays, subMonths, subYears, isToday, isSameDay, parseISO, addDays, eachDayOfInterval, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays }
