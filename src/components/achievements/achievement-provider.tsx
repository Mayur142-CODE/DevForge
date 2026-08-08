"use client"

import * as React from 'react'
import { checkAndUnlockAchievements } from '@/services/achievements'
import { AchievementModal } from '@/components/achievements/achievement-modal'
import { useQueryClient } from '@tanstack/react-query'
import type { Achievement } from '@/types/database'

interface AchievementContextType {
  checkAchievements: () => Promise<void>
}

const AchievementContext = React.createContext<AchievementContextType>({
  checkAchievements: async () => {},
})

export function useAchievementTrigger() {
  return React.useContext(AchievementContext)
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlockedQueue, setUnlockedQueue] = React.useState<Achievement[]>([])
  const [currentModal, setCurrentModal] = React.useState<Achievement | null>(null)
  const queryClient = useQueryClient()
  const hasCheckedRef = React.useRef(false)

  const checkAchievements = React.useCallback(async () => {
    try {
      const newlyUnlocked = await checkAndUnlockAchievements()
      if (newlyUnlocked.length > 0) {
        setUnlockedQueue((prev) => [...prev, ...newlyUnlocked])
        // Invalidate caches so the UI updates automatically
        queryClient.invalidateQueries({ queryKey: ['user_achievements'] })
        queryClient.invalidateQueries({ queryKey: ['statistics'] })
      }
    } catch (err) {
      console.error('Failed checking achievements:', err)
    }
  }, [queryClient])

  // Run initial check once on mount — non-blocking (renders children immediately)
  React.useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true
    // Fire-and-forget: doesn't block rendering
    checkAchievements()
  }, [checkAchievements])

  // Queue runner for modal
  React.useEffect(() => {
    if (!currentModal && unlockedQueue.length > 0) {
      const next = unlockedQueue[0]
      setCurrentModal(next)
      setUnlockedQueue((prev) => prev.slice(1))
    }
  }, [currentModal, unlockedQueue])

  const handleClose = () => {
    setCurrentModal(null)
  }

  return (
    <AchievementContext.Provider value={{ checkAchievements }}>
      {children}
      <AchievementModal achievement={currentModal} onClose={handleClose} />
    </AchievementContext.Provider>
  )
}
