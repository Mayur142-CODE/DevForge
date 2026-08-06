'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { eachDayOfInterval, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { getHeatmapDays, getMonthLabels, formatDateKey } from '@/lib/date-utils'
import { HEATMAP_COLORS } from '@/lib/constants'
import { HeatmapCell } from '@/components/heatmap/heatmap-cell'
import { cn } from '@/lib/utils'
import type { DailyEntry } from '@/types/database'

export interface HeatmapCalendarProps {
  /** Map of date strings (yyyy-MM-dd) to completion counts */
  data?: Record<string, number>
  /** Alternatively, array of completed date strings */
  completedDates?: string[]
  /** Map of date strings to DailyEntry object(s), or array of DailyEntry */
  entries?: Record<string, DailyEntry | DailyEntry[]> | DailyEntry[]
  /** Category theme accent color */
  color?: string
  /** Filter year (optional) */
  year?: number
  /** Number of days to display (default 365, or e.g. 84 for 12-week card view) */
  daysCount?: number
  /** Additional CSS class names */
  className?: string
  /** Click handler for cell */
  onCellClick?: (date: string, entry?: DailyEntry | null) => void
}

export function HeatmapCalendar({
  data,
  completedDates,
  entries,
  color,
  year,
  daysCount = 365,
  className,
  onCellClick,
}: HeatmapCalendarProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Calculate days interval
  const days = useMemo(() => {
    if (daysCount && daysCount !== 365) {
      const today = new Date()
      const startDate = startOfWeek(subDays(today, daysCount - 1), { weekStartsOn: 0 })
      const endDate = endOfWeek(today, { weekStartsOn: 0 })
      return eachDayOfInterval({ start: startDate, end: endDate })
    }
    return getHeatmapDays(year)
  }, [year, daysCount])

  const monthLabels = useMemo(() => getMonthLabels(days), [days])

  // Normalize counts map
  const countsMap = useMemo(() => {
    if (data) return data
    if (completedDates) {
      const map: Record<string, number> = {}
      completedDates.forEach((d) => {
        map[d] = (map[d] || 0) + 1
      })
      return map
    }
    return {}
  }, [data, completedDates])

  // Normalize entries map
  const entriesMap = useMemo(() => {
    if (!entries) return {}
    if (Array.isArray(entries)) {
      const map: Record<string, DailyEntry[]> = {}
      entries.forEach((e) => {
        if (!map[e.entry_date]) map[e.entry_date] = []
        map[e.entry_date].push(e)
      })
      return map
    }
    return entries as Record<string, DailyEntry | DailyEntry[]>
  }, [entries])

  const maxCount = useMemo(() => {
    const values = Object.values(countsMap)
    return values.length > 0 ? Math.max(...values) : 1
  }, [countsMap])

  // Build weeks (columns)
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const getColor = (count: number) => {
    if (count === 0) return isDark ? HEATMAP_COLORS.dark.empty : HEATMAP_COLORS.light.empty
    if (color) {
      const ratio = count / maxCount
      if (ratio <= 0.25) return `${color}33`
      if (ratio <= 0.5) return `${color}66`
      if (ratio <= 0.75) return `${color}99`
      return color
    }
    const colors = isDark ? HEATMAP_COLORS.dark : HEATMAP_COLORS.light
    const ratio = count / maxCount
    if (ratio <= 0.25) return colors.level1
    if (ratio <= 0.5) return colors.level2
    if (ratio <= 0.75) return colors.level3
    return colors.level4
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn('flex flex-col space-y-2 w-full', className)}
    >
      <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide pb-2 w-full custom-scrollbar">
        <div className="min-w-max flex">
          {/* Day of Week Labels */}
          <div className="flex flex-col text-[10px] text-muted-foreground w-8 justify-between pb-1 mt-[20px] h-[105px]">
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Mon</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Wed</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
            <span style={{ lineHeight: '14px', height: '14px' }}>Fri</span>
            <span style={{ lineHeight: '14px', height: '14px' }}></span>
          </div>

          <div className="flex flex-col">
            {/* Month Labels */}
            <div className="flex text-[10px] text-muted-foreground mb-1 relative h-[16px]">
              {monthLabels.map((month, i) => (
                <div
                  key={`${month.label}-${i}`}
                  className="absolute"
                  style={{
                    left: `${month.index * 15}px`,
                  }}
                >
                  {month.label}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px] h-[105px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day) => {
                    const dateKey = formatDateKey(day)
                    const count = countsMap[dateKey] || 0
                    const rawEntry = entriesMap[dateKey] || null
                    const entry = Array.isArray(rawEntry) ? rawEntry[0] || null : rawEntry

                    return (
                      <HeatmapCell
                        key={dateKey}
                        date={day}
                        count={count}
                        color={getColor(count)}
                        entry={entry}
                        onClick={onCellClick}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
