# 💳 Configuration Stripe pour le Système de Parrainage

## ✅ Ce qui fonctionne SANS configuration Stripe

Votre système de parrainage est **déjà fonctionnel** sans configuration Stripe supplémentaire pour :

- ✅ **Tracking des clics** : Enregistré automatiquement
- ✅ **Tracking des conversions** : Détecté lors de l'inscription
- ✅ **Calcul des commissions** : Commission de 40% calculée automatiquement
- ✅ **Emails de notification** : Envoyés aux ambassadeurs
- ✅ **Dashboard ambassadeur** : Statistiques en temps réel
- ✅ **Panel admin** : Gestion des ambassadeurs

---

## 💰 Configuration Stripe (OPTIONNEL - Pour les paiements automatiques)

Si vous voulez que les commissions soient **versées automatiquement** aux ambassadeurs, vous devez configurer **Stripe Connect**.

### Étape 1 : Activer Stripe Connect

1. Allez sur votre **Dashboard Stripe** : https://dashboard.stripe.com
2. Dans le menu de gauche, cliquez sur **Connect**
3. Cliquez sur **Commencer** pour activer Stripe Connect
4. Choisissez le type de compte : **Standard** (recommandé)

### Étape 2 : Créer une application Connect

1. Dans **Connect** → **Paramètres**
2. Cliquez sur **Créer une plateforme**
3. Remplissez les informations :
   - **Nom de la plateforme** : Athlink Ambassadeurs
   - **Type** : Plateforme
   - **URL de redirection OAuth** : `https://votre-domaine.com/api/stripe/connect/callback`

### Étape 3 : Ajouter les variables d'environnement

Dans votre fichier `.env.local`, ajoutez :

```bash
# Stripe Connect
STRIPE_CONNECT_CLIENT_ID=ca_xxx...  # Trouvé dans Connect > Paramètres
```

### Étape 4 : Configurer les webhooks Stripe

1. Dans **Développeurs** → **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL du endpoint : `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez ces événements :
   - `payment_intent.succeeded`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `account.updated` (pour Stripe Connect)
5. Copiez le **Signing secret** (commence par `whsec_...`)
6. Ajoutez-le dans `.env.local` :
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxx...
   ```

---

## 🔄 Comment fonctionnera le flux de paiement avec Stripe Connect

### Sans Stripe Connect (Configuration actuelle) :

```
1. Utilisateur clique sur lien de parrainage → ✅ Enregistré
2. Utilisateur s'inscrit → ✅ Conversion détectée
3. Commission calculée (40%) → ✅ Enregistrée dans la DB
4. Email envoyé à l'ambassadeur → ✅ Notification
5. Paiement de la commission → ❌ MANUEL (vous devez payer vous-même)
```

### Avec Stripe Connect (Configuration complète) :

```
1. Utilisateur clique sur lien de parrainage → ✅ Enregistré
2. Utilisateur s'inscrit → ✅ Conversion détectée
3. Commission calculée (40%) → ✅ Enregistrée dans la DB
4. Email envoyé à l'ambassadeur → ✅ Notification
5. Paiement de la commission → ✅ AUTOMATIQUE via Stripe Connect
   → Dès que l'ambassadeur atteint 50€ de commissions
   → Transfert automatique sur son compte bancaire
```

---

## 💡 Recommandation

### Pour commencer (SANS Stripe Connect) :

Votre système fonctionne **parfaitement** sans Stripe Connect pour :
- Tester le système
- Gérer quelques ambassadeurs
- Payer manuellement les commissions (virement bancaire, PayPal)

**Avantages** :
- ✅ Plus simple à mettre en place
- ✅ Pas de frais Stripe Connect (2,9% + 0,25€ par paiement)
- ✅ Vous gardez le contrôle des paiements

**Inconvénients** :
- ❌ Vous devez payer manuellement les commissions
- ❌ Plus de travail administratif

### Pour automatiser (AVEC Stripe Connect) :

Configurez Stripe Connect quand :
- Vous avez plus de 10 ambassadeurs actifs
- Vous voulez automatiser les paiements
- Vous acceptez de payer les frais Stripe Connect

**Avantages** :
- ✅ Paiements automatiques
- ✅ Moins de travail administratif
- ✅ Les ambassadeurs reçoivent l'argent plus rapidement

**Inconvénients** :
- ❌ Frais Stripe Connect : 2,9% + 0,25€ par paiement
- ❌ Configuration plus complexe
- ❌ Les ambassadeurs doivent créer un compte Stripe Connect

---

## 📊 État actuel de votre système

| Fonctionnalité | Statut | Nécessite Stripe Connect ? |
|----------------|--------|----------------------------|
| Tracking des clics | ✅ Actif | Non |
| Tracking des conversions | ✅ Actif | Non |
| Calcul des commissions | ✅ Actif | Non |
| Emails de notification | ✅ Actif | Non |
| Dashboard ambassadeur | ✅ Actif | Non |
| Panel admin | ✅ Actif | Non |
| **Paiements automatiques** | ⏳ Optionnel | **Oui** |

---

## 🎯 Conclusion

**Vous pouvez utiliser votre système de parrainage MAINTENANT sans configurer Stripe Connect !**

Les commissions seront enregistrées dans la base de données, et vous pourrez les payer manuellement via :
- Virement bancaire
- PayPal
- Autres moyens de paiement

**Stripe Connect n'est nécessaire QUE si vous voulez automatiser les paiements.**

---

## 🚀 Prochaines étapes recommandées

1. **Tester le système** avec 2-3 ambassadeurs
2. **Payer manuellement** les premières commissions
3. **Évaluer** si l'automatisation est nécessaire
4. **Configurer Stripe Connect** seulement si vous avez beaucoup d'ambassadeurs

---

## 💰 Exemple de paiement manuel

Dans le panel admin (`/dashboard/admin/affiliates`), vous pouvez voir :
- Les commissions en attente de chaque ambassadeur
- Le montant total à payer
- L'historique des conversions

Pour payer manuellement :
1. Notez le montant dû à l'ambassadeur
2. Effectuez un virement bancaire ou PayPal
3. Marquez la commission comme "PAID" dans la base de données

---

**Votre système est prêt à être utilisé ! 🎉**

