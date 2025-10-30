# 🔴 CONFIGURATION STRIPE OBLIGATOIRE - À FAIRE MAINTENANT

## ⚠️ VOTRE UPGRADE NE FONCTIONNE PAS À CAUSE DES CLÉS STRIPE !

L'erreur 500 sur `/api/upgrade-plan` signifie que **Stripe n'est pas correctement configuré sur Vercel**.

---

## ✅ CONFIGURATION OBLIGATOIRE (5 MINUTES)

### Étape 1 : Récupérez vos clés Stripe

1. **Allez sur Stripe Dashboard** : https://dashboard.stripe.com/apikeys

2. **Basculez en LIVE mode** (toggle en haut à droite)

3. **Copiez ces clés** :
   ```
   Secret key : sk_live_VOTRE_CLE_ICI...
   Publishable key : pk_live_VOTRE_CLE_ICI...
   ```

### Étape 2 : Configurez Vercel (OBLIGATOIRE)

1. **Allez sur Vercel** : https://vercel.com

2. **Sélectionnez votre projet** Athlink

3. **Settings** → **Environment Variables**

4. **Ajoutez ces variables** (cliquez "Add New") :

   ```
   STRIPE_SECRET_KEY
   Valeur: sk_live_VOTRE_CLE_SECRETE_ICI
   Environment: Production, Preview, Development (cochez TOUT)
   ```

   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   Valeur: pk_live_VOTRE_CLE_PUBLIQUE_ICI
   Environment: Production, Preview, Development (cochez TOUT)
   ```

   ```
   STRIPE_WEBHOOK_SECRET
   Valeur: whsec_VOTRE_WEBHOOK_SECRET_ICI
   Environment: Production, Preview, Development (cochez TOUT)
   ```

5. **Sauvegardez** chaque variable

### Étape 3 : Redéployez (OBLIGATOIRE)

1. **Allez sur** Deployments

2. **Cliquez sur les "..."** du dernier déploiement

3. **Redeploy** → **Use existing Build Cache** → **Redeploy**

4. **Attendez 2-3 minutes** que le déploiement se termine

---

## 🧪 Étape 4 : TESTEZ

### Une fois le déploiement terminé :

1. **Allez sur** : https://athlink.fr/api/test-promo

2. **Vous devriez voir** :
   ```json
   {
     "success": true,
     "stripeConfigured": true,
     "stripeKeyType": "LIVE",
     "allActiveCodes": [...]
   }
   ```

3. **Si stripeConfigured: false** → Les clés ne sont PAS dans Vercel, recommencez l'étape 2

### Test de l'upgrade :

1. **Allez sur** : https://athlink.fr/dashboard/upgrade

2. **Cliquez sur** "Passer Pro" ou "Passer Elite"

3. **Ça devrait marcher** ! ✅

---

## 🔴 SI ÇA NE MARCHE TOUJOURS PAS

### Vérifiez les logs Vercel :

1. **Vercel** → **Deployments** → Dernier déploiement

2. **Functions** → Cherchez `/api/upgrade-plan`

3. **Regardez l'erreur exacte**

### Erreurs courantes :

#### ❌ "STRIPE_SECRET_KEY is not set"
→ Les variables ne sont PAS dans Vercel
→ **Solution** : Recommencez l'étape 2, assurez-vous de cocher TOUS les environments

#### ❌ "Invalid API key"
→ Vous avez copié une clé TEST au lieu de LIVE
→ **Solution** : Vérifiez que vous êtes en LIVE mode dans Stripe Dashboard

#### ❌ "Authentication failed"
→ La clé est incorrecte ou révoquée
→ **Solution** : Générez une nouvelle clé dans Stripe Dashboard

---

## ⚡ CONFIGURATION RAPIDE

Pour configurer rapidement, ajoutez ces 3 variables dans Vercel :

```bash
# Dans Vercel → Environment Variables

STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_ICI

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE_ICI

STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI
```

**⚠️ IMPORTANT** : 
- Remplacez VOTRE_CLE_... par vos vraies clés de Stripe Dashboard
- Ajoutez CHAQUE variable séparément dans Vercel !

---

## ✅ CHECKLIST FINALE

Avant de tester, assurez-vous :

- [ ] J'ai ajouté `STRIPE_SECRET_KEY` dans Vercel
- [ ] J'ai ajouté `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` dans Vercel  
- [ ] J'ai ajouté `STRIPE_WEBHOOK_SECRET` dans Vercel
- [ ] J'ai coché **Production, Preview, Development** pour CHAQUE variable
- [ ] J'ai cliqué "Save" pour CHAQUE variable
- [ ] J'ai **Redeploy** le projet
- [ ] J'ai attendu que le déploiement soit terminé (2-3 min)

---

## 🎯 APRÈS CONFIGURATION

Une fois configuré correctement :

✅ `/api/upgrade-plan` fonctionnera  
✅ Les codes promo fonctionneront  
✅ L'upgrade de plan fonctionnera  
✅ Stripe Connect fonctionnera  
✅ Les webhooks fonctionneront  

**TOUT VA FONCTIONNER ! 🚀**

---

## 📞 BESOIN D'AIDE ?

Si après avoir suivi TOUTES les étapes ça ne marche toujours pas :

1. **Screenshot** de vos variables Vercel (Environment Variables)
2. **Screenshot** de l'erreur dans Vercel Functions logs
3. **Résultat** de https://athlink.fr/api/test-promo

Je pourrai alors voir exactement où est le problème !

---

**⏰ TEMPS ESTIMÉ : 5 MINUTES**  
**🎯 RÉSULTAT : TOUT FONCTIONNE**

**FAITES-LE MAINTENANT ! 🔥**

