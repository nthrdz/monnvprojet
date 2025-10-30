# 🔍 VÉRIFIER TON CODE PROMO DANS STRIPE

## ❌ ERREUR : "Code promo invalide (coupon manquant)"

Cette erreur signifie que le **code promo existe** dans Stripe, mais que son **coupon associé** n'est pas trouvé ou a été supprimé.

---

## ✅ SOLUTION : VÉRIFIER DANS STRIPE DASHBOARD

### Étape 1 : Connexion à Stripe
1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. ⚠️ **IMPORTANT** : Bascule en mode **LIVE** (pas TEST)
   - En haut à gauche, vérifie que tu es bien en mode **LIVE**

### Étape 2 : Vérifier le code promo
1. Dans le menu de gauche, clique sur **Produits** → **Codes promo**
2. Cherche ton code promo (ex: "WELCOME20", "TEST", etc.)
3. Clique dessus pour voir les détails

### Étape 3 : Vérifier que le coupon est bien lié
Tu dois voir :
- ✅ **Code** : ex. "WELCOME20"
- ✅ **Actif** : Doit être coché (switch vert)
- ✅ **Coupon** : Un lien cliquable vers le coupon (ex: "20% OFF")
  
⚠️ **SI LE CHAMP "COUPON" EST VIDE OU AFFICHE "Supprimé"** :
→ C'est ça le problème ! Le coupon a été supprimé.

---

## 🔧 CORRIGER LE PROBLÈME

### Option 1 : Créer un nouveau code promo (RECOMMANDÉ)

#### 1. Créer un nouveau coupon
1. Va dans **Produits** → **Coupons**
2. Clique sur **"Créer un coupon"**
3. Configure :
   - **Nom** : "Promo Lancement" (ou autre)
   - **Type** : 
     - **Pourcentage** : Ex. 20% → Entre "20"
     - **Montant fixe** : Ex. 10€ → Entre "10.00"
   - **Durée** :
     - `Une seule fois` = Réduction sur la 1ère facture uniquement
     - `Permanent` = Réduction à vie
     - `Répétition` = Réduction pendant X mois
4. Clique sur **"Créer le coupon"**
5. ✅ Coupon créé !

