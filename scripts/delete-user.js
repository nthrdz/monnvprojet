/**
 * Script pour supprimer un utilisateur et toutes ses données associées
 * Usage: node scripts/delete-user.js <email>
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const emailToDelete = process.argv[2] || 'nathanrdz834@gmail.com'

async function deleteUser(email) {
  console.log('\n🗑️  SUPPRESSION DE L\'UTILISATEUR')
  console.log('=' .repeat(60))
  console.log(`Email: ${email}`)
  console.log('=' .repeat(60))

  try {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            links: true,
            races: true,
            sponsors: true,
            media: true,
            analytics: true
          }
        }
      }
    })

    if (!user) {
      console.log('\n❌ Utilisateur non trouvé avec cet email.')
      return
    }

    console.log('\n📊 DONNÉES À SUPPRIMER:')
    console.log(`- Utilisateur: ${user.name || 'N/A'} (${user.email})`)
    
    if (user.profile) {
      console.log(`- Profil: @${user.profile.username}`)
      console.log(`- Liens: ${user.profile.links.length}`)
      console.log(`- Compétitions: ${user.profile.races.length}`)
      console.log(`- Sponsors: ${user.profile.sponsors.length}`)
      console.log(`- Médias: ${user.profile.media.length}`)
      console.log(`- Analytics: ${user.profile.analytics.length} entrées`)
    }

    // Confirmer la suppression
    console.log('\n⚠️  ATTENTION: Cette action est IRRÉVERSIBLE !')
    console.log('Toutes les données de cet utilisateur seront supprimées définitivement.')
    
    // En production, on demanderait confirmation, mais pour un script on continue
    console.log('\n🔄 Suppression en cours...')

    // Supprimer l'utilisateur (les cascades Prisma supprimeront automatiquement le reste)
    await prisma.user.delete({
      where: { email }
    })

    console.log('\n✅✅✅ UTILISATEUR SUPPRIMÉ AVEC SUCCÈS ✅✅✅')
    console.log(`L'utilisateur ${email} et toutes ses données ont été supprimés.`)
    console.log('\n')

  } catch (error) {
    console.error('\n❌ ERREUR lors de la suppression:', error)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la suppression
deleteUser(emailToDelete)

