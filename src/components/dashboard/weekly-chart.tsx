'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeeklyStats } from '@/hooks/use-statistics'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from 'next-themes'

export function WeeklyChart() {
  const { data, isLoading } = useWeeklyStats()
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  const barColor = theme === 'dark' ? '#e5e5e5' : '#171717'
  const gridColor = theme === 'dark' ? '#2a2a2a' : '#f0f0f0'
  const textColor = theme === 'dark' ? '#a1a1a1' : '#737373'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data || []} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#262626' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#3a3a3a' : '#e5e5e5'}`,
                borderRadius: '8px',
                fontSize: '12px',
              }}
              cursor={{ fill: theme === 'dark' ? '#262626' : '#f5f5f5' }}
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {(data || []).map((_, index) => (
                <Cell key={index} fill={barColor} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
