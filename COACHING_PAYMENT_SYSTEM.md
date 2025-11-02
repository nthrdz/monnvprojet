# 💳 SYSTÈME DE PAIEMENT COACHING

## ✅ FONCTIONNALITÉS IMPLÉMENTÉES

Le système de paiement Stripe est maintenant pleinement fonctionnel pour les plans d'entraînement.

---

## 🎯 FLUX DE PAIEMENT

### 1️⃣ L'utilisateur clique sur "Acheter PDF"
- Modal s'ouvre
- Formulaire : Nom, Email, Téléphone (optionnel)

### 2️⃣ Clic sur "Payer X€"
- Appel API : `/api/coaching/create-checkout`
- Création d'une session Stripe Checkout
- Redirection vers Stripe

### 3️⃣ Paiement sur Stripe
- Page de paiement Stripe sécurisée
- Carte bancaire, Apple Pay, Google Pay, etc.
- Paiement unique (pas d'abonnement)

### 4️⃣ Webhook Stripe
- Stripe envoie l'événement `checkout.session.completed`
- API : `/api/stripe/webhook`
- Vérifie `metadata.type === 'coaching_plan_purchase'`

### 5️⃣ Enregistrement de l'achat
- Ajout dans `profile.stats.purchases`
- Incrémentation du compteur `_count.subscribers`
- Email au client avec lien PDF
- Email au coach pour notification

---

## 📊 DONNÉES ENREGISTRÉES

### Purchase Object
```json
{
  "id": "purchase_1234567890_abcdef",
  "planId": "plan_temp_xxx_yyy",
  "planTitle": "Programme Running Débutant",
  "clientEmail": "client@example.com",
  "clientName": "Jean Dupont",
  "amount": 50,
  "pdfFileUrl": "https://...supabase.co/.../plan.pdf",
  "pdfFileName": "programme.pdf",
  "purchasedAt": "2025-11-02T10:30:00.000Z",
  "status": "completed",
  "stripeSessionId": "cs_test_xxxxx",
  "accessExpiresAt": null
}
```

### Compteur d'abonnés
```json
{
  "id": "plan_temp_xxx_yyy",
  "title": "Programme Running Débutant",
  "_count": {
    "sessions": 10,
    "subscribers": 5  // ← Incrémenté à chaque achat
  }
}
```

---

## 📧 EMAILS ENVOYÉS

### 1️⃣ Email au client
**Objet :** ✅ Votre plan d'entraînement "Titre du plan"

**Contenu :**
- Confirmation de paiement
- Nom du coach
- Prix payé
- **Bouton : Télécharger le PDF**
- Lien direct vers Supabase Storage

### 2️⃣ Email au coach
**Objet :** 💰 Nouvelle vente : Titre du plan

**Contenu :**
- Notification de vente
- Nom du client
- Email du client
- Prix de vente
- Lien vers dashboard

---

## 🔐 SÉCURITÉ

### Stripe Checkout
- ✅ Page de paiement hébergée par Stripe
- ✅ Pas de gestion de carte bancaire côté Athlink
- ✅ Conforme PCI-DSS
- ✅ 3D Secure supporté

### Webhook
- ✅ Vérification de la signature Stripe
- ✅ Protection contre les rejeux
- ✅ Validation des métadonnées

### Accès PDF
- ✅ URL Supabase Storage publique
- ✅ Accès illimité après achat
- ✅ Pas d'expiration

---

## 💰 GESTION DES PAIEMENTS

### ⚠️ ÉTAT ACTUEL
**Tous les paiements vont sur le compte Stripe principal d'Athlink.**

### 📝 Architecture
```
Client paie 50€
    ↓
Stripe (compte Athlink)
    ↓
Stats du coach mises à jour
Coach reçoit notification email
```

### 🔄 PROCHAINE ÉTAPE : STRIPE CONNECT

Pour que chaque coach reçoive directement l'argent :

#### 1. Configuration Stripe Connect
```env
NEXT_PUBLIC_STRIPE_CONNECT_ENABLED=true
```

#### 2. Chaque coach doit créer un compte Stripe Connect
```
/dashboard/coaching/settings
  └─ Connecter mon compte Stripe
     └─ Redirection vers Stripe Connect OAuth
```

#### 3. Stocker l'ID du compte connecté
```json
{
  "stats": {
    "stripeConnectAccountId": "acct_xxxxx",
    "stripeConnectEnabled": true
  }
}
```

#### 4. Créer les paiements avec transfer_data
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [...],
  mode: 'payment',
  payment_intent_data: {
    application_fee_amount: Math.round(plan.price * 100 * 0.10), // 10% pour Athlink
    transfer_data: {
      destination: coachStripeAccountId, // 90% pour le coach
    },
  },
  success_url: '...',
  cancel_url: '...'
})
```

#### 5. Commissions
- **Coach :** 90% du montant
- **Athlink (application fee) :** 10% du montant

**Exemple :**
- Plan à 50€
- Coach reçoit : **45€**
- Athlink reçoit : **5€**

---

## 🧪 TESTER LE SYSTÈME

### 1. Mode Test (Carte de test)
```
Numéro : 4242 4242 4242 4242
Date : N'importe quelle date future
CVC : N'importe quel 3 chiffres
```

### 2. Vérifier les logs
```bash
# Dans Vercel
vercel logs --follow

