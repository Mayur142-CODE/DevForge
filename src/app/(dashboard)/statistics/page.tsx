"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCategories } from '@/features/categories/api/use-categories'
import { useDailyEntries } from '@/features/daily-entries/api/use-daily-entries'
import { Loader2, TrendingUp, BarChart2, Activity, CalendarDays } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { motion } from 'framer-motion'
import { getLongestStreak } from '@/lib/date-utils'
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export default function StatisticsPage() {
  const { data: categories, isLoading: isCatLoading } = useCategories()
  const { data: entries, isLoading: isEntLoading } = useDailyEntries()

  if (isCatLoading || isEntLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Calculate high-level stats directly from daily entries
  const activeCategories = categories?.filter(c => c.is_active) || []
  const completedEntries = entries?.filter(e => e.completed) || []
  const totalCompletedDays = new Set(completedEntries.map(e => e.entry_date)).size
  const totalPossibleDays = activeCategories.length * 365
  const overallConsistency = totalPossibleDays > 0 ? ((totalCompletedDays / totalPossibleDays) * 100).toFixed(1) : 0
  const longestGlobalStreak = Math.max(
    ...activeCategories.map(c => {
      const catDates = completedEntries.filter(e => e.category_id === c.id).map(e => e.entry_date)
      return Math.max(getLongestStreak(catDates), c.longest_streak || 0)
    }),
    0
  )

  const currentYear = new Date().getFullYear()

  // Calculate monthly completions for LineChart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0')
    const monthEntries = completedEntries.filter(e => e.entry_date.startsWith(`${currentYear}-${month}`))
    return {
      name: format(new Date(currentYear, i, 1), 'MMM'),
      total: monthEntries.length
    }
  })

  // Calculate per-category completion for BarChart
  const categoryData = activeCategories.map(c => {
    const catDates = completedEntries.filter(e => e.category_id === c.id).map(e => e.entry_date)
    return {
      name: c.name,
      total: new Set(catDates).size
    }
  })

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-2">Analyze your overall consistency and progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Consistency</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConsistency}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all active categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Days</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Total completed tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Global Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{longestGlobalStreak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Longest streak in a single category</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Completions Over Time ({currentYear})</CardTitle>
            <CardDescription>Monthly activity across all categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }}
                  itemStyle={{ color: 'var(--popover-foreground)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--foreground)" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--background)', stroke: 'var(--foreground)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>By total completed days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--popover)', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="total" fill="var(--foreground)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
