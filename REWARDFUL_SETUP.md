# 🎯 GUIDE D'INSTALLATION REWARDFUL - Option A (Rapide)

## ✅ ÉTAPE 1 : RÉCUPÉRER TA CLÉ API REWARDFUL

### 1.1 - Dans ton Dashboard Rewardful :
1. Va dans **Settings → Installation**
2. Cherche ton **API Key** (ressemble à `abc123def456`)
3. Copie cette clé

---

## ✅ ÉTAPE 2 : AJOUTER LA CLÉ DANS TON .env.local

Ouvre ton fichier `.env.local` et ajoute :

```bash
# ============================================
# 🎯 REWARDFUL - Programme d'affiliation
# ============================================
NEXT_PUBLIC_REWARDFUL_API_KEY=abc123def456
```

**⚠️ REMPLACE `abc123def456` par ta vraie clé API !**

---

## ✅ ÉTAPE 3 : CONFIGURER L'INTÉGRATION STRIPE PAYMENT LINKS

### 3.1 - Dans Rewardful Dashboard :
1. Va dans **Integrations**
2. Clique sur **"Stripe Payment Links"**
3. Connecte ton compte Stripe (autorisation)
4. ✅ C'est tout ! Rewardful va automatiquement tracker les paiements via tes Payment Links

### 3.2 - Tes Payment Links actuels :
```
Elite Mensuel : https://buy.stripe.com/00w6oH9iSgu3fbL7WdeQM00
```

**✅ Rewardful va automatiquement attribuer les commissions sur ce lien !**

---

## ✅ ÉTAPE 4 : CRÉER UNE CAMPAGNE D'AFFILIATION

### 4.1 - Dans Rewardful Dashboard :
1. Va dans **Campaigns**
2. Clique sur **"Create Campaign"**
3. Configure :
   - **Nom** : Programme Ambassadeur Athlink
   - **Commission** : 20% (ou ce que tu veux)
   - **Type** : Récurrent (commission sur chaque paiement mensuel)
   - **Durée** : À vie (ou limité à X mois)

### 4.2 - Options recommandées :
- ✅ **Commission récurrente** : Oui (20% chaque mois)
- ✅ **Cookie durée** : 30 jours (attribution si achat dans 30 jours)
- ✅ **Auto-approval** : Non (tu valides les affiliés manuellement)

---

## ✅ ÉTAPE 5 : AJOUTER LA CLÉ SUR VERCEL (PRODUCTION)

### 5.1 - Dans Vercel Dashboard :
1. Va sur ton projet
2. **Settings → Environment Variables**
3. Ajoute :
   - **Name** : `NEXT_PUBLIC_REWARDFUL_API_KEY`
   - **Value** : `abc123def456` (ta vraie clé)
   - **Environment** : Production, Preview, Development

4. **Redéploie** ton application

---

## 🎉 RÉSULTAT : COMMENT ÇA MARCHE ?

### **Flux utilisateur :**

```
1. Un visiteur clique sur un lien d'affilié :
   https://athlink.fr/?via=jean-ambassadeur

2. Rewardful stocke un cookie (30 jours)

3. Le visiteur visite ton site, explore, réfléchit...

4. Le visiteur décide d'upgrader vers Elite
   → Il clique sur "Passer Elite"
   → Redirigé vers Stripe Payment Link
   → Il paie 25,90€

5. Stripe notifie Rewardful du paiement

6. Rewardful attribue la commission à l'affilié :
   → 20% de 25,90€ = 5,18€
   → Commission récurrente chaque mois tant que l'abo est actif

7. L'affilié voit ses commissions dans son dashboard Rewardful
```

---

## 📊 CRÉER DES LIENS D'AFFILIATION

### **Option A : Créer manuellement**
Dans Rewardful Dashboard :
1. Va dans **Affiliates → Add Affiliate**
2. Entre l'email de l'ambassadeur
3. Un lien unique est généré : `https://athlink.fr/?via=jean`

### **Option B : Auto-inscription (à configurer plus tard)**
Tu peux créer une page `/become-affiliate` où les gens peuvent s'inscrire eux-mêmes.

---

## 🧪 TESTER LE SYSTÈME

### Test en local :
1. **Démarre ton serveur** : `npm run dev`
2. **Ouvre la console du navigateur** (F12)
3. **Va sur** : `http://localhost:3000`
4. **Dans la console, tape** :
   ```javascript
   window.Rewardful
   ```
5. **Tu devrais voir** : Un objet Rewardful avec des méthodes
   - ✅ Si oui : Le tracking est installé !
   - ❌ Si undefined : Vérifie ta clé API

### Test avec un lien d'affilié :
1. **Crée un affilié test** dans Rewardful
2. **Copie son lien** : `http://localhost:3000/?via=test`
3. **Ouvre ce lien** dans un navigateur privé
4. **Clique sur "Passer Elite"** → Paie avec une carte test
5. **Vérifie dans Rewardful** → La conversion devrait apparaître

---

## 🚀 PROCHAINES ÉTAPES (OPTIONNEL)

### 1. **Page Dashboard Affilié**
Créer `/dashboard/affiliate` pour que tes utilisateurs deviennent affiliés

### 2. **Webhooks Rewardful**
Synchroniser les données d'affiliation avec ta DB Prisma

### 3. **Email automatique**
Envoyer un email aux affiliés quand ils ont une nouvelle commission

---

## 🆘 RÉSOLUTION DE PROBLÈMES

### ❌ Le script ne se charge pas
- Vérifie que `NEXT_PUBLIC_REWARDFUL_API_KEY` est bien défini
- Vérifie qu'il commence par `NEXT_PUBLIC_`
- Redémarre ton serveur (`npm run dev`)

### ❌ Les conversions ne sont pas trackées
- Vérifie que Stripe est bien connecté dans Rewardful
- Vérifie que ton Payment Link est bien celui configuré
- Attends 5-10 minutes (délai de synchronisation Stripe → Rewardful)

### ❌ L'affilié ne reçoit pas de commission
- Vérifie que le cookie était bien présent (fenêtre privée + lien via)
- Vérifie que la campagne est active
- Vérifie le taux de commission dans la campagne

---

## 📞 SUPPORT

**Rewardful** : support@getrewardful.com
**Discord Rewardful** : https://discord.gg/rewardful

---

**🎉 C'est tout ! Ton système d'affiliation est opérationnel !**

