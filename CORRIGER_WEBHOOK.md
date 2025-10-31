# 🔧 CORRECTION DU WEBHOOK STRIPE - URGENT

## ❌ Problème détecté

Le webhook secret dans votre `.env.local` est **INVALIDE**.

**Impact :**
- ✅ Les paiements fonctionnent
- ❌ **MAIS** les plans ne s'activent PAS automatiquement
- ❌ Les clients paient mais n'ont pas accès aux fonctionnalités PRO/ELITE

---

## ✅ Solution : Créer un nouveau webhook

### Étape 1 : Allez sur Stripe Dashboard

**URL :** https://dashboard.stripe.com/webhooks

### Étape 2 : Activez le mode LIVE

En haut à droite de l'écran, assurez-vous que vous êtes en **mode LIVE** (pas TEST).

### Étape 3 : Créer un nouveau endpoint

1. Cliquez sur **"+ Ajouter un endpoint"**

2. **URL de l'endpoint** : `https://athlink.fr/api/stripe/webhook`
   - ⚠️ IMPORTANT : L'URL doit contenir `/api/stripe/webhook`

3. **Description** (optionnel) : `Webhook production Athlink`

### Étape 4 : Sélectionner les événements

Cochez **SEULEMENT** ces 3 événements :

- ✅ `checkout.session.completed`
- ✅ `invoice.payment_succeeded`
- ✅ `customer.subscription.deleted`

### Étape 5 : Enregistrer

1. Cliquez sur **"Ajouter un endpoint"**

2. Vous verrez une page avec le **Signing secret**

3. Cliquez sur **"Révéler"** pour voir le secret

4. **Copiez le secret** (commence par `whsec_...`)

### Étape 6 : Mettre à jour .env.local

Ouvrez votre fichier `.env.local` et remplacez :

```bash
STRIPE_WEBHOOK_SECRET=whsec_Ky29o0fEALcs8IdKkGfatQCQaxxMKB9g
```

Par :

```bash
STRIPE_WEBHOOK_SECRET=whsec_NOUVEAU_SECRET_ICI
```

### Étape 7 : Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C dans le terminal)
# Puis relancez
npm run dev
```

---

## 🧪 Tester que ça fonctionne

1. **Allez sur :** http://localhost:3001/dashboard/upgrade

2. **Cliquez sur :** "Passer à Pro"

3. **Carte de test :**
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/25`
   - CVC : `123`

4. **Vérifiez :**
   - ✅ Le paiement passe
   - ✅ Vous êtes redirigé vers le dashboard
   - ✅ Votre plan est **PRO** (vérifiez dans l'interface)

---

## ⚠️ Note importante

Si vous avez déjà un webhook à l'URL `https://athlink.fr/webhook` (sans `/api/stripe`), vous devez soit :

1. **Option A (recommandé)** : Supprimer l'ancien et créer un nouveau avec la bonne URL
2. **Option B** : Modifier l'URL de l'ancien webhook

---

## 🎯 Vérification rapide

Une fois le webhook configuré, lancez :

```bash
node scripts/test-stripe-integration.js
```

Vous devriez voir :

```
✅ Webhook: OK
```

---

## 💡 Pourquoi cette erreur ?

Le webhook secret que vous avez fourni (`whsec_Ky29o0fEALcs8IdKkGfatQCQaxxMKB9g`) n'existe pas dans votre compte Stripe en mode LIVE.

**Causes possibles :**
1. Le webhook a été supprimé
2. Le secret a été regénéré
3. Le webhook est en mode TEST mais vos clés sont en mode LIVE
4. Vous avez copié le mauvais secret

---

## ✅ Une fois corrigé

Votre système sera **100% fonctionnel** :

✅ Changement de plan instantané  
✅ Activation automatique des fonctionnalités  
✅ Emails de confirmation  
✅ Gestion des renouvellements  
✅ Gestion des annulations  

🚀 **Vous pourrez accepter de vrais paiements en production !**

