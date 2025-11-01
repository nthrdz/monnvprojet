# 🔧 Guide : Corriger les Upgrades qui n'ont pas fonctionné

## 📋 Diagnostic du problème

D'après le diagnostic, **TOUS les 15 utilisateurs ont le plan FREE**, ce qui signifie qu'aucun upgrade n'a fonctionné automatiquement via le webhook.

---

## 🔍 Outils de diagnostic

### **1️⃣ Script de diagnostic complet**

Lancez le script pour vérifier la configuration :

```bash
node scripts/debug-upgrade-system.js
```

**Ce qu'il vérifie :**
- ✅ Variables d'environnement (Stripe, DB)
- ✅ Connexion Stripe (mode LIVE/TEST)
- ✅ Validité des Price IDs
- ✅ Configuration du webhook
- ✅ Connexion base de données
- ✅ Distribution des plans

**Pour vérifier un utilisateur spécifique :**
```bash
node scripts/debug-upgrade-system.js email@example.com
```

### **2️⃣ API de diagnostic utilisateur**

**GET** `/api/admin/force-upgrade?email=user@example.com`

Retourne les informations complètes d'un utilisateur (ID, email, profil, plan actuel, stats).

---

## 🚀 Solution : Force Upgrade Manuel

### **Via l'interface admin**

1. Allez sur `https://www.athlink.fr/dashboard/admin/force-upgrade`
2. Entrez l'email de l'utilisateur
3. Cliquez sur **"Rechercher"** pour voir son plan actuel
4. Sélectionnez le nouveau plan (FREE, PRO, ou ELITE)
5. Cliquez sur **"Forcer l'upgrade"**
6. ✅ Le plan est mis à jour immédiatement !

### **Via l'API**

**POST** `/api/admin/force-upgrade`

```bash
curl -X POST https://www.athlink.fr/api/admin/force-upgrade \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "plan": "ELITE"}'
```

**Réponse :**
```json
{
  "success": true,
  "message": "Plan mis à jour de FREE vers ELITE",
  "user": {
    "email": "user@example.com",
    "oldPlan": "FREE",
    "newPlan": "ELITE"
  }
}
```

---

## 🎯 Pourquoi les upgrades n'ont pas fonctionné ?

### **Causes possibles :**

1. **❌ Payment Link mal configuré**
   - L'URL de redirection n'était pas configurée
   - L'email client n'était pas collecté
   
2. **❌ Variables d'environnement manquantes sur Vercel**
   - Les 4 `STRIPE_PRICE_ID_...` ne sont peut-être pas sur Vercel
   - Le webhook ne peut pas identifier le plan sans les Price IDs
   
3. **❌ Webhook pas appelé**
   - Stripe n'a peut-être pas appelé le webhook
   - Vérifier dans **Stripe Dashboard** → **Webhooks** → **Events**

---

## ✅ Vérifications à faire sur Vercel

### **1️⃣ Variables d'environnement**

Allez sur **Vercel** → **Settings** → **Environment Variables** et vérifiez que TOUTES ces variables sont présentes :

```env
# Stripe API
STRIPE_SECRET_KEY=sk_live_51SKfx5H23JS5N2cD...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SKfx5H23JS5N2cD...
STRIPE_WEBHOOK_SECRET=whsec_Ky29o0fEALcs8IdKkGfatQCQaxxMKB9g

# Price IDs (CRITIQUES pour le webhook !)
STRIPE_PRICE_ID_ELITE_MONTHLY=price_1SLk9TH23JS5N2cDv057Uzv8
STRIPE_PRICE_ID_ELITE_YEARLY=price_1SLk92H23JS5N2cDvKHW9X0n
STRIPE_PRICE_ID_PRO_MONTHLY=price_1SLk8KH23JS5N2cDps6VfY3W
STRIPE_PRICE_ID_PRO_YEARLY=price_1SLkA2H23JS5N2cDiEmU195J

# Database
DATABASE_URL=postgresql://postgres.ioyklugzwavjyondimwd:Nathan141102%21@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Auth
NEXTAUTH_URL=https://athlink.fr
NEXTAUTH_SECRET=PIy5H0efKgCRWE6gAFhrVNG0FHvFApde2NpH3unqBoU=

# Resend
RESEND_API_KEY=re_AVTfoTBd_JauoB3i2iEC6u2GuSjsGMSkS
```

