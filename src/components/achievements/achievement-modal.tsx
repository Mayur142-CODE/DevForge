"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DynamicIcon } from '@/components/achievements/dynamic-icon'
import { RARITY_COLORS } from '@/lib/achievement-definitions'
import { Button } from '@/components/ui/button'
import { X, Sparkles } from 'lucide-react'
import type { Achievement } from '@/types/database'

interface AchievementModalProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementModal({ achievement, onClose }: AchievementModalProps) {
  React.useEffect(() => {
    if (!achievement) return
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [achievement, onClose])

  if (!achievement) return null

  const rarity = (achievement.rarity || 'Common') as keyof typeof RARITY_COLORS
  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.Common

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border/50 bg-card p-6 shadow-2xl text-center"
        >
          {/* Glowing Aura Background */}
          <div
            className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ backgroundColor: achievement.badge_color || colors.hex }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center">
            {/* Header Tag */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border"
              style={{
                backgroundColor: `${achievement.badge_color || colors.hex}15`,
                borderColor: `${achievement.badge_color || colors.hex}40`,
                color: achievement.badge_color || colors.hex,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              🎉 Achievement Unlocked!
            </motion.div>

            {/* Badge Icon Box */}
            <motion.div
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative w-24 h-24 rounded-2xl flex items-center justify-center mb-4 shadow-xl text-white font-bold"
              style={{
                backgroundColor: achievement.badge_color || colors.hex,
                boxShadow: `0 10px 30px -5px ${achievement.badge_color || colors.hex}60`,
              }}
            >
              <DynamicIcon name={achievement.icon} className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title & Description */}
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">
              {achievement.name || achievement.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              "{achievement.description}"
            </p>

            {/* Rarity Pill */}
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.border} ${colors.text} mb-6`}
            >
              {rarity} Tier
            </span>

            <Button
              className="w-full rounded-xl font-medium shadow-sm"
              onClick={onClose}
              style={{ backgroundColor: achievement.badge_color || colors.hex, color: '#fff' }}
            >
              Awesome!
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
