# 🔧 Migration des Tables d'Affiliation sur Supabase

## ⚠️ IMPORTANT : Fais ceci MAINTENANT pour que l'affiliation fonctionne !

Les tables d'affiliation (`Affiliate`, `Referral`, `Commission`, `AffiliateClick`) n'existent pas encore dans ta base de données Supabase. Tu dois les créer.

---

## 📋 Étapes pour Exécuter la Migration

### **Étape 1 : Ouvrir Supabase SQL Editor**

1. Va sur **https://supabase.com/dashboard**
2. Connecte-toi avec ton compte
3. Sélectionne ton projet Athlink
4. Dans le menu de gauche, clique sur **SQL Editor** (icône ⚡)

---

### **Étape 2 : Copier le Contenu du Fichier SQL**

1. Ouvre le fichier `prisma/migrations/create_affiliate_tables.sql` dans ton éditeur
2. **Copie TOUT le contenu** du fichier (Cmd+A puis Cmd+C)

---

### **Étape 3 : Exécuter la Migration**

1. Dans le **SQL Editor** de Supabase, clique sur **"New Query"** (+ Nouveau)
2. **Colle** tout le contenu du fichier SQL (Cmd+V)
3. Clique sur le bouton **"Run"** (▶ en bas à droite) ou appuie sur **Cmd+Enter**
4. Attends quelques secondes...

---

### **Étape 4 : Vérifier que tout fonctionne**

Si tout s'est bien passé, tu devrais voir :

✅ **"Success. No rows returned"** (C'est normal !)

Et en bas, un tableau avec :

```
table_name       | table_type
-----------------|------------
Affiliate        | BASE TABLE
AffiliateClick   | BASE TABLE
Commission       | BASE TABLE
Referral         | BASE TABLE
```

**+ Un autre tableau avec les ENUMS créés :**

```
enum_name         | enum_values
------------------|---------------------------
AffiliateStatus   | PENDING, APPROVED, SUSPENDED
ReferralStatus    | PENDING, CONVERTED, EXPIRED
ConversionType    | SIGNUP, UPGRADE, PAYMENT
CommissionType    | REFERRAL, BONUS, MANUAL
CommissionStatus  | PENDING, PAID, CANCELLED
```

---

### **Étape 5 : Créer ton Premier Affilié (Optionnel pour tester)**

Maintenant que les tables existent, tu peux créer un affilié manuellement pour tester :

```sql
-- 1. Trouver ton User ID
SELECT id, email, name FROM "User" WHERE email = 'nathanrdz834@gmail.com';

-- 2. Créer un Affiliate pour ce User (remplace USER_ID_TROUVE ci-dessous)
INSERT INTO "Affiliate" (
  id, 
  "userId", 
  "affiliateCode", 
  status, 
  "commissionRate",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'USER_ID_TROUVE',          -- ⚠️ Remplace par ton User ID de l'étape 1
  'nathan',                   -- Code de parrainage (ton username)
  'APPROVED',                 -- Status: APPROVED pour activer directement
  0.40,                       -- 40% de commission
  NOW(),
  NOW()
);

-- 3. Vérifier que l'Affiliate a été créé
SELECT * FROM "Affiliate";
```

---

### **Étape 6 : Créer un Referral de Test (Optionnel)**

Pour tester le système complet, crée un Referral en attente :

```sql
-- 1. Trouver l'Affiliate ID que tu viens de créer
SELECT id, "affiliateCode" FROM "Affiliate" WHERE "affiliateCode" = 'nathan';

-- 2. Créer un Referral en attente (remplace AFFILIATE_ID ci-dessous)
INSERT INTO "Referral" (
  id,
  "affiliateId",
  "referralCode",
  status,
  "conversionType",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'AFFILIATE_ID_TROUVE',      -- ⚠️ Remplace par l'ID de ton Affiliate
  'nathan',                    -- Code de parrainage utilisé
  'PENDING',                   -- En attente de conversion
  'SIGNUP',
  NOW(),
  NOW()
);

-- 3. Vérifier
SELECT * FROM "Referral";
```

---

## ✅ C'est Terminé !

Une fois la migration exécutée :

1. ✅ Les tables d'affiliation existent dans Supabase
2. ✅ L'API `/api/affiliate/stats` va fonctionner
3. ✅ Le dashboard `/dashboard/affiliate` va afficher les stats
4. ✅ Les webhooks Stripe vont enregistrer les conversions

---

## 🧪 Tester le Système

Maintenant tu peux tester le système d'affiliation :

1. Va sur **https://athlink.fr/dashboard/affiliate**
2. Les stats devraient maintenant s'afficher (parrainages, conversions, commissions)
3. Si tu as créé un Affiliate et un Referral, les données s'afficheront

---

## 🐛 Problèmes Fréquents

### Erreur : "duplicate key value violates unique constraint"

**Cause** : Tu essaies de créer un Affiliate pour un User qui en a déjà un.

**Solution** :
```sql
-- Supprimer l'Affiliate existant
DELETE FROM "Affiliate" WHERE "userId" = 'TON_USER_ID';

-- Puis refaire l'INSERT
```

### Erreur : "relation does not exist"

**Cause** : La migration n'a pas été exécutée ou a échoué.

**Solution** :
- Vérifie qu'il n'y a pas d'erreur rouge dans le SQL Editor
- Ré-exécute toute la migration (copie-colle + Run)

### Les stats affichent "0" partout

**C'est normal si** :
- Tu viens de créer les tables (elles sont vides)
- Tu n'as pas encore créé d'Affiliate ou de Referral
- Personne ne s'est encore inscrit avec un lien d'affiliation

---

## 📞 Besoin d'Aide ?

Si tu rencontres une erreur :
1. **Copie le message d'erreur complet**
2. Regarde dans les logs Vercel (Functions)
3. Vérifie que ton User existe bien dans la table `User`

---

## 🚀 Prochaine Étape

Une fois la migration faite, tu peux :
1. Créer ton compte Affiliate
2. Tester le système de parrainage
3. Vérifier que les emails sont envoyés

**Bon test ! 🎉**

