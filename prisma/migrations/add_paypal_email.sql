-- Migration: Add paypalEmail field to Profile table
-- This allows coaches to receive payments directly via PayPal

ALTER TABLE "Profile" 
ADD COLUMN IF NOT EXISTS "paypalEmail" TEXT;

-- Add comment
COMMENT ON COLUMN "Profile"."paypalEmail" IS 'Email PayPal pour recevoir les paiements des plans d''entraînement';

