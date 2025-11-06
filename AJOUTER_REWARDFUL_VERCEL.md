# 🚀 Ajouter les clés Rewardful sur Vercel (PRODUCTION)

## ✅ Configuration locale déjà faite

Les clés Rewardful ont été ajoutées dans `.env.local` pour le développement local.

---

## 🔧 Ajouter les clés sur Vercel (OBLIGATOIRE pour la production)

### **Étape 1 : Va sur Vercel Dashboard**

1. Ouvre : https://vercel.com/dashboard
2. Clique sur ton projet **Athlink**

### **Étape 2 : Va dans les Environment Variables**

1. Clique sur l'onglet **"Settings"**
2. Dans le menu de gauche, clique sur **"Environment Variables"**

### **Étape 3 : Ajoute la première clé (publique)**

1. Clique sur **"Add New"**
2. **Name** : `NEXT_PUBLIC_REWARDFUL_API_KEY`
3. **Value** : `bf940c`
4. **Environments** : Coche **TOUTES les cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique sur **"Save"**

### **Étape 4 : Ajoute la seconde clé (secrète)**

1. Clique sur **"Add New"** (encore)
2. **Name** : `REWARDFUL_API_SECRET`
3. **Value** : `88e0491c7cc82914f5377020f3655e2d`
4. **Environments** : Coche **TOUTES les cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique sur **"Save"**

### **Étape 5 : Redéploie le projet**

1. Va dans l'onglet **"Deployments"**
2. Clique sur le dernier déploiement
3. Clique sur les 3 petits points **"..."**
4. Clique sur **"Redeploy"**
5. Clique sur **"Redeploy"** (confirmer)

**Ou attends simplement** : Le prochain push GitHub redéploiera automatiquement avec les nouvelles clés.

---

## 🧪 Vérifier que ça fonctionne

### **Test en local (localhost:3000)**

1. Ouvre : http://localhost:3000
2. Ouvre la **Console** (F12)
3. Tape : `window.rewardful`
4. Tu devrais voir : `{q: []}` (pas `undefined`)

✅ Si tu vois l'objet, la clé publique est bien chargée !

### **Test en production (athlink.fr)**

1. Une fois redéployé sur Vercel, ouvre : https://athlink.fr
2. Ouvre la **Console** (F12)
3. Tape : `window.rewardful`
4. Tu devrais voir : `{q: []}` (pas `undefined`)

✅ Si tu vois l'objet, la clé publique fonctionne en production !

### **Test de conversion (important !)**

1. Utilise ton lien : `https://athlink.fr/?via=nathan`
2. Crée un compte test avec un email bidon
3. Paie avec la carte de test Stripe : `4242 4242 4242 4242`
4. **Vérifie les logs Stripe** (webhook logs) :

```
🎁 Code de parrainage détecté: nathan
🎁 Envoi de la conversion à Rewardful...
✅ Conversion envoyée à Rewardful avec succès !
```

5. **Vérifie ton dashboard Rewardful** : https://app.getrewardful.com/dashboard

Tu devrais voir la nouvelle conversion apparaître ! 🎉

---

## 📊 Résumé de la configuration

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `NEXT_PUBLIC_REWARDFUL_API_KEY` | `bf940c` | ✅ Local (.env.local) |
| `REWARDFUL_API_SECRET` | `88e0491c...` | ✅ Local (.env.local) |
| `NEXT_PUBLIC_REWARDFUL_API_KEY` | `bf940c` | ⏳ À ajouter sur Vercel |
| `REWARDFUL_API_SECRET` | `88e0491c...` | ⏳ À ajouter sur Vercel |

---

## ⚠️ Important

### **Sécurité**

- ✅ `NEXT_PUBLIC_REWARDFUL_API_KEY` : **Publique**, safe côté client
- ❌ `REWARDFUL_API_SECRET` : **Secrète**, ne JAMAIS la partager publiquement

### **Fonctionnement**

1. **SDK Rewardful** (côté client) utilise `NEXT_PUBLIC_REWARDFUL_API_KEY` pour tracker les clics sur `?via=nathan`
2. **Webhook Stripe** (côté serveur) utilise `REWARDFUL_API_SECRET` pour envoyer les conversions après paiement

Les **deux clés** sont nécessaires pour que tout fonctionne correctement.

---

## 🎯 Ce qui va se passer maintenant

```
Utilisateur clique sur https://athlink.fr/?via=nathan
      ↓
SDK Rewardful enregistre "nathan" dans un cookie (14 jours)
      ↓
Utilisateur s'inscrit et paie (ELITE = 25,90€)
      ↓
Stripe envoie webhook à Athlink
      ↓
Webhook détecte le referralCode "nathan" dans les metadata
      ↓
Webhook envoie la conversion à Rewardful via API :
  - Referral: nathan
  - Email: user@example.com
  - Amount: 2590 (en centimes)
  - Plan: ELITE
      ↓
Dashboard Rewardful affiche la conversion
      ↓
Tu gagnes 10,36€/mois (40% de 25,90€) 💰
```

---

## 🚀 Prochaines étapes

1. ✅ **Local configuré** : Les clés sont dans `.env.local`
2. ⏳ **À faire** : Ajoute les clés sur Vercel (Étapes 1-5 ci-dessus)
3. ⏳ **À faire** : Redéploie le projet
4. ✅ **Tester** : Fais un achat test et vérifie que la conversion apparaît dans Rewardful

---

**🎉 Une fois configuré sur Vercel, toutes les conversions futures apparaîtront automatiquement dans ton dashboard Rewardful !**