# Chercher :
💳 Achat de plan de coaching détecté !
✅✅✅ ACHAT ENREGISTRÉ ! ✅✅✅
```

### 3. Vérifier les emails
- ✅ Client reçoit le PDF
- ✅ Coach reçoit la notification

### 4. Vérifier la base de données
```sql
-- Vérifier les purchases
SELECT * FROM "Profile" WHERE id = 'coach_id';
-- Regarder le champ stats.purchases

-- Vérifier le compteur d'abonnés
-- Regarder le champ stats.trainingPlans[x]._count.subscribers
```

---

## 📈 DASHBOARD COACH

### Voir les ventes
```
/dashboard/coaching
  └─ Section "Performance Globale"
     └─ Revenus Total : XXX€
     └─ Revenus ce mois : XXX€
```

### Liste des achats
Pour l'instant, les achats sont dans `profile.stats.purchases`.

**TODO :** Créer une page dédiée `/dashboard/coaching/sales` pour :
- Liste de tous les achats
- Filtres par date, plan, client
- Export CSV
- Graphiques de revenus

---

## 🚨 LIMITATIONS ACTUELLES

### 1. Pas de Stripe Connect
- ❌ L'argent va sur le compte principal
- ❌ Pas de paiement direct aux coachs
- ❌ Distribution manuelle nécessaire

### 2. Pas de remboursements automatiques
- Manuel via Stripe Dashboard
- Pas d'interface dans Athlink

### 3. Pas de dashboard des ventes
- Stats visibles dans coaching dashboard
- Pas de page dédiée aux ventes

### 4. Pas d'export de données
- Pas d'export CSV des ventes
- Pas de rapports de revenus

---

## 🔮 ROADMAP

### Phase 1 : ✅ FAIT
- [x] Intégration Stripe Checkout
- [x] Webhook pour enregistrer les achats
- [x] Email de confirmation avec PDF
- [x] Email de notification au coach
- [x] Compteur d'abonnés

### Phase 2 : 🔄 EN COURS
- [ ] Stripe Connect pour paiements directs
- [ ] Commission 10% pour Athlink
- [ ] Connexion OAuth Stripe pour chaque coach
- [ ] Vérification du compte Stripe Connect

### Phase 3 : 📋 À FAIRE
- [ ] Dashboard des ventes `/dashboard/coaching/sales`
- [ ] Export CSV des ventes
- [ ] Graphiques de revenus
- [ ] Système de remboursement
- [ ] Gestion des litiges
- [ ] Factures automatiques

### Phase 4 : 🚀 AVANCÉ
- [ ] Abonnements récurrents aux plans
- [ ] Plans par paliers (Basic, Premium)
- [ ] Coupons de réduction
- [ ] Programme d'affiliation pour les plans
- [ ] Marketplace des plans de coaching

---

## 📚 DOCUMENTATION STRIPE

- **Checkout :** https://stripe.com/docs/payments/checkout
- **Webhooks :** https://stripe.com/docs/webhooks
- **Stripe Connect :** https://stripe.com/docs/connect
- **Testing :** https://stripe.com/docs/testing

---

## ✅ CHECKLIST PRODUCTION

Avant de passer en production :

- [ ] Clés Stripe de production dans Vercel
- [ ] Webhook configuré dans Stripe Dashboard
- [ ] URL de webhook : `https://athlink.fr/api/stripe/webhook`
- [ ] Événements à écouter : `checkout.session.completed`
- [ ] Emails testés et vérifiés
- [ ] Conditions générales de vente (CGV)
- [ ] Politique de remboursement
- [ ] Support client pour les litiges

---

## 🎉 RÉSULTAT

**Le système de paiement fonctionne ! Les coachs peuvent maintenant :**
- ✅ Vendre leurs plans d'entraînement
- ✅ Recevoir des notifications de vente
- ✅ Voir le nombre d'abonnés
- ✅ Les clients reçoivent le PDF par email

**Prochaine étape :** Implémenter Stripe Connect pour que chaque coach reçoive directement l'argent !

