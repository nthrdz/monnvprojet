# 🗄️ Configuration Supabase pour Athlink

## Étape 1 : Créer un projet Supabase

1. Va sur [supabase.com](https://supabase.com)
2. Clique sur **"Start your project"** ou **"New Project"**
3. Connecte-toi avec GitHub (ou crée un compte)
4. Crée une **Organization** si tu n'en as pas
5. Clique sur **"New Project"**

### Paramètres du projet :
- **Name** : `athlink` (ou ce que tu veux)
- **Database Password** : Génère un mot de passe fort (GARDE-LE !)
- **Region** : Choisis la région la plus proche de toi (ex: Europe (Frankfurt))
- **Plan** : Free (gratuit)

6. Clique sur **"Create new project"**
7. ⏳ Attends 2-3 minutes que le projet se crée

---

## Étape 2 : Récupérer la Connection String

Une fois le projet créé :

1. Va dans **Settings** (icône ⚙️ en bas à gauche)
2. Clique sur **Database** dans le menu
3. Scroll jusqu'à **"Connection string"**
4. Sélectionne l'onglet **"URI"** 
5. Copie la connection string qui ressemble à :

```
postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

⚠️ **IMPORTANT** : Remplace `[YOUR-PASSWORD]` par le mot de passe que tu as créé à l'étape 1 !

---

## Étape 3 : Configuration locale

### A. Créer le fichier .env.local

Dans le dossier `/Users/nathan/athlink`, crée un fichier `.env.local` :

```bash
# Copie ta connection string Supabase ici
DATABASE_URL="postgresql://postgres.xxxxxxxxxxxx:TON_MOT_DE_PASSE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# Génère un secret avec : openssl rand -base64 32
NEXTAUTH_SECRET="ton-secret-genere"

# Pour développement local
NEXTAUTH_URL="http://localhost:3000"
```

### B. Générer le secret NextAuth

Dans ton terminal :

```bash
openssl rand -base64 32
```

Copie le résultat dans `.env.local` comme valeur de `NEXTAUTH_SECRET`.

---

## Étape 4 : Créer les tables

Maintenant que la base de données est configurée, crée les tables :

```bash
# Générer le client Prisma
npx prisma generate

# Créer toutes les tables dans Supabase
npx prisma db push
```

Tu devrais voir :

```
✔ Generated Prisma Client
🚀  Your database is now in sync with your Prisma schema.
```

---

## Étape 5 : Vérifier la connexion

### Option 1 : Prisma Studio

Ouvre l'interface visuelle de ta base de données :

```bash
npx prisma studio
```

Va sur http://localhost:5555 - tu devrais voir toutes tes tables vides.

### Option 2 : Dashboard Supabase

1. Retourne sur supabase.com
2. Va dans **Table Editor** (icône 📊)
3. Tu devrais voir toutes tes tables créées :
   - User
   - Profile
   - Link
   - Race
   - Sponsor
   - Media
   - Analytics
   - Account
   - Session
   - VerificationToken

---

## Étape 6 : Lancer l'application

```bash
npm run dev
```

Ouvre http://localhost:3000 et teste :

1. ✅ Créer un compte via `/signup`
2. ✅ Te connecter via `/login`
3. ✅ Voir le dashboard
4. ✅ Ajouter des liens

---

## 🎉 C'est fait !

Ton application utilise maintenant Supabase !

### Avantages de Supabase :

✅ **Gratuit** jusqu'à 500 MB de données  
✅ **Hébergé** - pas besoin de gérer PostgreSQL localement  
✅ **Backups automatiques**  
✅ **Interface web** pour voir/modifier les données  
✅ **Prêt pour la production**  

---

## 🔍 Inspecter les données

### Avec Prisma Studio (recommandé pour dev)

```bash
npx prisma studio
```

### Avec Supabase Dashboard

1. Va sur supabase.com
2. Sélectionne ton projet
3. Clique sur **Table Editor**
4. Explore tes données visuellement

---

## 🚀 Déploiement sur Vercel

Quand tu seras prêt à déployer :

1. Push ton code sur GitHub
2. Va sur [vercel.com](https://vercel.com)
3. Importe ton repo
4. Configure les **Environment Variables** :
   - `DATABASE_URL` : Ta connection string Supabase
   - `NEXTAUTH_SECRET` : Ton secret
   - `NEXTAUTH_URL` : `https://ton-app.vercel.app`
5. Deploy !

⚠️ Vercel détectera automatiquement Next.js et configurera le build.

---

## 🐛 Problèmes courants

### "Can't reach database server"

- ✅ Vérifie que tu as bien remplacé `[YOUR-PASSWORD]`
- ✅ Vérifie que le projet Supabase est bien actif (pas en pause)
- ✅ Vérifie qu'il n'y a pas d'espaces dans la connection string

### "SSL connection error"

Ajoute `?pgbouncer=true&connection_limit=1` à la fin de ta DATABASE_URL :

```
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

### "Prepared statement already exists"

Utilise le mode Transaction Pooler :

1. Dans Supabase, va dans Settings → Database
2. Change de **Session** à **Transaction** mode
3. Copie la nouvelle connection string

---

## 📞 Besoin d'aide ?

- 📖 [Documentation Supabase](https://supabase.com/docs)
- 🔍 [Prisma + Supabase Guide](https://supabase.com/docs/guides/integrations/prisma)

---

Créé avec ❤️ pour Athlink 🏃‍♂️
