# 🚀 Déploiement AthLink sur Vercel

## 📋 **Prérequis**

- ✅ Compte Vercel
- ✅ Compte Supabase
- ✅ Compte Stripe (pour l'affiliation)
- ✅ Projet GitHub

## 🔧 **Étapes de Déploiement**

### **1. Préparation du Projet**

#### **A. Vérifier la Configuration**
```bash
# Générer le client Prisma
npx prisma generate

# Tester le build local
npm run build
```

#### **B. Pousser sur GitHub**
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit with Stripe affiliate system"

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/athlink.git
git push -u origin main
```

### **2. Configuration Vercel**

#### **A. Connexion à Vercel**
1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" ou "Log In"
3. Connectez votre compte GitHub
4. Cliquez sur "New Project"
5. Sélectionnez votre repository `athlink`

#### **B. Configuration du Projet**
- **Framework Preset** : Next.js
- **Root Directory** : `./` (racine)
- **Build Command** : `npm run vercel-build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### **3. Variables d'Environnement**

Dans Vercel, allez dans **Settings > Environment Variables** et ajoutez :

#### **Base de Données**
```
DATABASE_URL = postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres
```

#### **NextAuth**
```
NEXTAUTH_URL = https://votre-domaine.vercel.app
NEXTAUTH_SECRET = votre-clé-secrète-générée
```

#### **Google OAuth (optionnel)**
```
GOOGLE_CLIENT_ID = votre-google-client-id
GOOGLE_CLIENT_SECRET = votre-google-client-secret
```

#### **Stripe (Affiliation)**
```
STRIPE_SECRET_KEY = sk_live_... (production)
STRIPE_PUBLISHABLE_KEY = pk_live_... (production)
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_PLATFORM_ACCOUNT_ID = acct_...
```

### **4. Configuration Supabase**

#### **A. Migration de la Base de Données**
1. Allez dans votre dashboard Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script de migration :
   ```sql
   -- Copier le contenu de deployment/database/affiliate-migration.sql
   ```

#### **B. Configuration RLS**
Vérifiez que les politiques RLS sont activées :
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### **5. Configuration Stripe**

#### **A. Webhooks de Production**
1. Allez dans votre dashboard Stripe
2. Allez dans **Developers > Webhooks**
3. Créez un nouveau webhook :
   - **URL** : `https://votre-domaine.vercel.app/api/stripe/webhooks`
   - **Événements** :
     - `account.updated`
     - `payment_intent.succeeded`
     - `invoice.payment_succeeded`
     - `customer.subscription.created`
     - `transfer.created`

#### **B. Compte Stripe Connect**
1. Activez Stripe Connect dans votre dashboard
2. Configurez les pays autorisés
3. Configurez les types de business

### **6. Déploiement**

#### **A. Premier Déploiement**
1. Dans Vercel, cliquez sur **Deploy**
2. Attendez la fin du build
3. Vérifiez que l'application fonctionne

#### **B. Configuration du Domaine**
1. Allez dans **Settings > Domains**
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS

### **7. Tests Post-Déploiement**

#### **A. Tests Fonctionnels**
- [ ] Page d'accueil charge
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard accessible
- [ ] Système d'affiliation fonctionne

#### **B. Tests Stripe**
- [ ] Création de compte d'affilié
- [ ] Onboarding Stripe Connect
- [ ] Liens de parrainage
- [ ] Webhooks fonctionnent

### **8. Monitoring**

#### **A. Vercel Analytics**
- Activez Vercel Analytics
- Surveillez les performances
- Surveillez les erreurs

#### **B. Stripe Dashboard**
- Surveillez les paiements
- Surveillez les webhooks
- Surveillez les comptes d'affiliés

## 🔧 **Commandes Utiles**

### **Développement Local**
```bash
npm run dev
```

### **Build de Production**
```bash
npm run build
npm run start
```

### **Migration de Base de Données**
```bash
npx prisma db push
npx prisma generate
```

### **Tests**
```bash
node scripts/test-affiliate-system.js
```

## 🚨 **Dépannage**

### **Erreurs Courantes**

#### **1. Erreur de Base de Données**
```
Can't reach database server
```
**Solution** : Vérifiez la variable `DATABASE_URL`

#### **2. Erreur Stripe**
```
Invalid API key
```
**Solution** : Vérifiez les clés Stripe (test vs production)

#### **3. Erreur NextAuth**
```
NEXTAUTH_SECRET is not set
```
**Solution** : Ajoutez la variable `NEXTAUTH_SECRET`

#### **4. Erreur Webhook**
```
Webhook signature verification failed
```
**Solution** : Vérifiez le secret du webhook

### **Logs de Débogage**

#### **Vercel Logs**
```bash
vercel logs
```

#### **Stripe Logs**
- Dashboard Stripe > Developers > Logs

#### **Supabase Logs**
- Dashboard Supabase > Logs

## 📊 **Métriques de Succès**

### **Performance**
- Temps de chargement < 3s
- Core Web Vitals optimisés
- 99.9% uptime

### **Fonctionnalités**
- Système d'affiliation opérationnel
- Paiements Stripe fonctionnels
- Webhooks fiables

### **Sécurité**
- HTTPS activé
- Variables d'environnement sécurisées
- RLS activé sur Supabase

## 🎯 **Prochaines Étapes**

1. **Monitoring** : Configurez des alertes
2. **Analytics** : Ajoutez Google Analytics
3. **SEO** : Optimisez le référencement
4. **Performance** : Optimisez les images
5. **Sécurité** : Ajoutez des headers de sécurité

## 🆘 **Support**

- **Vercel** : [vercel.com/support](https://vercel.com/support)
- **Supabase** : [supabase.com/support](https://supabase.com/support)
- **Stripe** : [stripe.com/support](https://stripe.com/support)

---

**🎉 Félicitations ! Votre SaaS AthLink avec système d'affiliation Stripe est maintenant déployé sur Vercel !**



