-- Migration manuelle pour ajouter le champ showCoachingOnProfile
-- À exécuter dans Supabase SQL Editor

ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "showCoachingOnProfile" BOOLEAN NOT NULL DEFAULT false;

-- Vérifier que la colonne a été créée
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Profile' AND column_name = 'showCoachingOnProfile';

