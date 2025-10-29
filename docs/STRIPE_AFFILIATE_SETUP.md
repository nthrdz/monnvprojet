# Configuration Stripe pour l'Affiliation

## 🚀 **Configuration Stripe Connect**

### **1. Créer un Compte Stripe**

1. Allez sur [stripe.com](https://stripe.com)
2. Créez un compte Stripe
3. Activez Stripe Connect dans votre dashboard

### **2. Variables d'Environnement**

Ajoutez ces variables à votre fichier `.env.local` :

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_..." # Clé secrète de votre compte principal
STRIPE_PUBLISHABLE_KEY="pk_test_..." # Clé publique
STRIPE_WEBHOOK_SECRET="whsec_..." # Secret du webhook
STRIPE_PLATFORM_ACCOUNT_ID="acct_..." # ID de votre compte principal
```

### **3. Configuration des Webhooks**

1. Allez dans votre dashboard Stripe
2. Allez dans "Developers" > "Webhooks"
3. Créez un nouveau webhook avec l'URL : `https://votre-domaine.com/api/stripe/webhooks`
4. Sélectionnez ces événements :
   - `account.updated`
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `transfer.created`

### **4. Configuration Stripe Connect**

1. Allez dans "Connect" > "Settings"
2. Activez "Express accounts"
3. Configurez les pays autorisés (ex: France)
4. Configurez les types de business autorisés

## 🎯 **Fonctionnalités Disponibles**

### **Pour les Ambassadeurs :**
- ✅ Création automatique de compte Stripe Connect
- ✅ Onboarding simplifié via Stripe
- ✅ Dashboard Stripe intégré
- ✅ Paiements automatiques des commissions
- ✅ Suivi des transferts en temps réel

### **Pour l'Administration :**
- ✅ Gestion des comptes d'affiliés
- ✅ Configuration des taux de commission
- ✅ Suivi des paiements
- ✅ Analytics détaillées

## 💰 **Système de Commissions**

### **Configuration par Défaut :**
- **Commission** : 5% sur chaque conversion
- **Paiement** : Hebdomadaire (vendredi)
- **Minimum** : 50€ avant versement
- **Devise** : EUR

### **Types de Conversions :**
- Inscription avec abonnement
- Upgrade de plan
- Renouvellement d'abonnement

## 🔧 **APIs Disponibles**

### **Endpoints Principaux :**
- `POST /api/stripe/connect/onboarding` - Créer un compte d'affilié
- `GET /api/stripe/connect/dashboard` - Dashboard de l'affilié
- `POST /api/stripe/webhooks` - Webhooks Stripe

### **Intégration Frontend :**
- Dashboard d'affiliation avec données Stripe
- Liens de parrainage personnalisés
- Suivi des commissions en temps réel

## 📊 **Avantages Stripe Connect**

### **Pour Vous :**
- ✅ Gestion automatique des paiements
- ✅ Conformité fiscale incluse
- ✅ Reporting détaillé
- ✅ Support client Stripe
- ✅ Sécurité bancaire

### **Pour vos Ambassadeurs :**
- ✅ Paiements automatiques
- ✅ Dashboard professionnel
- ✅ Support Stripe
- ✅ Transparence totale
- ✅ Paiements rapides

## 🚀 **Déploiement**

### **1. Migration de la Base de Données**
```bash
npx prisma db push
```

### **2. Configuration des Webhooks**
- Mettez à jour l'URL du webhook en production
- Testez les événements webhook

### **3. Test en Mode Test**
- Utilisez les clés de test Stripe
- Testez le flux complet d'affiliation

### **4. Passage en Production**
- Remplacez par les clés de production
- Configurez les webhooks de production
- Testez avec de vrais paiements

## 🔍 **Monitoring**

### **Métriques Importantes :**
- Nombre d'affiliés actifs
- Taux de conversion des parrainages
- Montant des commissions payées
- Performance des webhooks

### **Logs à Surveiller :**
- Erreurs de webhook
- Échecs de création de compte
- Problèmes de paiement
- Conversions non trackées

## 🆘 **Support**

### **Documentation Stripe :**
- [Stripe Connect](https://stripe.com/docs/connect)
- [Webhooks](https://stripe.com/docs/webhooks)
- [API Reference](https://stripe.com/docs/api)

### **Support Technique :**
- Dashboard Stripe > Support
- Documentation Stripe Connect
- Communauté Stripe

## 💡 **Conseils**

1. **Testez toujours en mode test** avant la production
2. **Configurez les webhooks** correctement
3. **Surveillez les logs** régulièrement
4. **Formez vos ambassadeurs** sur Stripe
5. **Documentez vos processus** d'affiliation



