-- DevForge Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon TEXT NOT NULL DEFAULT 'book',
    color TEXT NOT NULL DEFAULT '#6366f1',
    daily_target INT DEFAULT 1,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    total_completed_days INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- DAILY_ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN NOT NULL DEFAULT false,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category_id, entry_date)
);

-- ============================================
-- ACHIEVEMENTS (global, not per user)
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    badge_color TEXT NOT NULL DEFAULT '#f59e0b',
    requirement_type TEXT NOT NULL,
    requirement_value INT NOT NULL,
    category_filter TEXT
);

-- ============================================
-- USER_ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- REMINDERS
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL DEFAULT '09:00',
    is_active BOOLEAN DEFAULT true,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user ON daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_category ON daily_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_daily_entries_lookup ON daily_entries(category_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Categories
CREATE POLICY "Users can CRUD own categories"
    ON categories FOR ALL
    USING (auth.uid() = user_id);

-- Daily Entries
CREATE POLICY "Users can CRUD own entries"
    ON daily_entries FOR ALL
    USING (auth.uid() = user_id);

-- User Achievements
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Achievements (global, viewable by all authenticated)
CREATE POLICY "Anyone can view achievements"
    ON achievements FOR SELECT
    TO authenticated
    USING (true);

-- Reminders
CREATE POLICY "Users can CRUD own reminders"
    ON reminders FOR ALL
    USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA: Achievements
-- ============================================
INSERT INTO achievements (name, description, icon, badge_color, requirement_type, requirement_value, category_filter) VALUES
    ('First Step', 'Complete your first task', 'sparkles', '#10b981', 'first_completion', 1, NULL),
    ('Week Warrior', 'Maintain a 7-day streak', 'flame', '#f59e0b', 'streak', 7, NULL),
    ('Monthly Master', 'Maintain a 30-day streak', 'star', '#8b5cf6', 'streak', 30, NULL),
    ('Half Century', 'Maintain a 50-day streak', 'medal', '#ec4899', 'streak', 50, NULL),
    ('Centurion', 'Maintain a 100-day streak', 'crown', '#ef4444', 'streak', 100, NULL),
    ('Year Legend', 'Maintain a 365-day streak', 'gem', '#6366f1', 'streak', 365, NULL),
    ('Perfect Week', 'Complete all tasks for 7 consecutive days', 'calendar-check', '#0ea5e9', 'perfect_week', 7, NULL),
    ('Perfect Month', 'Complete all tasks for 30 consecutive days', 'calendar-heart', '#d946ef', 'perfect_month', 30, NULL),
    ('LeetCode Grinder', '100 days of LeetCode', 'code', '#ffa116', 'total_days', 100, 'LeetCode'),
    ('Git Machine', '100 days of Git commits', 'git-branch', '#f97316', 'total_days', 100, 'Git Commit'),
    ('Dedicated Learner', '50 total learning days', 'graduation-cap', '#14b8a6', 'total_days', 50, NULL),
    ('Knowledge Seeker', '200 total learning days', 'book-marked', '#84cc16', 'total_days', 200, NULL)
ON CONFLICT DO NOTHING;
