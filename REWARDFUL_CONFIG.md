# 🔑 CONFIGURATION REWARDFUL - ATHLINK

## ✅ TA CLÉ API REWARDFUL

```
bf940c
```

---

## 📝 ÉTAPE 1 : AJOUTER LA CLÉ DANS .env.local

Ouvre ton fichier `.env.local` et **ajoute cette ligne à la fin** :

```bash
# ============================================
# 🎯 REWARDFUL - Programme d'affiliation
# ============================================
NEXT_PUBLIC_REWARDFUL_API_KEY=bf940c
```

**⚠️ IMPORTANT** : Sauvegarde le fichier !

---

## 🔄 ÉTAPE 2 : REDÉMARRER LE SERVEUR LOCAL

```bash
# Arrête le serveur actuel (Ctrl+C)
# Puis relance :
npm run dev
```

---

## 🧪 ÉTAPE 3 : TESTER EN LOCAL

1. **Va sur** : http://localhost:3000
2. **Ouvre la console du navigateur** (F12 → Console)
3. **Tape cette commande** :
   ```javascript
   window.rewardful
   ```
4. **Résultat attendu** :
   - ✅ Tu devrais voir : `function rewardful() { ... }`
   - ❌ Si `undefined` : Vérifie que tu as bien ajouté la clé dans `.env.local` et redémarré

---

## ☁️ ÉTAPE 4 : AJOUTER SUR VERCEL (PRODUCTION)

### 4.1 - Dans Vercel Dashboard :

1. Va sur **https://vercel.com/dashboard**
2. Sélectionne ton projet **"monnvprojet"**
3. Va dans **Settings** (en haut)
4. Clique sur **Environment Variables** (menu de gauche)

### 4.2 - Ajouter la variable :

Clique sur **"Add New"** et entre :

| Champ | Valeur |
|-------|--------|
| **Key** | `NEXT_PUBLIC_REWARDFUL_API_KEY` |
| **Value** | `bf940c` |
| **Environments** | ✅ Production ✅ Preview ✅ Development |

### 4.3 - Sauvegarder et redéployer :

1. Clique sur **"Save"**
2. Va dans l'onglet **"Deployments"**
3. Clique sur **"Redeploy"** sur le dernier déploiement
4. ✅ Attend que le déploiement soit terminé (~1-2 min)

---

## 🎯 ÉTAPE 5 : CONNECTER STRIPE DANS REWARDFUL

### 5.1 - Dans Rewardful Dashboard :

1. Va sur **https://www.getrewardful.com/dashboard**
2. Clique sur **"Integrations"** (menu de gauche)
3. Cherche **"Stripe"**
4. Clique sur **"Connect Stripe"**
5. **Autorise l'accès** à ton compte Stripe

### 5.2 - Configurer Payment Links :

1. Une fois connecté, sélectionne **"Stripe Payment Links"**
2. ✅ C'est tout ! Rewardful va automatiquement tracker tes Payment Links :
   - `https://buy.stripe.com/00w6oH9iSgu3fbL7WdeQM00` (Elite Mensuel)

---

## 📊 ÉTAPE 6 : CRÉER UNE CAMPAGNE D'AFFILIATION

### 6.1 - Dans Rewardful Dashboard :

1. Va dans **"Campaigns"**
2. Clique sur **"Create Campaign"**

### 6.2 - Configuration recommandée :

| Paramètre | Valeur recommandée |
|-----------|-------------------|
| **Campaign Name** | Programme Ambassadeur Athlink |
| **Commission Type** | Recurring (Récurrent) |
| **Commission Rate** | 20% |
| **Commission Duration** | Lifetime (À vie) |
| **Cookie Duration** | 30 days |
| **Auto-approve affiliates** | No (tu valides manuellement) |

### 6.3 - Sauvegarder :

Clique sur **"Create Campaign"** ✅

---

## 🧪 ÉTAPE 7 : CRÉER UN AFFILIÉ TEST

### 7.1 - Dans Rewardful Dashboard :

1. Va dans **"Affiliates"**
2. Clique sur **"Add Affiliate"**
3. Entre :
   - **Email** : `test@athlink.fr` (ou ton propre email)
   - **First Name** : `Test`
   - **Last Name** : `Ambassadeur`
4. Clique sur **"Add Affiliate"**

