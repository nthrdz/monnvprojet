# 🔑 Comment trouver tes clés API Rewardful

## 📍 ÉTAPE 1 : Connexion à Rewardful

1. **Ouvre ce lien** : https://app.getrewardful.com/login

2. **Connecte-toi** avec ton compte Rewardful
   - Email : (celui que tu as utilisé pour t'inscrire)
   - Mot de passe : (ton mot de passe Rewardful)

3. **Clique** sur **"Log in"**

---

## 📍 ÉTAPE 2 : Accéder aux paramètres API

Une fois connecté au dashboard Rewardful :

1. **Cherche dans le menu de gauche** (sidebar)
2. **Clique** sur **"Settings"** (⚙️ Paramètres)
3. **Clique** sur **"API"** ou **"API Keys"**

**OU**

**Ouvre directement ce lien** : https://app.getrewardful.com/settings/api

---

## 📍 ÉTAPE 3 : Récupérer la clé publique (Public API Key)

Tu vas voir une section **"Public API Key"** :

```
┌─────────────────────────────────────────┐
│ Public API Key                          │
├─────────────────────────────────────────┤
│ bf940c  [Copy]                          │
└─────────────────────────────────────────┘
```

✅ **TA CLÉ PUBLIQUE** : `bf940c`

**Note** : Cette clé est courte (6 caractères), c'est normal !

---

## 📍 ÉTAPE 4 : Récupérer la clé secrète (Secret Key)

Plus bas sur la même page, tu vas voir **"Secret Key"** :

```
┌──────────────────────────────────────────────┐
│ Secret Key                                   │
├──────────────────────────────────────────────┤
│ sk_••••••••••••••••••••••••••  [Reveal]     │
└──────────────────────────────────────────────┘
```

1. **Clique** sur le bouton **"Reveal"** (Révéler) ou **"Show"** (Afficher)
2. La clé secrète va s'afficher :

```
sk_88e0491c7cc82914f5377020f3655e2d
```

3. **Copie cette clé complète** (elle commence par `sk_`)

✅ **TA CLÉ SECRÈTE** : `88e0491c7cc82914f5377020f3655e2d`

---

## 📝 RÉCAPITULATIF DE TES CLÉS

Une fois que tu as trouvé les 2 clés, vérifie qu'elles correspondent :

| Clé | Valeur | Longueur |
|-----|--------|----------|
| **Public API Key** | `bf940c` | 6 caractères |
| **Secret Key** | `88e0491c7cc82914f5377020f3655e2d` | 32 caractères |

---

## ✅ ÉTAPE 5 : Ajouter les clés sur Vercel

Maintenant que tu as tes clés, va sur Vercel :

### **5.1 - Ouvre Vercel**
https://vercel.com/dashboard

### **5.2 - Va dans ton projet Athlink**
Clique sur **Athlink**

### **5.3 - Va dans Settings → Environment Variables**
1. Clique sur **"Settings"** (en haut)
2. Clique sur **"Environment Variables"** (menu de gauche)

### **5.4 - Ajoute la première clé**

Clique sur **"Add New"** :

```
Name:  NEXT_PUBLIC_REWARDFUL_API_KEY
Value: bf940c
```

✅ Coche **Production**, **Preview** et **Development**

Clique **"Save"**

### **5.5 - Ajoute la deuxième clé**

Clique sur **"Add New"** (encore) :

```
Name:  REWARDFUL_API_SECRET
Value: 88e0491c7cc82914f5377020f3655e2d
```

✅ Coche **Production**, **Preview** et **Development**

Clique **"Save"**

---

## 🚀 ÉTAPE 6 : Redéployer

1. Va dans **"Deployments"**
2. Clique sur le **dernier déploiement**
3. Clique sur **les 3 points** `...`
4. Clique sur **"Redeploy"**
5. Confirme en cliquant **"Redeploy"**

⏳ **Attends 2-3 minutes**

---

## 🧪 ÉTAPE 7 : Tester

Une fois le build terminé, teste :

```bash
cd /Users/nathan/Desktop/athlink\ copie
node scripts/test-rewardful-production.js
```

**Si tu vois** :
```
🎉 SUCCÈS : Rewardful est correctement configuré !
```

✅ **C'EST BON !**

---

## ❓ SI TU NE TROUVES PAS LES CLÉS

### **Problème 1 : Je n'ai pas de compte Rewardful**

Si tu n'as pas encore de compte Rewardful :

1. Va sur : https://www.getrewardful.com/
2. Clique sur **"Sign Up"**
3. Crée ton compte
4. Ensuite, suis les étapes ci-dessus

### **Problème 2 : Les clés affichées sont différentes**

⚠️ **ATTENTION** : Les clés mentionnées dans ce guide (`bf940c` et `88e0491c...`) sont **TES VRAIES CLÉS REWARDFUL**.

Elles sont déjà configurées dans ton code local, mais **manquent sur Vercel**.

Utilise exactement ces clés :
- `NEXT_PUBLIC_REWARDFUL_API_KEY` = `bf940c`
- `REWARDFUL_API_SECRET` = `88e0491c7cc82914f5377020f3655e2d`

### **Problème 3 : Je ne vois pas la section "API"**

Si tu ne vois pas l'option "API" dans les settings :

1. Assure-toi d'être bien connecté
2. Va directement sur : https://app.getrewardful.com/settings/api
3. Si ça ne marche toujours pas, contacte le support Rewardful

---

## 📞 SUPPORT REWARDFUL

Si tu as des problèmes avec Rewardful :

- **Documentation** : https://www.getrewardful.com/docs
- **Support** : support@getrewardful.com
- **Chat** : Sur leur site getrewardful.com

---

## 🎯 RÉSUMÉ VISUEL

```
1. Va sur app.getrewardful.com/login
        ↓
2. Connecte-toi
        ↓
3. Settings → API
        ↓
4. Copie la clé publique (6 caractères)
        ↓
5. Révèle et copie la clé secrète (32 caractères)
        ↓
6. Va sur vercel.com/dashboard
        ↓
7. Athlink → Settings → Environment Variables
        ↓
8. Ajoute NEXT_PUBLIC_REWARDFUL_API_KEY
        ↓
9. Ajoute REWARDFUL_API_SECRET
        ↓
10. Redéploie
        ↓
11. Teste avec le script
        ↓
✅ SUCCÈS !
```

---

## 💡 ASTUCES

- Les clés publiques sont **courtes** (6-10 caractères)
- Les clés secrètes sont **longues** (32+ caractères) et commencent souvent par `sk_`
- Tu peux régénérer tes clés si tu les perds (dans les settings Rewardful)
- **Ne partage JAMAIS ta clé secrète** publiquement

---

**Une fois les clés ajoutées sur Vercel, Rewardful sera opérationnel ! 🚀**

