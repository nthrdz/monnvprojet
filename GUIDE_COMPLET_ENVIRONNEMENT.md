# 🔧 Guide Complet des Variables d'Environnement

## 📋 Table des matières
1. [Toutes les variables d'environnement](#toutes-les-variables-denvironnement)
2. [Configuration du Webhook Stripe](#configuration-du-webhook-stripe)
3. [Comment obtenir chaque variable](#comment-obtenir-chaque-variable)
4. [Différences Test vs Production](#différences-test-vs-production)

---

## 📝 Toutes les variables d'environnement

Voici **TOUTES** les variables que vous devez ajouter dans votre fichier `.env.local` :

```bash
# ============================================
# 🗄️ BASE DE DONNÉES
# ============================================
DATABASE_URL="postgresql://user:password@host:5432/database"
# Votre URL de connexion PostgreSQL (Supabase, Railway, etc.)

# ============================================
# 🔐 AUTHENTIFICATION (NextAuth)
# ============================================
NEXTAUTH_URL="http://localhost:3000"
# En développement : http://localhost:3000
# En production : https://votre-domaine.com

NEXTAUTH_SECRET="votre_secret_random_32_caractères"
# Pour générer : openssl rand -base64 32
# Exemple : "jZQd8mP3wX9kR2nF5vL7tY1qW4eN6hS8"

# ============================================
# 💳 STRIPE - Clés API
# ============================================
STRIPE_SECRET_KEY="sk_test_51..."
# Clé secrète Stripe (JAMAIS la clé publique ici)
# En test : sk_test_...
# En production : sk_live_...
# Où trouver : https://dashboard.stripe.com/apikeys

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."
# Clé publique Stripe (visible côté client)
# En test : pk_test_...
# En production : pk_live_...
# Où trouver : https://dashboard.stripe.com/apikeys

# ============================================
# 💰 STRIPE - Prix des Abonnements (MENSUEL)
# ============================================
STRIPE_PRICE_ID_PRO_MONTHLY="price_1..."
# Price ID du plan PRO mensuel (9.99€/mois)
# Où trouver : https://dashboard.stripe.com/products

STRIPE_PRICE_ID_ELITE_MONTHLY="price_1..."
# Price ID du plan ELITE mensuel (19.99€/mois)
# Où trouver : https://dashboard.stripe.com/products

# ============================================
# 💰 STRIPE - Prix des Abonnements (ANNUEL)
# ============================================
STRIPE_PRICE_ID_PRO_YEARLY="price_1..."
# Price ID du plan PRO annuel (99€/an)
# Où trouver : https://dashboard.stripe.com/products

STRIPE_PRICE_ID_ELITE_YEARLY="price_1..."
# Price ID du plan ELITE annuel (199€/an)
# Où trouver : https://dashboard.stripe.com/products

# ============================================
# 🎣 STRIPE - Webhook Secret
# ============================================
STRIPE_WEBHOOK_SECRET="whsec_..."
# Secret du webhook Stripe pour vérifier les signatures
# Où trouver : https://dashboard.stripe.com/webhooks
# Voir la section ci-dessous pour la configuration complète

# ============================================
# 📧 RESEND - Envoi d'emails
# ============================================
RESEND_API_KEY="re_..."
# Clé API Resend pour envoyer des emails
# Où trouver : https://resend.com/api-keys
# Votre clé : re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS
```

---

## 🎣 Configuration du Webhook Stripe (ÉTAPE PAR ÉTAPE)

### Qu'est-ce qu'un webhook ?

Un webhook permet à Stripe d'**informer votre application** quand un événement se produit (paiement réussi, abonnement annulé, etc.). C'est **ESSENTIEL** pour activer automatiquement les plans après paiement.

### ⚙️ Configuration en DÉVELOPPEMENT (localhost)

#### Option 1 : Utiliser Stripe CLI (Recommandé)

**Étape 1** : Installer Stripe CLI

```bash
# Sur macOS
brew install stripe/stripe-cli/stripe

# Sur Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Étape 2** : Se connecter à Stripe

```bash
stripe login
```

**Étape 3** : Démarrer le tunnel de webhook

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Étape 4** : Copier le webhook secret

Vous verrez un message comme :
```
> Ready! Your webhook signing secret is whsec_abc123xyz...
```

**Étape 5** : Ajouter le secret dans `.env.local`

```bash
STRIPE_WEBHOOK_SECRET="whsec_abc123xyz..."
```

**Étape 6** : Redémarrer votre serveur Next.js

```bash
npm run dev
```

✅ **C'est tout !** Stripe CLI va maintenant transférer tous les webhooks vers votre localhost.

#### Option 2 : Utiliser ngrok (Alternative)

Si vous ne voulez pas installer Stripe CLI, vous pouvez utiliser ngrok :

**Étape 1** : Installer ngrok

```bash
npm install -g ngrok
```

**Étape 2** : Démarrer ngrok

```bash
ngrok http 3000
```

**Étape 3** : Copier l'URL publique

Vous verrez quelque chose comme :
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Étape 4** : Configurer le webhook dans Stripe Dashboard

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **+ Ajouter un endpoint**
3. URL : `https://abc123.ngrok.io/api/stripe/webhook`
4. Sélectionnez les événements (voir ci-dessous)
5. Cliquez sur **Ajouter un endpoint**
6. Copiez le **Signing secret** (commence par `whsec_...`)
7. Ajoutez-le dans `.env.local` :
   ```bash
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

---

### ⚙️ Configuration en PRODUCTION (Vercel/Heroku/etc.)

**Étape 1** : Déployer votre application

Assurez-vous que votre application est accessible publiquement (ex: `https://athlink.vercel.app`)

**Étape 2** : Créer le webhook dans Stripe Dashboard

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **+ Ajouter un endpoint**

**Étape 3** : Configurer l'URL

```
https://votre-domaine.com/api/stripe/webhook
```

Exemple :
```
https://athlink.vercel.app/api/stripe/webhook
```

**Étape 4** : Sélectionner les événements

Cochez ces 3 événements **OBLIGATOIRES** :

- ✅ `checkout.session.completed` → Déclenché quand un paiement est réussi
- ✅ `invoice.payment_succeeded` → Déclenché lors des renouvellements mensuels
- ✅ `customer.subscription.deleted` → Déclenché quand un utilisateur annule son abonnement

**Étape 5** : Enregistrer et copier le secret

1. Cliquez sur **Ajouter un endpoint**
2. Copiez le **Signing secret** (commence par `whsec_...`)
3. Il ressemble à : `whsec_GH4k9mP2xQ7nR5vL8tY3wZ1qE6jN4fS2`

**Étape 6** : Ajouter le secret dans vos variables d'environnement

Sur Vercel :
1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez :
   - **Key** : `STRIPE_WEBHOOK_SECRET`
   - **Value** : `whsec_...`
3. Sélectionnez **Production**, **Preview**, et **Development**
4. Cliquez sur **Save**

**Étape 7** : Redéployer votre application

Sur Vercel, allez dans **Deployments** et cliquez sur **Redeploy**.

---

## 🔑 Comment obtenir chaque variable

### 1. DATABASE_URL

**Où ?** Votre fournisseur de base de données (Supabase, Railway, etc.)

**Exemple Supabase** :
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Database**
4. Copiez la **Connection string** (mode URI)
5. Format : `postgresql://user:password@host:5432/database`

---

### 2. NEXTAUTH_SECRET

**Comment générer ?** Utilisez la commande :

```bash
openssl rand -base64 32
```

Résultat : `jZQd8mP3wX9kR2nF5vL7tY1qW4eN6hS8`

Ajoutez dans `.env.local` :
```bash
NEXTAUTH_SECRET="jZQd8mP3wX9kR2nF5vL7tY1qW4eN6hS8"
```

---

### 3. STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY

**Où ?** https://dashboard.stripe.com/apikeys

**Étapes** :
1. Connectez-vous à Stripe Dashboard
2. Allez dans **Développeurs** → **Clés API**
3. Copiez :
   - **Clé publique** (commence par `pk_test_...`)
   - **Clé secrète** (commence par `sk_test_...`)

**⚠️ ATTENTION** : La clé secrète est affichée UNE SEULE FOIS. Si vous la perdez, créez-en une nouvelle.

**En mode Test** :
```bash
STRIPE_SECRET_KEY="sk_test_51..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51..."
```

**En mode Live** :
```bash
STRIPE_SECRET_KEY="sk_live_51..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_51..."
```

---

### 4. STRIPE_PRICE_ID_PRO_MONTHLY, etc.

**Où ?** https://dashboard.stripe.com/products

**Étapes** :

#### Créer le plan PRO Mensuel

1. Allez sur https://dashboard.stripe.com/products
2. Cliquez sur **+ Ajouter un produit**
3. Remplissez :
   - **Nom** : `Athlink PRO`
   - **Description** : `Abonnement mensuel Athlink PRO`
   - **Prix** : `9.99 EUR`
   - **Récurrent** : ✅ Cochez
   - **Intervalle** : `Mois`
4. Cliquez sur **Enregistrer le produit**
5. ✅ **Copiez le Price ID** (commence par `price_...`)
6. Exemple : `price_1QAbCdEfGhIjKlMn`

Ajoutez dans `.env.local` :
```bash
STRIPE_PRICE_ID_PRO_MONTHLY="price_1QAbCdEfGhIjKlMn"
```

#### Créer le plan PRO Annuel

1. Dans le même produit "Athlink PRO", cliquez sur **Ajouter un autre prix**
2. Remplissez :
   - **Prix** : `99 EUR`
   - **Récurrent** : ✅ Cochez
   - **Intervalle** : `Année`
3. Cliquez sur **Enregistrer**
4. ✅ **Copiez le Price ID annuel**

Ajoutez dans `.env.local` :
```bash
STRIPE_PRICE_ID_PRO_YEARLY="price_..."
```

#### Répétez pour ELITE

Créez les prix mensuels et annuels pour ELITE :
- **ELITE Mensuel** : `19.99 EUR/mois`
- **ELITE Annuel** : `199 EUR/an`

---

### 5. RESEND_API_KEY

**Où ?** https://resend.com/api-keys

Vous avez déjà votre clé :
```bash
RESEND_API_KEY="re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS"
```

---

## 🧪 Test vs Production

### Mode Test (Développement)

```bash
# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID_PRO_MONTHLY="price_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
```

### Mode Live (Production)

```bash
# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_PRICE_ID_PRO_MONTHLY="price_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# NextAuth
NEXTAUTH_URL="https://athlink.vercel.app"
```

**⚠️ IMPORTANT** : En production, vous devrez créer **DE NOUVEAUX** produits et prix dans Stripe en mode LIVE (pas en mode test).

---

## ✅ Checklist de vérification

Avant de lancer votre application, vérifiez que :

- [ ] `DATABASE_URL` fonctionne (testez avec `npx prisma db push`)
- [ ] `NEXTAUTH_SECRET` est généré (32 caractères minimum)
- [ ] `STRIPE_SECRET_KEY` commence par `sk_test_` (test) ou `sk_live_` (prod)
- [ ] `STRIPE_PUBLISHABLE_KEY` commence par `pk_test_` ou `pk_live_`
- [ ] Les 4 `STRIPE_PRICE_ID_*` sont corrects (copiés depuis Stripe Dashboard)
- [ ] `STRIPE_WEBHOOK_SECRET` est configuré (webhook créé dans Stripe)
- [ ] `RESEND_API_KEY` est valide
- [ ] Vous avez redémarré votre serveur après avoir modifié `.env.local`

---

## 🧪 Tester que tout fonctionne

### Test 1 : Vérifier les clés Stripe

```bash
# Créez un fichier test-stripe.js
node -e "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); stripe.prices.list({ limit: 5 }).then(prices => console.log('✅ Stripe fonctionne :', prices.data.length, 'prix trouvés')).catch(err => console.error('❌ Erreur Stripe:', err.message))"
```

### Test 2 : Vérifier le webhook

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur votre webhook
3. Cliquez sur **Envoyer un événement de test**
4. Sélectionnez `checkout.session.completed`
5. Cliquez sur **Envoyer l'événement de test**
6. ✅ Vérifiez que l'événement est reçu (logs Vercel ou console locale)

### Test 3 : Faire un paiement de test

1. Allez sur `/dashboard/upgrade`
2. Cliquez sur **Passer à Pro**
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. ✅ Le paiement doit réussir
5. ✅ Le webhook doit être reçu
6. ✅ Votre plan doit être activé

---

## 🚨 Erreurs courantes

### Erreur : "No signing secret found"

**Cause** : `STRIPE_WEBHOOK_SECRET` manquant ou incorrect.

**Solution** :
1. Vérifiez que la variable existe dans `.env.local`
2. Vérifiez qu'elle commence par `whsec_`
3. Redémarrez votre serveur

---

### Erreur : "Invalid price ID"

**Cause** : Les `STRIPE_PRICE_ID_*` sont incorrects ou n'existent pas.

**Solution** :
1. Allez sur https://dashboard.stripe.com/products
2. Vérifiez que les produits existent
3. Copiez les bons Price IDs
4. Vérifiez qu'ils commencent par `price_`
5. Redémarrez votre serveur

---

### Erreur : "Webhook signature verification failed"

**Cause** : Le `STRIPE_WEBHOOK_SECRET` ne correspond pas au webhook.

**Solution** :
1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur votre webhook
3. Copiez le nouveau **Signing secret**
4. Remplacez `STRIPE_WEBHOOK_SECRET` dans `.env.local`
5. Redémarrez votre serveur

---

## 📞 Besoin d'aide ?

Si vous rencontrez un problème :

1. **Vérifiez les logs** :
   - En local : Console de votre terminal
   - En production : Vercel Functions logs

2. **Vérifiez Stripe Dashboard** :
   - Webhooks : https://dashboard.stripe.com/webhooks
   - Événements : https://dashboard.stripe.com/events
   - Paiements : https://dashboard.stripe.com/payments

3. **Vérifiez que toutes les variables sont définies** :
   ```bash
   # Testez dans votre terminal
   echo $STRIPE_SECRET_KEY
   echo $STRIPE_WEBHOOK_SECRET
   ```

---

## 🎉 Récapitulatif

Voici le fichier `.env.local` complet que vous devez avoir :

```bash
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Stripe - Clés
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Stripe - Prix Mensuels
STRIPE_PRICE_ID_PRO_MONTHLY="price_..."
STRIPE_PRICE_ID_ELITE_MONTHLY="price_..."

# Stripe - Prix Annuels
STRIPE_PRICE_ID_PRO_YEARLY="price_..."
STRIPE_PRICE_ID_ELITE_YEARLY="price_..."

# Stripe - Webhook
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS"
```

✅ **Voilà ! Vous avez maintenant tout ce qu'il faut pour faire fonctionner votre système de paiement Stripe.**

