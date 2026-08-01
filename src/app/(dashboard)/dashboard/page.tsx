"use client"

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCategories } from '@/features/categories/api/use-categories'
import { useDailyEntries, useToggleDailyEntry } from '@/features/daily-entries/api/use-daily-entries'
import { Check, Flame, Trophy, Calendar, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { CategoryCard } from '@/components/categories/category-card'

export default function DashboardPage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories()
  const currentYear = new Date().getFullYear()
  const { data: dailyEntries, isLoading: isEntriesLoading } = useDailyEntries(currentYear)
  const toggleEntry = useToggleDailyEntry()
  const today = format(new Date(), 'yyyy-MM-dd')

  if (isCategoriesLoading || isEntriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const activeCategories = categories?.filter(c => c.is_active) || []
  const totalCompletedDays = categories?.reduce((sum, c) => sum + c.total_completed_days, 0) || 0
  const longestStreak = categories?.reduce((max, c) => Math.max(max, c.longest_streak), 0) || 0
  const todayCompleted = dailyEntries?.filter(e => e.entry_date === today && e.completed).length || 0

  return (
    <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your daily learning consistency.</p>
        </div>
      </div>

      {/* Top Stats - 4 Column Glassy Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Active Categories", value: activeCategories.length, icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Current Longest Streak", value: `${longestStreak} days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
          { title: "Total Completed Days", value: totalCompletedDays, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { title: "Today's Progress", value: `${todayCompleted} / ${activeCategories.length}`, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden relative group">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${stat.bg} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-4">
                  <p className="text-sm font-medium text-muted-foreground tracking-tight">{stat.title}</p>
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold tracking-tighter">{stat.value}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {activeCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed rounded-2xl">
            <h3 className="text-lg font-medium">No active categories</h3>
            <p className="text-muted-foreground mt-1">Create your first category to start tracking your progress.</p>
            <Link href="/categories" className={buttonVariants({ variant: "default", className: "mt-4" })}>
              Manage Categories
            </Link>
          </div>
        ) : (
          activeCategories.map((category, index) => {
            const categoryEntries = dailyEntries?.filter(e => e.category_id === category.id) || []
            
            return (
              <CategoryCard 
                key={category.id}
                category={category}
                dailyEntries={categoryEntries}
                onToggleEntry={(categoryId, date, completed) => toggleEntry.mutate({ categoryId, date, completed })}
                isTogglePending={toggleEntry.isPending}
                index={index}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
