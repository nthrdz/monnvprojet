# Système d'Affiliation - AthLink

## Vue d'ensemble

Le système d'affiliation d'AthLink permet aux utilisateurs de devenir des ambassadeurs et de gagner des commissions en parrainant de nouveaux utilisateurs vers la plateforme.

## Fonctionnalités

### Pour les Ambassadeurs
- **Demande d'affiliation** : Les utilisateurs peuvent postuler pour devenir ambassadeurs
- **Code de parrainage unique** : Chaque ambassadeur reçoit un code unique (ex: AMB123456)
- **Liens de parrainage** : Génération automatique de liens de parrainage personnalisés
- **Dashboard complet** : Suivi des parrainages, conversions et commissions en temps réel
- **Système de commissions** : Gain de commissions sur chaque conversion (10% par défaut)
- **Paiements** : Support des virements bancaires et PayPal

### Pour l'Administration
- **Gestion des candidatures** : Approbation/suspension des ambassadeurs
- **Panneau d'administration** : Vue d'ensemble de tous les ambassadeurs
- **Statistiques détaillées** : Suivi des performances et des paiements
- **Gestion des commissions** : Validation et paiement des commissions

## Architecture Technique

### Base de Données

#### Tables Principales
- **Affiliate** : Informations des ambassadeurs
- **Referral** : Parrainages et conversions
- **Commission** : Commissions et paiements

#### Enums
- `AffiliateStatus` : PENDING, APPROVED, SUSPENDED
- `ReferralStatus` : PENDING, CONVERTED, EXPIRED
- `ConversionType` : SIGNUP, UPGRADE, PAYMENT
- `CommissionType` : REFERRAL, BONUS, MANUAL
- `CommissionStatus` : PENDING, PAID, CANCELLED

### APIs

#### Endpoints Principaux
- `POST /api/affiliate/apply` : Candidature d'affiliation
- `GET /api/affiliate/dashboard` : Dashboard ambassadeur
- `POST /api/affiliate/track` : Tracking des parrainages
- `POST /api/affiliate/convert` : Conversion des parrainages
- `GET /api/admin/affiliates` : Gestion des ambassadeurs (admin)
- `PATCH /api/admin/affiliates` : Mise à jour des ambassadeurs (admin)

### Composants Frontend

#### Pages
- `/dashboard/affiliate` : Dashboard principal des ambassadeurs
- `/dashboard/affiliate/apply` : Page de candidature
- `/dashboard/admin/affiliates` : Panneau d'administration

#### Composants
- `AffiliateTracker` : Tracking automatique des parrainages
- `GlassStats` : Affichage des statistiques
- `PromoCodeField` : Champ de code de parrainage

## Installation et Configuration

### 1. Migration de la Base de Données

Exécutez le script de migration dans votre base de données Supabase :

```sql
-- Exécuter le contenu de deployment/database/affiliate-migration.sql
```

### 2. Variables d'Environnement

Aucune variable d'environnement supplémentaire n'est requise. Le système utilise les variables existantes.

### 3. Déploiement

Le système est prêt à être déployé avec le reste de l'application.

## Utilisation

### Pour les Utilisateurs

#### Devenir Ambassadeur
1. Se connecter à son compte
2. Aller dans "Ambassadeur" dans le menu
3. Cliquer sur "Devenir ambassadeur"
4. Remplir le formulaire de candidature
5. Attendre l'approbation (24-48h)

#### Parrainer des Utilisateurs
1. Une fois approuvé, récupérer son code de parrainage
2. Partager le lien : `https://votre-site.com?ref=VOTRE_CODE`
3. Ou partager directement le code : `VOTRE_CODE`

#### Suivre ses Performances
1. Aller dans le dashboard "Ambassadeur"
2. Consulter les statistiques en temps réel
3. Voir l'historique des parrainages et commissions

### Pour les Administrateurs

#### Gérer les Ambassadeurs
1. Aller dans `/dashboard/admin/affiliates`
2. Voir la liste de tous les ambassadeurs
3. Approuver/suspendre selon les besoins
4. Consulter les statistiques détaillées

#### Payer les Commissions
1. Les commissions sont automatiquement calculées
2. Utiliser le panneau d'administration pour marquer comme payées
3. Les paiements peuvent être effectués via virement ou PayPal

## Flux de Parrainage

### 1. Tracking Initial
```
Utilisateur clique sur lien de parrainage
↓
AffiliateTracker détecte le paramètre ?ref=CODE
↓
POST /api/affiliate/track avec données de tracking
↓
Création d'un enregistrement Referral (statut PENDING)
```

### 2. Inscription
```
Utilisateur s'inscrit avec code de parrainage
↓
POST /api/auth/signup avec referralCode
↓
Vérification du code et de l'affilié
↓
Création du compte utilisateur
↓
POST /api/affiliate/convert pour marquer comme converti
↓
Calcul et attribution de la commission
```

### 3. Conversion
```
Parrainage marqué comme CONVERTED
↓
Mise à jour des statistiques de l'affilié
↓
Création d'une commission (statut PENDING)
↓
Notification à l'ambassadeur (optionnel)
```

## Personnalisation

### Taux de Commission
Modifier le taux par défaut dans le schéma Prisma :
```prisma
commissionRate Float @default(0.10) // 10% par défaut
```

### Types de Conversion
Ajouter de nouveaux types dans l'enum :
```prisma
enum ConversionType {
  SIGNUP
  UPGRADE
  PAYMENT
  // Ajouter d'autres types
}
```

### Conditions d'Approbation
Modifier la logique dans `/api/admin/affiliates/route.ts` pour ajouter des conditions d'approbation automatique.

## Monitoring et Analytics

### Métriques Clés
- Nombre total d'ambassadeurs
- Taux de conversion des parrainages
- Montant total des commissions payées
- Performance par ambassadeur

### Logs Importants
- Candidatures d'affiliation
- Conversions de parrainages
- Paiements de commissions
- Erreurs de tracking

## Sécurité

### Row Level Security (RLS)
- Les utilisateurs ne peuvent voir que leurs propres données d'affiliation
- Les admins ont accès à toutes les données
- Les parrainages sont protégés par les relations

### Validation
- Validation des codes de parrainage
- Vérification des statuts d'affiliés
- Protection contre les conversions multiples

## Support et Maintenance

### Tâches Régulières
1. Vérifier les candidatures en attente
2. Valider les conversions suspectes
3. Payer les commissions en attente
4. Nettoyer les parrainages expirés

### Dépannage
- Vérifier les logs de tracking
- Contrôler les statuts des affiliés
- Valider les calculs de commissions
- Tester les liens de parrainage

## Évolutions Futures

### Fonctionnalités Possibles
- Système de niveaux d'ambassadeurs
- Bonus de performance
- Intégration avec des plateformes de paiement
- API publique pour les partenaires
- Tableau de bord avancé avec graphiques
- Notifications push pour les conversions
- Système de récompenses gamifié

### Optimisations
- Cache des statistiques
- Indexation avancée
- Compression des données de tracking
- CDN pour les liens de parrainage
