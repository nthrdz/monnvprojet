/**
 * Script pour activer les plans des utilisateurs avec des abonnements en trial
 * Utile pour les abonnements créés avant l'activation du webhook
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')
const { PrismaClient } = require('@prisma/client')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

async function activateTrialSubscriptions() {
  console.log("============================================")
  console.log("🔄 ACTIVATION DES ABONNEMENTS EN TRIAL")
  console.log("============================================\n")

  try {
    // Récupérer tous les abonnements Stripe en mode "trialing"
    console.log("📋 Récupération des abonnements en trial...\n")
    
    const subscriptions = await stripe.subscriptions.list({
      status: 'trialing',
      limit: 100
    })

    console.log(`✅ ${subscriptions.data.length} abonnement(s) en trial trouvé(s)\n`)

    if (subscriptions.data.length === 0) {
      console.log("ℹ️  Aucun abonnement en trial à activer.")
      return
    }

    let activatedCount = 0
    let errorCount = 0

    for (const subscription of subscriptions.data) {
      console.log("─────────────────────────────────────────")
      console.log(`🔍 Abonnement: ${subscription.id}`)
      console.log(`   Customer: ${subscription.customer}`)
      console.log(`   Status: ${subscription.status}`)
      console.log(`   Trial End: ${subscription.trial_end ? new Date(subscription.trial_end * 1000).toLocaleString('fr-FR') : 'N/A'}`)

      try {
        // Récupérer le customer pour obtenir l'email
        const customer = await stripe.customers.retrieve(subscription.customer)
        const customerEmail = customer.email

        if (!customerEmail) {
          console.log(`   ⚠️ Pas d'email pour ce customer, ignoré`)
          errorCount++
          continue
        }

        console.log(`   Email: ${customerEmail}`)

        // Chercher l'utilisateur dans la DB
        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
          include: { profile: true }
        })

        if (!user || !user.profile) {
          console.log(`   ⚠️ Utilisateur non trouvé dans la DB, ignoré`)
          errorCount++
          continue
        }

        console.log(`   ✅ Utilisateur trouvé: ${user.profile.username}`)
        console.log(`   Plan actuel: ${user.profile.plan}`)

        // Identifier le plan par le Price ID
        const priceId = subscription.items.data[0]?.price?.id
        console.log(`   Price ID: ${priceId}`)

        const priceIdMapping = {
          [process.env.STRIPE_PRICE_ID_ELITE_MONTHLY || '']: 'ELITE',
          [process.env.STRIPE_PRICE_ID_ELITE_YEARLY || '']: 'ELITE',
          [process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '']: 'PRO',
          [process.env.STRIPE_PRICE_ID_PRO_YEARLY || '']: 'PRO',
        }

        const plan = priceId ? priceIdMapping[priceId] : undefined

        if (!plan) {
          console.log(`   ⚠️ Plan non identifié, ignoré`)
          errorCount++
          continue
        }

        console.log(`   🎯 Plan à activer: ${plan}`)

        // Vérifier si le plan est déjà activé
        if (user.profile.plan === plan) {
          console.log(`   ℹ️  Plan déjà activé, ignoré`)
          continue
        }

        // Mettre à jour le plan
        const stats = user.profile.stats || {}
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            plan: plan,
            stats: {
              ...stats,
              stripeCustomerId: subscription.customer,
              stripeSubscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              activatedAt: new Date().toISOString(),
              activatedBy: 'manual_script'
            }
          }
        })

        console.log(`   ✅✅✅ PLAN ACTIVÉ: ${user.profile.plan} → ${plan}`)
        activatedCount++

      } catch (error) {
        console.error(`   ❌ Erreur:`, error.message)
        errorCount++
      }
    }

    console.log("\n============================================")
    console.log("📊 RÉSUMÉ")
    console.log("============================================")
    console.log(`✅ Plans activés: ${activatedCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`📋 Total traité: ${subscriptions.data.length}`)
    console.log("============================================\n")

  } catch (error) {
    console.error("\n❌ ERREUR GLOBALE:")
    console.error(error.message)
    console.error(error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

activateTrialSubscriptions()

