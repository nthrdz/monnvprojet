# 🎁 Codes Promo Stripe - Guide Complet

## ✅ Système connecté à Stripe Dashboard

Votre SaaS utilise maintenant **directement les codes promo de Stripe**. Plus besoin de base de données personnalisée !

---

## 📋 Comment créer un code promo dans Stripe

### Étape 1 : Créer un Coupon

1. **Allez sur Stripe Dashboard** : https://dashboard.stripe.com/coupons
2. **Cliquez sur "Create coupon"**
3. **Configurez votre coupon** :

   **Type de réduction** :
   - **Pourcentage** : Ex. 50% de réduction
   - **Montant fixe** : Ex. 5€ de réduction

   **Durée** :
   - **Once** : Une seule fois (première facturation)
   - **Forever** : Permanent (chaque facturation)
   - **Repeating** : Pendant X mois

   **Nom** : Donnez un nom descriptif (ex. "Promotion Lancement")

4. **Cliquez sur "Create coupon"**

### Étape 2 : Créer un Code Promo

1. Sur la page du coupon, cliquez sur **"Create promotion code"**
2. **Configurez le code** :

   **Code** : 
   - Laissez vide pour générer automatiquement
   - OU saisissez un code personnalisé (ex. `ATHLINK50`, `BIENVENUE`)

   **Utilisations** :
   - **Max redemptions** : Nombre max d'utilisations (optionnel)
   - **First time customers only** : Réserver aux nouveaux clients

   **Expiration** :
   - Optionnel : Date d'expiration du code

   **Montant minimum** :
   - Optionnel : Panier minimum requis

3. **Cliquez sur "Create promotion code"**

---

## 🎯 Exemples de codes promo à créer

### 🔥 Code "BIENVENUE" - 30% de réduction le 1er mois
```
Coupon:
  Type: Pourcentage (30%)
  Durée: Once (première facturation)
  Nom: Offre de bienvenue

Code promo:
  Code: BIENVENUE
  Max redemptions: Illimité
  First time only: Oui
```

### 💎 Code "VIP2025" - 50% permanent
```
Coupon:
  Type: Pourcentage (50%)
  Durée: Forever (permanent)
  Nom: VIP permanent

Code promo:
  Code: VIP2025
  Max redemptions: 100
  First time only: Non
```

### 🎁 Code "GRATUIT30" - 1 mois gratuit
```
Coupon:
  Type: Pourcentage (100%)
  Durée: Once (première facturation)
  Nom: 1 mois gratuit

Code promo:
  Code: GRATUIT30
  Max redemptions: 50
  First time only: Oui
```

### 🏃 Code "ATHLETE10" - 10€ de réduction
```
Coupon:
  Type: Montant fixe (10€)
  Durée: Once (première facturation)
  Nom: Réduction athlète

Code promo:
  Code: ATHLETE10
  Max redemptions: Illimité
  Montant minimum: 20€
```

---

## 🔍 Comment ça fonctionne dans votre SaaS

### 1. L'utilisateur saisit un code promo

Sur la page **`/dashboard/upgrade`**, l'utilisateur peut saisir un code dans le champ dédié.

### 2. Validation automatique via Stripe

Le code est envoyé à **`/api/promo-codes/validate`** qui :
- ✅ Recherche le code dans Stripe
- ✅ Vérifie qu'il est actif
- ✅ Vérifie la date d'expiration
- ✅ Vérifie les utilisations restantes
- ✅ Récupère les détails du coupon

### 3. Affichage de la réduction

Si le code est valide :
- ✅ Badge "Code promo appliqué" vert
- ✅ Ancien prix barré
- ✅ Nouveau prix avec réduction
- ✅ Description de l'offre

### 4. Application lors du paiement

Lors de l'upgrade, le code Stripe est appliqué automatiquement :
- ✅ Réduction calculée par Stripe
- ✅ Paiement avec prix réduit
- ✅ Code marqué comme utilisé dans Stripe

