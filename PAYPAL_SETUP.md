# 🔧 Guide Complet : Configuration PayPal pour AthLink

## 📋 Table des matières
1. [Étape 1 : Créer un compte PayPal Business](#étape-1)
2. [Étape 2 : Obtenir les clés API PayPal](#étape-2)
3. [Étape 3 : Configurer les variables d'environnement](#étape-3)
4. [Étape 4 : Configurer le Webhook PayPal](#étape-4)
5. [Étape 5 : Tester le système](#étape-5)

---

## ✅ Ce qui a été implémenté

1. **API Route pour créer des ordres PayPal** (`/api/paypal/create-order`)
   - Crée un ordre PayPal avec l'email du coach comme destinataire
   - Redirige vers PayPal pour le paiement

2. **Webhook PayPal** (`/api/paypal/webhook`)
   - Reçoit les notifications de paiement de PayPal
   - Envoie automatiquement le PDF par email après confirmation du paiement

3. **Pages de retour**
   - `/payment/paypal/success` : Page de succès après paiement
   - `/payment/paypal/cancel` : Page d'annulation

4. **Modal de paiement mis à jour**
   - Utilise maintenant l'API PayPal au lieu de liens simples
   - Envoi automatique du PDF après paiement

---

## 🔑 Étape 1 : Créer un compte PayPal Business {#étape-1}

### Option A : Vous avez déjà un compte PayPal personnel

1. Allez sur [paypal.com](https://www.paypal.com) et connectez-vous
2. Cliquez sur **Paramètres** (icône ⚙️ en haut à droite)
3. Allez dans **Compte** > **Passer à un compte Business**
4. Suivez les instructions pour convertir votre compte
5. Vous devrez fournir :
   - Nom de votre entreprise
   - Type d'entreprise
   - Informations de contact

### Option B : Créer un nouveau compte Business

1. Allez sur [paypal.com](https://www.paypal.com)
2. Cliquez sur **S'inscrire**
3. Sélectionnez **Compte Business**
4. Remplissez le formulaire avec vos informations d'entreprise
5. Vérifiez votre email

### ⚠️ Important : Vérifier votre compte

PayPal vous demandera de vérifier votre compte Business :
- **Documents requis** : Pièce d'identité, justificatif de domicile
- **Vérification bancaire** : PayPal peut vous demander de confirmer un compte bancaire
- **Temps de traitement** : Généralement 1-3 jours ouvrés

**Note** : Vous pouvez commencer avec le mode **Sandbox** (test) sans vérifier votre compte, mais pour la production, la vérification est obligatoire.

---

## 🔑 Étape 2 : Obtenir les clés API PayPal {#étape-2}

### 2.1. Accéder à PayPal Developer

1. Allez sur [developer.paypal.com](https://developer.paypal.com)
2. Cliquez sur **Log In** (en haut à droite)
3. Connectez-vous avec votre compte PayPal Business

### 2.2. Créer une application Sandbox (pour tester)

1. Une fois connecté, vous arrivez sur le **Dashboard**
2. Cliquez sur **My Apps & Credentials** dans le menu de gauche
3. Vous verrez deux onglets : **Sandbox** et **Live**
4. Restez sur l'onglet **Sandbox** pour commencer
5. Cliquez sur **Create App** (bouton bleu en haut à droite)

### 2.3. Remplir le formulaire de l'application

- **App Name** : `AthLink Sandbox` (ou un nom de votre choix)
- **Merchant** : Sélectionnez votre compte Business dans la liste
- Cliquez sur **Create App**

### 2.4. Copier les clés API

Après la création, vous verrez :
- **Client ID** : Une longue chaîne de caractères (commence souvent par `Ae...`)
- **Secret** : Cliquez sur **Show** pour révéler le secret (commence souvent par `EF...`)

**⚠️ IMPORTANT** : Copiez ces deux valeurs immédiatement, vous ne pourrez plus voir le Secret après !

### 2.5. Créer une application Live (pour la production)

**Attendez d'avoir testé en Sandbox avant de créer l'app Live !**

1. Allez dans **My Apps & Credentials**
2. Cliquez sur l'onglet **Live**
3. Cliquez sur **Create App**
4. Remplissez le formulaire :
   - **App Name** : `AthLink Production`
   - **Merchant** : Votre compte Business
5. Copiez le **Client ID** et le **Secret** Live

---

## 🔑 Étape 3 : Configurer les variables d'environnement {#étape-3}

### 3.1. Localement (fichier .env.local)

1. Ouvrez le fichier `.env.local` à la racine de votre projet
2. Ajoutez ces lignes :

```env
# PayPal Configuration (Sandbox pour les tests)
PAYPAL_CLIENT_ID=Ae...votre_client_id_sandbox_ici
PAYPAL_CLIENT_SECRET=EF...votre_secret_sandbox_ici
PAYPAL_MODE=sandbox
```

3. Sauvegardez le fichier
4. Redémarrez votre serveur de développement :
   ```bash
   # Arrêtez le serveur (Ctrl+C) puis relancez
   npm run dev
   ```

### 3.2. Sur Vercel (production)

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Sélectionnez votre projet AthLink
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez ces variables :

| Name | Value | Environment |
|------|-------|-------------|
| `PAYPAL_CLIENT_ID` | Votre Client ID Live | Production |
| `PAYPAL_CLIENT_SECRET` | Votre Secret Live | Production |
| `PAYPAL_MODE` | `live` | Production |

5. Cliquez sur **Save**
6. Redéployez votre application (Vercel le fera automatiquement)

### 3.3. Vérifier que les variables sont chargées

Ouvrez la console de votre serveur et vérifiez qu'il n'y a pas d'erreur au démarrage. Si vous voyez une erreur "Configuration PayPal manquante", vérifiez que les variables sont bien définies.

---

## 🔑 Étape 4 : Configurer le Webhook PayPal {#étape-4}

Le webhook permet à PayPal de notifier votre application quand un paiement est confirmé, pour envoyer automatiquement le PDF.

### 4.1. Obtenir l'URL de votre webhook

**En développement local :**
- Utilisez [ngrok](https://ngrok.com) ou [localtunnel](https://localtunnel.github.io/www/) pour exposer votre serveur local
- Exemple avec ngrok : `ngrok http 3000`
- Votre URL webhook sera : `https://votre-url-ngrok.ngrok.io/api/paypal/webhook`

**En production :**
- Votre URL webhook sera : `https://votre-domaine.com/api/paypal/webhook`
- Exemple : `https://athlink.vercel.app/api/paypal/webhook`

### 4.2. Configurer le webhook dans PayPal Developer

1. Allez sur [developer.paypal.com](https://developer.paypal.com)
2. **My Apps & Credentials** > Sélectionnez votre app (Sandbox ou Live)
3. Cliquez sur l'onglet **Webhooks**
4. Cliquez sur **Add Webhook**
5. Remplissez :
   - **Webhook URL** : `https://votre-domaine.com/api/paypal/webhook`
   - **Event types** : Sélectionnez :
     - ✅ `PAYMENT.CAPTURE.COMPLETED`
     - ✅ `PAYMENT.CAPTURE.DENIED`
6. Cliquez sur **Save**

### 4.3. Tester le webhook

1. PayPal vous donnera un **Webhook ID**
2. Vous pouvez tester le webhook en cliquant sur **Send test event**
3. Vérifiez les logs de votre serveur pour voir si l'événement est reçu

---

## 🔑 Étape 5 : Tester le système {#étape-5}

### 5.1. Tester en mode Sandbox

1. **Créer un compte de test** :
   - Allez dans [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/accounts)
   - Cliquez sur **Create Account** (Sandbox)
   - Créez un compte "Personal" pour simuler un client

2. **Tester le paiement** :
   - Allez sur votre site local
   - Naviguez vers une page de coaching avec un plan d'entraînement
   - Cliquez sur "Acheter"
   - Remplissez le formulaire
   - Vous serez redirigé vers PayPal Sandbox
   - Connectez-vous avec le compte de test créé
   - Complétez le paiement (utilisez une carte de test : `4111111111111111`)

3. **Vérifier l'envoi du PDF** :
   - Après le paiement, vérifiez l'email du client
   - Le PDF devrait être attaché automatiquement

### 5.2. Passer en mode Live

**⚠️ Ne passez en Live que quand tout fonctionne en Sandbox !**

1. Remplacez les clés API Sandbox par les clés Live dans `.env.local` :
   ```env
   PAYPAL_CLIENT_ID=votre_client_id_live
   PAYPAL_CLIENT_SECRET=votre_secret_live
   PAYPAL_MODE=live
   ```

2. Configurez le webhook Live avec votre URL de production

3. Testez avec un petit montant réel

---

## ⚠️ Notes importantes

- **Sans clés API** : Le système ne fonctionnera pas, vous aurez une erreur "Configuration PayPal manquante"
- **Sans webhook** : Le PDF ne sera pas envoyé automatiquement après paiement
- **Email PayPal du coach** : Chaque coach doit configurer son email PayPal dans son profil (Dashboard > Profile)
- **Frais PayPal** : PayPal prend une commission sur chaque transaction (environ 2.9% + 0.30€ en Europe)
- **Mode Sandbox** : Les paiements sont fictifs, parfait pour tester sans risque

---

## 🔍 Dépannage

### Erreur "Configuration PayPal manquante"
- ✅ Vérifiez que `PAYPAL_CLIENT_ID` et `PAYPAL_CLIENT_SECRET` sont définis dans `.env.local`
- ✅ Redémarrez votre serveur après avoir ajouté les variables
- ✅ Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs

### Le PDF n'est pas envoyé
- ✅ Vérifiez que le webhook est configuré correctement dans PayPal Developer
- ✅ Vérifiez les logs du serveur pour voir les événements PayPal reçus
- ✅ Vérifiez que `RESEND_API_KEY` est configuré
- ✅ Vérifiez que l'email du client est correct dans le formulaire

### Erreur "Coach non trouvé"
- ✅ Vérifiez que le `coachUsername` est correct
- ✅ Vérifiez que le coach a bien configuré son email PayPal dans son profil

### Erreur lors de la création de l'ordre PayPal
- ✅ Vérifiez que les clés API sont correctes
- ✅ Vérifiez que `PAYPAL_MODE` correspond (sandbox ou live)
- ✅ Vérifiez que le compte PayPal du coach est valide

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs de votre serveur (console)
2. Vérifiez les logs PayPal Developer Dashboard > Webhooks
3. Consultez la [documentation PayPal](https://developer.paypal.com/docs/)

