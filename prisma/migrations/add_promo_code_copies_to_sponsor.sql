-- Migration: Ajouter le tracking des copies de code promo
-- Ajoute un champ promoCodeCopies au modèle Sponsor

ALTER TABLE "Sponsor" ADD COLUMN "promoCodeCopies" INTEGER NOT NULL DEFAULT 0;

