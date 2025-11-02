-- Migration: Add twitter field to Profile table
-- Date: 2025-01-XX

-- Add twitter column
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "twitter" TEXT;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS "Profile_twitter_idx" ON "Profile"("twitter");

