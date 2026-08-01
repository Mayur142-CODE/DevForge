'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  checkIn,
  uncheckIn,
  getTodayEntries,
  getHeatmapData,
  getAllHeatmapData,
} from '@/services/daily-entries'
import { checkAndUnlockAchievements } from '@/services/achievements'
import { toast } from 'sonner'

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

export function useAllHeatmapData(year?: number) {
  return useQuery({
    queryKey: ['heatmap', 'all', year],
    queryFn: () => getAllHeatmapData(year),
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, date }: { categoryId: string; date?: string }) =>
      checkIn(categoryId, date),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      toast.success('Task completed! 🎉')

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
      toast.error(error.message || 'Failed to check in')
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
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to undo check in')
    },
  })
}
