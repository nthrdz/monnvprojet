# 🎁 Configuration Rewardful pour le tracking des conversions

## ❌ Problème actuel

Les conversions Stripe ne sont **pas envoyées à Rewardful**, donc les stats n'apparaissent pas dans le dashboard Rewardful.

## ✅ Solution

Il faut configurer **2 clés API Rewardful** pour que les conversions soient trackées automatiquement.

---

## 📝 Étapes de configuration

### 1️⃣ Récupérer les clés API Rewardful

1. **Va sur** : https://app.getrewardful.com/settings/api
2. Tu verras deux clés :
   - **API Key** (publique, commence par `rw_...`)
   - **Secret Key** (secrète, commence par `sk_...`)

### 2️⃣ Ajouter les clés dans `.env.local` (local)

Ouvre ton fichier `.env.local` et ajoute :

```bash
# 🎁 REWARDFUL - Système d'affiliation
# ============================================

# Clé publique (pour le tracking côté client)
NEXT_PUBLIC_REWARDFUL_API_KEY=rw_xxxxxxxxxxxxxxxx

# Clé secrète (pour envoyer les conversions depuis le serveur)
REWARDFUL_API_SECRET=sk_xxxxxxxxxxxxxxxx
```

### 3️⃣ Ajouter les clés sur Vercel (production)

1. **Va sur** : https://vercel.com/dashboard
2. **Clique sur** ton projet Athlink
3. **Va dans** : Settings → Environment Variables
4. **Ajoute** les 2 variables :
   - `NEXT_PUBLIC_REWARDFUL_API_KEY` = `rw_xxxxxxxxxxxxxxxx`
   - `REWARDFUL_API_SECRET` = `sk_xxxxxxxxxxxxxxxx`
5. **Redéploie** le projet pour appliquer les changements

---

## 🎯 Comment ça fonctionne maintenant

### Avant (ne fonctionnait pas) ❌

```
1. Utilisateur clique sur https://athlink.fr/?via=nathan
2. Utilisateur s'inscrit et paie (ELITE)
3. ❌ Rien n'est envoyé à Rewardful
4. ❌ Dashboard Rewardful vide (0 conversions)
```

### Après (fonctionne correctement) ✅

```
1. Utilisateur clique sur https://athlink.fr/?via=nathan
2. SDK Rewardful enregistre le referral code "nathan"
3. Utilisateur s'inscrit et paie (ELITE)
4. Webhook Stripe reçoit le paiement
5. ✅ API envoie la conversion à Rewardful :
   - Referral code: "nathan"
   - Email: contact@athlink.fr
   - Montant: 25.90€ (ELITE)
   - Plan: ELITE
6. ✅ Dashboard Rewardful affiche la conversion
7. ✅ Tu gagnes ta commission : 10,36€/mois
```

---

## 🧪 Tester la configuration

### 1. Vérifier que le SDK Rewardful est chargé

Ouvre la console du navigateur sur https://athlink.fr et tape :

```javascript
window.rewardful
```

Tu devrais voir un objet avec `q: []`. Si c'est `undefined`, la clé publique n'est pas configurée.

### 2. Faire un test d'achat

1. Utilise ton lien : `https://athlink.fr/?via=nathan`
2. Crée un compte test
3. Paie avec une carte de test Stripe : `4242 4242 4242 4242`
4. Vérifie dans les logs Stripe (webhook) que la conversion est envoyée
5. Vérifie dans ton dashboard Rewardful que la conversion apparaît

---

## 📊 Exemple de logs Stripe (webhook)

Quand tout fonctionne correctement, tu verras dans les logs :

```
🎁 Code de parrainage détecté: nathan
   - Appel de l'API affiliate/convert...
✅ Conversion affilié enregistrée avec succès !
   - Commission: 10.36 €

🎁 Envoi de la conversion à Rewardful...
✅ Conversion envoyée à Rewardful avec succès !
   - Conversion ID: conv_xxxxxxxxxxxxxxxx
```

---

## ⚠️ Important

### Sécurité

- ✅ `NEXT_PUBLIC_REWARDFUL_API_KEY` : **Publique**, safe côté client
- ❌ `REWARDFUL_API_SECRET` : **Secrète**, NE JAMAIS l'exposer dans le code frontend

### Format de l'API Rewardful

L'endpoint utilisé est :

```
POST https://api.getrewardful.com/v1/conversions
```

Avec le body :

```json
{
  "referral_code": "nathan",
  "email": "contact@athlink.fr",
  "amount": 2590,
  "currency": "eur",
  "external_id": "cs_xxxxxxxxxxxxxxxx",
  "metadata": {
    "plan": "ELITE",
    "userId": "user_xxxxxxxxxxxxxxxx",
    "subscriptionId": "sub_xxxxxxxxxxxxxxxx"
  }
}
```

---

## 🚀 Une fois configuré

Toutes les conversions Stripe (PRO et ELITE) seront automatiquement envoyées à Rewardful et tu pourras suivre :

- 📊 Nombre de parrainages
- 💰 Commissions gagnées
- 📈 Taux de conversion
- 💳 Paiements reçus

**Tout apparaîtra dans ton dashboard Rewardful : https://app.getrewardful.com/dashboard**

