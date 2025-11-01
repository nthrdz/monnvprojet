/**
 * Script de vérification complète de TOUS les paiements Stripe
 * Vérifie : Charges, Payment Intents, Checkout Sessions
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function checkAllPayments() {
  console.log("============================================")
  console.log("🔍 VÉRIFICATION COMPLÈTE DES PAIEMENTS")
  console.log("============================================\n")

  const targetEmail = 'llllolrdz@gmail.com'

  try {
    console.log(`🎯 Recherche de paiements pour: ${targetEmail}\n`)

    // 1. Vérifier les Charges (paiements directs)
    console.log("📋 1. VÉRIFICATION DES CHARGES (Payments)...\n")
    
    const charges = await stripe.charges.list({
      limit: 100
    })

    console.log(`✅ ${charges.data.length} charges trouvées\n`)

    let foundInCharges = false
    for (const charge of charges.data) {
      if (charge.billing_details?.email === targetEmail || 
          charge.receipt_email === targetEmail) {
        foundInCharges = true
        const status = charge.paid ? '✅ PAYÉ' : '❌ NON PAYÉ'
        console.log(`${status} ${charge.billing_details?.email || charge.receipt_email}`)
        console.log(`   Montant: ${charge.amount / 100}€`)
        console.log(`   Status: ${charge.status}`)
        console.log(`   Paid: ${charge.paid ? 'OUI ✅' : 'NON ❌'}`)
        console.log(`   ID: ${charge.id}`)
        console.log(`   Date: ${new Date(charge.created * 1000).toLocaleString('fr-FR')}`)
        console.log()
      }
    }

    if (!foundInCharges) {
      console.log(`❌ Aucun charge trouvé pour ${targetEmail}\n`)
    }

    // 2. Vérifier les Payment Intents
    console.log("📋 2. VÉRIFICATION DES PAYMENT INTENTS...\n")
    
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100
    })

    console.log(`✅ ${paymentIntents.data.length} payment intents trouvés\n`)

    let foundInPI = false
    for (const pi of paymentIntents.data) {
      if (pi.receipt_email === targetEmail) {
        foundInPI = true
        const status = pi.status === 'succeeded' ? '✅ RÉUSSI' : `⏳ ${pi.status.toUpperCase()}`
        console.log(`${status} ${pi.receipt_email}`)
        console.log(`   Montant: ${pi.amount / 100}€`)
        console.log(`   Status: ${pi.status}`)
        console.log(`   ID: ${pi.id}`)
        console.log(`   Date: ${new Date(pi.created * 1000).toLocaleString('fr-FR')}`)
        if (pi.metadata) {
          console.log(`   Metadata:`, pi.metadata)
        }
        console.log()
      }
    }

    if (!foundInPI) {
      console.log(`❌ Aucun payment intent trouvé pour ${targetEmail}\n`)
    }

    // 3. Vérifier les Customers
    console.log("📋 3. VÉRIFICATION DES CUSTOMERS...\n")
    
    const customers = await stripe.customers.list({
      email: targetEmail,
      limit: 10
    })

    console.log(`✅ ${customers.data.length} customer(s) trouvé(s)\n`)

    for (const customer of customers.data) {
      console.log(`👤 Customer: ${customer.email}`)
      console.log(`   ID: ${customer.id}`)
      console.log(`   Créé: ${new Date(customer.created * 1000).toLocaleString('fr-FR')}`)
      
      // Récupérer les abonnements du customer
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10
      })
      
      if (subscriptions.data.length > 0) {
        console.log(`   Abonnements: ${subscriptions.data.length}`)
        for (const sub of subscriptions.data) {
          console.log(`      - ${sub.id}: ${sub.status}`)
          console.log(`        Items:`, sub.items.data.map(i => i.price.id).join(', '))
        }
      } else {
        console.log(`   Abonnements: Aucun`)
      }
      console.log()
    }

    if (customers.data.length === 0) {
      console.log(`❌ Aucun customer trouvé pour ${targetEmail}\n`)
    }

    // 4. Vérifier les Checkout Sessions (déjà fait mais on refait pour être complet)
    console.log("📋 4. VÉRIFICATION DES CHECKOUT SESSIONS...\n")
    
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price']
    })

    console.log(`✅ ${sessions.data.length} sessions trouvées\n`)

    let foundInSessions = false
    for (const session of sessions.data) {
      if (session.customer_email === targetEmail) {
        foundInSessions = true
        const statusIcon = session.status === 'complete' ? '✅' : '⏳'
        console.log(`${statusIcon} ${session.customer_email}`)
        console.log(`   Montant: ${session.amount_total ? session.amount_total / 100 : 0}€`)
        console.log(`   Status: ${session.status}`)
        console.log(`   Payment Status: ${session.payment_status}`)
        console.log(`   ID: ${session.id}`)
        console.log(`   Date: ${new Date(session.created * 1000).toLocaleString('fr-FR')}`)
        if (session.line_items?.data?.[0]?.price?.id) {
          console.log(`   Price ID: ${session.line_items.data[0].price.id}`)
        }
        console.log()
      }
    }

    if (!foundInSessions) {
      console.log(`❌ Aucune session trouvée pour ${targetEmail}\n`)
    }

    // Résumé
    console.log("============================================")
    console.log("📊 RÉSUMÉ")
    console.log("============================================")
    console.log(`Charges: ${foundInCharges ? '✅ Trouvé' : '❌ Rien'}`)
    console.log(`Payment Intents: ${foundInPI ? '✅ Trouvé' : '❌ Rien'}`)
    console.log(`Customers: ${customers.data.length > 0 ? '✅ Trouvé' : '❌ Rien'}`)
    console.log(`Checkout Sessions: ${foundInSessions ? '✅ Trouvé' : '❌ Rien'}`)
    console.log("============================================\n")

    if (!foundInCharges && !foundInPI && customers.data.length === 0 && !foundInSessions) {
      console.log("⚠️  AUCUN PAIEMENT TROUVÉ POUR CET EMAIL !")
      console.log("\n💡 Vérifiez :")
      console.log("   1. L'email est-il correct ? (vérifiez les espaces)")
      console.log("   2. Le paiement a-t-il été fait sur ce compte Stripe ?")
      console.log("   3. Le paiement date-t-il de moins de 90 jours ?")
    }

  } catch (error) {
    console.error("\n❌ ERREUR:")
    console.error(error.message)
  }
}

checkAllPayments()

