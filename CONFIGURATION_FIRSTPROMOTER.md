# 🎯 Configuration FirstPromoter

## ✅ Étape 1 : SDK FirstPromoter installé

Le SDK FirstPromoter est maintenant intégré dans votre site Athlink !

**Code ajouté dans** `app/layout.tsx` :
```javascript
fpr("init", {cid:"sb7ej7w0"}); 
fpr("click");
```

---

## 🔗 Étape 2 : Configurer l'intégration Stripe

Pour que les conversions soient automatiquement trackées lors des paiements Stripe, vous devez configurer l'intégration dans votre dashboard FirstPromoter.

### Instructions :

1. **Connectez-vous à votre dashboard FirstPromoter** :
   - URL : https://firstpromoter.com/dashboard

2. **Allez dans Settings → Integrations** :
   - Cherchez "Stripe"
   - Cliquez sur "Connect Stripe"

3. **Authentifiez votre compte Stripe** :
   - Vous serez redirigé vers Stripe pour autoriser l'accès
   - Sélectionnez votre compte Stripe Athlink
   - Confirmez l'autorisation

4. **Configurez les paramètres** :
   - ✅ **Track Stripe Payments** : Activé
   - ✅ **Track Stripe Subscriptions** : Activé
   - ✅ **Track Stripe Customers** : Activé
   - Commission : **40%** (récurrente)

5. **Enregistrez les modifications**

---

## 🎁 Étape 3 : Créer votre lien affilié

1. Dans votre dashboard FirstPromoter, allez dans **"My Affiliate Link"**

2. Votre lien affilié sera au format :
   ```
   https://athlink.fr/?fpr=votre_code
   ```

3. Vous pouvez également créer des liens personnalisés :
   ```
   https://athlink.fr/?fpr=nathan
   ```

---

## 📊 Étape 4 : Tester le tracking

### Test complet :

1. **Ouvrez une fenêtre de navigation privée**

2. **Visitez votre lien affilié** :
   ```
   https://athlink.fr/?fpr=votre_code
   ```

3. **Créez un compte de test** :
   - Inscrivez-vous avec un email test
   - Passez au plan PRO ou ELITE

4. **Vérifiez dans FirstPromoter** :
   - Dashboard → Referrals
   - Vous devriez voir le nouveau referral
   - Dashboard → Commissions
   - La commission devrait apparaître après le paiement Stripe

---

## 🔄 Migration depuis Rewardful

### Ce qui a été fait automatiquement :

✅ SDK Rewardful retiré de `app/layout.tsx`
✅ SDK FirstPromoter ajouté
✅ Appels API Rewardful désactivés dans le webhook Stripe
✅ FirstPromoter utilisera l'intégration Stripe native

### Ce qu'il reste à faire manuellement :

1. **Configurer l'intégration Stripe dans FirstPromoter** (voir Étape 2)

2. **Mettre à jour vos liens affiliés** :
   - Anciens liens Rewardful : `https://athlink.fr/?via=nathan`
   - Nouveaux liens FirstPromoter : `https://athlink.fr/?fpr=nathan`

3. **(Optionnel) Nettoyer les anciennes variables d'environnement** :
   - `REWARDFUL_API_SECRET`
   - `NEXT_PUBLIC_REWARDFUL_API_KEY`

---

## 📧 Support FirstPromoter

Si vous avez des questions sur la configuration :
- Documentation : https://docs.firstpromoter.com
- Support : support@firstpromoter.com

---

## ✨ Avantages de FirstPromoter vs Rewardful

✅ Intégration Stripe plus robuste
✅ Dashboard plus complet pour les affiliés
✅ Meilleure gestion des commissions récurrentes
✅ Plus d'options de personnalisation
✅ Support multilingue
✅ Webhooks plus fiables

---

**Dernière mise à jour** : Migration Rewardful → FirstPromoter effectuée ✅

