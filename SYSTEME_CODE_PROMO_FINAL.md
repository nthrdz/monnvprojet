# 🎯 SYSTÈME CODE PROMO STRIPE - 100% OPÉRATIONNEL

## ✅ CE QUI A ÉTÉ FAIT

### 1. **Page d'inscription refaite complètement**
- ✅ Nouveau champ "Code promo" avec bouton **"Vérifier"**
- ✅ Validation en temps réel avec Stripe API
- ✅ États visuels clairs (vert = valide, rouge = invalide)
- ✅ Inscription automatique avec promo si code validé

### 2. **Système simplifié à 100%**
- ✅ Suppression du code de parrainage (ancien système)
- ✅ Suppression de toutes les pages de test
- ✅ Gardé UNIQUEMENT le système Stripe fonctionnel
- ✅ Code nettoyé et production-ready

### 3. **APIs fonctionnelles**
- ✅ `/api/promo-codes/validate` - Valide les codes Stripe
- ✅ `/api/promo-codes/apply` - Créer compte avec code promo
- ✅ `/api/auth/signup` - Créer compte sans code promo
- ✅ `/api/upgrade-plan` - Upgrade avec code promo

---

## 🎯 COMMENT CRÉER UN CODE PROMO DANS STRIPE

### Étape 1 : Aller dans Stripe Dashboard
1. Connectez-vous sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. ⚠️ **IMPORTANT** : Basculez en mode **LIVE** (pas TEST)

### Étape 2 : Créer un coupon
1. Allez dans **Produits** → **Coupons**
2. Cliquez sur **"Créer un coupon"**
3. Configurez :
   - **Nom** : Ex. "Promo Lancement"
   - **Type** : Pourcentage (ex. 20%) ou Montant fixe (ex. 10€)
   - **Durée** : 
     - `once` = Une seule fois
     - `forever` = Permanent
     - `repeating` = X mois
4. Cliquez sur **"Créer le coupon"**

