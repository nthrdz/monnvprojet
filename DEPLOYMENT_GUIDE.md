# 🚀 Guide de Déploiement AthLink SaaS

## 📋 **Prérequis**

- ✅ Compte Vercel
- ✅ Compte Supabase
- ✅ Compte Stripe
- ✅ Clés Stripe de production

## 🚀 **Étapes de Déploiement**

### **1. Connexion à Vercel**
```bash
npx vercel login
```

### **2. Déploiement**
```bash
npx vercel --prod
```

### **3. Variables d'Environnement Vercel**

Dans **Vercel Dashboard > Settings > Environment Variables**, ajoutez :

```env
# Base de données Supabase
DATABASE_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://votre-domaine.vercel.app
NEXTAUTH_SECRET=votre-clé-secrète-nextauth

# Stripe (remplacez par vos vraies clés)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PLATFORM_ACCOUNT_ID=acct_platform_placeholder

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **4. Configuration Supabase**

1. **Créez un projet** : [supabase.com](https://supabase.com)
2. **Exécutez la migration** : Copiez le contenu de `deployment/database/affiliate-migration.sql`
3. **Copiez l'URL de connexion** et ajoutez-la à Vercel

### **5. Configuration Stripe Webhooks**

Dans **Stripe Dashboard > Webhooks**, ajoutez :
- **URL** : `https://votre-domaine.vercel.app/api/stripe/webhooks`
- **Événements** : `account.updated`, `payment_intent.succeeded`, `transfer.created`

## 🎯 **Test Final**

Une fois déployé, testez :
- ✅ Page d'accueil
- ✅ Inscription/Connexion  
- ✅ Dashboard
- ✅ Système d'affiliation Stripe

## 🎉 **Votre SaaS sera en ligne !**

**Prochaines étapes :**
1. Exécutez `npx vercel login`
2. Exécutez `npx vercel --prod`
3. Configurez les variables d'environnement
4. Votre SaaS sera live ! 🚀
