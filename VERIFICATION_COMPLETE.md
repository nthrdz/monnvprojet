# 🔍 VÉRIFICATION COMPLÈTE - POURQUOI LES CODES PROMO NE MARCHENT PAS

## 📋 CHECKLIST DE VÉRIFICATION

### ✅ Étape 1 : Vérifiez EXACTEMENT les noms des variables dans Vercel

**Allez sur Vercel** → **Settings** → **Environment Variables**

Vérifiez que vous avez **EXACTEMENT** ces noms (copier-coller) :

```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
DATABASE_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
RESEND_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### ❌ ERREURS COURANTES

**SI VOUS AVEZ** :
- `AUTH_SECRET` → ❌ **CHANGEZ EN** `NEXTAUTH_SECRET`
- `AUTH_URL` → ❌ **CHANGEZ EN** `NEXTAUTH_URL`

**SI VOUS N'AVEZ PAS COCHÉ "ALL ENVIRONMENTS"** :
- ❌ Allez sur chaque variable
- ✅ Cochez **Production**, **Preview**, **Development**
- ✅ Sauvegardez

---

## 🚀 Étape 2 : Redéployez OBLIGATOIREMENT

**IMPORTANT** : Après avoir modifié les variables, vous **DEVEZ** redéployer !

1. **Vercel** → **Deployments**
2. **Dernier déploiement** → **"..."** → **Redeploy**
3. **Use existing Build Cache** → **Redeploy**
4. **Attendez 2-3 minutes** ⏳

---

## 🧪 Étape 3 : Testez dans l'ordre

### Test A : Diagnostic (OBLIGATOIRE)

**Allez sur** : `https://athlink.fr/api/diagnostic`

**Vous DEVEZ voir** :
```json
{
  "summary": {
    "status": "✅ TOUT EST OK - CLÉS LIVE CONFIGURÉES"
  },
  "checks": {
    "stripeSecretKey": {
      "configured": true,
      "type": "LIVE"
    },
    "stripeConnection": {
      "success": true,
      "message": "Connexion Stripe réussie ✅"
    }
  }
}
```

**SI VOUS VOYEZ** :
```json
{
  "stripeSecretKey": {
    "configured": false
  }
}
```
→ ❌ **Les clés ne sont PAS dans Vercel !** Recommencez l'étape 1.

**SI VOUS VOYEZ** :
```json
{
  "stripeConnection": {
    "success": false
  }
}
```
→ ❌ **Les clés sont INVALIDES !** Vérifiez-les dans Stripe Dashboard.

### Test B : Test de votre code promo

**Allez sur** : `https://athlink.fr/test-promo`

1. Entrez `BIENVENUE`
2. Cliquez "Tester"

**Vous DEVEZ voir** :
```
✅ Code valide !
BIENVENUE - 100% de réduction
```

**SI VOUS VOYEZ** :
```
❌ Configuration Stripe manquante
```
→ Les clés ne sont pas dans Vercel, recommencez l'étape 1.

**SI VOUS VOYEZ** :
```
❌ Code promo invalide ou expiré
```
→ Le code n'est pas actif dans Stripe, vérifiez dans Stripe Dashboard.

### Test C : À l'inscription

**Allez sur** : `https://athlink.fr/signup`

1. Remplissez le formulaire
2. Entrez `BIENVENUE` dans le champ code promo
3. Cliquez "🎁 Vérifier"

**Vous DEVEZ voir** :
```
✅ BIENVENUE - 100% de réduction pendant permanent
```

**SI RIEN NE SE PASSE** :
→ Ouvrez la console du navigateur (F12) et regardez les erreurs.

---

## 🔍 Étape 4 : Vérifiez les logs Vercel

**Si ça ne marche toujours pas** :

1. **Vercel** → **Deployments** → Dernier déploiement
2. **Functions** → Cherchez `/api/promo-codes/validate`
3. **Cliquez dessus**

