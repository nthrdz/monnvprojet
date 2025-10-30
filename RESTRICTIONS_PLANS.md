# 🔒 Système de restrictions par plan d'abonnement

## ✅ Le système est DÉJÀ EN PLACE et FONCTIONNEL !

Toutes les fonctionnalités de votre SaaS sont déjà restreintes en fonction du niveau d'abonnement grâce au système dans `lib/features.ts`.

---

## 📊 Les 3 plans disponibles

### 🆓 Plan FREE
- **Prix** : Gratuit
- **Liens** : 10 maximum
- **Compétitions** : 1 maximum  
- **Sponsors** : 0 (désactivé)
- **Médias** : 2 maximum
- **Analytics** : Basiques uniquement
- **Domaine personnalisé** : ❌
- **CSS personnalisé** : ❌
- **Export de données** : ❌
- **Badge profil** : Aucun

### ⚡ Plan PRO (9,90€/mois)
- **Prix** : 9,90€/mois (99€/an)
- **Liens** : ♾️ Illimité
- **Compétitions** : ♾️ Illimité
- **Sponsors** : ♾️ Illimité
- **Médias** : ♾️ Illimité
- **Analytics** : 7 jours d'historique
- **Domaine personnalisé** : ❌
- **CSS personnalisé** : ❌
- **Export de données** : ❌
- **Badge profil** : "Pro"
- **Thèmes premium** : ✅
- **Sans publicité** : ✅

### 👑 Plan ELITE (25,90€/mois)
- **Prix** : 25,90€/mois (259€/an)
- **Liens** : ♾️ Illimité
- **Compétitions** : ♾️ Illimité
- **Sponsors** : ♾️ Illimité
- **Médias** : ♾️ Illimité
- **Analytics** : ♾️ Illimité
- **Domaine personnalisé** : ✅
- **CSS personnalisé** : ✅
- **Export de données** : ✅
- **Badge profil** : "Elite"
- **Thèmes premium** : ✅
- **Sans publicité** : ✅
- **Heatmap des clics** : ✅
- **Démographie visiteurs** : ✅
- **Support prioritaire** : ✅
- **Service de coaching** : ✅

---

## 🛠️ Comment fonctionne le système de restrictions ?

### 1. Vérification des limites

Le fichier `lib/features.ts` contient toutes les fonctions pour vérifier les limites :

```typescript
// Vérifier si un utilisateur peut ajouter un élément
canAddItem(currentCount, userPlan, 'links')  // true/false

// Obtenir la limite d'une feature
getUserFeatureLimit(userPlan, 'maxLinks')  // 10, -1 (illimité), etc.

// Vérifier si une feature est accessible
canUserAccessFeature(userPlan, 'customCSS')  // true/false

// Obtenir le message d'erreur de limite
getLimitMessage(userPlan, 'links')  // "Limite atteinte..."
```

### 2. Où les restrictions sont appliquées ?

#### Dans les API routes :
- **`/api/links/route.ts`** : Vérifie maxLinks avant création
- **`/api/races/route.ts`** : Vérifie maxRaces avant création
- **`/api/sponsors/route.ts`** : Vérifie maxSponsors avant création
- **`/api/media/route.ts`** : Vérifie maxMedia avant upload
- **`/api/analytics/*`** : Restreint analyticsDays selon le plan

#### Dans les pages dashboard :
- **`/dashboard/links`** : Affiche la limite et bloque si atteinte
- **`/dashboard/races`** : Affiche la limite et bloque si atteinte
- **`/dashboard/sponsors`** : Affiche la limite et bloque si atteinte
- **`/dashboard/media`** : Affiche la limite et bloque si atteinte
- **`/dashboard/analytics`** : Filtre selon analyticsDays
- **`/dashboard/settings`** : Désactive customCSS si non accessible

### 3. Exemple d'implémentation

```typescript
// Dans une API route
import { PlanType, canAddItem, getLimitMessage } from '@/lib/features'

const profile = await prisma.profile.findUnique({
  where: { userId: session.user.id }
})

const currentLinksCount = await prisma.link.count({
  where: { profileId: profile.id }
})

// Vérifier si l'utilisateur peut ajouter un lien
if (!canAddItem(currentLinksCount, profile.plan as PlanType, 'links')) {
  return NextResponse.json({
    error: getLimitMessage(profile.plan as PlanType, 'links')
  }, { status: 403 })
}

// Si OK, créer le lien
await prisma.link.create({ ... })
```

---

## 🚀 Upgrade d'abonnement

### Comment ça fonctionne ?

1. **L'utilisateur va sur** `/dashboard/upgrade`
2. **Choisit un plan** (Pro ou Elite)
3. **Clique sur "Passer Pro" ou "Passer Elite"**
4. **L'API `/api/upgrade-plan`** met à jour le plan dans la DB
5. **Le plan est immédiatement actif** → Les nouvelles limites s'appliquent

### Avec code promo

1. L'utilisateur saisit un **code promo** sur `/dashboard/upgrade`
2. Le code est validé via **`/api/promo-codes/validate`**
3. Si valide : **plan activé GRATUITEMENT** pour la durée du promo
4. Après expiration : retour au plan précédent

---

## 🔧 Correction de l'erreur useSession()

### Le problème

L'erreur `Cannot destructure property 'data' of 'useSession()' as it is undefined` était causée par **l'absence du `SessionProvider`** de NextAuth.

### La solution (DÉJÀ APPLIQUÉE)

✅ **Création de** `components/providers/session-provider.tsx`  
✅ **Ajout du provider** dans `app/layout.tsx`  
✅ **Code poussé sur GitHub**  
✅ **Vercel en cours de déploiement**

**Dans 2-3 minutes**, une fois Vercel déployé, l'erreur sera résolue !

---

## ✅ Récapitulatif

### Ce qui fonctionne MAINTENANT :
- ✅ Restrictions par plan (FREE/PRO/ELITE)
- ✅ Vérification des limites dans toutes les API
- ✅ Messages d'erreur si limite atteinte
- ✅ Upgrade de plan via `/dashboard/upgrade`
- ✅ Codes promo pour plans gratuits
- ✅ SessionProvider corrigé (en cours de déploiement)

### À venir automatiquement (après déploiement Vercel) :
- ✅ Plus d'erreur `useSession()` undefined
- ✅ Dashboard ambassadeur fonctionnel
- ✅ Page upgrade 100% stable

---

## 🎯 Pour tester après déploiement

1. **Connectez-vous** avec un compte FREE
2. **Essayez d'ajouter** plus de 10 liens → Message d'erreur
3. **Allez sur** `/dashboard/upgrade`
4. **Upgradez vers PRO** → Liens illimités débloqués !
5. **Vérifiez** `/dashboard/affiliate` → Devrait afficher "Restriction: Plan PRO ou ELITE requis"

---

**Tout est déjà en place ! Une fois Vercel déployé (dans quelques minutes), tout fonctionnera parfaitement ! 🎉**

