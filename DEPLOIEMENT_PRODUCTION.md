# 🚀 DÉPLOIEMENT EN PRODUCTION SUR VERCEL

## ✅ ÉTAT ACTUEL

Votre intégration Stripe est **prête pour la production**. Toutes les clés sont en mode **LIVE** et le webhook est configuré pour `https://athlink.fr/api/stripe/webhook`.

---

## 📋 CHECKLIST AVANT DÉPLOIEMENT

### ✅ Ce qui est DÉJÀ fait :

- ✅ Clés Stripe en mode LIVE
- ✅ 4 Price IDs configurés (PRO/ELITE monthly/yearly)
- ✅ Webhook configuré sur `https://athlink.fr/api/stripe/webhook`
- ✅ 3 événements webhook configurés
- ✅ Code prêt pour la production

### ⚠️ Ce qu'il faut faire :

1. Configurer les variables d'environnement sur Vercel
2. Déployer sur Vercel
3. Tester avec une vraie carte de test
4. Vérifier que les webhooks fonctionnent

---

## 🔧 ÉTAPE 1 : CONFIGURER LES VARIABLES D'ENVIRONNEMENT SUR VERCEL

### Aller sur Vercel Dashboard

1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet **athlink**
3. Allez dans **Settings** → **Environment Variables**

### Ajouter TOUTES ces variables :

```bash
# ============================================
# 🗄️ BASE DE DONNÉES
# ============================================
DATABASE_URL=postgresql://...votre_url_supabase...

# ============================================
# 🔐 AUTHENTIFICATION
# ============================================
NEXTAUTH_URL=https://athlink.fr
NEXTAUTH_SECRET=...votre_secret_nextauth...

# ============================================
# 💳 STRIPE - Clés API
# ============================================
STRIPE_SECRET_KEY=sk_live_...votre_cle_secrete_stripe...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...votre_cle_publique_stripe...

# ============================================
# 💰 STRIPE - Prix Mensuels
# ============================================
STRIPE_PRICE_ID_PRO_MONTHLY=price_...votre_price_id...
STRIPE_PRICE_ID_ELITE_MONTHLY=price_...votre_price_id...

# ============================================
# 💰 STRIPE - Prix Annuels
# ============================================
STRIPE_PRICE_ID_PRO_YEARLY=price_...votre_price_id...
STRIPE_PRICE_ID_ELITE_YEARLY=price_...votre_price_id...

# ============================================
# 🎣 STRIPE - Webhook Secret
# ============================================
STRIPE_WEBHOOK_SECRET=whsec_...votre_webhook_secret...

# ============================================
# 📧 RESEND
# ============================================
RESEND_API_KEY=re_...votre_api_key_resend...
```

**⚠️ IMPORTANT :** Utilisez VOS vraies valeurs du fichier `.env.local` (ne les copiez jamais dans GitHub !)

### ⚠️ IMPORTANT :

Pour chaque variable :
1. Cliquez sur **"Add New"**
2. **Key** : Le nom de la variable (ex: `STRIPE_SECRET_KEY`)
3. **Value** : La valeur (ex: `sk_live_51...`)
4. **Environment** : Sélectionnez **Production**, **Preview**, et **Development**
5. Cliquez sur **"Save"**

**Répétez pour TOUTES les variables ci-dessus.**

---

## 🚀 ÉTAPE 2 : DÉPLOYER SUR VERCEL

### Option A : Via le terminal

```bash
cd /Users/nathan/Desktop/athlink\ copie
vercel --prod
```

### Option B : Via le Dashboard Vercel

1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Deployments**
4. Cliquez sur **"Redeploy"** sur le dernier déploiement
5. Cochez **"Use existing Build Cache"** si demandé
6. Cliquez sur **"Redeploy"**

---

## 🧪 ÉTAPE 3 : TESTER EN PRODUCTION

### Test 1 : Vérifier que le site fonctionne

