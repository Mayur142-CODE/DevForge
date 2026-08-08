import * as React from 'react'
import {
  Flame,
  CalendarDays,
  FolderPlus,
  Layers,
  Grid,
  PenTool,
  BookOpen,
  Feather,
  Star,
  Trophy,
  Compass,
  Sun,
  Moon,
  Link2,
  Award,
  Medal,
  Crown,
  Gem,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  ShieldAlert,
  Target,
  CheckCircle2,
  LucideProps,
} from 'lucide-react'

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Flame,
  CalendarDays,
  FolderPlus,
  Layers,
  Grid,
  PenTool,
  BookOpen,
  Feather,
  Star,
  Trophy,
  Compass,
  Sun,
  Moon,
  Link2,
  Award,
  Medal,
  Crown,
  Gem,
  Lock,
  Unlock,
  Sparkles,
  Zap,
  ShieldAlert,
  Target,
  CheckCircle2,
}

interface DynamicIconProps extends LucideProps {
  name: string
  fallback?: React.FC<LucideProps>
}

export function DynamicIcon({ name, fallback: Fallback = Trophy, ...props }: DynamicIconProps) {
  const IconComponent = ICON_MAP[name] || Fallback
  return <IconComponent {...props} />
}
