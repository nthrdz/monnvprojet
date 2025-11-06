/**
 * 📊 Liste des clients et statistiques
 * 
 * Affiche le nombre total de clients et la répartition par plan
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getClientsStats() {
  console.log('\n📊 STATISTIQUES DES CLIENTS ATHLINK\n')
  console.log('='.repeat(70))

  try {
    // 1. Nombre total d'utilisateurs
    const totalUsers = await prisma.user.count()
    console.log(`\n👥 NOMBRE TOTAL D'UTILISATEURS : ${totalUsers}`)

    // 2. Nombre d'utilisateurs avec profil
    const usersWithProfile = await prisma.profile.count()
    console.log(`📝 Utilisateurs avec profil : ${usersWithProfile}`)

    // 3. Répartition par plan
    console.log('\n📈 RÉPARTITION PAR PLAN :')
    console.log('-'.repeat(70))

    const planStats = await prisma.profile.groupBy({
      by: ['plan'],
      _count: {
        plan: true
      }
    })

    let totalRevenueMensuel = 0

    for (const stat of planStats) {
      const plan = stat.plan
      const count = stat._count.plan
      let revenuPlan = 0

      if (plan === 'PRO') {
        revenuPlan = count * 9.90
      } else if (plan === 'ELITE') {
        revenuPlan = count * 25.90
      }

      totalRevenueMensuel += revenuPlan

      console.log(`   ${plan.padEnd(10)} : ${String(count).padStart(3)} clients   (${revenuPlan.toFixed(2)}€/mois)`)
    }

    console.log('-'.repeat(70))
    console.log(`   💰 REVENU MENSUEL TOTAL : ${totalRevenueMensuel.toFixed(2)}€/mois`)
    console.log(`   💰 REVENU ANNUEL ESTIMÉ : ${(totalRevenueMensuel * 12).toFixed(2)}€/an`)

    // 4. Liste des clients PRO et ELITE (payants)
    console.log('\n💎 CLIENTS PAYANTS (PRO + ELITE) :')
    console.log('-'.repeat(70))

    const payingClients = await prisma.profile.findMany({
      where: {
        plan: {
          in: ['PRO', 'ELITE']
        }
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\n📧 Total : ${payingClients.length} clients payants\n`)

    for (const client of payingClients) {
      const plan = client.plan.padEnd(6)
      const username = client.username.padEnd(20)
      const email = client.user.email.padEnd(30)
      const date = new Date(client.createdAt).toLocaleDateString('fr-FR')
      
      console.log(`   ${plan} | ${username} | ${email} | Inscrit le ${date}`)
    }

    // 5. Statistiques sur les affiliés
    console.log('\n\n🎁 STATISTIQUES D\'AFFILIATION :')
    console.log('-'.repeat(70))

    const totalAffiliates = await prisma.affiliate.count()
    const activeAffiliates = await prisma.affiliate.count({
      where: {
        status: 'APPROVED'
      }
    })

    console.log(`   Total affiliés : ${totalAffiliates}`)
    console.log(`   Affiliés actifs : ${activeAffiliates}`)

    // Nombre de conversions (Referrals)
    const totalReferrals = await prisma.referral.count()
    const convertedReferrals = await prisma.referral.count({
      where: {
        status: 'CONVERTED'
      }
    })

    console.log(`   Parrainages totaux : ${totalReferrals}`)
    console.log(`   Parrainages convertis : ${convertedReferrals}`)

    // Nombre de commissions
    const totalCommissionsCount = await prisma.commission.count()
    console.log(`   Commissions générées : ${totalCommissionsCount}`)

    // Montant total des commissions
    const commissions = await prisma.commission.findMany({
      select: {
        amount: true
      }
    })

    const totalCommissionsAmount = commissions.reduce((sum, c) => sum + c.amount, 0)
    console.log(`   Montant total commissions : ${totalCommissionsAmount.toFixed(2)}€`)

    // 6. Derniers clients inscrits
    console.log('\n\n🆕 DERNIERS CLIENTS INSCRITS (10 derniers) :')
    console.log('-'.repeat(70))

    const recentClients = await prisma.profile.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    for (const client of recentClients) {
      const plan = client.plan.padEnd(6)
      const username = client.username.padEnd(20)
      const email = client.user.email.padEnd(30)
      const date = new Date(client.createdAt).toLocaleDateString('fr-FR')
      const time = new Date(client.createdAt).toLocaleTimeString('fr-FR')
      
      console.log(`   ${plan} | ${username} | ${email} | ${date} ${time}`)
    }

    // 7. Statistiques Stripe
    console.log('\n\n💳 STATISTIQUES STRIPE :')
    console.log('-'.repeat(70))

    const profilesWithStripe = await prisma.profile.findMany({
      select: {
        stats: true,
        plan: true
      }
    })

    let clientsAvecStripe = 0
    let clientsAvecSubscription = 0

    for (const profile of profilesWithStripe) {
      const stats = profile.stats
      if (stats?.stripeCustomerId) {
        clientsAvecStripe++
      }
      if (stats?.stripeSubscriptionId) {
        clientsAvecSubscription++
      }
    }

    console.log(`   Clients avec Stripe Customer ID : ${clientsAvecStripe}`)
    console.log(`   Clients avec Stripe Subscription : ${clientsAvecSubscription}`)

    console.log('\n' + '='.repeat(70))
    console.log('\n✅ Statistiques générées avec succès !\n')

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getClientsStats()

