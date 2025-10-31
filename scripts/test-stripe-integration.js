// Script de test complet de l'intégration Stripe
require('dotenv').config({ path: '.env.local' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

console.log('\n' + '='.repeat(70))
console.log('🔍 TEST COMPLET DE L\'INTÉGRATION STRIPE')
console.log('='.repeat(70) + '\n')

async function testStripeIntegration() {
  let allTests = []

  // Test 1 : Vérifier la connexion Stripe
  console.log('📌 TEST 1 : Connexion à Stripe')
  try {
    const account = await stripe.accounts.retrieve()
    console.log('✅ Connecté à Stripe avec succès')
    console.log(`   - Account ID: ${account.id}`)
    console.log(`   - Mode: ${process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`)
    allTests.push({ name: 'Connexion Stripe', status: 'OK' })
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message)
    allTests.push({ name: 'Connexion Stripe', status: 'ERREUR' })
    return
  }

  console.log('\n' + '-'.repeat(70) + '\n')

  // Test 2 : Vérifier tous les Price IDs
  console.log('📌 TEST 2 : Vérification des Price IDs')
  
  const priceIds = [
    { name: 'PRO MONTHLY', env: 'STRIPE_PRICE_ID_PRO_MONTHLY', expectedAmount: 990 },
    { name: 'ELITE MONTHLY', env: 'STRIPE_PRICE_ID_ELITE_MONTHLY', expectedAmount: 2590 },
    { name: 'PRO YEARLY', env: 'STRIPE_PRICE_ID_PRO_YEARLY', expectedAmount: 25900 },
    { name: 'ELITE YEARLY', env: 'STRIPE_PRICE_ID_ELITE_YEARLY', expectedAmount: 9900 }
  ]

  let allPricesValid = true

  for (const priceConfig of priceIds) {
    const priceId = process.env[priceConfig.env]
    
    if (!priceId) {
      console.log(`❌ ${priceConfig.name} : Variable ${priceConfig.env} non configurée`)
      allPricesValid = false
      continue
    }

    try {
      const price = await stripe.prices.retrieve(priceId)
      const amount = price.unit_amount
      const interval = price.recurring?.interval || 'N/A'
      
      console.log(`✅ ${priceConfig.name}`)
      console.log(`   - Price ID: ${priceId}`)
      console.log(`   - Montant: ${amount / 100}€`)
      console.log(`   - Intervalle: ${interval}`)
      console.log(`   - Actif: ${price.active ? 'Oui' : 'Non'}`)
      
      if (!price.active) {
        console.log(`   ⚠️  ATTENTION: Ce prix est désactivé !`)
        allPricesValid = false
      }
    } catch (error) {
      console.log(`❌ ${priceConfig.name} : ${error.message}`)
      allPricesValid = false
    }
  }

  allTests.push({ name: 'Price IDs', status: allPricesValid ? 'OK' : 'ERREUR' })

  console.log('\n' + '-'.repeat(70) + '\n')

  // Test 3 : Vérifier le webhook
  console.log('📌 TEST 3 : Vérification du Webhook')
  
  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 })
    
    if (webhooks.data.length === 0) {
      console.log('❌ Aucun webhook configuré')
      console.log('   → Créez un webhook sur: https://dashboard.stripe.com/webhooks')
      allTests.push({ name: 'Webhook', status: 'MANQUANT' })
    } else {
      console.log(`✅ ${webhooks.data.length} webhook(s) trouvé(s)`)
      
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
      const matchingWebhook = webhooks.data.find(w => w.secret === webhookSecret)
      
      if (matchingWebhook) {
        console.log('✅ Webhook Secret valide')
        console.log(`   - URL: ${matchingWebhook.url}`)
        console.log(`   - Status: ${matchingWebhook.status}`)
        console.log(`   - Événements: ${matchingWebhook.enabled_events.length}`)
        
        // Vérifier les événements requis
        const requiredEvents = [
          'checkout.session.completed',
          'invoice.payment_succeeded',
          'customer.subscription.deleted'
        ]
        
        const missingEvents = requiredEvents.filter(
          event => !matchingWebhook.enabled_events.includes(event)
        )
        
        if (missingEvents.length > 0) {
          console.log('⚠️  ATTENTION: Il manque des événements:')
          missingEvents.forEach(event => console.log(`   - ${event}`))
          allTests.push({ name: 'Webhook', status: 'INCOMPLET' })
        } else {
          console.log('✅ Tous les événements requis sont configurés')
          allTests.push({ name: 'Webhook', status: 'OK' })
        }
        
        // Vérifier l'URL
        if (!matchingWebhook.url.includes('/api/stripe/webhook')) {
          console.log('⚠️  ATTENTION: L\'URL du webhook semble incorrecte')
          console.log(`   Actuel: ${matchingWebhook.url}`)
          console.log(`   Attendu: .../api/stripe/webhook`)
        }
      } else {
        console.log('❌ Le STRIPE_WEBHOOK_SECRET ne correspond à aucun webhook')
        console.log('   → Vérifiez votre secret sur: https://dashboard.stripe.com/webhooks')
        allTests.push({ name: 'Webhook', status: 'INVALIDE' })
      }
    }
  } catch (error) {
    console.log('❌ Erreur lors de la vérification du webhook:', error.message)
    allTests.push({ name: 'Webhook', status: 'ERREUR' })
  }

  console.log('\n' + '-'.repeat(70) + '\n')

  // Test 4 : Simuler la création d'une session Checkout
  console.log('📌 TEST 4 : Simulation de création de session Checkout')
  
  try {
    const testEmail = 'test@example.com'
    const testPriceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY
    
    if (!testPriceId) {
      console.log('❌ STRIPE_PRICE_ID_PRO_MONTHLY non configuré')
      allTests.push({ name: 'Session Checkout', status: 'SKIP' })
    } else {
      console.log('🔄 Tentative de création d\'une session de test...')
      
      const session = await stripe.checkout.sessions.create({
        customer_email: testEmail,
        line_items: [{ price: testPriceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/upgrade?canceled=true`,
        metadata: {
          userId: 'test-user-id',
          plan: 'PRO',
          billingCycle: 'monthly'
        }
      })
      
      console.log('✅ Session Checkout créée avec succès')
      console.log(`   - Session ID: ${session.id}`)
      console.log(`   - URL: ${session.url}`)
      console.log(`   ⚠️  Session de test créée (non facturée)`)
      allTests.push({ name: 'Session Checkout', status: 'OK' })
      
      // Nettoyer la session de test
      try {
        await stripe.checkout.sessions.expire(session.id)
        console.log('   ✅ Session de test expirée')
      } catch (err) {
        // Ignore les erreurs d'expiration
      }
    }
  } catch (error) {
    console.log('❌ Erreur lors de la création de session:', error.message)
    console.log(`   Type: ${error.type}`)
    console.log(`   Code: ${error.code}`)
    allTests.push({ name: 'Session Checkout', status: 'ERREUR' })
  }

  console.log('\n' + '='.repeat(70) + '\n')

  // Résumé
  console.log('📊 RÉSUMÉ DES TESTS\n')
  
  allTests.forEach(test => {
    const emoji = test.status === 'OK' ? '✅' : 
                  test.status === 'SKIP' ? '⏭️ ' :
                  test.status === 'INCOMPLET' ? '⚠️ ' : '❌'
    console.log(`${emoji} ${test.name}: ${test.status}`)
  })

  const allOk = allTests.every(t => t.status === 'OK' || t.status === 'SKIP')
  
  console.log('\n' + '='.repeat(70) + '\n')
  
  if (allOk) {
    console.log('🎉 🎉 🎉 TOUS LES TESTS RÉUSSIS ! 🎉 🎉 🎉')
    console.log('\n✅ Votre intégration Stripe est OPÉRATIONNELLE')
    console.log('✅ Vous pouvez maintenant tester les paiements')
    console.log('\n💳 Pour tester un paiement:')
    console.log('   1. Allez sur http://localhost:3001/dashboard/upgrade')
    console.log('   2. Cliquez sur "Passer Pro" ou "Passer Elite"')
    console.log('   3. Utilisez la carte: 4242 4242 4242 4242')
    console.log('   4. Le plan sera activé automatiquement\n')
  } else {
    console.log('⚠️  CERTAINS TESTS ONT ÉCHOUÉ')
    console.log('\n📝 Actions requises:')
    
    allTests.forEach(test => {
      if (test.status !== 'OK' && test.status !== 'SKIP') {
        console.log(`   - Corriger: ${test.name}`)
      }
    })
    
    console.log('\n📖 Consultez GUIDE_COMPLET_ENVIRONNEMENT.md pour plus de détails\n')
  }
}

// Exécuter les tests
testStripeIntegration().catch(error => {
  console.error('❌ Erreur critique:', error.message)
  process.exit(1)
})

