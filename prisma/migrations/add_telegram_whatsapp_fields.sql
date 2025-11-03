-- Migration: Ajouter les champs telegram et whatsapp au modèle Profile
-- Date: 2025-11-03

-- Ajouter telegram à Profile (optionnel)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "telegram" TEXT;

-- Ajouter whatsapp à Profile (optionnel)
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;

