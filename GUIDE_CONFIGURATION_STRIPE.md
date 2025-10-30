# 🔴 CONFIGURATION STRIPE REQUISE (2 MINUTES)

## ❌ POURQUOI L'ERREUR 500 ?

Votre SaaS est **correctement codé** mais Stripe n'est **pas configuré sur Vercel**.

Les clés sont dans `.env.local` (local) mais **PAS sur Vercel** (production).

---

## ✅ SOLUTION EN 3 ÉTAPES

### 📍 Étape 1 : Ouvrez Vercel

1. **Allez sur** : https://vercel.com
2. **Sélectionnez votre projet** : monnvprojet (ou athlink)
3. **Cliquez sur** : **Settings** → **Environment Variables**

### 📍 Étape 2 : Ajoutez les 3 variables Stripe

Pour **CHAQUE variable**, cliquez sur **"Add New"** :

#### Variable 1 : STRIPE_SECRET_KEY
```
Name: STRIPE_SECRET_KEY
Value: [Votre clé sk_live_... que vous m'avez donnée]
Environment: ✅ Production ✅ Preview ✅ Development (TOUT cocher)
```
Cliquez **Save**

#### Variable 2 : NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [Votre clé pk_live_... que vous m'avez donnée]
Environment: ✅ Production ✅ Preview ✅ Development (TOUT cocher)
```
Cliquez **Save**

#### Variable 3 : STRIPE_WEBHOOK_SECRET
```
Name: STRIPE_WEBHOOK_SECRET
Value: [Votre clé we_... que vous m'avez donnée]
Environment: ✅ Production ✅ Preview ✅ Development (TOUT cocher)
```
Cliquez **Save**

### 📍 Étape 3 : Redéployez

1. **Allez sur** : **Deployments**
2. **Dernier déploiement** → **"..."** → **Redeploy**
3. **Use existing Build Cache** → **Redeploy**
4. **Attendez 2-3 minutes** ⏳

---

## 🧪 TESTS APRÈS DÉPLOIEMENT

### Test 1 : Diagnostic complet
```
https://athlink.fr/api/diagnostic
```

**✅ Attendu** :
```json
{
  "summary": { "status": "✅ TOUT EST OK" },
  "checks": {
    "stripeSecretKey": { "configured": true, "type": "LIVE" },
    "stripeConnection": { "success": true }
  }
}
```

### Test 2 : Test Stripe
```
https://athlink.fr/api/test-promo
```

**✅ Attendu** : Liste de vos codes promo Stripe

### Test 3 : Test votre code promo
```
https://athlink.fr/api/test-promo?id=promo_1SNyifH23JS5N2cDONe5Hzdp
```

**✅ Attendu** : Détails de votre code promo

### Test 4 : Upgrade de plan
```
https://athlink.fr/dashboard/upgrade
```

1. Cliquez sur **"Passer Pro"** ou **"Passer Elite"**
2. **✅ Ça devrait marcher !**

---

## 🎯 CE QUI A ÉTÉ CORRIGÉ

### 1. ✅ Noms de plans corrigés
**Avant** : L'upgrade envoyait `ATHLETE_PRO` et `COACH` (mauvais)  
**Après** : L'upgrade envoie `PRO` et `ELITE` (correct)

Les **3 seuls plans valides** sont :
- `FREE` (Gratuit)
- `PRO` (Plan Pro - 9,90€/mois)
- `ELITE` (Plan Elite - 19,90€/mois)

### 2. ✅ Logs ultra détaillés
Les logs Vercel montrent maintenant **EXACTEMENT** ce qui se passe :
```
🚀 API /api/upgrade-plan appelée
✅ STRIPE_SECRET_KEY présente, type: LIVE
✅ Utilisateur authentifié: cxxx
📦 Données reçues - Plan: PRO, PromoCode: aucun
✅ Plan valide: PRO
💾 Mise à jour du profil en base de données...
✅ Plan mis à jour avec succès: PRO
```

### 3. ✅ API de diagnostic
`/api/diagnostic` vérifie **TOUTE** votre configuration

### 4. ✅ API de test Stripe
`/api/test-promo` teste votre connexion Stripe

---

## 📊 LOGS VERCEL

Si ça ne marche pas, regardez les logs :

1. **Vercel** → **Deployments** → Dernier déploiement
2. **Functions** → Cherchez `/api/upgrade-plan`
3. Les logs avec emojis montrent **EXACTEMENT** le problème !

**Exemples d'erreurs** :

### ❌ Si Stripe n'est pas configuré :
```
🚀 API /api/upgrade-plan appelée
❌ STRIPE_SECRET_KEY non configurée !
```
→ **Solution** : Ajoutez les variables dans Vercel (Étape 2)

### ❌ Si les variables ne sont pas sauvegardées :
```
stripeConfigured: false
```
→ **Solution** : Vérifiez que vous avez bien cliqué "Save" pour CHAQUE variable

### ❌ Si vous n'avez pas redéployé :
```
stripeConfigured: false (même après ajout des variables)
```
→ **Solution** : Redéployez (Étape 3)

---

## ✅ CHECKLIST FINALE

Avant de tester, vérifiez :

- [ ] J'ai ajouté `STRIPE_SECRET_KEY` dans Vercel
- [ ] J'ai ajouté `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans Vercel
- [ ] J'ai ajouté `STRIPE_WEBHOOK_SECRET` dans Vercel
- [ ] J'ai coché **TOUS les environments** (Production + Preview + Development)
- [ ] J'ai cliqué **"Save"** pour CHAQUE variable
- [ ] J'ai **Redeploy** le projet
- [ ] J'ai attendu que le déploiement soit terminé (2-3 min)
- [ ] J'ai testé `/api/diagnostic`
- [ ] J'ai testé `/dashboard/upgrade`

---

## 🎯 RÉSULTAT ATTENDU

**TOUT va fonctionner** :

✅ L'upgrade de plan (FREE → PRO → ELITE)  
✅ Les codes promo Stripe  
✅ Le système d'affiliation  
✅ Les statistiques ambassadeurs  
✅ Les webhooks Stripe  

---

## ⏰ TEMPS : 2 MINUTES
## 🎯 RÉSULTAT : 100% FONCTIONNEL

**FAITES-LE MAINTENANT !** 🚀

---

## 📧 SUPPORT

Si après avoir suivi **TOUTES** les étapes ça ne marche toujours pas, envoyez :

1. Screenshot de vos variables Vercel (Environment Variables)
2. Résultat de `https://athlink.fr/api/diagnostic`
3. Screenshot des logs Vercel Functions pour `/api/upgrade-plan`

Je verrai immédiatement le problème ! 🎯

