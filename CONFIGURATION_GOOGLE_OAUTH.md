# 🔐 Configuration Google OAuth pour Athlink

Ce guide explique comment configurer l'authentification Google pour ton application Athlink.

## 📋 Étapes de configuration

### 1️⃣ Créer un projet Google Cloud

1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Clique sur **"Select a project"** en haut
3. Clique sur **"New Project"**
4. Nomme ton projet : `Athlink`
5. Clique sur **"Create"**

### 2️⃣ Activer l'API Google+

1. Dans le menu de gauche, va dans **"APIs & Services" > "Library"**
2. Cherche **"Google+ API"**
3. Clique dessus et clique sur **"Enable"**

### 3️⃣ Configurer l'écran de consentement OAuth

1. Va dans **"APIs & Services" > "OAuth consent screen"**
2. Choisis **"External"**
3. Clique sur **"Create"**

**Remplis les informations :**
- **App name**: `Athlink`
- **User support email**: ton email
- **App logo**: (optionnel)
- **App domain**: 
  - Application home page: `https://athlink.app`
  - Privacy policy: `https://athlink.app/privacy`
  - Terms of service: `https://athlink.app/terms`
- **Authorized domains**: `athlink.app`
- **Developer contact information**: ton email

4. Clique sur **"Save and Continue"**
5. Sur l'écran "Scopes", clique sur **"Add or Remove Scopes"**
6. Sélectionne :
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
7. Clique sur **"Update"** puis **"Save and Continue"**
8. Clique sur **"Back to Dashboard"**

### 4️⃣ Créer les identifiants OAuth

1. Va dans **"APIs & Services" > "Credentials"**
2. Clique sur **"Create Credentials" > "OAuth client ID"**
3. Choisis **"Web application"**
4. Nomme-le : `Athlink Web Client`

**Configure les URIs :**

**Authorized JavaScript origins :**
```
http://localhost:3000
https://athlink.app
https://www.athlink.app
https://ton-projet.vercel.app
```

**Authorized redirect URIs :**
```
http://localhost:3000/api/auth/callback/google
https://athlink.app/api/auth/callback/google
https://www.athlink.app/api/auth/callback/google
https://ton-projet.vercel.app/api/auth/callback/google
```

5. Clique sur **"Create"**

### 5️⃣ Copier les identifiants

Une popup apparaît avec :
- **Client ID** (ressemble à : `123456789-abc...xyz.apps.googleusercontent.com`)
- **Client secret** (ressemble à : `GOCSPX-abc123...xyz`)

**Copie ces deux valeurs** ⚠️

---

## 🔧 Configuration dans ton projet

### En local (`.env.local`)

Ajoute ces lignes dans ton fichier `.env.local` :

```bash
# Google OAuth
GOOGLE_CLIENT_ID=ton_client_id_ici
GOOGLE_CLIENT_SECRET=ton_client_secret_ici

# Auth URL (important pour les callbacks)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ton_secret_aleatoire_ici_minimum_32_caracteres
```

**Pour générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### Sur Vercel (Production)

1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionne ton projet Athlink
3. Va dans **Settings > Environment Variables**
4. Ajoute ces 3 variables :

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | `ton_client_id_ici` |
| `GOOGLE_CLIENT_SECRET` | `ton_client_secret_ici` |
| `NEXTAUTH_SECRET` | `ton_secret_aleatoire_ici` |

5. Clique sur **"Save"**
6. **Redéploie** ton application

---

## ✅ Tester l'authentification Google

### En local
1. Lance ton serveur : `npm run dev`
2. Va sur `http://localhost:3000/login`
3. Clique sur **"Continuer avec Google"**
4. Connecte-toi avec ton compte Google
5. Tu devrais être redirigé vers `/dashboard`

### En production
1. Va sur `https://athlink.app/login`
2. Clique sur **"Continuer avec Google"**
3. Connecte-toi avec ton compte Google
4. Tu devrais être redirigé vers le dashboard

---

## 🔒 Sécurité

### ⚠️ Ne jamais commit les secrets

Assure-toi que `.env.local` est dans `.gitignore` :

```bash
# .gitignore
.env.local
.env*.local
```

### 🔄 Rotation des secrets

Si tu penses que tes secrets ont été compromis :

1. Va dans [Google Cloud Console](https://console.cloud.google.com/)
2. **"APIs & Services" > "Credentials"**
3. Clique sur ton OAuth Client ID
4. Clique sur **"Reset secret"**
5. Mets à jour les variables d'environnement (local + Vercel)

---

## 🐛 Dépannage

### Erreur : "Redirect URI mismatch"

**Solution** : Vérifie que l'URL de redirection est exactement la même dans :
- Google Cloud Console
- Ton URL actuelle

### Erreur : "Access blocked: This app's request is invalid"

**Solution** : 
1. Retourne sur Google Cloud Console
2. Configure l'**écran de consentement OAuth**
3. Ajoute ton email dans les **"Test users"** si ton app est en mode "Testing"

### L'utilisateur n'a pas de profil après connexion Google

**Solution** : C'est normal ! La fonction `signIn` callback dans `lib/auth.ts` crée automatiquement un profil avec :
- Username généré depuis l'email
- Sport par défaut : RUNNING
- Plan : FREE

---

## 📊 Monitoring

Tu peux voir les connexions Google dans :
- [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
- Clique sur ton OAuth Client ID pour voir les statistiques

---

## 🎉 C'est fait !

Une fois configuré, tes utilisateurs pourront :
- ✅ S'inscrire avec Google en un clic
- ✅ Se connecter avec Google
- ✅ Avoir un profil automatiquement créé

**Les boutons "Continuer avec Google" sont maintenant visibles sur :**
- `/login` - Page de connexion
- `/signup` - Page d'inscription

