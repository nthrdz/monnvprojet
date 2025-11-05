# 🔐 Système de Réinitialisation de Mot de Passe

## ✅ Fonctionnalités Implémentées

- ✅ Lien "Mot de passe oublié ?" sur la page de connexion
- ✅ Page de demande de réinitialisation avec formulaire email
- ✅ Génération de token sécurisé (32 bytes hexadécimal)
- ✅ Expiration automatique des tokens (1 heure)
- ✅ Envoi d'emails via Resend avec template HTML professionnel
- ✅ Page de réinitialisation avec validation du token
- ✅ Validation des mots de passe (minimum 8 caractères, confirmation)
- ✅ Affichage de l'œil pour visualiser le mot de passe
- ✅ Messages de succès et d'erreur clairs
- ✅ Sécurité anti-énumération (même message même si email inconnu)

---

## 📋 Flux Utilisateur Complet

### 1️⃣ **Demande de réinitialisation**
```
/login → "Mot de passe oublié ?" → /forgot-password
```
- L'utilisateur entre son email
- Un token est généré et sauvegardé dans la DB
- Un email est envoyé avec un lien de réinitialisation
- Le lien expire dans 1 heure

### 2️⃣ **Réception de l'email**
L'utilisateur reçoit un email avec :
- Un bouton "Réinitialiser mon mot de passe"
- Le lien complet (si bouton ne fonctionne pas)
- L'avertissement d'expiration (1 heure)

### 3️⃣ **Définition du nouveau mot de passe**
```
Email → Clic sur lien → /reset-password/[token]
```
- Validation automatique du token
- Si invalide/expiré : message d'erreur + lien pour redemander
- Si valide : formulaire pour nouveau mot de passe
- Confirmation du mot de passe requise
- Visualisation du mot de passe avec icône œil

### 4️⃣ **Succès et reconnexion**
- Message de succès
- Redirection automatique vers /login après 3 secondes
- L'utilisateur peut se connecter avec son nouveau mot de passe

---

## 🗄️ Schéma Base de Données

### Champs ajoutés au modèle `User` :

```prisma
model User {
  // ... autres champs ...
  
  // Réinitialisation du mot de passe
  resetPasswordToken    String?   @unique
  resetPasswordExpires  DateTime?
}
```

### Migration SQL :
```sql
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
```

---

## 🔌 API Endpoints

