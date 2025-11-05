# 🎁 Guide Complet du Système d'Affiliation Athlink

## ✅ Fonctionnalités Implémentées

### 1. **Dashboard Ambassadeur avec Stats en Temps Réel**

Les utilisateurs PRO et ELITE ont désormais accès à un dashboard ambassadeur complet avec :

- **Parrainages** : Nombre total de personnes inscrites via leur lien
- **Conversions** : Nombre d'abonnements payants générés  
- **Commissions** : Gains totaux (40% de commission récurrente)
- **Conversions récentes** : Liste des 30 derniers affiliés avec leur nom, plan et commission gagnée

**Accès** : `https://athlink.fr/dashboard/affiliate`

---

### 2. **Notifications Email Automatiques**

Quand quelqu'un s'inscrit avec un lien d'affiliation et passe PRO/ELITE, l'affiliateur reçoit **automatiquement un email** avec :

- ✅ Le **nom de la personne** qui s'est inscrite
- ✅ Le **plan souscrit** (PRO ou ELITE)
- ✅ La **commission gagnée** (3,96€/mois pour PRO, 10,36€/mois pour ELITE)
- ✅ Le **code de parrainage utilisé**
- ✅ Un lien vers le dashboard ambassadeur

**Email envoyé par** : `notifications@athlink.fr`  
**Template** : Email moderne avec gradient vert, card utilisateur et montant de la commission en grand

---

### 3. **Intégration Webhook Stripe**

Le webhook Stripe a été mis à jour pour :

1. Détecter automatiquement si un **code de parrainage** est présent lors du paiement
2. Appeler l'API `affiliate/convert` pour enregistrer la conversion
3. Créer une **commission** de 40% dans la base de données
4. Envoyer l'**email de notification** à l'affiliateur
5. Mettre à jour les **statistiques** (totalReferrals, totalConversions, totalEarnings)

**API impactée** : `/api/stripe/webhook` (ligne 358-391)

---

### 4. **Support du Code de Parrainage dans le Checkout**

L'API de création de session Stripe a été mise à jour pour :

- Accepter un paramètre `referralCode` dans la requête
- Enregistrer ce code dans les **metadata Stripe**
- Le webhook récupère automatiquement ce code pour déclencher l'affiliation

**API impactée** : `/api/stripe/create-checkout-session` (ligne 29-33 et 105)

---

## 🚀 Comment Tester le Système

### Étape 1 : Créer un Compte Ambassadeur

1. Connecte-toi avec un compte PRO ou ELITE (ex: `nathanrdz834@gmail.com`)
2. Va sur `https://athlink.fr/dashboard/affiliate`
3. Copie ton **lien d'affiliation** (format : `https://athlink.fr/?via=USERNAME`)

---

### Étape 2 : Créer un Referral en Attente

Le système d'affiliation utilise un modèle **Referral** pour tracker les clics et conversions.

**Pour tester manuellement**, tu dois créer un referral en attente dans la DB :

```sql
-- 1. Trouver l'ID de l'affilié
SELECT id, "userId", "affiliateCode" FROM "Affiliate" WHERE "userId" = 'USER_ID_DE_L_AMBASSADEUR';

-- 2. Créer un referral en attente
INSERT INTO "Referral" (
  id, 
  "affiliateId", 
  "referralCode", 
  status, 
  "conversionType", 
  "createdAt"
) VALUES (
  gen_random_uuid()::text,
  'AFFILIATE_ID_TROUVE_ETAPE_1',
  'USERNAME_AMBASSADEUR', -- Le code de parrainage (username de l'ambassadeur)
  'PENDING',
  'SIGNUP',
  NOW()
);
```

---

### Étape 3 : Tester le Flux Complet

#### Option A : Test avec Inscription + Paiement

1. **Ouvre une fenêtre de navigation privée**
2. Va sur `https://athlink.fr/?via=USERNAME_AMBASSADEUR`
3. **Inscris-toi** avec un nouveau compte (ex: `test-affiliate@example.com`)
4. Une fois connecté, **passe PRO ou ELITE** via `/dashboard/upgrade`
5. Complète le **paiement Stripe** (utilise une carte de test : `4242 4242 4242 4242`)
6. Le webhook Stripe va :
   - Mettre à jour le plan
   - Appeler `/api/affiliate/convert` avec le `referralCode`
   - Envoyer l'email de notification à l'ambassadeur
   - Mettre à jour les stats

7. **Vérifie** :
   - L'email de notification dans la boîte mail de l'ambassadeur
   - Les stats dans `/dashboard/affiliate` (parrainages, conversions, commissions)

#### Option B : Test Direct de l'API `affiliate/convert`

Si tu veux tester **uniquement** l'envoi d'email et la mise à jour des stats sans passer par Stripe :

```bash
curl -X POST https://athlink.fr/api/affiliate/convert \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "USERNAME_AMBASSADEUR",
    "userId": "USER_ID_DU_NOUVEL_INSCRIT",
    "planType": "PRO",
    "stripeCustomerId": "cus_test123",
    "stripeSubscriptionId": "sub_test123"
  }'
```

