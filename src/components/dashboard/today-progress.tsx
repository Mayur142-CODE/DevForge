'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/use-categories'
import { useTodayEntries, useCheckIn, useUncheckIn } from '@/hooks/use-daily-entries'
import { StreakBadge } from '@/components/shared/streak-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { JournalEntryDialog } from '@/components/daily-entries/journal-entry-dialog'
import { Check, X, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { Celebration } from '@/components/shared/celebration'

export function TodayProgress() {
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const { data: todayEntries, isLoading: loadingEntries } = useTodayEntries()
  const checkIn = useCheckIn()
  const uncheckIn = useUncheckIn()
  const [celebrating, setCelebrating] = useState(false)
  const [journalCategoryId, setJournalCategoryId] = useState<string | null>(null)
  const [journalCategoryName, setJournalCategoryName] = useState<string>('')

  const completedIds = new Set(todayEntries?.map((e) => e.category_id) || [])

  const handleToggle = async (categoryId: string, categoryName: string) => {
    if (completedIds.has(categoryId)) {
      uncheckIn.mutate({ categoryId })
    } else {
      // Open journal modal instead of direct check-in
      setJournalCategoryId(categoryId)
      setJournalCategoryName(categoryName)
    }
  }

  const handleJournalSave = (data: { title: string; description: string; resource_url: string | null }) => {
    if (!journalCategoryId) return
    setCelebrating(true)
    checkIn.mutate({
      categoryId: journalCategoryId,
      title: data.title,
      description: data.description,
      resource_url: data.resource_url,
    })
    setJournalCategoryId(null)
  }

  if (loadingCategories || loadingEntries) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!categories?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Inbox}
            title="No categories yet"
            description="Add categories to start tracking your daily tasks"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Celebration trigger={celebrating} onComplete={() => setCelebrating(false)} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories
            .filter((c) => c.is_active)
            .slice(0, 8)
            .map((category, i) => {
              const isCompleted = completedIds.has(category.id)
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'flex items-center justify-between rounded-lg border border-border p-3 transition-all',
                    isCompleted && 'bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isCompleted && 'line-through text-muted-foreground'
                      )}
                    >
                      {category.name}
                    </span>
                    <StreakBadge streak={category.current_streak} size="sm" />
                  </div>
                  <Button
                    variant={isCompleted ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleToggle(category.id, category.name)}
                    disabled={checkIn.isPending || uncheckIn.isPending}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </motion.div>
              )
            })}
        </CardContent>
      </Card>

      <JournalEntryDialog
        open={!!journalCategoryId}
        onOpenChange={(open) => { if (!open) setJournalCategoryId(null) }}
        onSave={handleJournalSave}
        isPending={checkIn.isPending}
        categoryName={journalCategoryName}
      />
    </>
  )
}
