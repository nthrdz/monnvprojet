# 📧 Configuration du Domaine Resend

## ❌ Problème Actuel

Resend en mode TEST (avec `onboarding@resend.dev`) ne permet d'envoyer des emails **QU'À** l'adresse email de ton compte Resend : `contact@athlink.fr`

**Erreur actuelle :**
```
statusCode: 403
message: 'Vous ne pouvez envoyer des emails de test qu'à votre propre adresse email (contact@athlink.fr)'
```

---

## ✅ Solution : Vérifier ton Domaine

### Étape 1 : Ajouter le domaine sur Resend

1. Va sur https://resend.com/domains
2. Clique sur **"Add Domain"**
3. Entre : `athlink.fr`
4. Clique sur **"Add"**

### Étape 2 : Configurer les DNS

Resend va te donner **3 enregistrements DNS** à ajouter. Tu dois aller chez ton registrar de domaine (là où tu as acheté athlink.fr) :

#### **Record 1 : SPF (TXT)**
```
Type: TXT
Name: @ (ou athlink.fr)
Value: v=spf1 include:_spf.resend.com ~all
```

#### **Record 2 : DKIM (TXT)**
```
Type: TXT
Name: resend._domainkey (ou resend._domainkey.athlink.fr)
Value: [Resend te donnera une longue chaîne]
```

#### **Record 3 : DMARC (TXT)**
```
Type: TXT
Name: _dmarc (ou _dmarc.athlink.fr)
Value: v=DMARC1; p=none;
```

### Étape 3 : Attendre la vérification

- La vérification peut prendre **de quelques minutes à 48h**
- Tu recevras un email de confirmation quand c'est prêt

### Étape 4 : Mettre à jour le code

Une fois le domaine vérifié, change l'email d'envoi dans **3 fichiers** :

#### **Fichier 1 : `/app/api/auth/forgot-password/route.ts`**

Ligne 89, change :
```typescript
from: 'Athlink <onboarding@resend.dev>',
```

En :
```typescript
from: 'Athlink <noreply@athlink.fr>',
```

#### **Fichier 2 : `/lib/email.ts`**

Ligne 8, change :
```typescript
from: 'Athlink <onboarding@resend.dev>',
```

En :
```typescript
from: 'Athlink <noreply@athlink.fr>',
```

Ligne 31, change :
```typescript
from: 'Athlink Coaching <coaching@resend.dev>',
```

En :
```typescript
from: 'Athlink Coaching <coaching@athlink.fr>',
```

Ligne 54, change :
```typescript
from: 'Athlink Programme Ambassadeur <affiliate@resend.dev>',
```

En :
```typescript
from: 'Athlink <noreply@athlink.fr>',
```

---

## 🧪 Test en Attendant

En attendant la vérification du domaine, tu peux tester avec le **lien direct** :

1. **Demande une réinitialisation** sur http://localhost:3002/forgot-password
2. **Regarde les logs** du serveur (terminal npm run dev)
3. **Cherche** la ligne qui commence par :
   ```
   🔗🔗🔗 LIEN DE RÉINITIALISATION 🔗🔗🔗
   http://localhost:3002/reset-password/XXXXX
   ```
4. **Copie ce lien** et ouvre-le dans ton navigateur
5. **Définis** un nouveau mot de passe
6. **Connecte-toi** avec ce nouveau mot de passe !

**Ou** crée un compte avec `contact@athlink.fr` et teste avec celui-ci (les emails arriveront).

---

## 📋 Checklist

- [ ] Domaine `athlink.fr` ajouté sur Resend
- [ ] 3 enregistrements DNS configurés (SPF, DKIM, DMARC)
- [ ] Domaine vérifié par Resend (email de confirmation reçu)
- [ ] Code mis à jour (`onboarding@resend.dev` → `noreply@athlink.fr`)
- [ ] Test réussi (envoi d'email à n'importe quelle adresse)

---

## 🔍 Vérifier le Statut

Pour vérifier si ton domaine est vérifié :
1. Va sur https://resend.com/domains
2. Regarde le statut à côté de `athlink.fr`
3. Si c'est **"Verified" ✅**, c'est bon !
4. Si c'est **"Pending" ⏳**, attends encore un peu

---

## 💡 Alternative : Mailgun / SendGrid

Si Resend pose problème, tu peux aussi utiliser :
- **Mailgun** (gratuit jusqu'à 5000 emails/mois)
- **SendGrid** (gratuit jusqu'à 100 emails/jour)
- **Amazon SES** (très bon marché)

Dis-moi si tu veux que je t'aide à configurer une alternative !