1. Allez sur : https://athlink.fr
2. Connectez-vous
3. Allez sur : https://athlink.fr/dashboard/upgrade

**✅ Vous devriez voir la page avec les 3 plans (FREE, PRO, ELITE)**

### Test 2 : Tester un changement d'abonnement

1. Sur https://athlink.fr/dashboard/upgrade
2. Cliquez sur **"Passer à Pro"**
3. Vous devriez être redirigé vers **Stripe Checkout**
4. Utilisez une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/25` (ou n'importe quelle date future)
   - CVC : `123`
   - Nom : Votre nom
5. Cliquez sur **"S'abonner"**

**✅ Résultat attendu :**
- Le paiement passe
- Vous êtes redirigé vers https://athlink.fr/dashboard?success=true&plan=PRO&cycle=monthly
- Votre plan est **automatiquement activé**
- Vous recevez un **email de confirmation**

### Test 3 : Vérifier le webhook

1. Allez sur : https://dashboard.stripe.com/webhooks
2. Cliquez sur votre webhook : `https://athlink.fr/api/stripe/webhook`
3. Cherchez **"Tentatives récentes"**
4. Vous devriez voir l'événement `checkout.session.completed` avec le statut **"Réussi"**

**✅ Si le statut est "Réussi", le webhook fonctionne !**

### Test 4 : Tester un code promo

1. Créez un code promo dans Stripe : https://dashboard.stripe.com/coupons
2. Créez un coupon (ex: 50% de réduction)
3. Créez un code promo lié à ce coupon (ex: `TEST50`)
4. Sur https://athlink.fr/dashboard/upgrade
5. Entrez le code `TEST50`
6. Cliquez sur **"Vérifier"**
7. **✅ Le code devrait être validé**
8. Cliquez sur **"Passer à Pro"**
9. **✅ Le code promo devrait être appliqué sur Stripe Checkout**

---

## 🐛 DÉPANNAGE

### Problème 1 : "Non authentifié" quand je clique sur "Passer à Pro"

**Cause :** Vous n'êtes pas connecté ou la session a expiré.

**Solution :**
1. Déconnectez-vous
2. Reconnectez-vous
3. Réessayez

### Problème 2 : "Profil non trouvé"

**Cause :** Votre profil n'existe pas dans la base de données.

**Solution :**
1. Vérifiez que `DATABASE_URL` est correct dans Vercel
2. Vérifiez que votre base de données est accessible
3. Vérifiez que la table `Profile` existe

### Problème 3 : "Price ID invalide"

**Cause :** Les Price IDs ne sont pas corrects dans Vercel.

**Solution :**
1. Allez sur Vercel → Settings → Environment Variables
2. Vérifiez que les 4 `STRIPE_PRICE_ID_*` sont corrects
3. Redéployez

### Problème 4 : Le plan ne s'active pas après paiement

**Cause :** Le webhook ne fonctionne pas.

**Solutions :**

**A. Vérifier l'URL du webhook**
1. Allez sur : https://dashboard.stripe.com/webhooks
2. Vérifiez que l'URL est **EXACTEMENT** : `https://athlink.fr/api/stripe/webhook`
3. Si ce n'est pas le cas, modifiez-la

**B. Vérifier le secret du webhook**
1. Sur la page du webhook, cliquez sur **"Révéler"** le Signing secret
2. Copiez le secret
3. Allez sur Vercel → Settings → Environment Variables
4. Modifiez `STRIPE_WEBHOOK_SECRET` avec le nouveau secret
5. Redéployez

