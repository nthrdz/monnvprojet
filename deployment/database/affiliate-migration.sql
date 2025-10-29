-- Migration pour le système d'affiliation
-- Exécuter ce script dans votre base de données Supabase

-- Créer les enums pour le système d'affiliation
DO $$ BEGIN
    CREATE TYPE affiliate_status AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE referral_status AS ENUM ('PENDING', 'CONVERTED', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE conversion_type AS ENUM ('SIGNUP', 'UPGRADE', 'PAYMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE commission_type AS ENUM ('REFERRAL', 'BONUS', 'MANUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE commission_status AS ENUM ('PENDING', 'PAID', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Créer la table Affiliate
CREATE TABLE IF NOT EXISTS "Affiliate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "affiliateCode" TEXT NOT NULL UNIQUE,
    "status" affiliate_status NOT NULL DEFAULT 'PENDING',
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "totalConversions" INTEGER NOT NULL DEFAULT 0,
    "bankAccount" TEXT,
    "paypalEmail" TEXT,
    "approvedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Affiliate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Créer la table Referral
CREATE TABLE IF NOT EXISTS "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referredUserId" TEXT,
    "referralCode" TEXT NOT NULL,
    "conversionType" conversion_type NOT NULL DEFAULT 'SIGNUP',
    "status" referral_status NOT NULL DEFAULT 'PENDING',
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
    CONSTRAINT "Referral_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Créer la table Commission
CREATE TABLE IF NOT EXISTS "Commission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "affiliateId" TEXT NOT NULL,
    "referralId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" commission_type NOT NULL DEFAULT 'REFERRAL',
    "status" commission_status NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentReference" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Commission_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Commission_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Créer les index pour les performances
CREATE INDEX IF NOT EXISTS "Affiliate_affiliateCode_idx" ON "Affiliate"("affiliateCode");
CREATE INDEX IF NOT EXISTS "Affiliate_status_idx" ON "Affiliate"("status");
CREATE INDEX IF NOT EXISTS "Referral_affiliateId_idx" ON "Referral"("affiliateId");
CREATE INDEX IF NOT EXISTS "Referral_referredUserId_idx" ON "Referral"("referredUserId");
CREATE INDEX IF NOT EXISTS "Referral_referralCode_idx" ON "Referral"("referralCode");
CREATE INDEX IF NOT EXISTS "Referral_status_idx" ON "Referral"("status");
CREATE INDEX IF NOT EXISTS "Commission_affiliateId_idx" ON "Commission"("affiliateId");
CREATE INDEX IF NOT EXISTS "Commission_status_idx" ON "Commission"("status");
CREATE INDEX IF NOT EXISTS "Commission_type_idx" ON "Commission"("type");

-- Activer Row Level Security
ALTER TABLE "Affiliate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Commission" ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view own affiliate data" ON "Affiliate" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can update own affiliate data" ON "Affiliate" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Users can insert own affiliate data" ON "Affiliate" FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Affiliates can view own referrals" ON "Referral" FOR SELECT USING (
    "affiliateId" IN (SELECT "id" FROM "Affiliate" WHERE "userId" = auth.uid()::text)
);
CREATE POLICY "Users can view referrals about them" ON "Referral" FOR SELECT USING (auth.uid()::text = "referredUserId");

CREATE POLICY "Affiliates can view own commissions" ON "Commission" FOR SELECT USING (
    "affiliateId" IN (SELECT "id" FROM "Affiliate" WHERE "userId" = auth.uid()::text)
);

-- Politiques pour les admins (vous pouvez adapter selon votre logique d'admin)
CREATE POLICY "Admins can view all affiliate data" ON "Affiliate" FOR ALL USING (true);
CREATE POLICY "Admins can view all referral data" ON "Referral" FOR ALL USING (true);
CREATE POLICY "Admins can view all commission data" ON "Commission" FOR ALL USING (true);

-- Fonction pour générer un code d'affiliation unique
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    code_exists BOOLEAN;
BEGIN
    LOOP
        new_code := 'AMB' || upper(substring(md5(random()::text) from 1 for 6));
        
        SELECT EXISTS(SELECT 1 FROM "Affiliate" WHERE "affiliateCode" = new_code) INTO code_exists;
        
        IF NOT code_exists THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le code d'affiliation
CREATE OR REPLACE FUNCTION set_affiliate_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."affiliateCode" IS NULL OR NEW."affiliateCode" = '' THEN
        NEW."affiliateCode" := generate_affiliate_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_affiliate_code_trigger
    BEFORE INSERT ON "Affiliate"
    FOR EACH ROW
    EXECUTE FUNCTION set_affiliate_code();

-- Fonction pour calculer automatiquement les commissions
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
    affiliate_rate DOUBLE PRECISION;
    commission_amount DOUBLE PRECISION;
BEGIN
    -- Récupérer le taux de commission de l'affilié
    SELECT "commissionRate" INTO affiliate_rate
    FROM "Affiliate"
    WHERE "id" = NEW."affiliateId";
    
    -- Calculer la commission
    commission_amount := COALESCE(NEW."conversionValue", 0) * COALESCE(affiliate_rate, 0.10);
    NEW."commissionEarned" := commission_amount;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_commission_trigger
    BEFORE UPDATE ON "Referral"
    FOR EACH ROW
    WHEN (NEW."status" = 'CONVERTED' AND OLD."status" != 'CONVERTED')
    EXECUTE FUNCTION calculate_commission();

-- Fonction pour mettre à jour les statistiques de l'affilié
CREATE OR REPLACE FUNCTION update_affiliate_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Incrémenter le nombre de parrainages
        UPDATE "Affiliate"
        SET "totalReferrals" = "totalReferrals" + 1
        WHERE "id" = NEW."affiliateId";
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Si le statut passe à CONVERTED
        IF NEW."status" = 'CONVERTED' AND OLD."status" != 'CONVERTED' THEN
            UPDATE "Affiliate"
            SET 
                "totalConversions" = "totalConversions" + 1,
                "totalEarnings" = "totalEarnings" + COALESCE(NEW."commissionEarned", 0)
            WHERE "id" = NEW."affiliateId";
            
            -- Créer une commission
            INSERT INTO "Commission" (
                "affiliateId",
                "referralId",
                "amount",
                "type",
                "status",
                "description"
            ) VALUES (
                NEW."affiliateId",
                NEW."id",
                COALESCE(NEW."commissionEarned", 0),
                'REFERRAL',
                'PENDING',
                'Commission pour ' || LOWER(NEW."conversionType"::text)
            );
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_stats_trigger
    AFTER INSERT OR UPDATE ON "Referral"
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_stats();

-- Insérer quelques données de test (optionnel)
-- Vous pouvez supprimer cette section en production
INSERT INTO "Affiliate" ("id", "userId", "affiliateCode", "status", "commissionRate")
SELECT 
    'test_affiliate_' || generate_random_uuid(),
    u."id",
    generate_affiliate_code(),
    'APPROVED',
    0.15
FROM "User" u
WHERE u."email" LIKE '%@example.com'
LIMIT 1
ON CONFLICT DO NOTHING;
