"use client"

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '@/components/shared/page-transition'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { useCategory, useDeleteCategory } from '@/hooks/use-categories'
import { useHeatmapData, useHeatmapEntries, useUpdateEntry, useDeleteEntry } from '@/hooks/use-daily-entries'
import { HeatmapCalendar } from '@/components/heatmap/heatmap-calendar'
import { AnimatedCounter } from '@/components/shared/animated-counter'
import { ProgressBar } from '@/components/shared/progress-bar'
import { CategoryFormDialog } from '@/components/categories/category-form-dialog'
import { EntryDetailDialog } from '@/components/daily-entries/entry-detail-dialog'
import { LearningHistory } from '@/components/daily-entries/learning-history'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Pencil, Trash2, Flame, Trophy, CalendarDays, TrendingUp, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getStreakFromDates, getLongestStreak, getCategoryCompletionRate } from '@/lib/date-utils'
import { ConfirmDeleteDialog } from '@/components/categories/confirm-delete-dialog'
import type { DailyEntry } from '@/types/database'

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: category, isLoading } = useCategory(id)
  const { data: heatmapData, isLoading: loadingHeatmap } = useHeatmapData(id)
  const { data: heatmapEntries } = useHeatmapEntries(id)
  const deleteCategory = useDeleteCategory()
  const updateEntry = useUpdateEntry()
  const deleteEntry = useDeleteEntry()
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null)
  const [showEntryDetail, setShowEntryDetail] = useState(false)

  const confirmDelete = () => {
    deleteCategory.mutate(id, {
      onSuccess: () => router.push('/categories'),
    })
  }

  const handleCellClick = (date: string, entry?: DailyEntry | null) => {
    if (entry) {
      setSelectedEntry(entry)
      setShowEntryDetail(true)
    }
  }

  const handleUpdateEntry = (entryId: string, updates: { title: string; description: string; resource_url: string | null }) => {
    updateEntry.mutate({ entryId, updates })
  }

  const handleDeleteEntry = (entryId: string, categoryId: string) => {
    deleteEntry.mutate({ entryId, categoryId })
  }

  if (isLoading || loadingHeatmap) {
    return (
      <div className="space-y-8 p-6 max-w-[1400px] mx-auto w-full">
        <Skeleton className="h-4 w-32 mb-8" />
        <div className="flex items-start justify-between mb-12">
          <div className="flex gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-2xl mb-8" />
        <div className="grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <PageTransition>
        <div className="text-center py-24">
          <p className="text-lg text-muted-foreground">Category not found</p>
          <Link 
            href="/categories"
            className={buttonVariants({ variant: "outline", className: "mt-6" })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </div>
      </PageTransition>
    )
  }

  const completedDates = Object.keys(heatmapData || {}).filter(d => (heatmapData || {})[d] > 0)
  const currentStreak = getStreakFromDates(completedDates)
  const longestStreak = Math.max(getLongestStreak(completedDates), category.longest_streak || 0)
  const totalCompletedDays = new Set(completedDates).size
  const completionRate = getCategoryCompletionRate(category.created_at, completedDates)

  const stats = [
    { label: 'Current Streak', value: currentStreak, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", suffix: 'd' },
    { label: 'Longest Streak', value: longestStreak, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10", suffix: 'd' },
    { label: 'Total Completions', value: totalCompletedDays, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", suffix: '' },
    { label: 'Completion Rate', value: completionRate, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10", suffix: '%' },
  ]

  return (
    <PageTransition>
      <div className="space-y-10 p-6 max-w-[1400px] mx-auto w-full pb-20">
        
        {/* Navigation & Header */}
        <div>
          <Link
            href="/categories"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-6">
              <div
                className="h-20 w-20 rounded-2xl flex items-center justify-center text-3xl text-white font-bold shadow-lg"
                style={{ backgroundColor: category.color, boxShadow: `0 8px 32px 0 ${category.color}50` }}
              >
                {category.icon[0]?.toUpperCase() || 'C'}
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-border/40 hover:bg-secondary/80"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="mr-2 h-4 w-4 text-muted-foreground" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteCategory.isPending}
                className="rounded-lg border-border/40 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Massive Hero Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-border/40 shadow-md bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
            <CardHeader className="pb-2 px-8 pt-8">
              <CardTitle className="text-xl font-semibold flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
                Contribution Graph
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              <div className="bg-secondary/10 p-6 rounded-2xl border border-border/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-secondary/20 to-transparent pointer-events-none z-10 rounded-r-2xl"></div>
                <HeatmapCalendar
                  data={heatmapData || {}}
                  entries={heatmapEntries}
                  color={category.color}
                  className="scale-[1.02] transform-gpu origin-left"
                  onCellClick={handleCellClick}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <Card className="h-full border-border/40 shadow-sm bg-card/50 backdrop-blur-sm overflow-hidden relative group rounded-2xl hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full ${stat.bg} blur-3xl opacity-40 group-hover:opacity-70 transition-opacity`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <AnimatedCounter
                      value={stat.value}
                      className="text-4xl font-bold tracking-tighter"
                      suffix={stat.suffix}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress & Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-lg font-semibold">Streak Progress</CardTitle>
              <CardDescription>How close you are to beating your longest streak</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground font-medium">Current Streak</span>
                    <span className="font-bold text-foreground">{currentStreak} <span className="text-muted-foreground font-normal">/ {Math.max(longestStreak, 1)} days</span></span>
                  </div>
                  <ProgressBar
                    value={currentStreak}
                    max={Math.max(longestStreak, 1)}
                    color={category.color}
                    size="lg"
                    className="bg-secondary/40 rounded-full overflow-hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-lg font-semibold">Overall Consistency</CardTitle>
              <CardDescription>Your lifetime completion rate</CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground font-medium">Completion Rate</span>
                    <span className="font-bold text-foreground">{completionRate}%</span>
                  </div>
                  <ProgressBar
                    value={completionRate}
                    max={100}
                    color={category.color}
                    size="lg"
                    className="bg-secondary/40 rounded-full overflow-hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning History */}
        <LearningHistory categoryId={id} color={category.color} />

        <CategoryFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          category={category}
        />
        
        <ConfirmDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDelete}
          isDeleting={deleteCategory.isPending}
        />

        <EntryDetailDialog
          open={showEntryDetail}
          onOpenChange={setShowEntryDetail}
          entry={selectedEntry}
          onUpdate={handleUpdateEntry}
          onDelete={handleDeleteEntry}
          isUpdating={updateEntry.isPending}
          isDeleting={deleteEntry.isPending}
        />
      </div>
    </PageTransition>
  )
}
