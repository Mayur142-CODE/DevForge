'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const PRESET_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Violet', hex: '#8b5cf6' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Slate', hex: '#475569' },
]

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const normalizedValue = (value || '#6366f1').toLowerCase()

  return (
    <div className={cn('space-y-3', className)}>
      {/* Preset Swatches Grid */}
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
        {PRESET_COLORS.map((color) => {
          const isSelected = normalizedValue === color.hex.toLowerCase()
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onChange(color.hex)}
              title={color.name}
              className={cn(
                'relative h-8 w-full rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs border border-white/10',
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md z-10'
                  : 'hover:scale-105 hover:shadow-xs opacity-90 hover:opacity-100'
              )}
              style={{ backgroundColor: color.hex }}
            >
              {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm stroke-[3]" />}
            </button>
          )
        })}
      </div>

      {/* Custom Color Input Row with Live Preview */}
      <div className="flex items-center gap-3 pt-1">
        <div
          className="h-10 w-10 rounded-xl border border-border/50 shadow-xs flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: normalizedValue }}
        >
          <input
            type="color"
            value={normalizedValue}
            onChange={(e) => onChange(e.target.value)}
            className="h-full w-full opacity-0 cursor-pointer"
            title="Choose custom color"
          />
        </div>

        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#6366F1"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-mono tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 uppercase"
          />
        </div>
      </div>
    </div>
  )
}
