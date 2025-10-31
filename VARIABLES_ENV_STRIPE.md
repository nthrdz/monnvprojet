# 🔑 Variables d'environnement Stripe - Configuration complète

## 📋 Variables à ajouter dans `.env.local`

Voici **toutes les variables** à ajouter dans votre fichier `.env.local` pour que le système de paiement fonctionne :

```bash
# ========================================
# STRIPE - Clés API
# ========================================
# Trouvez-les sur : https://dashboard.stripe.com/apikeys

STRIPE_SECRET_KEY=sk_test_...
# En production, utilisez : sk_live_...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# En production, utilisez : pk_live_...

# ========================================
# STRIPE - Prix des produits (4 Price IDs)
# ========================================
# Créez-les sur : https://dashboard.stripe.com/products

# PRO - Mensuel (ex: 9.99€/mois)
STRIPE_PRICE_ID_PRO_MONTHLY=price_...

# PRO - Annuel (ex: 99€/an - économie de 2 mois)
STRIPE_PRICE_ID_PRO_YEARLY=price_...

# ELITE - Mensuel (ex: 19.99€/mois)
STRIPE_PRICE_ID_ELITE_MONTHLY=price_...

# ELITE - Annuel (ex: 199€/an - économie de 2 mois)
STRIPE_PRICE_ID_ELITE_YEARLY=price_...

# ========================================
# STRIPE - Webhook Secret
# ========================================
# Configurez-le sur : https://dashboard.stripe.com/webhooks

STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🛠️ Comment obtenir ces variables

### 1️⃣ Clés API Stripe

1. Allez sur https://dashboard.stripe.com/apikeys
2. **Mode Test** (pour développement) :
   - Copiez la **Secret key** → `sk_test_...`
   - Copiez la **Publishable key** → `pk_test_...`
3. **Mode Live** (pour production) :
   - Activez votre compte Stripe
   - Copiez la **Secret key** → `sk_live_...`
   - Copiez la **Publishable key** → `pk_live_...`

---

### 2️⃣ Price IDs (4 produits à créer)

#### Créer les produits dans Stripe Dashboard

1. **Allez sur** : https://dashboard.stripe.com/products
2. **Cliquez sur** : **+ Ajouter un produit**

#### Produit 1 : Athlink PRO - Mensuel

```
Nom : Athlink PRO
Description : Abonnement mensuel Athlink PRO
Prix : 9.99 EUR
Fréquence : Mensuel (Recurring)
```

✅ **Enregistrez** et copiez le **Price ID** → `price_xxx...`  
➡️ Ajoutez dans `.env.local` : `STRIPE_PRICE_ID_PRO_MONTHLY=price_xxx...`

#### Produit 2 : Athlink PRO - Annuel

```
Produit : Utilisez le même produit "Athlink PRO"
Cliquez sur "Ajouter un autre prix"
Prix : 99 EUR (ou 95.88 EUR pour 2 mois gratuits)
Fréquence : Annuel (Recurring yearly)
```

✅ **Enregistrez** et copiez le **Price ID** → `price_yyy...`  
➡️ Ajoutez dans `.env.local` : `STRIPE_PRICE_ID_PRO_YEARLY=price_yyy...`

#### Produit 3 : Athlink ELITE - Mensuel

```
Nom : Athlink ELITE
Description : Abonnement mensuel Athlink ELITE
Prix : 19.99 EUR
Fréquence : Mensuel (Recurring)
```

✅ **Enregistrez** et copiez le **Price ID** → `price_zzz...`  
➡️ Ajoutez dans `.env.local` : `STRIPE_PRICE_ID_ELITE_MONTHLY=price_zzz...`

#### Produit 4 : Athlink ELITE - Annuel

```
Produit : Utilisez le même produit "Athlink ELITE"
Cliquez sur "Ajouter un autre prix"
Prix : 199 EUR (ou 191.88 EUR pour 2 mois gratuits)
Fréquence : Annuel (Recurring yearly)
```

✅ **Enregistrez** et copiez le **Price ID** → `price_aaa...`  
➡️ Ajoutez dans `.env.local` : `STRIPE_PRICE_ID_ELITE_YEARLY=price_aaa...`

---

### 3️⃣ Webhook Secret

#### En développement (local)

1. **Installez Stripe CLI** :
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Connectez-vous** :
   ```bash
   stripe login
   ```

3. **Lancez le listener** :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copiez le webhook secret** affiché (commence par `whsec_...`)
5. **Ajoutez dans `.env.local`** : `STRIPE_WEBHOOK_SECRET=whsec_...`

#### En production (Vercel/serveur)

1. **Allez sur** : https://dashboard.stripe.com/webhooks
2. **Cliquez sur** : **+ Ajouter un endpoint**
3. **URL du endpoint** : `https://votre-domaine.com/api/stripe/webhook`
4. **Sélectionnez ces événements** :
   - ✅ `checkout.session.completed`
   - ✅ `invoice.payment_succeeded`
   - ✅ `customer.subscription.deleted`
