# 🔄 Migration de la base de données pour activer toutes les fonctionnalités

## Pourquoi cette migration ?

Certains champs du schéma Prisma existent dans le code mais pas encore dans la base de données de production sur Vercel :
- `totalClicks` dans le modèle `Affiliate`
- `applicationEmail` dans le modèle `Affiliate`
- Table `AffiliateClick` complète

## ✅ Fonctionnalités actuellement actives (sans migration)

- ✅ Système d'ambassadeur de base
- ✅ Codes de parrainage
- ✅ Conversions
- ✅ Calcul des commissions
- ✅ Dashboard ambassadeur
- ✅ Notifications email

## 🚀 Fonctionnalités qui seront activées après migration

- 🔥 Tracking détaillé des clics (IP, User-Agent, UTM, etc.)
- 🔥 Compteur automatique de clics (`totalClicks`)
- 🔥 Statistiques avancées par jour
- 🔥 Email de contact pour chaque ambassadeur
- 🔥 Taux de conversion précis

## 📋 Comment migrer la base de données Vercel

### Option 1 : Via Supabase Dashboard (RECOMMANDÉ)

1. **Allez sur Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre projet** Athlink
3. **Cliquez sur "SQL Editor"** dans le menu de gauche
4. **Créez une nouvelle query**
5. **Copiez-collez le contenu** du fichier `prisma/migrations/add_affiliate_fields.sql`
6. **Exécutez la query** (bouton "Run")
7. **Vérifiez le succès** : vous devriez voir "Migration terminée avec succès !"

### Option 2 : Via psql (ligne de commande)

```bash
# Récupérez votre DATABASE_URL depuis Vercel
# Puis exécutez :
psql $DATABASE_URL -f prisma/migrations/add_affiliate_fields.sql
```

### Option 3 : Via Prisma Migrate (si vous avez accès local)

```bash
# 1. Configurez DATABASE_URL dans .env.local avec votre URL Vercel
# 2. Exécutez :
npx prisma db push
```

## 🔓 Après la migration

Une fois la migration effectuée, vous devrez **réactiver le code commenté** :

### Fichiers à modifier :

1. **`app/api/affiliate/apply/route.ts`** (ligne ~65)
   - Décommenter : `applicationEmail: session.user.email`

2. **`app/api/affiliate/track-click/route.ts`** (lignes ~41-55 et ~60-68)
   - Décommenter : création de `AffiliateClick`
   - Décommenter : incrémentation de `totalClicks`

3. **`app/api/affiliate/convert/route.ts`** (lignes ~107-129)
   - Décommenter : mise à jour de `AffiliateClick` lors de conversion

4. **`app/api/affiliate/dashboard/route.ts`** (ligne ~34-38)
   - Décommenter : `clicks: { orderBy: { createdAt: 'desc' }, take: 100 }`
   - Ligne ~73 : Remplacer `const clicksByDay = {} as Record<string, number>` par le code original

Puis :
```bash
git add -A
git commit -m "✨ Réactivation des fonctionnalités après migration DB"
git push origin clean-main
```

## ⚠️ Important

- **Ne migrez PAS en local** si vous n'avez pas configuré de base de données locale
- **Testez d'abord sur un environnement de staging** si possible
- **Faites un backup de votre base de données** avant de migrer (Supabase le fait automatiquement)

## 🆘 En cas de problème

Si quelque chose ne va pas après la migration :
1. Vérifiez les logs Vercel
2. Vérifiez que tous les champs ont été créés dans Supabase
3. Regénérez le client Prisma : `npx prisma generate`
4. Redéployez sur Vercel

## ✅ Comment vérifier que la migration a fonctionné

Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier les colonnes de Affiliate
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Affiliate';

-- Vérifier que AffiliateClick existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'AffiliateClick';
```

Vous devriez voir `totalClicks`, `applicationEmail` dans Affiliate et la table `AffiliateClick` devrait exister.

---

**Une fois la migration effectuée, votre système d'ambassadeur sera 100% complet ! 🎉**

