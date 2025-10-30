-- Migration pour ajouter les champs manquants au modèle Affiliate
-- À exécuter sur la base de données de production Vercel

-- Ajouter le champ totalClicks s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Affiliate' AND column_name = 'totalClicks'
    ) THEN
        ALTER TABLE "Affiliate" ADD COLUMN "totalClicks" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Ajouter le champ applicationEmail s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Affiliate' AND column_name = 'applicationEmail'
    ) THEN
        ALTER TABLE "Affiliate" ADD COLUMN "applicationEmail" TEXT;
    END IF;
END $$;

-- Créer la table AffiliateClick si elle n'existe pas
CREATE TABLE IF NOT EXISTS "AffiliateClick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrerUrl" TEXT,
    "landingPage" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "country" TEXT,
    "city" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "referralId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AffiliateClick_affiliateId_fkey" FOREIGN KEY ("affiliateId") 
        REFERENCES "Affiliate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Créer les index pour AffiliateClick si la table a été créée
CREATE INDEX IF NOT EXISTS "AffiliateClick_affiliateId_idx" ON "AffiliateClick"("affiliateId");
CREATE INDEX IF NOT EXISTS "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt");
CREATE INDEX IF NOT EXISTS "AffiliateClick_converted_idx" ON "AffiliateClick"("converted");

-- Message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE 'Migration terminée avec succès !';
END $$;

