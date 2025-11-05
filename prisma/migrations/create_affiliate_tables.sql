-- ============================================================
-- Migration: Création des tables d'affiliation pour Athlink
-- Date: 2025-11-05
-- ============================================================

-- 1. Supprimer les anciens enums s'ils existent (pour éviter les conflits)
DROP TYPE IF EXISTS "AffiliateStatus" CASCADE;
DROP TYPE IF EXISTS "ReferralStatus" CASCADE;
DROP TYPE IF EXISTS "ConversionType" CASCADE;
DROP TYPE IF EXISTS "CommissionType" CASCADE;
DROP TYPE IF EXISTS "CommissionStatus" CASCADE;

-- 2. Créer les ENUMS
CREATE TYPE "AffiliateStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'CONVERTED', 'EXPIRED');
CREATE TYPE "ConversionType" AS ENUM ('SIGNUP', 'UPGRADE', 'PAYMENT');
CREATE TYPE "CommissionType" AS ENUM ('REFERRAL', 'BONUS', 'MANUAL');
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- 3. Créer la table Affiliate
CREATE TABLE IF NOT EXISTS "Affiliate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'PENDING',
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.40,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "totalConversions" INTEGER NOT NULL DEFAULT 0,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,
    "stripeAccountId" TEXT,
    "stripeAccountStatus" TEXT,
    "applicationEmail" TEXT,
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- 4. Créer la table AffiliateClick
CREATE TABLE IF NOT EXISTS "AffiliateClick" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "AffiliateClick_pkey" PRIMARY KEY ("id")
);

-- 5. Créer la table Referral
CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCode" TEXT NOT NULL,
    "conversionType" "ConversionType" NOT NULL DEFAULT 'SIGNUP',
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrerUrl" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "convertedAt" TIMESTAMP(3),
    "conversionValue" DOUBLE PRECISION,
    "commissionEarned" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- 6. Créer la table Commission
CREATE TABLE IF NOT EXISTS "Commission" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "referralId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "CommissionType" NOT NULL DEFAULT 'REFERRAL',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "stripeTransferId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeSubscriptionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- 7. Créer les contraintes UNIQUE
CREATE UNIQUE INDEX IF NOT EXISTS "Affiliate_userId_key" ON "Affiliate"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Affiliate_affiliateCode_key" ON "Affiliate"("affiliateCode");
CREATE UNIQUE INDEX IF NOT EXISTS "Affiliate_stripeAccountId_key" ON "Affiliate"("stripeAccountId");

-- 8. Créer les INDEX pour les performances
CREATE INDEX IF NOT EXISTS "Affiliate_affiliateCode_idx" ON "Affiliate"("affiliateCode");
CREATE INDEX IF NOT EXISTS "Affiliate_status_idx" ON "Affiliate"("status");
CREATE INDEX IF NOT EXISTS "Affiliate_stripeAccountId_idx" ON "Affiliate"("stripeAccountId");

CREATE INDEX IF NOT EXISTS "AffiliateClick_affiliateId_idx" ON "AffiliateClick"("affiliateId");
CREATE INDEX IF NOT EXISTS "AffiliateClick_createdAt_idx" ON "AffiliateClick"("createdAt");
CREATE INDEX IF NOT EXISTS "AffiliateClick_converted_idx" ON "AffiliateClick"("converted");

CREATE INDEX IF NOT EXISTS "Referral_affiliateId_idx" ON "Referral"("affiliateId");
CREATE INDEX IF NOT EXISTS "Referral_referredUserId_idx" ON "Referral"("referredUserId");
CREATE INDEX IF NOT EXISTS "Referral_referralCode_idx" ON "Referral"("referralCode");
CREATE INDEX IF NOT EXISTS "Referral_status_idx" ON "Referral"("status");
CREATE INDEX IF NOT EXISTS "Referral_stripeCustomerId_idx" ON "Referral"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS "Referral_stripeSubscriptionId_idx" ON "Referral"("stripeSubscriptionId");

CREATE INDEX IF NOT EXISTS "Commission_affiliateId_idx" ON "Commission"("affiliateId");
CREATE INDEX IF NOT EXISTS "Commission_status_idx" ON "Commission"("status");
CREATE INDEX IF NOT EXISTS "Commission_type_idx" ON "Commission"("type");
CREATE INDEX IF NOT EXISTS "Commission_stripeTransferId_idx" ON "Commission"("stripeTransferId");

-- 9. Créer les FOREIGN KEY constraints
ALTER TABLE "Affiliate" DROP CONSTRAINT IF EXISTS "Affiliate_userId_fkey";
ALTER TABLE "Affiliate" ADD CONSTRAINT "Affiliate_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AffiliateClick" DROP CONSTRAINT IF EXISTS "AffiliateClick_affiliateId_fkey";
ALTER TABLE "AffiliateClick" ADD CONSTRAINT "AffiliateClick_affiliateId_fkey" 
    FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Referral" DROP CONSTRAINT IF EXISTS "Referral_affiliateId_fkey";
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_affiliateId_fkey" 
    FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Referral" DROP CONSTRAINT IF EXISTS "Referral_referredUserId_fkey";
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" 
    FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Commission" DROP CONSTRAINT IF EXISTS "Commission_affiliateId_fkey";
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_affiliateId_fkey" 
    FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Commission" DROP CONSTRAINT IF EXISTS "Commission_referralId_fkey";
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_referralId_fkey" 
    FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 10. Activer RLS (Row Level Security) - Optionnel mais recommandé
ALTER TABLE "Affiliate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AffiliateClick" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Commission" ENABLE ROW LEVEL SECURITY;

-- 11. Créer des policies RLS de base (tu peux les ajuster selon tes besoins)
-- Les utilisateurs peuvent voir leurs propres données d'affiliation
DROP POLICY IF EXISTS "Users can view own affiliate data" ON "Affiliate";
CREATE POLICY "Users can view own affiliate data" ON "Affiliate" 
    FOR SELECT USING ("userId" = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own affiliate data" ON "Affiliate";
CREATE POLICY "Users can update own affiliate data" ON "Affiliate" 
    FOR UPDATE USING ("userId" = auth.uid()::text);

-- Les conversions sont visibles par les affiliés concernés
DROP POLICY IF EXISTS "Affiliates can view own referrals" ON "Referral";
CREATE POLICY "Affiliates can view own referrals" ON "Referral" 
    FOR SELECT USING (
        "affiliateId" IN (SELECT "id" FROM "Affiliate" WHERE "userId" = auth.uid()::text)
    );

-- Les commissions sont visibles par les affiliés concernés
DROP POLICY IF EXISTS "Affiliates can view own commissions" ON "Commission";
CREATE POLICY "Affiliates can view own commissions" ON "Commission" 
    FOR SELECT USING (
        "affiliateId" IN (SELECT "id" FROM "Affiliate" WHERE "userId" = auth.uid()::text)
    );

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================

-- Vérification: Afficher les tables créées
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('Affiliate', 'AffiliateClick', 'Referral', 'Commission')
ORDER BY table_name;

-- Afficher les ENUMS créés
SELECT 
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
WHERE t.typname LIKE '%Status' OR t.typname LIKE '%Type'
GROUP BY t.typname
ORDER BY t.typname;

