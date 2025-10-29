-- Database Migrations for AthLink SaaS
-- Run these commands in your Supabase SQL editor

-- Create extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE sport_type AS ENUM ('RUNNING', 'CYCLING', 'TRIATHLON', 'SWIMMING', 'SKIING', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_type AS ENUM ('FREE', 'PRO', 'ELITE', 'ATHLETE_PRO', 'COACH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable Row Level Security
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Link" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Race" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Sponsor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Analytics" ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view own data" ON "User" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON "User" FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Profiles are viewable by everyone" ON "Profile" FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON "Profile" FOR ALL USING (auth.uid()::text = "userId");

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profile_username ON "Profile"("username");
CREATE INDEX IF NOT EXISTS idx_profile_plan ON "Profile"("plan");
CREATE INDEX IF NOT EXISTS idx_analytics_profile_date ON "Analytics"("profileId", "date");
CREATE INDEX IF NOT EXISTS idx_links_profile ON "Link"("profileId");
CREATE INDEX IF NOT EXISTS idx_races_profile ON "Race"("profileId");