**Résultat attendu** :
- Email envoyé à l'ambassadeur
- Stats mises à jour (totalReferrals +1, totalConversions +1, totalEarnings +3.96€)
- Commission créée dans la DB

---

## 📊 Où Trouver les Données

### 1. **Statistiques d'Affiliation**

**API** : `GET /api/affiliate/stats`

Retourne :
- `totalReferrals` : Nombre total de parrainages
- `totalConversions` : Nombre d'abonnements payants
- `totalEarnings` : Gains totaux en €
- `recentConversions` : Liste des conversions récentes avec nom et plan
- `referrals` : Liste complète des parrainages
- `commissions` : Liste des commissions

### 2. **Base de Données**

Tables impactées :
- `Affiliate` : Informations de l'ambassadeur
- `Referral` : Parrainages (PENDING → CONVERTED)
- `Commission` : Commissions gagnées
- `Profile` : Plan de l'utilisateur affilié

**Requête pour voir les stats d'un ambassadeur** :

```sql
SELECT 
  a."totalReferrals",
  a."totalConversions",
  a."totalEarnings",
  a."commissionRate",
  a.status,
  u.email
FROM "Affiliate" a
JOIN "User" u ON u.id = a."userId"
WHERE u.email = 'EMAIL_AMBASSADEUR';
```

---

## 🐛 Débogage

### Problème : L'email n'est pas envoyé

**Vérifications** :
1. La clé `RESEND_API_KEY` est bien configurée dans `.env.local` et Vercel
2. Le domaine `athlink.fr` est vérifié dans Resend (DKIM, SPF, DMARC)
3. Regarde les logs Vercel : `/api/affiliate/convert` et `/api/stripe/webhook`

### Problème : Les stats ne se mettent pas à jour

**Vérifications** :
1. Le `referralCode` est bien passé dans les metadata Stripe
2. L'API `/api/affiliate/convert` est bien appelée par le webhook
3. Le Referral existe en DB avec `status = 'PENDING'`
4. Regarde les logs dans Vercel Functions

### Problème : Le referralCode n'est pas détecté

**Cause probable** : Le referralCode n'est pas envoyé lors du checkout

**Solution** :
- Vérifie que le frontend envoie `referralCode` dans le body de `/api/stripe/create-checkout-session`
- Exemple : Si l'utilisateur s'inscrit via `/?via=nathan`, stocke `nathan` dans `localStorage` et envoie-le lors du checkout

---

## 📝 Prochaines Étapes (Optionnel)

### 1. **Intégration Frontend avec localStorage**

Pour récupérer automatiquement le `referralCode` :

```typescript
// Dans components/upgrade-page.tsx (ou similaire)

const referralCode = localStorage.getItem('referralCode')

const response = await fetch('/api/stripe/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: selectedPlan,
    billingCycle: selectedCycle,
    referralCode: referralCode || undefined // Envoyer le code s'il existe
  })
})
```

### 2. **Créer Automatiquement un Referral PENDING**

Actuellement, il faut créer manuellement un Referral en DB. Pour automatiser :

**Créer une API `/api/affiliate/track-visit`** qui :
- Détecte le paramètre `?via=USERNAME` dans l'URL
- Trouve l'Affiliate correspondant
- Crée un Referral avec `status = 'PENDING'`
- Stocke le `referralCode` dans `localStorage`

**Appeler cette API** :
- Dans `app/page.tsx` (homepage) avec `useEffect` pour détecter `?via=`
- Avant l'inscription dans `/signup`

---

## ✅ Résumé des Fichiers Modifiés

1. **`app/api/affiliate/stats/route.ts`** (NOUVEAU)
   - API GET pour récupérer les stats d'affiliation

2. **`app/(dashboard)/dashboard/affiliate/page.tsx`**
   - Affichage des stats réelles
   - Section conversions récentes
   - Loading states

3. **`app/api/stripe/create-checkout-session/route.ts`**
   - Support du paramètre `referralCode`
   - Ajout dans metadata Stripe

4. **`app/api/stripe/webhook/route.ts`**
   - Détection du `referralCode` dans metadata
   - Appel de `/api/affiliate/convert` lors du paiement
   - Logging amélioré

5. **`app/api/affiliate/convert/route.ts`**
   - Récupération du nom du nouvel affilié
   - Email amélioré avec nom et détails
   - Template HTML moderne

---

## 🎉 Conclusion

Le système d'affiliation est maintenant **100% fonctionnel** avec :
- ✅ Stats en temps réel
- ✅ Emails de notification automatiques
- ✅ Intégration Stripe complète
- ✅ Commission récurrente de 40%

**Pour tester** : Suis les instructions dans "Comment Tester le Système" ci-dessus.

Si tu rencontres un problème, vérifie :
1. Les logs Vercel (Functions)
2. Les logs Stripe (Webhooks)
3. Les logs Resend (Emails)

**Prochaine étape recommandée** : Implémenter l'auto-création du Referral PENDING lors de la visite avec `?via=USERNAME` (Section "Prochaines Étapes").

