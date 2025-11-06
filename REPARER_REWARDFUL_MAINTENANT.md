# 🚨 RÉPARER REWARDFUL MAINTENANT (5 MINUTES)

## ❌ PROBLÈME

Rewardful n'est PAS actif sur athlink.fr parce que les variables d'environnement ne sont pas sur Vercel.

---

## ✅ SOLUTION EN 4 ÉTAPES

### **📍 ÉTAPE 1 : Va sur Vercel**

Ouvre ce lien : **https://vercel.com/dashboard**

Clique sur ton projet **Athlink**

---

### **📍 ÉTAPE 2 : Va dans Settings**

1. Clique sur l'onglet **"Settings"** (en haut)
2. Dans le menu de gauche, clique sur **"Environment Variables"**

---

### **📍 ÉTAPE 3 : Ajoute les 2 clés Rewardful**

#### **PREMIÈRE CLÉ (publique)**

1. Clique sur **"Add New"**
2. Remplis :

```
Name:  NEXT_PUBLIC_REWARDFUL_API_KEY
Value: bf940c
```

3. **COCHE LES 3 CASES** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Clique **"Save"**

#### **DEUXIÈME CLÉ (secrète)**

1. Clique sur **"Add New"** (encore)
2. Remplis :

```
Name:  REWARDFUL_API_SECRET
Value: 88e0491c7cc82914f5377020f3655e2d
```

3. **COCHE LES 3 CASES** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Clique **"Save"**

---

### **📍 ÉTAPE 4 : Redéploie**

1. Clique sur **"Deployments"** (en haut)
2. Clique sur le **dernier déploiement** (tout en haut)
3. Clique sur les **3 points** `...` (en haut à droite)
4. Clique sur **"Redeploy"**
5. Clique sur **"Redeploy"** (confirmer)

⏳ **ATTENDS 2-3 MINUTES** que le build se termine.

---

## 🧪 TESTER

Une fois le build terminé (statut "Ready"), teste dans ton terminal :

```bash
cd /Users/nathan/Desktop/athlink\ copie
node scripts/test-rewardful-production.js
```

**Si tu vois** :
```
🎉 SUCCÈS : Rewardful est correctement configuré !
```

✅ **C'EST BON ! Rewardful fonctionne !**

---

## 🔗 Ton lien affilié sera alors actif

```
https://athlink.fr/?via=nathan
```

Chaque personne qui s'inscrit et paie via ce lien te rapportera :
- **PRO** : 3,96€/mois (40% de 9,90€)
- **ELITE** : 10,36€/mois (40% de 25,90€)

---

## 📊 Dashboard Rewardful

Une fois actif, tu pourras suivre tes conversions sur :
https://app.getrewardful.com/dashboard

---

## ❓ SI ÇA NE MARCHE TOUJOURS PAS

1. Vérifie que les 2 clés sont bien sur Vercel
2. Vérifie que le build est "Ready" (pas "Failed")
3. Vide le cache de ton navigateur (Cmd+Shift+R)
4. Réessaie le test

Si ça ne marche toujours pas après ça, dis-moi et je regarderai plus en détail !

---

## 🎯 RÉSUMÉ

1. ✅ Va sur Vercel
2. ✅ Ajoute les 2 clés dans Environment Variables
3. ✅ Redéploie
4. ✅ Attends 2-3 min
5. ✅ Teste avec le script

**TEMPS TOTAL : 5 MINUTES**

---

**🚀 Une fois fait, Rewardful sera opérationnel et tu pourras gagner des commissions !**