---

## 📊 Suivi des codes promo

### Dans Stripe Dashboard

1. **Allez sur** https://dashboard.stripe.com/coupons
2. **Cliquez sur un coupon** pour voir :
   - Nombre total d'utilisations
   - Montant total de réduction
   - Liste des transactions

3. **Allez sur un code promo** pour voir :
   - Nombre d'utilisations
   - Utilisations restantes
   - Date d'expiration
   - Statut actif/inactif

### Statistiques disponibles :
- 💰 **Revenu perdu** (réductions accordées)
- 📈 **Taux de conversion** avec codes promo
- 👥 **Nouveaux clients** via codes promo
- 📊 **Performance par code**

---

## 🛠️ Gestion des codes promo

### Désactiver un code

1. Allez sur le code promo dans Stripe Dashboard
2. Cliquez sur **"..."** (menu)
3. Sélectionnez **"Deactivate"**
4. Le code ne sera plus accepté immédiatement

### Modifier un code

❌ **On ne peut pas modifier un code existant**  
✅ **Solution** : Désactivez l'ancien et créez un nouveau code

### Supprimer un code

1. Désactivez d'abord le code
2. Il restera dans l'historique pour le suivi

---

## 💡 Bonnes pratiques

### Naming des codes :
- ✅ **COURT et MÉMORABLE** : `ATHLINK50`, `BIENVENUE`
- ✅ **DESCRIPTIF** : `NOEL2024`, `ETUDIANT20`
- ❌ Évitez les codes trop longs ou complexes

### Durée des codes :
- 🎯 **Promotions limitées** : Once (première fois)
- 💎 **Fidélisation** : Forever (permanent)
- 📆 **Campagnes** : Repeating (3-6 mois)

### Utilisations :
- 🔥 **Campagnes virales** : Illimité
- 🎁 **Codes exclusifs** : 50-100 utilisations
- 👑 **Codes VIP** : 10-20 utilisations

### Suivi :
- 📊 Vérifiez régulièrement les performances
- 🔄 Renouvelez les codes populaires
- 🗑️ Désactivez les codes non utilisés

---

## 🚀 Exemples de campagnes

### 🎉 Lancement d'une nouvelle fonctionnalité
```
Code: NEWFEATURE
Réduction: 40% pour 3 mois
Public: Tous les utilisateurs
Durée: 30 jours
```

### 🏃‍♂️ Partenariat avec un club sportif
```
Code: RUNNING CLUB
Réduction: 20% permanent
Public: Membres du club
Limite: 200 utilisations
```

### 🎓 Programme étudiant
```
Code: ETUDIANT50
Réduction: 50% pour 12 mois
Public: Étudiants
Montant min: Aucun
```

### 🎁 Période des fêtes
```
Code: NOEL2024
Réduction: 30% le 1er mois
Public: Nouveaux clients
Expiration: 31/12/2024
```

---

## ⚠️ Important

### Sécurité :
- ✅ Les codes sont vérifiés côté serveur (pas de fraude possible)
- ✅ Stripe gère toutes les validations
- ✅ Historique complet dans Stripe Dashboard

### Performance :
- ✅ Validation instantanée
- ✅ Pas de base de données locale à gérer
- ✅ Synchronisation automatique avec Stripe

### Compatibilité :
- ✅ Fonctionne avec tous les plans (Pro, Elite)
- ✅ Compatible avec les abonnements mensuels et annuels
- ✅ S'applique automatiquement lors du checkout Stripe

---

## 📞 Support

Si vous avez des questions sur les codes promo Stripe :
- 📚 **Documentation Stripe** : https://stripe.com/docs/billing/subscriptions/coupons
- 💬 **Support Stripe** : https://support.stripe.com
- 🎯 **Dashboard Stripe** : https://dashboard.stripe.com/coupons

---

**Votre système de codes promo est maintenant 100% géré par Stripe ! 🎉**

Plus simple, plus puissant, plus flexible !

