# 📧 Configuration Resend pour les emails d'upgrade

## ✅ Ce qui a été fait

### **1. Templates d'emails créés**
- ✅ `lib/email-templates.ts` : Templates HTML professionnels pour PRO et ELITE
- ✅ Design moderne et responsive
- ✅ Avantages clairs et CTA (Call-To-Action) percutants

### **2. Script d'envoi automatique**
- ✅ `scripts/send-upgrade-emails.js` : Script pour envoyer des emails à tous les utilisateurs FREE
- ✅ Support pour PRO, ELITE ou les deux
- ✅ Rate limiting (500ms entre chaque email)
- ✅ Logs détaillés

---

## 🔧 Configuration de Resend (OBLIGATOIRE)

### **Étape 1 : Créer un compte Resend**

1. Va sur : https://resend.com/signup
2. Crée un compte gratuit (100 emails/jour gratuits)
3. Vérifie ton email

### **Étape 2 : Obtenir ta clé API**

1. Va sur : https://resend.com/api-keys
2. Clique sur **"Create API Key"**
3. Nom : `Athlink Production`
4. Permission : **"Sending access"**
5. Clique sur **"Create"**
6. **Copie ta clé** : `re_xxxxxxxxxxxxxxxxxxxx`

⚠️ **IMPORTANT** : Sauvegarde cette clé, tu ne pourras plus la voir après !

### **Étape 3 : Configurer le domaine d'envoi**

#### **Option A : Utiliser le domaine par défaut (test)**
- Tu peux envoyer depuis `noreply@resend.dev` (limité à 100 emails/jour)
- Parfait pour tester

#### **Option B : Utiliser ton domaine (recommandé pour la production)**

1. Va sur : https://resend.com/domains
2. Clique sur **"Add Domain"**
3. Entre : `athlink.fr`
4. Ajoute les enregistrements DNS fournis par Resend :

```
Type: TXT
Name: @
Value: [fourni par Resend]

Type: MX
Name: @
Value: [fourni par Resend]
Priority: 10

Type: TXT
Name: resend._domainkey
Value: [fourni par Resend]
```

5. Attends 5-10 minutes que les DNS se propagent
6. Clique sur **"Verify DNS Records"**

### **Étape 4 : Ajouter la clé dans `.env.local`**

Ouvre ton fichier `.env.local` et ajoute :

```bash
# 📧 RESEND - Envoi d'emails
# ============================================
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

⚠️ Remplace `re_xxxxxxxxxxxxxxxxxxxx` par ta vraie clé API.

### **Étape 5 : Ajouter la clé sur Vercel (Production)**

1. Va sur : https://vercel.com/dashboard
2. Clique sur ton projet **Athlink**
3. **Settings** → **Environment Variables**
4. **Add New** :
   - Name : `RESEND_API_KEY`
   - Value : `re_xxxxxxxxxxxxxxxxxxxx`
   - Environments : ✅ Production, ✅ Preview, ✅ Development
5. **Save**
6. **Redéploie** le projet

---

## 🧪 Tester l'envoi d'emails

### **Test 1 : Vérifier la configuration**

```bash
node scripts/send-upgrade-emails.js
```

Si `RESEND_API_KEY` n'est pas configurée, tu verras :

```
❌ ERREUR: RESEND_API_KEY n'est pas définie dans .env.local
```

Si c'est configuré, le script va s'exécuter.

### **Test 2 : Envoyer un email de test (uniquement à toi)**

Modifie temporairement le script pour n'envoyer qu'à ton email :

```bash
# Dans send-upgrade-emails.js, ligne ~110
# Change:
to: [profile.user.email],
# Par:
to: ['contact@athlink.fr'],  // Ton email
```

Puis exécute :

```bash
node scripts/send-upgrade-emails.js ELITE
```

Vérifie ta boîte email !

---

## 🚀 Lancer la campagne d'emails

### **Option 1 : Promouvoir uniquement ELITE**

```bash
node scripts/send-upgrade-emails.js ELITE
```

Envoie l'email ELITE à tous les utilisateurs FREE.

### **Option 2 : Promouvoir uniquement PRO**

```bash
node scripts/send-upgrade-emails.js PRO
```

### **Option 3 : Promouvoir les deux (PRO et ELITE)**

```bash
node scripts/send-upgrade-emails.js BOTH
```

Chaque utilisateur FREE recevra **2 emails** : un pour PRO, un pour ELITE.

---

## 📊 Résultat attendu

Après l'exécution, tu verras :

```
📧 ENVOI D'EMAILS D'UPGRADE AUX UTILISATEURS FREE