### POST `/api/auth/forgot-password`
**Demander la réinitialisation du mot de passe**

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "Un email de réinitialisation a été envoyé"
}
```

**⚠️ Note Sécurité :** Renvoie toujours un succès même si l'email n'existe pas (anti-énumération)

---

### GET `/api/auth/reset-password?token=xxx`
**Valider un token de réinitialisation**

**Réponse si valide (200):**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Réponse si invalide (400):**
```json
{
  "valid": false,
  "error": "Token invalide"
}
```

---

### POST `/api/auth/reset-password`
**Réinitialiser le mot de passe avec un token**

**Body:**
```json
{
  "token": "abc123...",
  "password": "newPassword123"
}
```

**Réponse succès (200):**
```json
{
  "success": true,
  "message": "Mot de passe réinitialisé avec succès"
}
```

**Erreurs possibles:**
- `400` : Token invalide ou expiré
- `400` : Mot de passe trop court (< 8 caractères)
- `500` : Erreur serveur

---

## 📧 Configuration Resend

### Variables d'environnement requises :

```bash
# .env.local (développement) et Vercel (production)
RESEND_API_KEY=re_xxx
NEXTAUTH_URL=https://athlink.fr
```

### Domaine d'envoi :

Les emails sont envoyés depuis :
```
Athlink <onboarding@resend.dev>
```

⚠️ **En production**, configure un domaine personnalisé sur Resend :
1. Va sur https://resend.com/domains
2. Ajoute `athlink.fr`
3. Configure les enregistrements DNS (SPF, DKIM, DMARC)
4. Change `onboarding@resend.dev` en `noreply@athlink.fr` dans le code

---

## 🔒 Sécurité

### ✅ Mesures de sécurité implémentées :

1. **Tokens cryptographiques sécurisés**
   - 32 bytes générés avec `crypto.randomBytes()`
   - Impossible à deviner ou brute-forcer

2. **Expiration automatique (1 heure)**
   - Les tokens expirent après 60 minutes
   - Les tokens expirés sont supprimés de la DB

3. **Anti-énumération d'emails**
   - Même message de succès qu'un email existe ou non
   - Empêche de découvrir les emails inscrits

4. **Hachage des mots de passe**
   - Bcrypt avec salt de 10
   - Impossible de retrouver le mot de passe original

5. **Token à usage unique**
   - Le token est supprimé après utilisation
   - Ne peut pas être réutilisé

6. **HTTPS obligatoire en production**
   - Les liens de réinitialisation utilisent HTTPS
   - Protection contre l'interception

---

## 🧪 Comment Tester

### Test Local (développement) :

1. **Démarre le serveur** :
   ```bash
   npm run dev
   ```

2. **Va sur** http://localhost:3002/login

3. **Clique sur** "Mot de passe oublié ?"

4. **Entre un email** valide (qui existe dans ta DB)

5. **Vérifie dans les logs du serveur** :
   ```
   🔒 Demande de réinitialisation de mot de passe pour: xxx@xxx.com
   ✅ Token généré: abc123...
   ✅ Email de réinitialisation envoyé à: xxx@xxx.com
   ```

6. **Si Resend est configuré** : Tu recevras l'email

7. **Sinon**, copie le token des logs et va sur :
   ```
   http://localhost:3002/reset-password/[TOKEN]
   ```

8. **Entre un nouveau mot de passe** et confirme

9. **Connecte-toi** avec le nouveau mot de passe !

---

### Test en Production :

1. Va sur https://athlink.fr/login
2. Clique sur "Mot de passe oublié ?"
3. Entre ton email
4. Vérifie ta boîte mail (et les spams)
5. Clique sur le lien dans l'email
6. Définis ton nouveau mot de passe
7. Connecte-toi !

---

## 🐛 Dépannage

### ❌ "Email non envoyé"
**Cause :** `RESEND_API_KEY` non configurée

**Solution :**
1. Va sur https://resend.com/api-keys
2. Crée une API Key
3. Ajoute-la dans `.env.local` (local) et Vercel (production)

---

### ❌ "Token invalide ou expiré"
**Causes possibles :**
1. Le lien a plus d'1 heure (expiré)
2. Le token a déjà été utilisé
3. Le lien est mal copié-collé

**Solution :**
- Redemander un nouveau lien sur `/forgot-password`

---

### ❌ "Les mots de passe ne correspondent pas"
**Cause :** Les deux champs ne sont pas identiques

**Solution :**
- Vérifie que tu as bien saisi 2 fois le même mot de passe
- Utilise l'icône œil pour voir ce que tu tapes

---

### ❌ "Le mot de passe doit contenir au moins 8 caractères"
**Cause :** Mot de passe trop court

**Solution :**
- Utilise au moins 8 caractères
- Combine lettres, chiffres et caractères spéciaux

---

## 📝 Checklist de Déploiement

Avant de déployer en production, vérifie :

- [ ] `RESEND_API_KEY` configurée dans Vercel
- [ ] `NEXTAUTH_URL` correcte (`https://athlink.fr`)
- [ ] Migration Prisma exécutée (`resetPasswordToken` et `resetPasswordExpires` ajoutés)
- [ ] Domaine Resend configuré (optionnel mais recommandé)
- [ ] Test complet du flux (demande → email → réinitialisation → login)
- [ ] Webhook Stripe configuré avec `www.athlink.fr` (pour fix la redirection 307)

---

## 🎉 C'est Prêt !

Le système de réinitialisation de mot de passe est **100% fonctionnel** et prêt pour la production !

**Prochaines améliorations possibles :**
- [ ] Envoyer un email de confirmation après changement de mot de passe
- [ ] Ajouter un historique des tentatives de réinitialisation
- [ ] Rate limiting (limiter le nombre de demandes par email/IP)
- [ ] Authentification à deux facteurs (2FA)

---

**Créé le 5 novembre 2025**  
**Version 1.0**

