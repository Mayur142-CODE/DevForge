import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { DailyEntry, DailyEntryInsert } from '@/types/database'
import { updateStreaks } from '@/services/daily-entries'
import { checkAndUnlockAchievements } from '@/services/achievements'

export function useDailyEntries(year?: number, month?: number) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['daily_entries', year ?? 'all', month ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('daily_entries').select('*')
      
      if (year) {
        const startDate = `${year}-${month ? String(month).padStart(2, '0') : '01'}-01`
        const endDate = month 
          ? `${year}-${String(month).padStart(2, '0')}-31` 
          : `${year}-12-31`
          
        query = query.gte('entry_date', startDate).lte('entry_date', endDate)
      }

      const { data, error } = await query
      if (error) throw error
      return data as DailyEntry[]
    },
  })
}

export function useToggleDailyEntry() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      categoryId,
      date,
      completed,
      title,
      description,
      resource_url,
    }: {
      categoryId: string
      date: string
      completed: boolean
      title?: string
      description?: string
      resource_url?: string | null
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (completed) {
        const entry: DailyEntryInsert = {
          category_id: categoryId,
          user_id: user.id,
          entry_date: date,
          completed,
          title: title || '',
          description: description || '',
          resource_url: resource_url || null,
        }

        const { data, error } = await supabase
          .from('daily_entries')
          .upsert(entry, { onConflict: 'category_id,entry_date' })
          .select()
          .single()

        if (error) throw error

        // Atomically update streaks
        await updateStreaks(categoryId)
        return data
      } else {
        // Uncheck
        const { error } = await supabase
          .from('daily_entries')
          .delete()
          .eq('category_id', categoryId)
          .eq('entry_date', date)

        if (error) throw error
        
        // Atomically update streaks
        await updateStreaks(categoryId)
        return null
      }
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['daily_entries'] })
      queryClient.invalidateQueries({ queryKey: ['daily-entries'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap'] })
      queryClient.invalidateQueries({ queryKey: ['heatmap-entries'] })
      queryClient.invalidateQueries({ queryKey: ['statistics'] })
      queryClient.invalidateQueries({ queryKey: ['recent-entries'] })
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      queryClient.invalidateQueries({ queryKey: ['user_achievements'] })

      try {
        await checkAndUnlockAchievements()
      } catch (e) {
        // Silently handle
      }
    },
  })
}
