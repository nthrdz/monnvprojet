# 🚀 AthLink - Déploiement Vercel

## ⚡ **Déploiement Rapide**

### **1. Prérequis**
- ✅ Compte Vercel
- ✅ Compte Supabase  
- ✅ Compte Stripe
- ✅ Repository GitHub

### **2. Variables d'Environnement Vercel**

Copiez ces variables dans **Vercel > Settings > Environment Variables** :

```env
# Base de données
DATABASE_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=PIy5H0efKgCRWE6gAFhrVNG0FHvFApde2NpH3unqBoU=

# Stripe (remplacez par vos clés de production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_ACCOUNT_ID=acct_...

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **3. Configuration Supabase**

1. **Migration de la base de données** :
   - Allez dans Supabase > SQL Editor
   - Exécutez le contenu de `deployment/database/affiliate-migration.sql`

2. **Configuration RLS** :
   - Vérifiez que les politiques RLS sont activées
   - Testez la connexion

### **4. Configuration Stripe**

1. **Webhooks de production** :
   - URL : `https://votre-domaine.vercel.app/api/stripe/webhooks`
   - Événements : `account.updated`, `payment_intent.succeeded`, `invoice.payment_succeeded`, `customer.subscription.created`, `transfer.created`

2. **Stripe Connect** :
   - Activez Stripe Connect
   - Configurez les pays autorisés

### **5. Déploiement**

1. **Connectez Vercel à GitHub**
2. **Sélectionnez votre repository**
3. **Configurez les variables d'environnement**
4. **Déployez !**

## 🎯 **Fonctionnalités Incluses**

- ✅ **Système d'affiliation Stripe Connect**
- ✅ **Paiements automatiques des commissions**
- ✅ **Dashboard d'affiliation professionnel**
- ✅ **Webhooks Stripe intégrés**
- ✅ **Base de données Supabase**
- ✅ **Authentification NextAuth**
- ✅ **Interface responsive**

## 🔧 **Commandes Utiles**

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Migration de base de données
npx prisma db push

# Générer les clés secrètes
node scripts/generate-secrets.js
```

## 📊 **Monitoring**

- **Vercel Analytics** : Performance et erreurs
- **Stripe Dashboard** : Paiements et affiliés
- **Supabase Dashboard** : Base de données

## 🆘 **Support**

- **Documentation complète** : `docs/VERCEL_DEPLOYMENT.md`
- **Configuration Stripe** : `docs/STRIPE_AFFILIATE_SETUP.md`
- **Système d'affiliation** : `docs/AFFILIATE_SYSTEM.md`

---

**🎉 Votre SaaS AthLink est prêt pour le déploiement !**



