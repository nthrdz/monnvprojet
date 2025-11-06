/**
 * 🗑️ Supprimer un utilisateur de la base de données
 * 
 * Usage: node scripts/delete-user.js <email>
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function deleteUser(email) {
  console.log('\n🗑️  SUPPRESSION D\'UTILISATEUR\n')
  console.log('='.repeat(70))
  console.log(`\n📧 Email : ${email}\n`)

  try {
    // 1. Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        affiliate: true
      }
    })

    if (!user) {
      console.log('❌ Aucun utilisateur trouvé avec cet email.\n')
      return
    }

    console.log('✅ Utilisateur trouvé :')
    console.log(`   - ID: ${user.id}`)
    console.log(`   - Email: ${user.email}`)
    console.log(`   - Nom: ${user.name || 'Non renseigné'}`)
    
    if (user.profile) {
      console.log(`   - Username: ${user.profile.username}`)
      console.log(`   - Plan: ${user.profile.plan}`)
    }
    
    if (user.affiliate) {
      console.log(`   - Affilié: Oui (${user.affiliate.affiliateCode})`)
    }

    console.log('\n⚠️  ATTENTION : Cette action est IRRÉVERSIBLE !')
    console.log('    Toutes les données liées seront supprimées :')
    console.log('    - Profil')
    console.log('    - Liens personnalisés')
    console.log('    - Compétitions')
    console.log('    - Sponsors')
    console.log('    - Médias')
    console.log('    - Analytics')
    console.log('    - Données d\'affiliation')
    console.log('    - Sessions')
    console.log('')

    // Demander confirmation (simulation, on supprime directement en script)
    console.log('🗑️  Suppression en cours...\n')

    // Prisma gère automatiquement les suppressions en cascade grâce à onDelete: Cascade
    await prisma.user.delete({
      where: { email }
    })

    console.log('='.repeat(70))
    console.log('\n✅ Utilisateur supprimé avec succès !')
    console.log(`   Email : ${email}`)
    console.log(`   Toutes les données associées ont été supprimées.\n`)

  } catch (error) {
    console.error('\n❌ Erreur lors de la suppression:', error.message)
    
    if (error.code === 'P2025') {
      console.log('\n⚠️  L\'utilisateur n\'existe pas ou a déjà été supprimé.\n')
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Récupérer l'email depuis les arguments
const email = process.argv[2]

if (!email) {
  console.log('\n❌ Usage: node scripts/delete-user.js <email>')
  console.log('\nExemple:')
  console.log('  node scripts/delete-user.js contact@athlink.fr\n')
  process.exit(1)
}

deleteUser(email)
