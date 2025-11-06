# 🧪 Tester que Rewardful fonctionne correctement

## ⏳ Attendre que Vercel finisse de déployer

**Statut actuel** : Vercel est en train de déployer avec les nouvelles clés Rewardful.

**Temps estimé** : 2-3 minutes

---

## 🔍 Vérifier que le déploiement est terminé

### **Option 1 : Dashboard Vercel**
1. Va sur : https://vercel.com/dashboard
2. Clique sur ton projet **Athlink**
3. Onglet **"Deployments"**
4. Le dernier déploiement doit afficher : ✅ **Ready**

### **Option 2 : Test direct**
1. Ouvre : https://athlink.fr
2. **Force le rafraîchissement** : **Cmd+Shift+R** (Mac) ou **Ctrl+Shift+R** (Windows)
3. Si le script Rewardful est chargé, tu verras des requêtes réseau vers `getrewardful.com`

---

## ✅ Test 1 : Vérifier que le SDK Rewardful est chargé

### **Sur athlink.fr (production)**

1. **Ouvre** : https://athlink.fr
2. **Ouvre la Console** : **F12** ou **Cmd+Option+I** (Mac)
3. **Tape** dans la console :

```javascript
window.rewardful
```

4. **Résultat attendu** :

```javascript
{q: Array(0)}
```

✅ **Si tu vois cet objet** : Le SDK Rewardful est bien chargé !

❌ **Si tu vois `undefined`** : Le déploiement n'est pas encore terminé, attends 1-2 minutes et recharge la page.

---

## ✅ Test 2 : Vérifier que le tracking fonctionne

### **Tester le tracking du lien affilié**

1. **Ouvre ton lien affilié** : https://athlink.fr/?via=nathan
2. **Ouvre la Console** : **F12**
3. **Tape** :

```javascript
document.cookie
```

4. **Résultat attendu** : Tu devrais voir un cookie `rewardful.referral` contenant `nathan`

```
"rewardful.referral=nathan; ..."
```

✅ **Si tu vois le cookie** : Le tracking fonctionne !

---

## ✅ Test 3 : Faire un achat test complet

### **Étape 1 : Créer un compte test avec ton lien affilié**

