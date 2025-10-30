# 🔴 VÉRIFICATION AUTOMATIQUE DES CLÉS STRIPE

## ✅ PROTECTION INTÉGRÉE

Votre SaaS est maintenant **protégé contre l'utilisation de clés TEST en production** !

---

## 🛡️ CE QUI A ÉTÉ AJOUTÉ

### 1. Validation automatique au démarrage (`lib/stripe.ts`)

```typescript
// ⚠️ FORCER L'UTILISATION DES CLÉS LIVE UNIQUEMENT
if (process.env.NODE_ENV === 'production') {
  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    throw new Error('❌ ERREUR : Vous devez utiliser une clé STRIPE LIVE (sk_live_...) en production !')
  }
  
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
    throw new Error('❌ ERREUR : Vous devez utiliser une clé Publishable LIVE (pk_live_...) en production !')
  }
  
  console.log('✅ STRIPE MODE: LIVE (Production) ✅')
}
```

### 2. Diagnostic amélioré (`/api/diagnostic`)

Le diagnostic affiche maintenant :
- ✅ Type de clé (LIVE / TEST / INVALID)
- ⚠️ Warnings si clés TEST en production
- 🔑 Preview des clés (20 premiers caractères)

---

## 🎯 COMPORTEMENT AUTOMATIQUE

### En PRODUCTION (Vercel) :

#### ✅ Si vous utilisez des clés LIVE :
```
✅ STRIPE MODE: LIVE (Production) ✅
🔑 Clé Stripe: sk_live_51SKfx5H23J...
```
→ **Tout fonctionne normalement**

#### ❌ Si vous utilisez des clés TEST :
```
❌ ERREUR : Vous devez utiliser une clé STRIPE LIVE (sk_live_...) en production, pas une clé TEST (sk_test_...) !
```
→ **L'application REFUSE de démarrer** (protection totale !)

### En DÉVELOPPEMENT (local) :

#### Clés LIVE acceptées :
```
⚠️ STRIPE MODE: LIVE (⚠️ en dev)
```
→ Fonctionne mais affiche un warning

#### Clés TEST acceptées :
```
⚠️ STRIPE MODE: TEST
```
→ Fonctionne normalement (pour les tests)

---

## 🔍 COMMENT VÉRIFIER VOS CLÉS

### Méthode 1 : API Diagnostic

Après déploiement, allez sur :
```
https://athlink.fr/api/diagnostic
```

**Réponse attendue avec clés LIVE** :
```json
{
  "environment": "production",
  "summary": {
    "status": "✅ TOUT EST OK - CLÉS LIVE CONFIGURÉES",
    "failed": 0,
    "warnings": 0
  },
  "checks": {
    "stripeSecretKey": {
      "configured": true,
      "type": "LIVE",
      "preview": "sk_live_51SKfx5H23J..."
    },
    "stripePublishableKey": {
      "configured": true,
      "type": "LIVE",
      "preview": "pk_live_51SKfx5H23J..."
    },
    "stripeConnection": {
      "success": true,
      "message": "Connexion Stripe réussie ✅"
    }
  }
}
```

**Réponse avec clés TEST (ERREUR)** :
```json
{
  "summary": {
    "status": "⚠️ ATTENTION : UTILISEZ DES CLÉS LIVE EN PRODUCTION",
    "warnings": 2
  },
  "checks": {
    "stripeSecretKey": {
      "configured": true,
      "type": "TEST",
      "warning": "⚠️ VOUS DEVEZ UTILISER UNE CLÉ LIVE EN PRODUCTION !"
    }
  }
}
```

### Méthode 2 : Logs Vercel

1. **Vercel** → **Deployments** → Dernier déploiement
2. **Build Logs** ou **Function Logs**
3. Cherchez :
```
✅ STRIPE MODE: LIVE (Production) ✅
```

---

## 🔐 VOS CLÉS STRIPE LIVE

Vos clés live commencent par :
- `STRIPE_SECRET_KEY` : `sk_live_51SKfx5H23JS5N2cD...`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : `pk_live_51SKfx5H23JS5N2cD...`
- `STRIPE_WEBHOOK_SECRET` : `we_1SLlGxH23JS5N2cD...` (ou `whsec_...`)

**⚠️ IMPORTANT** : 
- Ces clés doivent être dans **Vercel Environment Variables**
- Elles doivent être configurées pour **TOUS les environments** (Production, Preview, Development)
- Après ajout, vous **DEVEZ redéployer**

---

## ✅ CHECKLIST DE VÉRIFICATION

Après avoir configuré Stripe sur Vercel :

- [ ] Les clés commencent par `sk_live_` et `pk_live_` (pas `sk_test_` ou `pk_test_`)
- [ ] Les clés sont dans Vercel Environment Variables
- [ ] Tous les environments sont cochés (Production + Preview + Development)
- [ ] Le projet a été redéployé
- [ ] `/api/diagnostic` retourne `"status": "✅ TOUT EST OK - CLÉS LIVE CONFIGURÉES"`
- [ ] Les logs Vercel montrent `✅ STRIPE MODE: LIVE (Production) ✅`

---

## 🚨 SI VOUS VOYEZ DES ERREURS

### Erreur au démarrage :
```
❌ ERREUR : Vous devez utiliser une clé STRIPE LIVE (sk_live_...) en production !
```
**Solution** : Vous avez mis des clés TEST. Remplacez-les par vos clés LIVE dans Vercel.

### Warning dans diagnostic :
```
"warning": "⚠️ VOUS DEVEZ UTILISER UNE CLÉ LIVE EN PRODUCTION !"
```
**Solution** : Remplacez vos clés TEST par des clés LIVE dans Vercel et redéployez.

### Clés manquantes :
```
❌ ERREUR CRITIQUE : STRIPE_SECRET_KEY n'est pas configurée dans Vercel !
```
**Solution** : Ajoutez les clés dans Vercel Environment Variables.

---

## 🎯 RÉSULTAT

Avec ces protections :

✅ **IMPOSSIBLE** d'utiliser des clés TEST en production (l'app refuse de démarrer)  
✅ Logs clairs qui montrent le mode Stripe utilisé  
✅ Diagnostic qui vérifie tout automatiquement  
✅ **100% sécurisé** : seules les vraies transactions Stripe sont autorisées  

**Vos clés LIVE seront OBLIGATOIREMENT utilisées en production !** 🔒

---

## 📞 SUPPORT

Si vous voyez encore des clés TEST après configuration :

1. Vérifiez que vous avez bien mis `sk_live_` et `pk_live_` dans Vercel
2. Vérifiez que vous avez redéployé après modification
3. Testez `/api/diagnostic` pour confirmation
4. Regardez les logs Vercel pour voir le mode Stripe utilisé

**Les clés LIVE sont maintenant OBLIGATOIRES en production !** ✅

