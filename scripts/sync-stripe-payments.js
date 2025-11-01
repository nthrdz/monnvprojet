/**
 * Script de synchronisation automatique des paiements Stripe
 * 
 * Ce script :
 * 1. Récupère tous les paiements réussis de Stripe
 * 2. Identifie les utilisateurs par email
 * 3. Met à jour automatiquement leur plan selon le Price ID payé
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const Stripe = require('stripe')

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Mapping Price ID → Plan
const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_ID_ELITE_MONTHLY]: { plan: 'ELITE', cycle: 'monthly' },
  [process.env.STRIPE_PRICE_ID_ELITE_YEARLY]: { plan: 'ELITE', cycle: 'yearly' },
  [process.env.STRIPE_PRICE_ID_PRO_MONTHLY]: { plan: 'PRO', cycle: 'monthly' },
  [process.env.STRIPE_PRICE_ID_PRO_YEARLY]: { plan: 'PRO', cycle: 'yearly' },
}

async function syncStripePayments() {
  console.log("============================================")
  console.log("🔄 SYNCHRONISATION DES PAIEMENTS STRIPE")
  console.log("============================================\n")

  try {
    // 1. Récupérer tous les checkout sessions réussis
    console.log("📥 Récupération des paiements Stripe...")
    
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price']
    })

    console.log(`✅ ${sessions.data.length} sessions trouvées\n`)

    let updated = 0
    let alreadyCorrect = 0
    let errors = 0
    let notFound = 0

    // 2. Pour chaque session
    for (const session of sessions.data) {
      // Ignorer les sessions non complétées
      if (session.status !== 'complete' || !session.customer_email) {
        continue
      }

      const email = session.customer_email
      const amountPaid = session.amount_total / 100
      
      // Récupérer le Price ID
      if (!session.line_items?.data?.length) continue
      
      const priceId = session.line_items.data[0].price?.id
      if (!priceId) continue

      const planInfo = PRICE_TO_PLAN[priceId]
      if (!planInfo) {
        console.log(`⚠️  ${email}: Price ID inconnu (${priceId})`)
        continue
      }

      const expectedPlan = planInfo.plan

      // 3. Trouver l'utilisateur dans la DB
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      })

      if (!user || !user.profile) {
        console.log(`❌ ${email}: Utilisateur non trouvé dans la DB`)
        notFound++
        continue
      }

      const currentPlan = user.profile.plan

      // 4. Vérifier si le plan est correct
      if (currentPlan === expectedPlan) {
        console.log(`✅ ${email}: Plan déjà correct (${currentPlan})`)
        alreadyCorrect++
        continue
      }

      // 5. Mettre à jour le plan
      console.log(`🔄 ${email}: ${currentPlan} → ${expectedPlan} (${amountPaid}€)`)
      
      await prisma.profile.update({
        where: { id: user.profile.id },
        data: {
          plan: expectedPlan,
          stats: {
            ...(user.profile.stats as any || {}),
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            lastSyncAt: new Date().toISOString(),
            syncedAmount: amountPaid,
            syncedPriceId: priceId
          }
        }
      })

      console.log(`   ✅ Plan mis à jour avec succès !`)
      updated++
    }

    // 6. Résumé
    console.log("\n============================================")
    console.log("📊 RÉSUMÉ DE LA SYNCHRONISATION")
    console.log("============================================")
    console.log(`✅ Plans mis à jour: ${updated}`)
    console.log(`✓  Plans déjà corrects: ${alreadyCorrect}`)
    console.log(`❌ Utilisateurs non trouvés: ${notFound}`)
    console.log(`⚠️  Erreurs: ${errors}`)
    console.log("============================================\n")

    if (updated > 0) {
      console.log("🎉 SYNCHRONISATION RÉUSSIE !")
      console.log("\n💡 Les utilisateurs doivent se déconnecter/reconnecter pour voir le changement.\n")
    } else {
      console.log("ℹ️  Aucune mise à jour nécessaire. Tous les plans sont déjà corrects.")
    }

  } catch (error) {
    console.error("\n❌ ERREUR lors de la synchronisation:")
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Lancer le script
syncStripePayments()

