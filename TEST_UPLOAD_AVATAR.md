# 🖼️ TEST UPLOAD AVATAR - GUIDE

## ❌ PROBLÈME PRÉCÉDENT
`Failed to load resource: the server responded with a status of 405 ()`

**Erreur 405** = Method Not Allowed → La route n'accepte pas la méthode HTTP (POST)

## ✅ SOLUTION APPLIQUÉE

Le fix a été **forcé avec un nouveau commit** pour s'assurer que Vercel redéploie avec la bonne configuration.

### Ce qui est dans `/app/api/upload/route.ts` :
```typescript
export const runtime = 'nodejs'  // Force runtime Node.js (pas Edge)
export const maxDuration = 60     // Timeout de 60 secondes pour upload

export async function POST(req: NextRequest) {
  // ... code d'upload
}
```

---

## 🧪 COMMENT TESTER

### Étape 1 : Attendre le déploiement Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur ton projet
3. Attends que le statut soit **"Ready"** (pas "Building")
4. **⏱️ Temps estimé : 2-3 minutes**

### Étape 2 : Tester l'upload d'avatar
1. Va sur `https://athlink.fr/dashboard/profile`
2. Clique sur **"Uploader l'avatar"** (ou la zone en pointillés)
3. Sélectionne une image :
   - **Format** : JPG, PNG, WEBP, GIF
   - **Taille max** : 30 MB
   - **Recommandé** : Image carrée (ex: 500x500px)
4. Clique sur **"Ouvrir"**
5. L'image devrait :
   - ✅ S'uploader (barre de progression)
   - ✅ S'afficher dans l'aperçu
   - ✅ Être enregistrée dans la base de données

### Étape 3 : Vérifier que ça a marché
1. Rafraîchis la page (`F5`)
2. L'avatar devrait toujours être affiché
3. Va sur ton profil public : `https://athlink.fr/[ton-username]`
4. L'avatar devrait être affiché là aussi

---

## 🐛 SI ÇA NE MARCHE TOUJOURS PAS

### Erreur 405 (Method Not Allowed)
**Cause** : Vercel n'a pas encore redéployé avec la nouvelle config

**Solution** :
1. Attends encore 2-3 minutes
2. Vide le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
3. Réessaye

### Erreur 413 (Payload Too Large)
**Cause** : L'image est trop lourde (> 30 MB)

**Solution** :
1. Compresse ton image avec [tinypng.com](https://tinypng.com)
2. Ou choisis une image plus petite

### Erreur 401 (Unauthorized)
**Cause** : Tu n'es pas connecté

**Solution** :
1. Déconnecte-toi et reconnecte-toi
2. Vérifie que tu es bien sur `https://athlink.fr/dashboard/profile`

### Erreur 500 (Internal Server Error)
**Cause** : Problème avec Supabase Storage ou la base de données

**Solution** :
1. Vérifie dans Vercel → Logs
2. Cherche `/api/upload`
3. Regarde l'erreur exacte
4. Envoie-moi les logs

---

## 📊 VÉRIFIER DANS SUPABASE

Si l'upload semble fonctionner mais l'image ne s'affiche pas :

1. Va sur [supabase.com](https://supabase.com)
2. Sélectionne ton projet
3. Va dans **Storage** (menu de gauche)
4. Tu devrais voir un bucket **"avatars"** ou **"uploads"**
5. Vérifie que ton image est bien là

---

## 🎯 CE QUI DEVRAIT FONCTIONNER APRÈS LE DÉPLOIEMENT

✅ **Upload d'avatar** (200x200 à 1000x1000 px recommandé)  
✅ **Upload de cover** (1920x400 px recommandé)  
✅ **Upload de média** (galerie)  
✅ **Upload de logo sponsor**  
✅ **Optimisation automatique** avec sharp (conversion PNG haute qualité)  
✅ **Stockage dans Supabase Storage**  
✅ **URL enregistrée dans la base de données**  

---

## 🔧 CONFIGURATION TECHNIQUE

### Variables Vercel requises :
```bash
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Route API :
- **URL** : `/api/upload`
- **Méthode** : `POST`
- **Body** : `FormData` avec `file` et `type`
- **Types acceptés** : `avatar`, `cover`, `media`, `sponsor`

### Limites :
- **Taille max** : 30 MB
- **Timeout** : 60 secondes
- **Formats** : JPG, PNG, WEBP, GIF (images) / MP4, MOV (vidéos pour media)

---

## ✅ CHECKLIST FINALE

Avant de tester, vérifie que :

✅ **Vercel a fini le déploiement** (status "Ready")  
✅ **Tu es connecté** sur le dashboard  
✅ **Tu es sur** `/dashboard/profile`  
✅ **L'image fait moins de 30 MB**  
✅ **Le format est supporté** (JPG, PNG, WEBP, GIF)  

---

## 🚀 RÉSULTAT ATTENDU

Après le déploiement Vercel (dans ~2-3 minutes) :

1. Tu vas sur `/dashboard/profile`
2. Tu cliques sur "Uploader l'avatar"
3. Tu sélectionnes une image
4. **✅ L'upload fonctionne sans erreur 405 !**
5. L'image s'affiche immédiatement
6. Elle reste affichée après rafraîchissement

**Le fix a été poussé, il faut juste attendre le redéploiement Vercel !** ⏱️

