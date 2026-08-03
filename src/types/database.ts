export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          icon: string
          color: string
          daily_target: number
          current_streak: number
          longest_streak: number
          total_completed_days: number
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          icon?: string
          color?: string
          daily_target?: number
          current_streak?: number
          longest_streak?: number
          total_completed_days?: number
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          icon?: string
          color?: string
          daily_target?: number
          current_streak?: number
          longest_streak?: number
          total_completed_days?: number
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      daily_entries: {
        Row: {
          id: string
          category_id: string
          user_id: string
          entry_date: string
          completed: boolean
          notes: string
          title: string
          description: string
          resource_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          user_id: string
          entry_date?: string
          completed?: boolean
          notes?: string
          title?: string
          description?: string
          resource_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          user_id?: string
          entry_date?: string
          completed?: boolean
          notes?: string
          title?: string
          description?: string
          resource_url?: string | null
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          badge_color: string
          requirement_type: string
          requirement_value: number
          category_filter: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          badge_color?: string
          requirement_type: string
          requirement_value: number
          category_filter?: string | null
        }
        Update: {
          name?: string
          description?: string
          icon?: string
          badge_color?: string
          requirement_type?: string
          requirement_value?: number
          category_filter?: string | null
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          reminder_time: string
          is_active: boolean
          timezone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reminder_time?: string
          is_active?: boolean
          timezone?: string
          created_at?: string
        }
        Update: {
          reminder_time?: string
          is_active?: boolean
          timezone?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type DailyEntry = Database['public']['Tables']['daily_entries']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type Reminder = Database['public']['Tables']['reminders']['Row']

export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type DailyEntryInsert = Database['public']['Tables']['daily_entries']['Insert']
export type DailyEntryUpdate = Database['public']['Tables']['daily_entries']['Update']
