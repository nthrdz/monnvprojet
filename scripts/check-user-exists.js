/**
 * 🔍 Vérifier si un utilisateur existe dans la base de données
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserExists(email) {
  console.log(`\n🔍 VÉRIFICATION DE L'EXISTENCE DE L'UTILISATEUR\n`)
  console.log('='.repeat(70))
  console.log(`\n📧 Email : ${email}\n`)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        affiliate: true,
        sessions: true
      }
    })

    if (!user) {
      console.log('✅ L\'utilisateur n\'existe PAS dans la base de données.')
      console.log('   Le compte a été correctement supprimé.\n')
      return
    }

    console.log('❌ L\'utilisateur existe ENCORE dans la base de données !')
    console.log(`   - ID: ${user.id}`)
    console.log(`   - Email: ${user.email}`)
    console.log(`   - Nom: ${user.name || 'Non renseigné'}`)
    
    if (user.profile) {
      console.log(`   - Profil: ${user.profile.username} (${user.profile.plan})`)
    }
    
    if (user.affiliate) {
      console.log(`   - Affilié: Oui (${user.affiliate.affiliateCode})`)
    }
    
    if (user.sessions && user.sessions.length > 0) {
      console.log(`   - Sessions actives: ${user.sessions.length}`)
    }
    
    console.log('')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }

  console.log('='.repeat(70) + '\n')
}

const email = process.argv[2] || 'contact@athlink.fr'
checkUserExists(email)