⚠️ **Si les 4 `STRIPE_PRICE_ID_...` sont manquantes sur Vercel, le webhook NE PEUT PAS identifier le plan !**

### **2️⃣ Après avoir ajouté les variables**

1. **Redéployez** l'application (ne pas juste rebuild)
2. Testez un nouveau paiement
3. Vérifiez les logs Vercel de `/api/stripe/webhook`

---

## 🧪 Tester le webhook

### **Après avoir corrigé les variables Vercel :**

1. Allez sur `https://www.athlink.fr/dashboard/upgrade`
2. Testez un upgrade ELITE Mensuel
3. Utilisez la carte test : `4242 4242 4242 4242`
4. **Vérifiez les logs webhook sur Vercel** :
   - Allez sur **Vercel** → **Functions** → `/api/stripe/webhook` → **Logs**
   - Vous devriez voir :
     ```
     💰 Checkout session complété !
     ✅ Utilisateur identifié par email: ...
     💰 Price ID: price_1SLk9TH23JS5N2cDv057Uzv8
     ✅ Plan identifié: ELITE
     ✅✅✅ PLAN ACTIVÉ AVEC SUCCÈS ! ✅✅✅
     ```

5. **Vérifiez dans Stripe Dashboard** :
   - **Webhooks** → Votre webhook → **Events**
   - L'événement `checkout.session.completed` doit avoir le statut **200 OK**
   - Si **400** ou **500**, lisez l'erreur dans les logs Vercel

---

## 📊 Corriger les utilisateurs existants

### **Si des utilisateurs ont déjà payé mais n'ont pas été upgradés :**

1. **Identifiez les utilisateurs qui ont payé** dans Stripe Dashboard :
   - **Payments** → Liste des paiements réussis
   - Notez les emails

2. **Pour chaque utilisateur, forcez l'upgrade** :
   - Via l'interface : `https://www.athlink.fr/dashboard/admin/force-upgrade`
   - Ou via l'API :
     ```bash
     curl -X POST https://www.athlink.fr/api/admin/force-upgrade \
       -H "Content-Type: application/json" \
       -d '{"email": "user@example.com", "plan": "ELITE"}'
     ```

3. **L'utilisateur verra son plan mis à jour** :
   - À la prochaine actualisation de page
   - Ou à la prochaine connexion

---

## 🔄 Flux de correction

```
1. Vérifier variables Vercel (surtout STRIPE_PRICE_ID_...)
        ↓
2. Redéployer si variables manquantes
        ↓
3. Tester un nouveau paiement
        ↓
4. Vérifier logs webhook Vercel
        ↓
5. Si webhook OK maintenant → Corriger utilisateurs existants via force-upgrade
        ↓
6. Si webhook encore KO → Lire logs d'erreur et ajuster
```

---

## 💡 Prévention future

### **Pour éviter ce problème à l'avenir :**

1. ✅ **Toujours vérifier les variables Vercel** avant de mettre en production
2. ✅ **Tester le webhook** avec une carte de test avant de lancer
3. ✅ **Monitorer les logs webhook** régulièrement
4. ✅ **Vérifier Stripe Dashboard** → **Webhooks** → **Events** pour voir les erreurs
5. ✅ **Activer les alertes email** dans Stripe pour les webhooks en erreur

---

## 📞 En cas de problème

Si le webhook ne fonctionne toujours pas après avoir vérifié les variables :

1. **Lisez les logs Vercel** de `/api/stripe/webhook` en détail
2. **Vérifiez les événements Stripe** pour voir l'erreur exacte
3. **Utilisez le script de diagnostic** :
   ```bash
   node scripts/debug-upgrade-system.js email@example.com
   ```
4. **Forcez manuellement** les upgrades en attendant de corriger le webhook

---

✅ **Résumé :**
- **Script de diagnostic** : `node scripts/debug-upgrade-system.js`
- **Interface admin** : `https://www.athlink.fr/dashboard/admin/force-upgrade`
- **API force upgrade** : `POST /api/admin/force-upgrade`
- **Cause probable** : Variables `STRIPE_PRICE_ID_...` manquantes sur Vercel

