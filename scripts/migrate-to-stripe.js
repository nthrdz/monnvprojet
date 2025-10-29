/**
 * Script de migration vers Stripe Connect
 * Exécuter avec: node scripts/migrate-to-stripe.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateToStripe() {
  console.log('🔄 Migration vers Stripe Connect...')
  console.log('=====================================\n')

  try {
    // 1. Nettoyer les anciennes données d'affiliation
    console.log('1. Nettoyage des anciennes données...')
    
    // Supprimer les commissions existantes
    await prisma.commission.deleteMany({})
    console.log('   ✅ Commissions supprimées')
    
    // Supprimer les parrainages existants
    await prisma.referral.deleteMany({})
    console.log('   ✅ Parrainages supprimés')
    
    // Supprimer les affiliés existants
    await prisma.affiliate.deleteMany({})
    console.log('   ✅ Anciens affiliés supprimés')

    // 2. Créer des données de test pour Stripe
    console.log('\n2. Création des données de test...')
    
    // Créer un utilisateur de test
    const testUser = await prisma.user.upsert({
      where: { email: 'test-affiliate@example.com' },
      update: {},
      create: {
        email: 'test-affiliate@example.com',
        name: 'Test Affiliate',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeGdXQz7Kz8Kz8Kz8' // test123
      }
    })
    
    // Créer un profil pour l'utilisateur de test
    await prisma.profile.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        username: 'test-affiliate',
        displayName: 'Test Affiliate',
        sport: 'RUNNING',
        plan: 'FREE'
      }
    })
    
    console.log('   ✅ Utilisateur de test créé')

    // 3. Afficher les instructions
    console.log('\n🎉 Migration terminée!')
    console.log('\n📋 Prochaines étapes :')
    console.log('1. Configurez vos variables d\'environnement Stripe')
    console.log('2. Exécutez la migration de base de données : npx prisma db push')
    console.log('3. Testez la création d\'un compte d\'affilié')
    console.log('4. Configurez les webhooks Stripe')
    
    console.log('\n🔗 Liens utiles :')
    console.log('- Dashboard Stripe : https://dashboard.stripe.com')
    console.log('- Documentation Stripe Connect : https://stripe.com/docs/connect')
    console.log('- Configuration webhooks : https://dashboard.stripe.com/webhooks')
    
    console.log('\n🧪 Test de l\'affiliation :')
    console.log('1. Allez sur http://localhost:3000/dashboard/affiliate/apply')
    console.log('2. Créez un compte d\'affilié')
    console.log('3. Suivez le processus Stripe Connect')
    console.log('4. Testez les liens de parrainage')

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
if (require.main === module) {
  migrateToStripe()
    .catch(console.error)
}

module.exports = { migrateToStripe }



