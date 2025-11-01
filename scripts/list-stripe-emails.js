/**
 * Script de diagnostic : Liste tous les emails des paiements Stripe
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function listStripeEmails() {
  console.log("============================================")
  console.log("📧 LISTE DES EMAILS DANS STRIPE")
  console.log("============================================\n")

  try {
    // Récupérer toutes les sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price']
    })

    console.log(`✅ ${sessions.data.length} sessions trouvées\n`)
    console.log("📧 EMAILS TROUVÉS :\n")

    const emailsFound = new Set()

    for (const session of sessions.data) {
      if (session.customer_email) {
        emailsFound.add(session.customer_email)
        
        const status = session.status === 'complete' ? '✅' : '⏳'
        const amount = session.amount_total ? `${session.amount_total / 100}€` : 'N/A'
        
        // Récupérer le Price ID si disponible
        let priceId = 'N/A'
        if (session.line_items?.data?.length > 0) {
          priceId = session.line_items.data[0].price?.id || 'N/A'
        }
        
        console.log(`${status} ${session.customer_email}`)
        console.log(`   Montant: ${amount}`)
        console.log(`   Status: ${session.status}`)
        console.log(`   Price ID: ${priceId}`)
        console.log(`   Date: ${new Date(session.created * 1000).toLocaleString('fr-FR')}`)
        console.log()
      }
    }

    console.log("\n============================================")
    console.log(`📊 TOTAL: ${emailsFound.size} email(s) unique(s)`)
    console.log("============================================\n")

    console.log("💡 Si 'llllolrdz@gmail.com' n'apparaît pas :")
    console.log("   1. Le paiement n'a peut-être pas été fait via Stripe Checkout")
    console.log("   2. L'email utilisé lors du paiement est peut-être différent")
    console.log("   3. Le paiement date de plus de 30 jours (limite Stripe API)\n")

  } catch (error) {
    console.error("\n❌ ERREUR:")
    console.error(error.message)
  }
}

listStripeEmails()

