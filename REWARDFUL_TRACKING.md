# 🎯 REWARDFUL - TRACKING AFFILIATION

## ✅ CONFIGURATION TERMINÉE

### 📋 Clés API ajoutées dans `.env.local` :
```bash
NEXT_PUBLIC_REWARDFUL_API_KEY=bf940c
REWARDFUL_API_SECRET=88e0491c7cc82914f5377020f3655e2d
```

---

## 🚀 COMMENT ÇA FONCTIONNE

### 1️⃣ **Génération du lien affilié**

Chaque ambassadeur reçoit un lien personnalisé :
```
https://www.athlink.fr/?via=username
```

Par exemple :
```
https://www.athlink.fr/?via=nnthrdz
```

---

### 2️⃣ **Tracking automatique par Rewardful**

Quand quelqu'un clique sur un lien affilié :

1. ✅ **Rewardful détecte le paramètre `?via=username`**
2. ✅ **Un cookie est créé** (durée : 60 jours)
3. ✅ **Le clic est enregistré** dans le dashboard Rewardful
4. ✅ **Le visiteur est tracké** pendant 60 jours

---

### 3️⃣ **Conversion automatique**

Quand le visiteur s'inscrit et paye :

1. ✅ **Stripe traite le paiement**
2. ✅ **Rewardful détecte la conversion** (grâce au cookie)
3. ✅ **La commission est calculée** (40% du montant)
4. ✅ **L'affilié est crédité automatiquement**

---

## 💰 COMMISSIONS

| Plan | Prix Mensuel | Commission (40%) |
|------|--------------|------------------|
| **PRO** | 9,90€ | **3,96€ / mois** |
| **ELITE** | 25,90€ | **10,36€ / mois** |

### 📊 Caractéristiques :
- ✅ **Commission récurrente** : Payée chaque mois tant que l'abonné reste actif
- ✅ **Cookie 60 jours** : Si l'utilisateur s'inscrit dans les 60 jours, la commission est attribuée
- ✅ **Paiements automatiques** : Rewardful gère tout automatiquement

---

## 🔧 INTÉGRATION TECHNIQUE

### **Scripts chargés dans `app/layout.tsx` :**

```typescript
{/* Initialisation de la queue Rewardful */}
<Script
  id="rewardful-init"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`
  }}
/>

{/* SDK Rewardful */}
<Script
  src="https://r.wdfl.co/rw.js"
  data-rewardful={process.env.NEXT_PUBLIC_REWARDFUL_API_KEY}
  strategy="afterInteractive"
/>
```

### **Ce que fait le script :**
1. ✅ Détecte automatiquement les paramètres `?via=` dans l'URL
2. ✅ Crée un cookie pour tracker le visiteur
3. ✅ Communique avec Stripe pour détecter les conversions
4. ✅ Attribue les commissions aux affiliés

---

## 📊 DASHBOARD AFFILIÉ

### **Inscription affilié :**
```
https://nathan-rodriguez.getrewardful.com/signup
```

### **Connexion affilié :**
```
https://app.getrewardful.com/login
```

### **Ce que l'affilié voit :**
- 📈 Nombre de clics sur son lien
- 💰 Nombre de conversions
- 💵 Commissions gagnées
- 📅 Historique des paiements
- 🔗 Son lien unique personnalisé

---

## 🎯 CONNEXION STRIPE

### **Rewardful est connecté à Stripe :**
- ✅ Détection automatique des nouveaux abonnements
- ✅ Attribution automatique des commissions
- ✅ Suivi des abonnements récurrents
- ✅ Gestion des annulations (commissions s'arrêtent automatiquement)

### **Webhook Stripe → Rewardful :**
Rewardful écoute les événements Stripe suivants :
- `customer.subscription.created` → Nouvelle conversion
- `invoice.payment_succeeded` → Paiement mensuel réussi
- `customer.subscription.deleted` → Annulation

---

## 🧪 TESTER LE SYSTÈME

### **1. Tester le tracking de clic :**
1. Ouvre une fenêtre de navigation privée
2. Va sur `https://www.athlink.fr/?via=nnthrdz`
3. Vérifie dans le dashboard Rewardful que le clic est enregistré

### **2. Tester une conversion complète :**
1. Utilise une carte de test Stripe : `4242 4242 4242 4242`
2. Clique sur un lien affilié
3. Inscris-toi avec un nouvel email
4. Passe au plan PRO ou ELITE
5. Vérifie dans Rewardful que la commission est attribuée

### **3. Vérifier le cookie :**
1. Va sur `https://www.athlink.fr/?via=nnthrdz`
2. Ouvre les DevTools (F12) → Application → Cookies
3. Cherche un cookie contenant "rewardful" ou "via"

---

## 🚨 IMPORTANT - SÉCURITÉ

### **Variables d'environnement :**

| Variable | Visibilité | Usage |
|----------|-----------|-------|
| `NEXT_PUBLIC_REWARDFUL_API_KEY` | ✅ Client | Chargement du script Rewardful côté client |
| `REWARDFUL_API_SECRET` | ❌ Serveur uniquement | Appels API serveur (ne JAMAIS exposer) |

⚠️ **Ne JAMAIS commit `.env.local` dans Git !**

---

## 📚 DOCUMENTATION REWARDFUL

- 📖 Guide complet : https://www.getrewardful.com/docs
- 🔧 API Reference : https://www.getrewardful.com/docs/api
- 💬 Support : Via le dashboard Rewardful

---

## ✅ CHECKLIST DÉPLOIEMENT PRODUCTION

Avant de déployer sur Vercel :

- [x] Clés Rewardful ajoutées dans `.env.local`
- [ ] Clés Rewardful ajoutées dans Vercel (Settings → Environment Variables)
- [x] Script Rewardful chargé dans `app/layout.tsx`
- [x] Page `/dashboard/affiliate` configurée avec lien d'inscription
- [x] Commission 40% configurée dans Rewardful
- [x] Stripe connecté à Rewardful
- [ ] Test complet : Clic → Inscription → Paiement → Commission

---

## 🎉 RÉSULTAT FINAL

Les ambassadeurs peuvent maintenant :
1. ✅ S'inscrire sur Rewardful
2. ✅ Obtenir leur lien unique `athlink.fr/?via=username`
3. ✅ Partager leur lien
4. ✅ Gagner 40% de commission récurrente sur tous leurs parrainages
5. ✅ Recevoir des paiements automatiques chaque mois

**Le système est 100% automatique ! 🚀**