======================================================================

📊 Utilisateurs FREE trouvés : 15

📤 Plan(s) à promouvoir : ELITE

⏳ Envoi en cours...

✅ RODRIGUEZ (nathanrdz8314@gmail.com) - ELITE - Envoyé (abc123)
✅ pascal_gama (pascal_gama@yahoo.fr) - ELITE - Envoyé (def456)
...

======================================================================

📊 RÉSUMÉ

   Total utilisateurs FREE  : 15
   Emails envoyés          : 15
   Erreurs                 : 0

✅ Campagne d'emails terminée !
```

---

## 📧 Aperçu de l'email

### **Sujet** (ELITE)
```
👑 Deviens ELITE et gagne jusqu'à 40% de commission
```

### **Sujet** (PRO)
```
🚀 Débloque tout le potentiel de ton profil Athlink
```

### **Contenu**

L'email contient :
- ✅ Salutation personnalisée avec le username
- ✅ Présentation du plan (PRO ou ELITE)
- ✅ Prix affiché clairement
- ✅ Liste des avantages
- ✅ Bonus ELITE : système d'affiliation à 40%
- ✅ Témoignage client
- ✅ CTA (bouton) : "Passer ELITE maintenant"
- ✅ Garantie : paiement sécurisé, résiliable à tout moment

---

## 📈 Suivi des résultats

### **Dans Resend Dashboard**

1. Va sur : https://resend.com/emails
2. Tu verras tous les emails envoyés
3. Statuts possibles :
   - ✅ **Delivered** : Email livré
   - ⏳ **Queued** : En cours d'envoi
   - ❌ **Bounced** : Email invalide
   - 📖 **Opened** : Email ouvert (si tracking activé)
   - 🖱️ **Clicked** : Lien cliqué (si tracking activé)

### **Dans Stripe Dashboard**

1. Va sur : https://dashboard.stripe.com
2. **Customers** → Regarde les nouveaux clients
3. Si un utilisateur upgrade, tu verras son paiement

---

## 🎯 Optimisations futures

### **1. Segmentation des emails**

Envoyer des emails différents selon :
- Date d'inscription (nouveaux vs anciens)
- Sport pratiqué (running, cyclisme, etc.)
- Niveau d'engagement (profil complété ou non)

### **2. Séquence d'emails**

Au lieu d'un seul email, créer une séquence :
- **Jour 0** : Email de bienvenue
- **Jour 3** : Email d'upgrade (PRO)
- **Jour 7** : Email d'upgrade (ELITE + affiliation)
- **Jour 14** : Email de réengagement

### **3. A/B Testing**

Tester différentes versions :
- Sujets différents
- Ordre des avantages
- Prix mis en avant ou non
- Couleurs du CTA

### **4. Code promo exclusif**

Ajouter un code promo dans l'email :
```
🎁 CODE : UPGRADE20 (-20% le premier mois)
```

---

## ⚠️ Bonnes pratiques

### **À FAIRE ✅**

- ✅ Tester l'email sur ton propre email d'abord
- ✅ Vérifier que tous les liens fonctionnent
- ✅ Envoyer pendant les heures ouvrables (9h-18h)
- ✅ Respecter un délai entre les emails (500ms minimum)
- ✅ Ne pas spammer (1 email par semaine maximum)

### **À ÉVITER ❌**

- ❌ Envoyer à 3h du matin
- ❌ Envoyer plusieurs emails par jour
- ❌ Utiliser des mots spam ("GRATUIT", "GAGNEZ", etc.)
- ❌ Oublier le lien de désinscription

---

## 🚀 Checklist avant l'envoi

- [ ] `RESEND_API_KEY` configurée dans `.env.local`
- [ ] `RESEND_API_KEY` configurée sur Vercel
- [ ] Domaine vérifié sur Resend (ou utiliser resend.dev)
- [ ] Email de test envoyé et reçu
- [ ] Tous les liens testés et fonctionnels
- [ ] CTA redirige vers `/dashboard/upgrade`
- [ ] Script exécuté en local avec succès
- [ ] Heure d'envoi : entre 9h et 18h
- [ ] Sauvegarde de la liste des destinataires

---

## 📞 Support

Si tu rencontres un problème :

1. **Resend Support** : https://resend.com/support
2. **Documentation Resend** : https://resend.com/docs
3. **Logs Resend** : https://resend.com/emails

---

**🎉 Une fois configuré, tu pourras relancer facilement tes utilisateurs FREE pour les convertir en clients payants !**