### 7.2 - Récupérer le lien de test :

1. Clique sur l'affilié que tu viens de créer
2. Copie son **lien d'affiliation** :
   ```
   https://athlink.fr/?via=test
   ```

---

## 🎉 ÉTAPE 8 : TESTER LE FLUX COMPLET

### Test en local :

1. **Ouvre une fenêtre de navigation privée**
2. **Va sur** : `http://localhost:3000/?via=test`
3. **Clique sur "Connexion"** et connecte-toi (ou inscris-toi)
4. **Va dans "Upgrade"** → Clique sur **"Passer Elite"**
5. **Tu seras redirigé vers Stripe** → Paie avec une carte test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
6. **Après le paiement** :
   - Tu reviens sur `/dashboard/payment-success`
   - Ton plan est activé en Elite ✅

### Vérifier dans Rewardful :

1. Va dans **Rewardful Dashboard → Referrals**
2. Tu devrais voir **une nouvelle conversion** avec :
   - Affilié : `test@athlink.fr`
   - Montant : `25,90€`
   - Commission : `5,18€`
   - Status : `Pending` (en attente de validation)

---

## 📍 ACCÉDER À LA PAGE AFFILIÉ

### En local :
```
http://localhost:3000/dashboard/affiliate
```

### En production (après déploiement) :
```
https://athlink.fr/dashboard/affiliate
```

**Cette page affiche** :
- ✅ Le lien d'ambassadeur personnalisé
- ✅ Bouton copier
- ✅ Conseils marketing
- ✅ Lien vers le dashboard Rewardful complet

---

## 🔍 VÉRIFIER QUE TOUT FONCTIONNE

### Checklist :

- [ ] ✅ Clé API ajoutée dans `.env.local`
- [ ] ✅ Serveur redémarré
- [ ] ✅ `window.rewardful` existe dans la console
- [ ] ✅ Stripe connecté dans Rewardful
- [ ] ✅ Campagne créée avec 20% de commission
- [ ] ✅ Affilié test créé
- [ ] ✅ Test de conversion effectué
- [ ] ✅ Conversion visible dans Rewardful
- [ ] ✅ Clé ajoutée sur Vercel
- [ ] ✅ Application redéployée

---

## 🎯 COMMENT ÇA MARCHE EN PRODUCTION

### Flux utilisateur complet :

```
1. 👤 Un visiteur clique sur le lien d'un ambassadeur :
   https://athlink.fr/?via=jean

2. 🍪 Rewardful stocke un cookie pendant 30 jours
   → Le visiteur est "taggé" comme référé par "jean"

3. 👀 Le visiteur explore ton site, regarde son profil...

4. 💳 Le visiteur décide d'upgrader :
   → Clique sur "Passer Elite"
   → Redirigé vers Stripe Payment Link
   → Paie 25,90€

5. ✅ Stripe envoie la notification à Rewardful
   → Rewardful voit que ce client avait un cookie "jean"
   → Attribution automatique !

6. 💰 Commission calculée et enregistrée :
   → 20% de 25,90€ = 5,18€ pour "jean"
   → Chaque mois, tant que l'abo est actif !

7. 📧 "jean" reçoit une notification par email
   → Il peut voir ses stats dans Rewardful

8. 💸 Paiement automatique à "jean" :
   → Stripe Connect ou PayPal (configuré dans Rewardful)
   → Chaque mois ou à un seuil défini
```

---

## 📞 SUPPORT

**Rewardful Support** : support@getrewardful.com  
**Discord Rewardful** : https://discord.gg/rewardful  
**Documentation** : https://docs.getrewardful.com

---

## 🎉 C'EST TERMINÉ !

Ton système d'affiliation est maintenant 100% opérationnel ! 🚀

**Fonctionnalités actives** :
✅ Tracking automatique des affiliés
✅ Attribution des conversions
✅ Commissions récurrentes (20% à vie)
✅ Dashboard pour les ambassadeurs
✅ Intégration Stripe automatique
✅ Paiements automatiques

**Tu peux maintenant** :
1. Créer tes premiers ambassadeurs
2. Leur donner leurs liens personnalisés
3. Les laisser promouvoir Athlink
4. Voir les conversions en temps réel dans Rewardful
5. Les payer automatiquement chaque mois !

