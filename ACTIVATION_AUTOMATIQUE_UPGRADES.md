# 🚀 Activation Automatique des Upgrades - Guide Complet

## 📋 Vue d'ensemble

Ce guide vous permet de :
1. ✅ **Rattraper les anciens paiements** → Script automatique
2. ✅ **Activer les futurs paiements** → Webhook automatique

---

## 🔥 PARTIE 1 : Rattraper les Anciens Paiements (MAINTENANT)

### **Script de synchronisation automatique**

Ce script va automatiquement :
- Récupérer tous les paiements Stripe réussis
- Identifier les utilisateurs par email
- Mettre à jour leur plan selon le Price ID payé

### **Lancer le script :**

```bash
node scripts/sync-stripe-payments.js
```

### **Ce que le script fait :**

```
1. Se connecte à Stripe et récupère les 100 derniers paiements
2. Pour chaque paiement réussi :
   - Identifie l'utilisateur par son email
   - Vérifie le Price ID pour déterminer le plan (PRO/ELITE)
   - Compare avec le plan actuel dans la DB
   - Met à jour si nécessaire
3. Affiche un résumé :
   - ✅ Plans mis à jour
   - ✓  Plans déjà corrects
   - ❌ Utilisateurs non trouvés
```

### **Résultat attendu :**

```
============================================
🔄 SYNCHRONISATION DES PAIEMENTS STRIPE
============================================

📥 Récupération des paiements Stripe...
✅ 15 sessions trouvées

🔄 llllolrdz@gmail.com: FREE → ELITE (25.9€)
   ✅ Plan mis à jour avec succès !

✅ john@example.com: Plan déjà correct (PRO)

============================================
📊 RÉSUMÉ DE LA SYNCHRONISATION
============================================
✅ Plans mis à jour: 1
✓  Plans déjà corrects: 14
❌ Utilisateurs non trouvés: 0
⚠️  Erreurs: 0
============================================

🎉 SYNCHRONISATION RÉUSSIE !

💡 Les utilisateurs doivent se déconnecter/reconnecter pour voir le changement.
```

---

## ✅ PARTIE 2 : Activer les Futurs Paiements (WEBHOOK)

### **Le webhook est déjà codé et fonctionne automatiquement !**

Le fichier `/app/api/stripe/webhook/route.ts` gère automatiquement :
1. ✅ Identification de l'utilisateur par email
2. ✅ Identification du plan par Price ID
3. ✅ Mise à jour automatique du profil
4. ✅ Envoi d'un email de confirmation

### **Configuration requise sur Stripe Dashboard :**

#### **1️⃣ Payment Link (si vous utilisez Payment Links)**

Pour **chaque Payment Link** (ELITE Mensuel, ELITE Annuel, PRO Mensuel, PRO Annuel) :

**Settings du Payment Link :**
- ☑️ **Collect customer email** ← **OBLIGATOIRE !**
- ☑️ **Allow promotion codes** (optionnel)
- **Success URL** : `https://athlink.fr/dashboard/payment-success`
- **Cancel URL** : `https://athlink.fr/dashboard/upgrade?payment=cancelled`

**Sans l'email, le webhook ne peut pas identifier l'utilisateur !**

#### **2️⃣ Webhook Stripe**

**URL du webhook :** `https://athlink.fr/api/stripe/webhook`

**Événements à écouter :**
- ☑️ `checkout.session.completed` ← **OBLIGATOIRE**
- ☑️ `invoice.payment_succeeded` (pour les renouvellements)
- ☑️ `customer.subscription.deleted` (pour les annulations)

**Vérifier que le webhook est actif :**
1. Stripe Dashboard → **Webhooks**
2. Trouvez votre webhook `https://athlink.fr/api/stripe/webhook`
3. Status : **Enabled** ✅

#### **3️⃣ Variables d'environnement Vercel**

**TOUTES ces variables doivent être sur Vercel :**

```env
# Database (CRITIQUE !)
DATABASE_URL=postgresql://postgres.ioyklugzwavjyondimwd:Nathan141102!@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Stripe API
STRIPE_SECRET_KEY=sk_live_51SKfx5H23JS5N2cD...
STRIPE_WEBHOOK_SECRET=whsec_Ky29o0fEALcs8IdKkGfatQCQaxxMKB9g

# Price IDs (CRITIQUES pour identifier le plan !)
STRIPE_PRICE_ID_ELITE_MONTHLY=price_1SLk9TH23JS5N2cDv057Uzv8
STRIPE_PRICE_ID_ELITE_YEARLY=price_1SLk92H23JS5N2cDvKHW9X0n
STRIPE_PRICE_ID_PRO_MONTHLY=price_1SLk8KH23JS5N2cDps6VfY3W
STRIPE_PRICE_ID_PRO_YEARLY=price_1SLkA2H23JS5N2cDiEmU195J

# Auth
NEXTAUTH_URL=https://athlink.fr
NEXTAUTH_SECRET=PIy5H0efKgCRWE6gAFhrVNG0FHvFApde2NpH3unqBoU=

# Email
RESEND_API_KEY=re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS
```

