# 🚀 Déploiement Rapide sur Vercel

## ⚡ **Étapes Rapides**

### **1. Pousser sur GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### **2. Déployer sur Vercel**
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez GitHub
3. Importez votre repository
4. Configurez les variables d'environnement

### **3. Variables d'Environnement Vercel**

Ajoutez ces variables dans **Vercel > Settings > Environment Variables** :

```env
# Base de données Supabase
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

### **4. Configuration Supabase**
1. Créez un projet Supabase
2. Exécutez la migration : `deployment/database/affiliate-migration.sql`
3. Copiez l'URL de connexion

### **5. Configuration Stripe**
1. Créez un compte Stripe
2. Activez Stripe Connect
3. Configurez les webhooks : `https://votre-domaine.vercel.app/api/stripe/webhooks`

## 🎯 **C'est tout !**

Votre SaaS sera déployé en quelques minutes ! 🚀
