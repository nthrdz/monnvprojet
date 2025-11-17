/**
 * 📊 Liste tous les utilisateurs avec leur abonnement
 * 
 * Affiche le nombre total d'utilisateurs et la liste complète avec leur plan
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsersWithPlans() {
  console.log('\n📊 LISTE DES UTILISATEURS ET LEURS ABONNEMENTS\n')
  console.log('='.repeat(80))

  try {
    // Récupérer tous les profils avec leurs utilisateurs
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Statistiques par plan
    const planCounts = {
      FREE: 0,
      PRO: 0,
      ELITE: 0
    }

    profiles.forEach(profile => {
      planCounts[profile.plan] = (planCounts[profile.plan] || 0) + 1
    })

    // Afficher les statistiques
    console.log('\n📈 RÉPARTITION PAR PLAN :')
    console.log('-'.repeat(80))
    console.log(`   FREE  : ${String(planCounts.FREE).padStart(3)} utilisateurs`)
    console.log(`   PRO   : ${String(planCounts.PRO).padStart(3)} utilisateurs`)
    console.log(`   ELITE : ${String(planCounts.ELITE).padStart(3)} utilisateurs`)
    console.log('-'.repeat(80))
    console.log(`   TOTAL : ${String(profiles.length).padStart(3)} utilisateurs`)
    console.log('')

    // Afficher la liste complète
    console.log('\n👥 LISTE COMPLÈTE DES UTILISATEURS :')
    console.log('-'.repeat(80))
    console.log('Plan   | Username              | Email                              | Date inscription')
    console.log('-'.repeat(80))

    for (const profile of profiles) {
      const plan = profile.plan.padEnd(6)
      const username = (profile.username || 'N/A').padEnd(22)
      const email = (profile.user.email || 'N/A').padEnd(35)
      const date = new Date(profile.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      
      console.log(`${plan} | ${username} | ${email} | ${date}`)
    }

    console.log('-'.repeat(80))
    console.log(`\n✅ Total : ${profiles.length} utilisateurs\n`)

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des utilisateurs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsersWithPlans()

