'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  checkIn,
  uncheckIn,
  getTodayEntries,
  getHeatmapData,
  getHeatmapEntries,
  getAllHeatmapData,
  updateEntry,
  deleteEntry,
  getEntryByDate,
  getRecentEntries,
} from '@/services/daily-entries'
import { checkAndUnlockAchievements } from '@/services/achievements'
import { toast } from 'sonner'
import type { DailyEntry } from '@/types/database'

export function useTodayEntries() {
  return useQuery({
    queryKey: ['daily-entries', 'today'],
    queryFn: getTodayEntries,
  })
}

export function useHeatmapData(categoryId: string, year?: number) {
  return useQuery({
    queryKey: ['heatmap', categoryId, year],
    queryFn: () => getHeatmapData(categoryId, year),
    enabled: !!categoryId,
  })
}

export function useHeatmapEntries(categoryId: string, year?: number) {
  return useQuery({
    queryKey: ['heatmap-entries', categoryId, year],
    queryFn: () => getHeatmapEntries(categoryId, year),
    enabled: !!categoryId,
  })
}

export function useAllHeatmapData(year?: number) {
  return useQuery({
    queryKey: ['heatmap', 'all', year],
    queryFn: () => getAllHeatmapData(year),
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      categoryId,
      date,
      title,
      description,
      resource_url,
    }: {
      categoryId: string
      date?: string
      title: string
      description: string
      resource_url?: string | null
    }) => checkIn(categoryId, date, { title, description, resource_url }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['daily_entries'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap-entries'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['recent-entries'] })
      toast.success('Entry saved! 🎉')

      // Check for new achievements
      try {
        const newAchievements = await checkAndUnlockAchievements()
        if (newAchievements.length > 0) {
          queryClient.invalidateQueries({ queryKey: ['achievements'] })
          newAchievements.forEach((name) => {
            toast.success(`🏆 Achievement Unlocked: ${name}!`, {
              duration: 5000,
            })
          })
        }
      } catch {
        // Silently fail achievement check
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save entry')
    },
  })
}

export function useUncheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, date }: { categoryId: string; date?: string }) =>
      uncheckIn(categoryId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['daily_entries'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap-entries'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['recent-entries'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to undo check in')
    },
  })
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      entryId,
      updates,
    }: {
      entryId: string
      updates: { title?: string; description?: string; resource_url?: string | null }
    }) => updateEntry(entryId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['daily_entries'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap-entries'] })
      queryClient.invalidateQueries({ queryKey: ['recent-entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry-by-date'] })
      toast.success('Entry updated!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update entry')
    },
  })
}

export function useDeleteEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ entryId, categoryId }: { entryId: string; categoryId: string }) =>
      deleteEntry(entryId, categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['daily_entries'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap-entries'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['recent-entries'] })
      queryClient.invalidateQueries({ queryKey: ['entry-by-date'] })
      toast.success('Entry deleted')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete entry')
    },
  })
}

export function useRecentEntries(categoryId: string, limit: number = 20) {
  return useQuery({
    queryKey: ['recent-entries', categoryId, limit],
    queryFn: () => getRecentEntries(categoryId, limit),
    enabled: !!categoryId,
  })
}

export function useEntryByDate(categoryId: string, date: string) {
  return useQuery({
    queryKey: ['entry-by-date', categoryId, date],
    queryFn: () => getEntryByDate(categoryId, date),
    enabled: !!categoryId && !!date,
  })
}
