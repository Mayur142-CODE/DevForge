export interface DefaultCategory {
  name: string
  description: string
  icon: string
  color: string
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: 'DevOps', description: 'DevOps practices and tools', icon: 'settings', color: '#6366f1' },
  { name: 'AI', description: 'Artificial Intelligence', icon: 'brain', color: '#8b5cf6' },
  { name: 'Machine Learning', description: 'ML algorithms and models', icon: 'cpu', color: '#a855f7' },
  { name: 'Deep Learning', description: 'Neural networks and deep learning', icon: 'layers', color: '#d946ef' },
  { name: 'Data Science', description: 'Data analysis and visualization', icon: 'bar-chart-3', color: '#ec4899' },
  { name: '.NET', description: '.NET framework and C#', icon: 'hash', color: '#512bd4' },
  { name: 'Laravel', description: 'PHP Laravel framework', icon: 'flame', color: '#ff2d20' },
  { name: 'MERN', description: 'MongoDB, Express, React, Node', icon: 'database', color: '#00ed64' },
  { name: 'React', description: 'React.js library', icon: 'atom', color: '#61dafb' },
  { name: 'Next.js', description: 'Next.js framework', icon: 'triangle', color: '#000000' },
  { name: 'System Design', description: 'System architecture and design', icon: 'network', color: '#0ea5e9' },
  { name: 'DSA', description: 'Data Structures and Algorithms', icon: 'binary', color: '#14b8a6' },
  { name: 'LeetCode', description: 'LeetCode problem solving', icon: 'code', color: '#ffa116' },
  { name: 'Git Commit', description: 'Daily Git contributions', icon: 'git-branch', color: '#f97316' },
  { name: 'Reading', description: 'Technical reading and books', icon: 'book-open', color: '#84cc16' },
  { name: 'Open Source', description: 'Open source contributions', icon: 'heart', color: '#ef4444' },
  { name: 'Competitive Programming', description: 'CP contests and practice', icon: 'trophy', color: '#eab308' },
  { name: 'Linux', description: 'Linux administration', icon: 'terminal', color: '#fcc624' },
  { name: 'Docker', description: 'Docker containers', icon: 'container', color: '#2496ed' },
  { name: 'Kubernetes', description: 'K8s orchestration', icon: 'ship', color: '#326ce5' },
  { name: 'AWS', description: 'Amazon Web Services', icon: 'cloud', color: '#ff9900' },
  { name: 'Terraform', description: 'Infrastructure as Code', icon: 'blocks', color: '#7b42bc' },
  { name: 'CI/CD', description: 'Continuous Integration/Deployment', icon: 'refresh-cw', color: '#22c55e' },
  { name: 'Cyber Security', description: 'Security practices', icon: 'shield', color: '#dc2626' },
  { name: 'Networking', description: 'Computer networking', icon: 'wifi', color: '#06b6d4' },
]

export interface AchievementDef {
  name: string
  description: string
  icon: string
  badge_color: string
  requirement_type: 'streak' | 'total_days' | 'perfect_week' | 'perfect_month' | 'first_completion' | 'category_specific'
  requirement_value: number
  category_filter: string | null
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { name: 'First Step', description: 'Complete your first task', icon: 'sparkles', badge_color: '#10b981', requirement_type: 'first_completion', requirement_value: 1, category_filter: null },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', badge_color: '#f59e0b', requirement_type: 'streak', requirement_value: 7, category_filter: null },
  { name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: 'star', badge_color: '#8b5cf6', requirement_type: 'streak', requirement_value: 30, category_filter: null },
  { name: 'Half Century', description: 'Maintain a 50-day streak', icon: 'medal', badge_color: '#ec4899', requirement_type: 'streak', requirement_value: 50, category_filter: null },
  { name: 'Centurion', description: 'Maintain a 100-day streak', icon: 'crown', badge_color: '#ef4444', requirement_type: 'streak', requirement_value: 100, category_filter: null },
  { name: 'Year Legend', description: 'Maintain a 365-day streak', icon: 'gem', badge_color: '#6366f1', requirement_type: 'streak', requirement_value: 365, category_filter: null },
  { name: 'Perfect Week', description: 'Complete all tasks for 7 consecutive days', icon: 'calendar-check', badge_color: '#0ea5e9', requirement_type: 'perfect_week', requirement_value: 7, category_filter: null },
  { name: 'Perfect Month', description: 'Complete all tasks for 30 consecutive days', icon: 'calendar-heart', badge_color: '#d946ef', requirement_type: 'perfect_month', requirement_value: 30, category_filter: null },
  { name: 'LeetCode Grinder', description: '100 days of LeetCode', icon: 'code', badge_color: '#ffa116', requirement_type: 'total_days', requirement_value: 100, category_filter: 'LeetCode' },
  { name: 'Git Machine', description: '100 days of Git commits', icon: 'git-branch', badge_color: '#f97316', requirement_type: 'total_days', requirement_value: 100, category_filter: 'Git Commit' },
  { name: 'Dedicated Learner', description: '50 total learning days', icon: 'graduation-cap', badge_color: '#14b8a6', requirement_type: 'total_days', requirement_value: 50, category_filter: null },
  { name: 'Knowledge Seeker', description: '200 total learning days', icon: 'book-marked', badge_color: '#84cc16', requirement_type: 'total_days', requirement_value: 200, category_filter: null },
]

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'layout-dashboard' },
  { label: 'Categories', href: '/categories', icon: 'grid-3x3' },
  { label: 'Statistics', href: '/statistics', icon: 'bar-chart-3' },
  { label: 'Achievements', href: '/achievements', icon: 'trophy' },
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
]

export const HEATMAP_COLORS = {
  light: {
    empty: '#ebedf0',
    level1: '#9be9a8',
    level2: '#40c463',
    level3: '#30a14e',
    level4: '#216e39',
  },
  dark: {
    empty: '#161b22',
    level1: '#0e4429',
    level2: '#006d32',
    level3: '#26a641',
    level4: '#39d353',
  },
}