**C. Vérifier les événements**
1. Sur la page du webhook, vérifiez que ces 3 événements sont cochés :
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.deleted`

**D. Envoyer un événement de test**
1. Sur la page du webhook, cliquez sur **"Envoyer un événement de test"**
2. Sélectionnez `checkout.session.completed`
3. Cliquez sur **"Envoyer"**
4. ✅ Le statut devrait être **"Réussi"**
5. Si c'est une erreur, consultez les logs Vercel

### Problème 5 : Erreur 500 sur l'API

**Cause :** Une variable d'environnement manque ou est incorrecte.

**Solution :**
1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Functions**
4. Cliquez sur une fonction qui a une erreur
5. Consultez les **logs**
6. Identifiez la variable manquante
7. Ajoutez-la dans **Settings** → **Environment Variables**
8. Redéployez

---

## 📊 VÉRIFICATION POST-DÉPLOIEMENT

### Checklist :

- [ ] Le site `https://athlink.fr` charge correctement
- [ ] Je peux me connecter
- [ ] La page `/dashboard/upgrade` s'affiche
- [ ] Je peux cliquer sur "Passer à Pro"
- [ ] Je suis redirigé vers Stripe Checkout
- [ ] Les prix affichés sont corrects
- [ ] Je peux entrer mes informations de paiement
- [ ] Le paiement passe (avec carte de test)
- [ ] Je suis redirigé vers `/dashboard`
- [ ] Mon plan est passé à PRO (vérifier dans l'interface)
- [ ] J'ai reçu un email de confirmation
- [ ] Le webhook a le statut "Réussi" dans Stripe Dashboard

**Si toutes les cases sont cochées ✅ → Votre intégration Stripe est OPÉRATIONNELLE !**

---

## 🔐 SÉCURITÉ

### ✅ Ce qui est sécurisé :

- ✅ Authentification obligatoire pour créer une session de paiement
- ✅ Validation du webhook via la signature Stripe
- ✅ Clés secrètes stockées dans Vercel (pas dans le code)
- ✅ Paiement géré par Stripe (PCI compliant)
- ✅ Codes promo validés côté serveur

### ⚠️ NE JAMAIS :

- ❌ Commiter les clés Stripe dans Git
- ❌ Exposer `STRIPE_SECRET_KEY` côté client
- ❌ Désactiver la vérification de la signature du webhook
- ❌ Faire confiance aux données côté client

---

## 📞 LOGS À CONSULTER

### En production sur Vercel :

1. **Allez sur :** https://vercel.com/dashboard
2. **Sélectionnez votre projet**
3. **Allez dans "Functions"**
4. **Cliquez sur une fonction** (ex: `/api/stripe/create-checkout-session`)
5. **Consultez les logs** en temps réel

### Dans Stripe Dashboard :

1. **Paiements :** https://dashboard.stripe.com/payments
2. **Abonnements :** https://dashboard.stripe.com/subscriptions
3. **Webhooks :** https://dashboard.stripe.com/webhooks
4. **Événements :** https://dashboard.stripe.com/events
5. **Logs :** https://dashboard.stripe.com/logs

---

## 🎯 RÉSUMÉ

### Ce que vous devez faire MAINTENANT :

1. ✅ **Configurer les variables d'environnement sur Vercel** (Étape 1)
2. ✅ **Déployer sur Vercel** (Étape 2)
3. ✅ **Tester en production** (Étape 3)
4. ✅ **Vérifier que le webhook fonctionne** (Test 3)

### Une fois fait :

🎉 **Votre système de paiement Stripe sera 100% opérationnel sur https://athlink.fr !**

Vos utilisateurs pourront :
- ✅ Changer d'abonnement en temps réel
- ✅ Utiliser des codes promo
- ✅ Choisir entre mensuel et annuel
- ✅ Recevoir des emails de confirmation
- ✅ Voir leur plan activé automatiquement

---

## 🚀 NEXT STEPS

Une fois que tout fonctionne en production :

1. **Testez avec une vraie carte de test** pour être sûr
2. **Créez vos vrais codes promo** dans Stripe
3. **Communiquez les codes promo** à vos utilisateurs
4. **Surveillez les paiements** dans Stripe Dashboard
5. **Surveillez les logs** dans Vercel Functions

---

**TOUT EST PRÊT ! IL NE VOUS RESTE PLUS QU'À DÉPLOYER ! 🚀**