5. **Cliquez sur** : **Ajouter un endpoint**
6. **Copiez le Signing secret** (commence par `whsec_...`)
7. **Ajoutez dans Vercel** : Settings → Environment Variables → `STRIPE_WEBHOOK_SECRET`

---

## 📝 Exemple de fichier `.env.local` complet

```bash
# Base de données
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-nextauth"

# Stripe - API Keys
STRIPE_SECRET_KEY="sk_test_51ABC..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51ABC..."

# Stripe - Prix PRO
STRIPE_PRICE_ID_PRO_MONTHLY="price_1QRST...mensuel"
STRIPE_PRICE_ID_PRO_YEARLY="price_1QRST...annuel"

# Stripe - Prix ELITE
STRIPE_PRICE_ID_ELITE_MONTHLY="price_1QXYZ...mensuel"
STRIPE_PRICE_ID_ELITE_YEARLY="price_1QXYZ...annuel"

# Stripe - Webhook
STRIPE_WEBHOOK_SECRET="whsec_ABC..."

# Resend Email
RESEND_API_KEY="re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS"
```

---

## ✅ Checklist de vérification

Avant de tester, vérifiez que :

- [ ] Vous avez créé **4 produits** dans Stripe (PRO monthly, PRO yearly, ELITE monthly, ELITE yearly)
- [ ] Vous avez copié les **4 Price IDs** dans `.env.local`
- [ ] Vous avez configuré le **webhook** (Stripe CLI en dev ou Stripe Dashboard en prod)
- [ ] Vous avez le **webhook secret** dans `.env.local`
- [ ] Vous avez redémarré votre serveur après modification de `.env.local`

---

## 🧪 Tester que tout fonctionne

```bash
# 1. Redémarrer le serveur
npm run dev

# 2. En parallèle, lancer le webhook listener (dev uniquement)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 3. Aller sur http://localhost:3000/dashboard/upgrade

# 4. Tester avec une carte de test Stripe
Numéro : 4242 4242 4242 4242
Date : n'importe quelle date future
CVC : n'importe quel 3 chiffres

# 5. Vérifier que :
✅ Le paiement est validé
✅ Le plan est activé
✅ Un email de confirmation est envoyé
✅ Les logs du webhook s'affichent
```

---

## 💰 Prix recommandés

| Plan | Mensuel | Annuel | Économie |
|------|---------|--------|----------|
| **PRO** | 9.99€/mois | 99€/an | 2 mois gratuits |
| **ELITE** | 19.99€/mois | 199€/an | 2 mois gratuits |

**Calcul :**
- PRO mensuel : 9.99€ × 12 = 119.88€
- PRO annuel : 99€ → Économie de 20.88€ (≈17%)
- ELITE mensuel : 19.99€ × 12 = 239.88€
- ELITE annuel : 199€ → Économie de 40.88€ (≈17%)

---

## 🐛 Dépannage

### Erreur : "Price ID invalide"

**Cause :** Les Price IDs dans `.env.local` ne correspondent pas à ceux dans Stripe

**Solution :**
1. Vérifiez que les Price IDs commencent par `price_`
2. Vérifiez qu'ils existent dans votre Stripe Dashboard
3. Vérifiez que vous utilisez les bons IDs (test vs live)
4. Redémarrez votre serveur après modification

### Erreur : "Webhook signature invalid"

**Cause :** Le webhook secret est incorrect ou manquant

**Solution :**
1. En dev : Lancez `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Copiez le secret affiché et mettez-le dans `.env.local`
3. Redémarrez votre serveur
4. En prod : Vérifiez que le secret dans Vercel est correct

### Erreur : "Plan not found"

**Cause :** Un des 4 Price IDs est manquant ou invalide

**Solution :**
1. Vérifiez que TOUS les 4 Price IDs sont présents dans `.env.local`
2. Vérifiez qu'il n'y a pas de fautes de frappe
3. Testez avec `console.log(process.env.STRIPE_PRICE_ID_PRO_MONTHLY)`

---

## 🔐 Sécurité

⚠️ **IMPORTANT** : Ne JAMAIS commiter le fichier `.env.local` dans Git !

Vérifiez que `.env.local` est bien dans votre `.gitignore` :

```bash
# .gitignore
.env.local
.env*.local
```

---

## 📚 Documentation

- **Stripe Products** : https://stripe.com/docs/products-prices
- **Stripe Checkout** : https://stripe.com/docs/checkout
- **Stripe Webhooks** : https://stripe.com/docs/webhooks
- **Stripe CLI** : https://stripe.com/docs/stripe-cli

---

**Votre configuration est maintenant complète ! 🎉**

