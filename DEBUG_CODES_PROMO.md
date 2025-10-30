# 🔍 Debug Codes Promo - Erreur 500

## 🚨 Problème actuel

Vous obtenez une **erreur 500** lors de la validation d'un code promo créé dans Stripe.

---

## ✅ CHECKLIST DE VÉRIFICATION

### 1. Vérifiez les variables d'environnement Vercel

**Allez sur Vercel** → Votre projet → **Settings** → **Environment Variables**

Vérifiez que ces variables existent :
- ✅ `STRIPE_SECRET_KEY` : Doit commencer par `sk_live_...` ou `sk_test_...`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Doit commencer par `pk_live_...` ou `pk_test_...`

**Important** : Si vous utilisez les clés **test**, les codes promo doivent être créés dans le **dashboard test** de Stripe !

### 2. Vérifiez que votre code promo existe dans le bon environnement Stripe

**Dashboard Stripe** : https://dashboard.stripe.com/coupons

⚠️ **ATTENTION** :
- Si vous utilisez `sk_test_...` → Créez les codes dans **Test mode**
- Si vous utilisez `sk_live_...` → Créez les codes dans **Live mode**

Pour basculer : Cliquez sur le toggle **Test mode** / **Live mode** en haut à droite

### 3. Créez correctement le code promo

#### Étape 1 : Créer le Coupon
1. https://dashboard.stripe.com/coupons
2. **Create coupon**
3. Choisissez :
   - Type : Pourcentage (ex: 30%) OU Montant (ex: 5€)
   - Duration : Once, Forever, ou Repeating
4. **Create coupon**

#### Étape 2 : Créer le Code Promo
1. Sur la page du coupon, cliquez **"Create promotion code"**
2. Saisissez le code : **BIENVENUE** (majuscules recommandées)
3. **Create promotion code**

### 4. Vérifiez les logs Vercel

**Allez sur Vercel** → Votre projet → **Deployments** → Dernier déploiement → **Functions**

Cherchez les logs qui commencent par :
- `🔍 Validation code promo:` → Le code reçu
- `🔗 Connexion à Stripe API...` → Tentative de connexion
- `📊 Résultats Stripe:` → Nombre de codes trouvés
- `❌ Erreur validation code promo Stripe:` → L'erreur exacte

---

## 🎯 PROBLÈMES COURANTS

### Erreur : "No such promotion_code"
**Cause** : Le code n'existe pas dans Stripe
**Solution** : Créez le code dans le dashboard Stripe

### Erreur : "Invalid API Key"
**Cause** : `STRIPE_SECRET_KEY` incorrecte ou manquante
**Solution** : Vérifiez les variables d'environnement Vercel

### Erreur : "Test mode / Live mode mismatch"
**Cause** : Code créé en Test mais clé Live utilisée (ou inverse)
**Solution** : Créez le code dans le bon environnement

### Erreur : "API key expired"
**Cause** : Clé Stripe expirée ou révoquée
**Solution** : Générez une nouvelle clé dans Stripe Dashboard

---

## 🧪 COMMENT TESTER

### Test 1 : Vérifier que Stripe fonctionne

Créez un code promo simple :
```
Coupon:
  Type: 100% (gratuit)
  Duration: Once
  Name: Test

Code promo:
  Code: TEST
  Active: Yes
```

Testez avec le code **TEST** sur `/dashboard/upgrade`

### Test 2 : Vérifier les logs

1. Saisissez le code **TEST**
2. Ouvrez la console du navigateur (F12)
3. Allez sur l'onglet **Network**
4. Cherchez la requête `/api/promo-codes/validate`
5. Regardez la réponse

**Réponse attendue si tout fonctionne :**
```json
{
  "valid": true,
  "code": "TEST",
  "discount": "100%",
  "description": "...",
  ...
}
```

**Réponse en cas d'erreur :**
```json
{
  "valid": false,
  "error": "Message d'erreur",
  "details": "Détails techniques (en dev)"
}
```

### Test 3 : Vérifier dans Vercel Logs

1. **Vercel Dashboard** → Votre projet
2. **Deployments** → Dernier déploiement
3. **Functions** → Cherchez `/api/promo-codes/validate`
4. Regardez les logs console

---

## 🔧 SOLUTIONS RAPIDES

### Solution 1 : Redéployer avec les bonnes variables

1. **Vercel** → **Settings** → **Environment Variables**
2. Vérifiez `STRIPE_SECRET_KEY`
3. **Deployments** → **...** → **Redeploy**

### Solution 2 : Utiliser les clés de test

Si vous débutez, utilisez les **clés test** de Stripe :
1. **Stripe Dashboard** → Basculez en **Test mode**
2. **Developers** → **API keys**
3. Copiez `Secret key` (commence par `sk_test_...`)
4. Mettez à jour dans Vercel
5. Créez vos codes promo en **Test mode**

### Solution 3 : Vérifier que le code est actif

1. **Stripe Dashboard** → **Coupons**
2. Cliquez sur votre coupon
3. Vérifiez que le code promo est **Active**
4. Vérifiez qu'il n'est pas **Expired**

---

## 📞 BESOIN D'AIDE ?

### Informations à fournir :

1. **Les logs Vercel** de `/api/promo-codes/validate`
2. **Screenshot** du code promo dans Stripe Dashboard
3. **Environment** : Test ou Live mode ?
4. **Message d'erreur** exact du frontend

### Où trouver les logs :

**Vercel** : https://vercel.com/[votre-projet]/deployments → Dernier déploiement → **Functions**

---

## ✅ UNE FOIS QUE ÇA MARCHE

Une fois que vous aurez un code promo fonctionnel :
1. ✅ Le code sera validé en temps réel
2. ✅ L'UI affichera la réduction
3. ✅ Le code sera appliqué lors de l'upgrade
4. ✅ Les stats seront dans le profil utilisateur

---

**Dans 2-3 minutes, testez avec le code "TEST" et vérifiez les logs Vercel pour voir l'erreur exacte ! 🔍**