#### 2. Créer un nouveau code promo lié à ce coupon
1. Va dans **Produits** → **Codes promo**
2. Clique sur **"Créer un code promo"**
3. Configure :
   - **Code** : Ex. "BIENVENUE20" (ce que l'utilisateur entre)
   - **Coupon** : Sélectionne le coupon créé à l'étape 1
   - **Actif** : ✅ Cocher
   - **Limite d'utilisation** : (optionnel) Ex. 100 utilisations max
   - **Date d'expiration** : (optionnel) Ex. 31/12/2025
4. Clique sur **"Créer le code promo"**
5. ✅ Code promo créé et fonctionnel !

### Option 2 : Restaurer l'ancien coupon (si possible)
Si le coupon a été supprimé par erreur :
1. Va dans **Produits** → **Coupons**
2. Regarde dans les **"Coupons archivés"** ou **"Supprimés"**
3. Si tu le trouves, clique dessus et **"Restaurer"**
4. Retourne dans **Codes promo** et vérifie que le lien est rétabli

---

## 🧪 TESTER APRÈS CORRECTION

### Test 1 : En local
```bash
npm run dev
```
1. Va sur `http://localhost:3000/signup`
2. Remplis le formulaire
3. Entre ton nouveau code promo (ex: "BIENVENUE20")
4. Clique sur **"Vérifier"**
5. ✅ Si bordure verte → **ÇA MARCHE !**
6. ❌ Si bordure rouge → Vérifie les logs dans le terminal

### Test 2 : En production (Vercel)
1. Attends ~2-3 minutes que Vercel finisse le nouveau déploiement
2. Va sur `https://athlink.fr/signup`
3. Remplis le formulaire
4. Entre ton code promo
5. Clique sur **"Vérifier"**
6. ✅ Si bordure verte → **ÇA MARCHE !**
7. ❌ Si bordure rouge → Vérifie les logs Vercel

---

## 📊 VÉRIFIER LES LOGS VERCEL

Si le problème persiste après avoir créé un nouveau code promo :

1. Va sur [vercel.com](https://vercel.com)
2. Clique sur ton projet (athlink)
3. Va dans l'onglet **"Logs"**
4. Filtre par fonction : `/api/promo-codes/validate`
5. Cherche les logs :
   ```
   🔍 Recherche du code: TON_CODE
   ✅ Code trouvé: { ... }
   ⚠️ Coupon non chargé via expand, récupération manuelle...
   ✅ Coupon récupéré manuellement: coupon_id
   ```

### Logs importants à vérifier
- ✅ `"✅ Code trouvé"` → Le code existe dans Stripe
- ✅ `"✅ Coupon récupéré manuellement"` → Le système a réussi à récupérer le coupon
- ❌ `"❌ Coupon manquant"` → Le coupon n'existe vraiment pas (créer un nouveau)
- ❌ `"❌ Impossible de récupérer le coupon"` → Problème avec les clés API Stripe

---

## 🎯 CHECKLIST FINALE

Avant de tester, vérifie que :

✅ **Mode LIVE activé dans Stripe Dashboard**  
✅ **Le coupon existe** (Produits → Coupons)  
✅ **Le code promo existe** (Produits → Codes promo)  
✅ **Le code promo est ACTIF** (switch vert)  
✅ **Le code promo est lié au coupon** (champ "Coupon" rempli)  
✅ **Le code n'a pas expiré** (vérifier la date d'expiration)  
✅ **Le code n'a pas atteint sa limite** (X / limite max)  

---

## 🚀 CODES PROMO DE TEST RECOMMANDÉS

Voici quelques exemples de codes promo à créer pour tester :

### 1. Code promo simple : 20% permanent
- **Coupon** :
  - Nom : "20% OFF Permanent"
  - Type : Pourcentage → 20%
  - Durée : Permanent
- **Code promo** :
  - Code : "WELCOME20"
  - Coupon : "20% OFF Permanent"
  - Actif : ✅

### 2. Code promo premium : 50% pendant 3 mois
- **Coupon** :
  - Nom : "50% OFF 3 mois"
  - Type : Pourcentage → 50%
  - Durée : Répétition → 3 mois
- **Code promo** :
  - Code : "LAUNCH50"
  - Coupon : "50% OFF 3 mois"
  - Actif : ✅

### 3. Code promo première facture : 10€
- **Coupon** :
  - Nom : "10€ OFF Once"
  - Type : Montant fixe → 10.00 EUR
  - Durée : Une seule fois
- **Code promo** :
  - Code : "FIRST10"
  - Coupon : "10€ OFF Once"
  - Actif : ✅

---

## 🐛 PROBLÈMES COURANTS

### ❌ "Code invalide ou expiré"
**Cause** : Le code n'existe pas ou n'est pas actif  
**Solution** : Vérifie que le code existe et est actif dans Stripe

### ❌ "Code promo invalide (coupon manquant)"
**Cause** : Le coupon a été supprimé ou n'est pas lié  
**Solution** : Crée un nouveau code promo avec un nouveau coupon

### ❌ "Erreur lors de la vérification"
**Cause** : Problème avec les clés API Stripe  
**Solution** : Vérifie les Environment Variables dans Vercel :
- `STRIPE_SECRET_KEY` doit commencer par `sk_live_`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` doit commencer par `pk_live_`

---

## 📞 BESOIN D'AIDE ?

Si après avoir suivi ce guide le problème persiste :

1. **Vérifie les logs Vercel** (très important !)
2. **Teste avec un nouveau code promo créé de A à Z**
3. **Vérifie que tu es bien en mode LIVE dans Stripe**
4. **Teste en local d'abord** (`npm run dev`)

Le fix a été déployé, donc maintenant :
- ✅ Le système essaie d'abord avec `expand`
- ✅ Si ça échoue, il récupère le coupon manuellement
- ✅ S'il ne trouve toujours pas le coupon, il affiche une erreur claire

🎯 **La solution est maintenant déployée sur Vercel !**