---

## 🧪 PARTIE 3 : Tester que Tout Fonctionne

### **Test 1 : Script de rattrapage**

```bash
node scripts/sync-stripe-payments.js
```

**Résultat attendu :** Tous les utilisateurs qui ont payé sont mis à jour vers le bon plan.

### **Test 2 : Nouveau paiement**

1. Allez sur `https://www.athlink.fr/dashboard/upgrade`
2. Cliquez sur **"Passer Elite"** (Mensuel)
3. Utilisez la carte de test : `4242 4242 4242 4242`
4. **Entrez votre email** (le même que votre compte Athlink)
5. Validez le paiement
6. **Vous êtes redirigé vers** `/dashboard/payment-success`
7. **Attendez 2-3 secondes** (le webhook s'exécute)
8. **Votre plan est activé automatiquement** ✅
9. **Vous recevez un email de confirmation**

### **Test 3 : Vérifier les logs webhook**

**Sur Vercel :**
1. **Functions** → `/api/stripe/webhook` → **Logs**
2. Vous devriez voir :
   ```
   💰 Checkout session complété !
   ✅ Utilisateur identifié par email: user@example.com
   💰 Price ID: price_1SLk9TH23JS5N2cDv057Uzv8
   ✅ Plan identifié: ELITE
   ✅✅✅ PLAN ACTIVÉ AVEC SUCCÈS ! ✅✅✅
   📧 Email de confirmation envoyé
   ```

**Sur Stripe :**
1. **Webhooks** → Votre webhook → **Events**
2. `checkout.session.completed` → Status **200 OK** ✅

---

## 🔄 Flux Complet d'un Paiement

```
Utilisateur clique "Passer Elite"
    ↓
Redirection vers Payment Link Stripe
    ↓
Paiement avec carte + EMAIL
    ↓
Stripe envoie webhook checkout.session.completed
    ↓
Webhook /api/stripe/webhook reçoit l'événement
    ↓
Identifie l'utilisateur par email
    ↓
Identifie le plan par Price ID
    ↓
Met à jour profile.plan en DB
    ↓
Envoie email de confirmation
    ↓
Retourne 200 OK à Stripe
    ↓
Utilisateur redirigé vers /dashboard/payment-success
    ↓
Page force rafraîchissement de session
    ↓
Utilisateur voit son nouveau plan ELITE ✅
```

---

## 🚨 Résolution de Problèmes

### **Problème : Le plan ne s'active pas automatiquement**

**Vérifiez :**
1. ✅ Variables `STRIPE_PRICE_ID_...` sur Vercel ?
2. ✅ `DATABASE_URL` correcte sur Vercel ?
3. ✅ Payment Link collecte l'email ?
4. ✅ Webhook reçoit l'événement `checkout.session.completed` ?
5. ✅ Logs webhook sur Vercel : erreur ?

**Solutions :**
- Si variables manquantes → Ajoutez-les sur Vercel et redéployez
- Si erreur webhook → Lisez les logs Vercel pour voir l'erreur exacte
- Si email non collecté → Modifiez le Payment Link Stripe

### **Problème : "Tenant or user not found"**

**Solution :** La DATABASE_URL est incorrecte. Utilisez :
```
postgresql://postgres.ioyklugzwavjyondimwd:Nathan141102!@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### **Problème : "Can't reach database server"**

**Solution :** Le serveur Supabase est peut-être en pause ou l'URL a changé. Allez sur Supabase Dashboard → Settings → Database et copiez la nouvelle URL.

---

## 📊 Récapitulatif des Actions

```
☐ 1. Lancer le script de rattrapage
     → node scripts/sync-stripe-payments.js
     
☐ 2. Vérifier Payment Links Stripe
     → Collect customer email : ☑️
     → Success URL : https://athlink.fr/dashboard/payment-success
     
☐ 3. Vérifier variables Vercel
     → DATABASE_URL ✅
     → 4 x STRIPE_PRICE_ID_... ✅
     → STRIPE_WEBHOOK_SECRET ✅
     
☐ 4. Tester un paiement
     → Carte : 4242 4242 4242 4242
     → Vérifier activation automatique
     
☐ 5. Vérifier logs
     → Vercel : /api/stripe/webhook
     → Stripe : Webhooks → Events
```

---

## ✅ Une fois tout configuré

**Les upgrades seront 100% automatiques :**
- ✅ Paiement réussi → Plan activé instantanément
- ✅ Email de confirmation envoyé
- ✅ Utilisateur voit son nouveau plan
- ✅ Fonctionnalités débloquées

**Aucune intervention manuelle nécessaire ! 🎉**

