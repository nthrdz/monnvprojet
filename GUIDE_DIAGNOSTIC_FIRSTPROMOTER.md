# 🔍 Guide de Diagnostic FirstPromoter

## ⚠️ Le message Framer Editor Bar n'est PAS un problème

Le message `[Framer Editor Bar] Unavailable...` est un **avertissement de Framer Motion** (bibliothèque d'animations) et **n'a rien à voir avec FirstPromoter**. Tu peux l'ignorer complètement.

---

## 🧪 Comment tester si FirstPromoter fonctionne

### Étape 1 : Vérifier que le SDK est chargé

1. Ouvre ton site : `https://athlink.fr` (ou `http://localhost:3000` en local)
2. Ouvre la console du navigateur (F12 → Console)
3. Tape : `window.fpr`
4. Tu devrais voir : `ƒ () { ... }` (une fonction)
5. Tape : `window.FPROM`
6. Tu devrais voir un objet avec des propriétés

**Si tu vois ces éléments → Le SDK est chargé ✅**

---

### Étape 2 : Tester avec un lien d'affiliation

1. Ouvre une **fenêtre de navigation privée** (important !)
2. Visite : `https://athlink.fr/?fpr=ton_code` (remplace `ton_code` par ton code affilié)
3. Attends 2-3 secondes
4. Ouvre la console (F12 → Console)
5. Tu devrais voir :
   - `✅ FirstPromoter SDK chargé`
   - `✅ FirstPromoter Tracking ID: [valeur]`
   - Des cookies `_fprom_tid` et `_fprom_ref`

**Si tu vois ces logs → Le tracking fonctionne ✅**

---

### Étape 3 : Vérifier les cookies

1. Dans la console, tape : `document.cookie`
2. Tu devrais voir des cookies commençant par `_fprom`
3. Ou va dans : Application → Cookies → athlink.fr
4. Cherche les cookies `_fprom_tid` et `_fprom_ref`

**Si les cookies existent → Le tracking est actif ✅**

---

### Étape 4 : Tester une conversion complète

1. Visite ton lien d'affiliation : `https://athlink.fr/?fpr=ton_code`
2. Crée un compte de test
3. Va sur `/dashboard/upgrade`
4. Clique sur "Passer PRO" ou "Passer ELITE"
5. Dans la console, tu devrais voir :
   - `🎯 FirstPromoter Tracking ID trouvé: [valeur]`
   - `🎯 FirstPromoter Tracking ID (fp_tid): [valeur]`
6. Complète le paiement Stripe

**Après le paiement :**
- Va dans ton dashboard FirstPromoter
- Vérifie Dashboard → Referrals
- Vérifie Dashboard → Commissions

**Si la conversion apparaît → Tout fonctionne ✅**

---

## ❌ Problèmes courants et solutions

### Problème 1 : `window.fpr` n'existe pas

**Solution :**
- Vérifie que le script est bien chargé dans `app/layout.tsx`
- Vérifie la console pour des erreurs de chargement
- Vérifie que tu es bien sur `athlink.fr` (pas un autre domaine)

### Problème 2 : Aucun cookie `_fprom_tid`

**Solution :**
- Assure-toi d'utiliser un lien avec `?fpr=ton_code`
- Utilise une fenêtre de navigation privée (pour éviter les cookies en cache)
- Attends 2-3 secondes après avoir visité le lien
- Vérifie que le Client ID est correct : `sb7ej7w0`

### Problème 3 : Le `fp_tid` n'est pas transmis à Stripe

**Solution :**
- Vérifie les logs dans la console lors du clic sur "Passer PRO/ELITE"
- Vérifie que tu vois : `🎯 FirstPromoter Tracking ID trouvé: [valeur]`
- Vérifie dans Stripe Dashboard → Sessions → Métadonnées que `fp_tid` est présent

### Problème 4 : Les conversions n'apparaissent pas dans FirstPromoter

**Solution :**
- Vérifie que Stripe est bien connecté dans FirstPromoter Dashboard
- Vérifie que l'intégration "Stripe Checkout" est bien configurée
- Vérifie que le `fp_tid` est bien dans les métadonnées Stripe
- Attends quelques minutes (le traitement peut prendre du temps)

---

## 🔧 Outils de diagnostic

### En développement local

Le composant `FirstPromoterDebug` s'affiche automatiquement et affiche des logs détaillés dans la console.

### Script de test

Tu peux exécuter le script de test :
```bash
# Ouvre la console du navigateur et colle le code de scripts/test-firstpromoter.js
```

---

## 📊 Vérification finale

Pour confirmer que tout fonctionne :

1. ✅ Le SDK FirstPromoter est chargé (`window.fpr` existe)
2. ✅ Les cookies sont créés quand tu visites `?fpr=ton_code`
3. ✅ Le `tid` est récupéré lors du clic sur "Passer PRO/ELITE"
4. ✅ Le `fp_tid` est transmis dans les métadonnées Stripe
5. ✅ Les conversions apparaissent dans FirstPromoter Dashboard

---

## 🆘 Besoin d'aide ?

Si après avoir suivi ce guide, FirstPromoter ne fonctionne toujours pas :

1. Vérifie les logs dans la console du navigateur
2. Vérifie les logs serveur (Vercel → Functions → Logs)
3. Vérifie que Stripe est bien connecté dans FirstPromoter
4. Contacte le support FirstPromoter avec les détails de ton problème

---

**Dernière mise à jour** : Intégration FirstPromoter complète avec diagnostic ✅