**Vous DEVEZ voir** :
```
============================================================
🚀 API /api/promo-codes/validate appelée
============================================================
📥 Code reçu: BIENVENUE
✅ STRIPE_SECRET_KEY configurée, type: LIVE
🔍 Recherche du code: BIENVENUE
📊 Résultats Stripe: 1 code(s) trouvé(s)
✅✅✅ CODE PROMO VALIDE ! ✅✅✅
```

**SI VOUS VOYEZ** :
```
❌ STRIPE_SECRET_KEY non configurée !
```
→ **LES CLÉS NE SONT PAS DANS VERCEL !** Recommencez TOUT depuis l'étape 1.

**SI VOUS NE VOYEZ AUCUN LOG** :
→ L'API n'est pas appelée, problème côté frontend.

---

## 📊 DIAGNOSTIC COMPLET

### Cas 1 : "Configuration Stripe manquante"

**Problème** : Les variables d'environnement ne sont PAS dans Vercel.

**Solution** :
1. Vérifiez dans Vercel → Settings → Environment Variables
2. Assurez-vous d'avoir `STRIPE_SECRET_KEY`
3. Assurez-vous d'avoir coché "All Environments"
4. Redéployez
5. Attendez 2-3 minutes
6. Re-testez `/api/diagnostic`

### Cas 2 : "Code promo invalide ou expiré"

**Problème** : Le code n'est pas actif dans Stripe OU vous utilisez des clés TEST.

**Solution** :
1. Allez sur Stripe Dashboard
2. Vérifiez que le code `BIENVENUE` est ACTIF (toggle vert)
3. Vérifiez que vous utilisez des clés LIVE dans Vercel
4. Re-testez

### Cas 3 : L'API ne répond pas

**Problème** : Erreur réseau ou build cassé.

**Solution** :
1. Vérifiez que le site est bien déployé
2. Ouvrez F12 → Network → Essayez de valider un code
3. Regardez la réponse de `/api/promo-codes/validate`
4. Si erreur 500, regardez les logs Vercel Functions

### Cas 4 : Ça marche sur `/test-promo` mais pas sur `/signup`

**Problème** : Problème côté frontend de la page signup.

**Solution** :
1. Ouvrez F12 → Console sur `/signup`
2. Regardez les erreurs JavaScript
3. Essayez de valider un code
4. Regardez les logs dans la console

---

## 🎯 SOLUTION RAPIDE

### Si vous avez TOUT vérifié et ça ne marche toujours pas :

1. **Supprimez TOUTES les variables Stripe dans Vercel**
2. **Rajoutez-les une par une** en copiant-collant ces noms EXACTS :
   ```
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_WEBHOOK_SECRET
   ```
3. **Cochez ALL ENVIRONMENTS pour chaque**
4. **Redéployez**
5. **Attendez 3-5 minutes**
6. **Testez `/api/diagnostic`**

---

## 📞 SI ÇA NE MARCHE TOUJOURS PAS

Envoyez-moi **5 SCREENSHOTS** :

1. **Screenshot 1** : Vercel → Environment Variables (liste complète)
2. **Screenshot 2** : Résultat de `https://athlink.fr/api/diagnostic`
3. **Screenshot 3** : Résultat de `https://athlink.fr/test-promo` avec code BIENVENUE
4. **Screenshot 4** : Console du navigateur (F12) sur `/signup` quand vous validez un code
5. **Screenshot 5** : Logs Vercel Functions pour `/api/promo-codes/validate`

Avec ces 5 screenshots, je verrai **IMMÉDIATEMENT** le problème ! 🎯

---

## ✅ ÇA MARCHE QUAND :

```
/api/diagnostic        → ✅ "TOUT EST OK - CLÉS LIVE CONFIGURÉES"
/test-promo           → ✅ "Code valide ! BIENVENUE - 100%"
/signup               → ✅ Message vert avec checkmark
Logs Vercel Functions → ✅ "CODE PROMO VALIDE ! ✅✅✅"
```

**Si vous voyez ces 4 ✅, TOUT FONCTIONNE !** 🎉

