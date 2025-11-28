-- Migration: Add paypalEmail field to Profile table
-- Execute this SQL in your Supabase SQL Editor or via psql

ALTER TABLE "Profile" 
ADD COLUMN IF NOT EXISTS "paypalEmail" TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Profile' AND column_name = 'paypalEmail';

