# 🚀 Activer Rewardful en production

## ❌ Problème actuel

Rewardful n'est **PAS encore actif** sur athlink.fr en production.

**Raison** : Le dernier build Vercel a échoué à cause d'une erreur TypeScript (maintenant corrigée).

---

## ✅ Solution : Redéployer sur Vercel

### **Option 1 : Redéploiement automatique (recommandé)**

Le dernier commit a été pushé sur GitHub avec la correction. Vercel devrait redéployer automatiquement.

**Action** : Attends 2-3 minutes et vérifie.

### **Option 2 : Redéploiement manuel (si Option 1 échoue)**

1. Va sur : https://vercel.com/dashboard
2. Clique sur ton projet **Athlink**
3. Onglet **"Deployments"**
4. Clique sur le **dernier déploiement** (celui qui a échoué)
5. Clique sur les **3 points** `...` en haut à droite
6. Clique sur **"Redeploy"**
7. ✅ **Coche** : "Use existing Build Cache" (plus rapide)
8. Clique sur **"Redeploy"** (confirmer)

---

## 🧪 Vérifier que Rewardful est actif

### **Test automatique (dans 3 minutes)**

```bash
node scripts/test-rewardful-production.js
```

**Résultat attendu** :
```
🎉 SUCCÈS : Rewardful est correctement configuré !
```

### **Test manuel dans le navigateur**

1. Ouvre : https://athlink.fr
2. **Force le refresh** : Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
3. Ouvre la **Console** : F12
4. Tape : `window.rewardful`
5. **Tu devrais voir** : `{q: []}` (pas `undefined`)

---

## 🔗 Tester le lien affilié

### **Étape 1 : Tester le tracking**

1. Ouvre : https://athlink.fr/?via=nathan
2. Console (F12) : `document.cookie`
3. **Tu devrais voir** : `rewardful.referral=nathan`

✅ Si tu vois le cookie, le tracking fonctionne !

### **Étape 2 : Tester une conversion complète**

1. Ouvre : https://athlink.fr/?via=nathan
2. Crée un compte test avec un email bidon
3. Upgrade vers ELITE
4. Paie avec la carte de test Stripe : `4242 4242 4242 4242`
5. **Vérifie les logs Stripe** (webhook) :

```
🎁 Code de parrainage détecté: nathan
🎁 Envoi de la conversion à Rewardful...
✅ Conversion envoyée à Rewardful avec succès !
```

6. **Vérifie ton dashboard Rewardful** : https://app.getrewardful.com/dashboard

Tu devrais voir la conversion apparaître ! 🎉

---

## 📊 Vérifier dans le dashboard Rewardful

### **Connexion**

1. Va sur : https://app.getrewardful.com/login
2. Connecte-toi avec ton compte Rewardful

### **Statistiques à surveiller**

Dans le dashboard, tu devrais voir :

- **Links** : Ton lien `https://athlink.fr/?via=nathan`
- **Visitors** : Nombre de personnes qui ont cliqué sur ton lien
- **Conversions** : Nombre de personnes qui ont payé après avoir cliqué
- **Commissions** : Montant des commissions gagnées

---

## 🔑 Vérifier les clés API sur Vercel

Si Rewardful ne fonctionne toujours pas après le redéploiement :

1. Va sur : https://vercel.com/dashboard
2. Clique sur ton projet **Athlink**
3. **Settings** → **Environment Variables**
4. Vérifie que ces 2 clés existent :

| Variable | Valeur | Environments |
|----------|--------|--------------|
| `NEXT_PUBLIC_REWARDFUL_API_KEY` | `bf940c` | ✅ Production, ✅ Preview, ✅ Development |
| `REWARDFUL_API_SECRET` | `88e0491c7cc82914f5377020f3655e2d` | ✅ Production, ✅ Preview, ✅ Development |

Si elles ne sont pas là ou incorrectes, ajoute-les et redéploie.

---

## ⚠️ Checklist de dépannage

Si Rewardful ne fonctionne toujours pas :

- [ ] Les 2 clés API sont sur Vercel
- [ ] Le dernier build Vercel est "Ready" (pas "Failed")
- [ ] Le cache du navigateur est vidé (Cmd+Shift+R)
- [ ] Tu testes sur https://athlink.fr (pas localhost)
- [ ] Tu as attendu au moins 3 minutes après le redéploiement

---

## 📝 Commandes utiles

### **Tester Rewardful en production**
```bash
node scripts/test-rewardful-production.js
```

### **Vérifier les stats clients**
```bash
node scripts/list-clients-stats.js
```

### **Voir les infos d'un client**
```bash
node scripts/get-client-info.js <username>
```

---

## 🎯 Timeline attendue

```
Maintenant : Correction pushée sur GitHub
    ↓
+2 min : Vercel détecte le push et commence le build
    ↓
+5 min : Build terminé, déploiement en production
    ↓
+6 min : Rewardful actif sur athlink.fr
    ↓
Test : node scripts/test-rewardful-production.js
    ↓
✅ SUCCÈS : Rewardful fonctionne !
```

---

## 🚀 Une fois que Rewardful est actif

### **1. Partager ton lien affilié**

Ton lien officiel :
```
https://athlink.fr/?via=nathan
```

Partage-le sur :
- Instagram
- Twitter
- LinkedIn
- TikTok
- Dans ta bio
- Dans tes stories

### **2. Promouvoir auprès des athlètes**

Message type :
```
🚀 Découvre Athlink, le profil digital des athlètes !

✅ Centralise tous tes liens
✅ Partage tes performances
✅ Trouve des sponsors

👉 Inscris-toi : https://athlink.fr/?via=nathan

💰 Upgrade ELITE = tu gagnes 10,36€/mois !
```

### **3. Suivre tes conversions**

- Dashboard Rewardful : https://app.getrewardful.com/dashboard
- Dashboard Stripe : https://dashboard.stripe.com
- Dashboard Athlink : https://athlink.fr/dashboard/affiliate

---

## ✅ Résumé des actions

1. ⏳ **Maintenant** : Attends 3 minutes que Vercel redéploie
2. 🧪 **Dans 3 min** : Teste avec `node scripts/test-rewardful-production.js`
3. ✅ **Si ça marche** : Partage ton lien `https://athlink.fr/?via=nathan`
4. 📊 **Chaque jour** : Surveille ton dashboard Rewardful

---

**🎉 Dans 5 minutes, ton système d'affiliation Rewardful sera complètement opérationnel !**

