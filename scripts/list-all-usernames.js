/**
 * 📋 Lister tous les usernames dans la base de données
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listAllUsernames() {
  console.log('\n📋 LISTE DE TOUS LES USERNAMES\n')
  console.log('='.repeat(70))

  try {
    const profiles = await prisma.profile.findMany({
      select: {
        username: true,
        plan: true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        username: 'asc'
      }
    })

    console.log(`\n📊 Total : ${profiles.length} usernames\n`)

    profiles.forEach((profile, index) => {
      const num = String(index + 1).padStart(2, ' ')
      const username = profile.username.padEnd(30)
      const plan = profile.plan.padEnd(6)
      const email = profile.user.email
      
      console.log(`${num}. ${username} | ${plan} | ${email}`)
    })

    console.log('\n' + '='.repeat(70) + '\n')

  } catch (error) {
    console.error('\n❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

listAllUsernames()