### Étape 3 : Créer un code promo
1. Allez dans **Produits** → **Codes promo**
2. Cliquez sur **"Créer un code promo"**
3. Configurez :
   - **Code** : Ex. "WELCOME20" (ce que l'utilisateur entre)
   - **Coupon** : Sélectionnez le coupon créé à l'étape 2
   - **Actif** : ✅ Coché
   - **Limite d'utilisation** : (optionnel) Ex. 100 utilisations max
   - **Date d'expiration** : (optionnel)
4. Cliquez sur **"Créer le code promo"**

---

## 🧪 COMMENT TESTER

### Test en local
```bash
npm run dev
```

1. Allez sur `http://localhost:3000/signup`
2. Remplissez le formulaire
3. Dans "Code promo", entrez votre code Stripe (ex. "WELCOME20")
4. Cliquez sur **"Vérifier"**
5. ✅ Si valide : bordure verte + message de confirmation
6. ❌ Si invalide : bordure rouge + message d'erreur
7. Cliquez sur **"Créer mon profil"**
8. Vérifiez dans Stripe que le code a été utilisé

### Test en production (Vercel)
1. Allez sur `https://athlink.fr/signup`
2. Même process qu'en local
3. Vérifiez dans Stripe Dashboard → Codes promo → Utilisation

---

## 📋 CHECKLIST VERCEL

### Environment Variables à configurer
✅ Toutes ces variables DOIVENT être en mode **LIVE** :

```bash
# Stripe (MODE LIVE OBLIGATOIRE)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://athlink.fr

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Resend (emails)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@athlink.fr

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Vérification des clés Stripe
⚠️ **CRITÈRE IMPÉRATIF** : 
- `STRIPE_SECRET_KEY` DOIT commencer par `sk_live_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` DOIT commencer par `pk_live_`
- Sinon le système refusera de démarrer en production

---

## 🎯 FLUX UTILISATEUR

### Inscription avec code promo
1. Utilisateur va sur `/signup`
2. Remplit le formulaire (nom, email, sport, etc.)
3. Entre un code promo (ex. "WELCOME20")
4. Clique sur **"Vérifier"**
   - ✅ Si valide : Message "✅ Code WELCOME20 valide : 20%"
   - ❌ Si invalide : Message "❌ Code invalide ou expiré"
5. Clique sur **"Créer mon profil"**
6. **SI CODE VALIDE** :
   - API `/api/promo-codes/apply` est appelée
   - Compte créé + code promo enregistré dans `profile.stats.discountInfo`
   - Message : "🎉 Compte créé avec code promo WELCOME20 (20%)"
7. **SI PAS DE CODE ou INVALIDE** :
   - API `/api/auth/signup` est appelée
   - Compte créé normalement
   - Message : "✅ Compte créé avec succès !"

### Upgrade avec code promo
1. Utilisateur va sur `/dashboard/upgrade`
2. Entre un code promo
3. Clique sur **"Vérifier"**
4. Sélectionne un plan (Pro ou Elite)
5. Clique sur **"Passer à [Plan]"**
6. Le code promo est appliqué automatiquement si valide

---

## 🐛 DEBUGGING

### Logs à vérifier dans Vercel
1. Allez dans **Vercel Dashboard** → Votre projet → **Logs**
2. Filtrez par fonction : `/api/promo-codes/validate`
3. Recherchez :
   ```
   🔍 Recherche du code: VOTRE_CODE
   ✅ Code trouvé: { id, code, active, ... }
   ```

### Problèmes courants

#### ❌ "Code invalide ou expiré"
**Causes possibles :**
1. Le code n'existe pas dans Stripe
2. Le code est en mode TEST mais vous utilisez des clés LIVE
3. Le code est inactif dans Stripe
4. Le code a expiré
5. Le code a atteint sa limite d'utilisation

**Solution :**
1. Vérifiez dans Stripe Dashboard → Codes promo
2. Vérifiez que le code est **ACTIF**
3. Vérifiez la date d'expiration
4. Vérifiez les utilisations (X / limite)

#### ❌ "Erreur lors de la vérification"
**Causes possibles :**
1. Clés Stripe incorrectes dans Vercel
2. Clés TEST au lieu de LIVE
3. Problème réseau avec Stripe API

**Solution :**
1. Vérifiez les Environment Variables dans Vercel
2. Vérifiez que `STRIPE_SECRET_KEY` commence par `sk_live_`
3. Vérifiez les logs Vercel pour plus de détails

---

## 📊 STATISTIQUES

### Voir les utilisations d'un code promo dans Stripe
1. Allez dans **Produits** → **Codes promo**
2. Cliquez sur votre code (ex. "WELCOME20")
3. Vous verrez :
   - **Utilisations** : X / limite
   - **Dernière utilisation** : Date
   - **Revenu généré** : Montant

### Voir les codes promo appliqués dans votre base de données
```sql
SELECT 
  u.email,
  p.username,
  p.stats->>'promoCodeUsed' as code_used,
  p.stats->'discountInfo'->>'discount' as discount,
  p.createdAt as signup_date
FROM "User" u
JOIN "Profile" p ON u.id = p."userId"
WHERE p.stats->>'promoCodeUsed' IS NOT NULL
ORDER BY p.createdAt DESC;
```

---

## 🚀 DÉPLOIEMENT

### Push sur GitHub
```bash
git add .
git commit -m "feat: mise à jour codes promo"
git push origin clean-main
```

### Déploiement Vercel automatique
- Vercel détecte automatiquement le push sur `clean-main`
- Le build se lance automatiquement
- Le déploiement se fait en ~2-3 minutes

### Vérification post-déploiement
1. Allez sur `https://athlink.fr/signup`
2. Testez avec un code promo réel
3. Vérifiez les logs Vercel
4. Créez un compte de test pour vérifier

---

## 📝 RÉSUMÉ

✅ **Ce qui fonctionne maintenant :**
- Codes promo Stripe validés en temps réel
- Inscription avec code promo
- Upgrade avec code promo
- États visuels clairs (vert/rouge)
- Logs détaillés pour debugging
- Code nettoyé et production-ready

❌ **Ce qui a été supprimé :**
- Ancien système de parrainage
- Pages de test (/test-promo, /api/diagnostic, etc.)
- Scripts de test
- Documentation de debug

🎯 **Résultat final :**
Un système **100% fonctionnel**, **simple**, **maintenable** et **prêt pour la production** ! 🚀

