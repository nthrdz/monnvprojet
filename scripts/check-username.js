/**
 * 🔍 Vérifier si un username existe dans la base de données
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsername(username) {
  console.log(`\n🔍 VÉRIFICATION DU USERNAME\n`)
  console.log('='.repeat(70))
  console.log(`\n👤 Username : ${username}\n`)

  try {
    const profile = await prisma.profile.findUnique({
      where: { username: username },
      include: {
        user: true
      }
    })

    if (!profile) {
      console.log('✅ Le username n\'existe PAS dans la base de données.')
      console.log('   Il est disponible pour inscription.\n')
      return
    }

    console.log('❌ Le username existe ENCORE dans la base de données !')
    console.log(`   - Username: ${profile.username}`)
    console.log(`   - Plan: ${profile.plan}`)
    console.log(`   - User ID: ${profile.userId}`)
    
    if (profile.user) {
      console.log(`   - Email associé: ${profile.user.email}`)
      console.log(`   - Nom: ${profile.user.name || 'Non renseigné'}`)
    } else {
      console.log('   ⚠️  ORPHELIN : Profil sans utilisateur associé !')
    }
    
    console.log('')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }

  console.log('='.repeat(70) + '\n')
}

const username = process.argv[2]

if (!username) {
  console.log('\n❌ Usage: node scripts/check-username.js <username>')
  console.log('\nExemple:')
  console.log('  node scripts/check-username.js RODRIGUEZz\n')
  process.exit(1)
}

checkUsername(username)

