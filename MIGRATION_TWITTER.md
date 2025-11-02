# Migration : Ajout du champ Twitter

## 🎯 Objectif
Ajouter le champ `twitter` à la table `Profile` pour permettre aux utilisateurs d'afficher leur profil Twitter/X sur leur page publique.

## 📋 Étapes d'application

### 1. Accéder à Supabase SQL Editor
1. Connecte-toi à [https://supabase.com](https://supabase.com)
2. Sélectionne ton projet
3. Va dans **SQL Editor** (menu de gauche)

### 2. Exécuter la migration
Copie et colle ce SQL dans l'éditeur :

```sql
-- Migration: Add twitter field to Profile table

-- Add twitter column
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "twitter" TEXT;

-- Add index for better performance (optionnel mais recommandé)
CREATE INDEX IF NOT EXISTS "Profile_twitter_idx" ON "Profile"("twitter");
```

### 3. Exécuter
Clique sur **Run** ou appuie sur `Ctrl/Cmd + Enter`

### 4. Vérifier
Tu devrais voir un message de succès ✅

## ✨ Résultat
Une fois la migration appliquée :
- Les utilisateurs pourront renseigner leur Twitter dans **Dashboard > Profil > Réseaux Sociaux**
- Le lien Twitter s'affichera automatiquement sur leur page publique (si renseigné)
- Format attendu : `@username` ou `username` (sans le @)

## 🔄 Alternative : Reset complet (⚠️ PERD LES DONNÉES)
Si tu préfères recréer toute la base depuis zéro :
```bash
npx prisma migrate reset
npx prisma db push
```
⚠️ **ATTENTION** : Cette commande supprime TOUTES les données !

## 📝 Notes
- Le champ est **optionnel** (NULL autorisé)
- L'URL générée sera : `https://twitter.com/{username}`
- Compatible avec X (nouveau nom de Twitter)

