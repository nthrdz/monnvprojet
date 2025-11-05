-- Ajouter le champ rewardfulAffiliateLink à la table Affiliate
ALTER TABLE "Affiliate" ADD COLUMN IF NOT EXISTS "rewardfulAffiliateLink" TEXT;

