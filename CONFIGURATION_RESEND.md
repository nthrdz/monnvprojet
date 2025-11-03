# Configuration RESEND pour les Emails

## 📧 Pourquoi RESEND ?

RESEND est utilisé pour envoyer les emails transactionnels d'Athlink :
- ✉️ Email de bienvenue après inscription
- 📩 Notifications de nouvelles demandes de coaching
- 🎉 Notifications de parrainage réussi (Programme Ambassadeur)

---

## 🔑 Étape 1 : Obtenir la clé API RESEND

### 1. Créer un compte RESEND

1. Va sur [https://resend.com](https://resend.com)
2. Clique sur **Sign Up** et crée ton compte
3. Vérifie ton email

### 2. Obtenir la clé API

1. Connecte-toi à [https://resend.com/](https://resend.com/)
2. Va dans **Settings** → **API Keys**
3. Clique sur **Create API Key**
4. Nomme-la "Athlink Production" (ou "Athlink Development")
5. **Copie la clé** (elle commence par `re_...`)

⚠️ **IMPORTANT** : Tu ne pourras voir la clé qu'une seule fois !

---

## 🌐 Étape 2 : Vérifier ton domaine (Optionnel mais recommandé)

Pour envoyer des emails depuis `@athlink.app` au lieu de `@resend.dev` :

### 1. Ajouter ton domaine

1. Dans Resend, va dans **Domains**
2. Clique sur **Add Domain**
3. Entre ton domaine : `athlink.app`
4. Clique sur **Add Domain**

### 2. Configurer les DNS

Resend va te donner des enregistrements DNS à ajouter :

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com

Type: CNAME  
Name: resend._domainkey.athlink.app
Value: resend._domainkey.resend.com
```

Va dans ton fournisseur DNS (ex: Vercel, Cloudflare, OVH) et ajoute ces enregistrements.

### 3. Vérifier le domaine

Attends quelques minutes (jusqu'à 48h) puis clique sur **Verify** dans Resend.

---

## ⚙️ Étape 3 : Configuration dans Athlink

### 1. Variables d'environnement locales

Crée ou modifie ton fichier `.env.local` :

```bash
# RESEND Email Configuration
RESEND_API_KEY=re_123abc456def789...
```

### 2. Variables d'environnement sur Vercel

1. Va sur [vercel.com](https://vercel.com)
2. Sélectionne ton projet **Athlink**
3. Va dans **Settings** → **Environment Variables**
4. Ajoute la variable :
   - **Name** : `RESEND_API_KEY`
   - **Value** : `re_123abc456def789...` (ta clé API)
   - **Environment** : Sélectionne **Production**, **Preview** et **Development**
5. Clique sur **Save**

### 3. Redéployer l'application

Sur Vercel, va dans **Deployments** et clique sur **Redeploy** pour prendre en compte la nouvelle variable.

---

## ✅ Étape 4 : Tester la configuration

### Test en local

1. Lance ton application en local :
```bash
npm run dev
```

2. Crée un nouveau compte sur `http://localhost:3000/signup`

3. Vérifie dans les logs de ton terminal :
```
✅ Email de bienvenue envoyé à: test@example.com
```

4. Vérifie dans ta boîte email que tu as reçu l'email de bienvenue

### Test en production

1. Va sur `https://athlink.app/signup`
2. Crée un compte de test
3. Vérifie que tu reçois l'email de bienvenue

---

## 📋 Fonctionnalités Email implémentées

### 1. Email de bienvenue (`sendWelcomeEmail`)

**Déclenché** : Après inscription réussie

**Template** : 
- Message de bienvenue personnalisé
- Prochaines étapes pour configurer son profil
- Lien vers le dashboard

**Fichier** : `lib/email.ts` → `sendWelcomeEmail()`

### 2. Notification de réservation coaching (`sendBookingNotification`)

**Déclenché** : Quand un client demande une réservation

**Template** :
- Informations du client (nom, email)
- Service demandé
- Message du client
- Lien vers le dashboard coaching

**Fichier** : `lib/email.ts` → `sendBookingNotification()`

### 3. Notification parrainage (`sendAffiliateSignupNotification`)

**Déclenché** : Quand un nouveau utilisateur s'inscrit via un lien de parrainage

**Template** :
- Félicitations pour le parrainage
- Montant de la commission
- Informations sur le nouveau membre
- Lien vers le dashboard d'affiliation

**Fichier** : `lib/email.ts` → `sendAffiliateSignupNotification()`

---

## 🔧 Personnalisation des emails

Les templates d'emails sont dans le fichier `lib/email.ts`.

Pour modifier un email :

1. Ouvre `lib/email.ts`
2. Trouve la fonction correspondante (ex: `sendWelcomeEmail`)
3. Modifie le contenu HTML dans la propriété `html`
4. Sauvegarde et teste

### Exemple de personnalisation :

```typescript
// Dans lib/email.ts
export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'Athlink <onboarding@athlink.app>', // ← Change l'expéditeur
    to,
    subject: '🎉 Bienvenue sur Athlink !', // ← Change le sujet
    html: `
      <div>
        <!-- Ton HTML personnalisé ici -->
      </div>
    `
  })
}
```

---

## 🐛 Dépannage

### Erreur : "Missing API key"

**Solution** : Vérifie que `RESEND_API_KEY` est bien configurée dans `.env.local` ou sur Vercel.

### Les emails ne sont pas reçus

**Causes possibles** :
1. ✉️ Vérifie ta boîte de SPAM
2. 🔑 Vérifie que la clé API est valide
3. 🌐 Vérifie que ton domaine est vérifié (si tu utilises un domaine custom)
4. 📊 Vérifie les logs dans Resend : https://resend.com/logs

### Emails reçus mais en spam

**Solution** : Configure SPF, DKIM et vérifie ton domaine sur Resend (voir Étape 2)

---

## 📊 Monitoring

### Dashboard Resend

Va sur https://resend.com/logs pour voir :
- ✅ Emails envoyés avec succès
- ❌ Emails échoués
- 📈 Statistiques d'envoi
- 🔍 Détails de chaque email

---

## 💡 Bonnes pratiques

1. **Utilise un domaine vérifié** pour éviter que tes emails finissent en spam
2. **Teste en développement** avant de déployer en production
3. **Ne bloque jamais l'inscription** si l'email échoue (c'est déjà fait dans le code)
4. **Surveille les logs Resend** pour détecter les problèmes rapidement

---

## 🆘 Support

- Documentation Resend : https://resend.com/docs
- Support Resend : https://resend.com/support
- Dashboard Athlink : `/dashboard`

---

✅ **Configuration terminée !** Tes emails sont maintenant opérationnels.