1. **Ouvre** : https://athlink.fr/?via=nathan
2. **Clique sur** "S'inscrire"
3. **Crée un compte test** :
   - Email : `test-rewardful-$(date +%s)@example.com` (ou n'importe quel email de test)
   - Nom : Test Rewardful
   - Username : test-rewardful-$(date +%s)
4. **Termine l'inscription**

### **Étape 2 : Passer au plan ELITE**

1. **Va sur** : Dashboard → Upgrade
2. **Choisis** : Plan **ELITE** (25,90€/mois)
3. **Clique sur** "Passer Elite"

### **Étape 3 : Payer avec une carte de test Stripe**

1. **Email** : test-rewardful@example.com
2. **Numéro de carte** : `4242 4242 4242 4242`
3. **Expiration** : N'importe quelle date future (ex: `12/25`)
4. **CVC** : N'importe quel 3 chiffres (ex: `123`)
5. **Code postal** : N'importe lequel (ex: `75001`)
6. **Clique sur** "Payer"

### **Étape 4 : Vérifier les logs Stripe**

1. **Va sur** : https://dashboard.stripe.com/test/webhooks
2. **Clique sur** ton webhook (endpoint qui pointe vers athlink.fr)
3. **Clique sur** le dernier événement `checkout.session.completed`
4. **Vérifie les logs** :

Tu devrais voir :

```
🎁 Code de parrainage détecté: nathan
   - Appel de l'API affiliate/convert...
✅ Conversion affilié enregistrée avec succès !
   - Commission: 10.36 €

🎁 Envoi de la conversion à Rewardful...
✅ Conversion envoyée à Rewardful avec succès !
   - Conversion ID: conv_xxxxxxxxxxxxxxxx
```

✅ **Si tu vois ces logs** : La conversion a été envoyée à Rewardful !

❌ **Si tu ne vois pas ces logs** : Vérifie que `REWARDFUL_API_SECRET` est bien configurée sur Vercel.

### **Étape 5 : Vérifier dans le dashboard Rewardful**

1. **Va sur** : https://app.getrewardful.com/dashboard
2. **Section "Links"** :
   - Tu devrais voir ton lien : `https://athlink.fr/?via=nathan`
   - **Visitors** : 1 (au moins)
   - **Conversions** : 1 (au moins)

3. **Section "Commissions"** :
   - Tu devrais voir une nouvelle commission : **10,36€** (pour ELITE)

✅ **Si tu vois la conversion** : TOUT FONCTIONNE PARFAITEMENT ! 🎉

❌ **Si tu ne vois rien** :
   - Vérifie les logs Stripe (Étape 4)
   - Vérifie que `REWARDFUL_API_SECRET` est correcte sur Vercel
   - Attends quelques minutes (parfois il y a un délai)

---

## 🔧 Troubleshooting

### **Problème 1 : `window.rewardful` est `undefined`**

**Cause** : Le script Rewardful n'est pas chargé.

**Solution** :
1. Vérifie que `NEXT_PUBLIC_REWARDFUL_API_KEY=bf940c` est bien sur Vercel
2. Redéploie le projet
3. Vide le cache du navigateur (**Cmd+Shift+R**)

### **Problème 2 : Pas de cookie `rewardful.referral`**

**Cause** : Le SDK Rewardful n'a pas capturé le `?via=nathan`.

**Solution** :
1. Assure-toi d'ouvrir **directement** le lien `https://athlink.fr/?via=nathan`
2. Ne pas ouvrir `https://athlink.fr` puis ajouter `?via=nathan` manuellement
3. Le cookie doit être créé au **premier chargement** de la page

### **Problème 3 : Conversion non visible dans Rewardful**

**Cause** : L'API Rewardful n'a pas reçu la conversion ou la clé secrète est incorrecte.

**Solution** :
1. Vérifie les logs Stripe (webhook) pour voir si la conversion a été envoyée
2. Vérifie que `REWARDFUL_API_SECRET=88e0491c7cc82914f5377020f3655e2d` est correcte
3. Vérifie que le `referralCode` "nathan" est bien dans les metadata Stripe

### **Problème 4 : Erreur 401 dans les logs Stripe**

**Cause** : La clé `REWARDFUL_API_SECRET` est incorrecte.

**Solution** :
1. Va sur https://app.getrewardful.com/settings/api
2. Vérifie que ta **Secret Key** est bien : `88e0491c7cc82914f5377020f3655e2d`
3. Si elle est différente, mets à jour la variable sur Vercel
4. Redéploie

---

## 📊 Résultats attendus après un test réussi

| Élément | Valeur attendue |
|---------|-----------------|
| **SDK chargé** | `window.rewardful = {q: []}` ✅ |
| **Cookie créé** | `rewardful.referral=nathan` ✅ |
| **Webhook Stripe** | "✅ Conversion envoyée à Rewardful" ✅ |
| **Dashboard Rewardful** | 1 conversion visible ✅ |
| **Commission** | 10,36€ (ELITE) ou 3,96€ (PRO) ✅ |

---

## 🎯 Commandes de test rapides

### **Vérifier le SDK en production**

```bash
curl -s https://athlink.fr | grep -i "data-rewardful"
```

Résultat attendu : `data-rewardful="bf940c"`

### **Vérifier le cookie après avoir cliqué sur le lien affilié**

1. Ouvre : https://athlink.fr/?via=nathan
2. Console : `document.cookie`
3. Cherche : `rewardful.referral=nathan`

---

## ✅ Checklist finale

Avant de considérer que tout fonctionne, vérifie :

- [ ] `window.rewardful` existe en production
- [ ] Cookie `rewardful.referral` créé après avoir cliqué sur `?via=nathan`
- [ ] Achat test réussi avec carte Stripe test
- [ ] Logs Stripe montrent "✅ Conversion envoyée à Rewardful"
- [ ] Dashboard Rewardful affiche la conversion
- [ ] Commission visible dans Rewardful

---

## 🚀 Une fois que tout fonctionne

Tu peux partager ton lien affilié en toute confiance :

```
https://athlink.fr/?via=nathan
```

**Chaque personne qui s'inscrit et paie via ce lien te rapportera** :
- **Plan PRO** : 3,96€/mois (récurrent)
- **Plan ELITE** : 10,36€/mois (récurrent)

**Toutes les stats sont sur Rewardful** : https://app.getrewardful.com/dashboard

🎉 **Bon partage !**

