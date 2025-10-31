// Test complet du flux Stripe end-to-end
require('dotenv').config({ path: '.env.local' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

console.log('\n' + '='.repeat(80))
console.log('🔍 TEST COMPLET DU FLUX STRIPE END-TO-END')
console.log('='.repeat(80) + '\n')

async function testCompletFlux() {
  const errors = []
  const warnings = []

  // TEST 1: Variables d'environnement
  console.log('📌 TEST 1: Variables d\'environnement\n')
  
  const requiredEnvVars = {
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    'STRIPE_PRICE_ID_PRO_MONTHLY': process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    'STRIPE_PRICE_ID_ELITE_MONTHLY': process.env.STRIPE_PRICE_ID_ELITE_MONTHLY,
    'STRIPE_PRICE_ID_PRO_YEARLY': process.env.STRIPE_PRICE_ID_PRO_YEARLY,
    'STRIPE_PRICE_ID_ELITE_YEARLY': process.env.STRIPE_PRICE_ID_ELITE_YEARLY,
    'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET,
    'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  }

  for (const [name, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      console.log(`❌ ${name}: MANQUANT`)
      errors.push(`${name} manquant`)
    } else {
      console.log(`✅ ${name}: Configuré (${value.substring(0, 15)}...)`)
    }
  }

  console.log('\n' + '-'.repeat(80) + '\n')

  // TEST 2: Vérifier tous les Price IDs
  console.log('📌 TEST 2: Vérification des Price IDs\n')
  
  const priceConfigs = [
    { name: 'PRO MONTHLY', id: process.env.STRIPE_PRICE_ID_PRO_MONTHLY },
    { name: 'ELITE MONTHLY', id: process.env.STRIPE_PRICE_ID_ELITE_MONTHLY },
    { name: 'PRO YEARLY', id: process.env.STRIPE_PRICE_ID_PRO_YEARLY },
    { name: 'ELITE YEARLY', id: process.env.STRIPE_PRICE_ID_ELITE_YEARLY },
  ]

  for (const config of priceConfigs) {
    try {
      const price = await stripe.prices.retrieve(config.id)
      if (price.active) {
        console.log(`✅ ${config.name}: ${price.unit_amount / 100}€ / ${price.recurring.interval}`)
      } else {
        console.log(`⚠️  ${config.name}: Prix désactivé dans Stripe`)
        warnings.push(`${config.name} désactivé`)
      }
    } catch (error) {
      console.log(`❌ ${config.name}: ${error.message}`)
      errors.push(`${config.name} invalide`)
    }
  }

  console.log('\n' + '-'.repeat(80) + '\n')

  // TEST 3: Simuler création de session Checkout
  console.log('📌 TEST 3: Simulation de création de session Checkout\n')
  
  try {
    const testSession = await stripe.checkout.sessions.create({
      customer_email: 'test@test.com',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/upgrade?canceled=true`,
      metadata: {
        userId: 'test-user',
        plan: 'PRO',
        billingCycle: 'monthly'
      }
    })
    
    console.log('✅ Session Checkout créée avec succès')
    console.log(`   - Session ID: ${testSession.id}`)
    console.log(`   - URL: ${testSession.url ? 'Générée' : 'Manquante'}`)
    
    // Expirer la session de test
    await stripe.checkout.sessions.expire(testSession.id)
    console.log('   - Session de test nettoyée')
  } catch (error) {
    console.log(`❌ Erreur création session: ${error.message}`)
    errors.push('Création session échoue')
  }

  console.log('\n' + '-'.repeat(80) + '\n')

  // TEST 4: Vérifier les codes promo
  console.log('📌 TEST 4: Vérification des codes promo\n')
  
  try {
    const promoCodes = await stripe.promotionCodes.list({ active: true, limit: 5 })
    
    if (promoCodes.data.length === 0) {
      console.log('⚠️  Aucun code promo actif trouvé')
      warnings.push('Pas de codes promo')
    } else {
      console.log(`✅ ${promoCodes.data.length} code(s) promo actif(s) trouvé(s):`)
      promoCodes.data.forEach((promo, i) => {
        const coupon = promo.coupon
        const discount = coupon.percent_off 
          ? `${coupon.percent_off}%`
          : coupon.amount_off 
            ? `${coupon.amount_off / 100}€`
            : 'Discount inconnu'
        console.log(`   ${i + 1}. Code: "${promo.code}" - Réduction: ${discount}`)
      })
    }
  } catch (error) {
    console.log(`❌ Erreur récupération codes promo: ${error.message}`)
    errors.push('Codes promo inaccessibles')
  }

  console.log('\n' + '-'.repeat(80) + '\n')

  // TEST 5: Webhook
  console.log('📌 TEST 5: Configuration Webhook\n')
  
  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 })
    
    if (webhooks.data.length === 0) {
      console.log('❌ Aucun webhook configuré')
      errors.push('Webhook manquant')
    } else {
      const webhook = webhooks.data[0]
      console.log(`✅ Webhook trouvé: ${webhook.url}`)
      console.log(`   - Status: ${webhook.status}`)
      console.log(`   - Événements: ${webhook.enabled_events.length}`)
      
      const required = ['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted']
      const missing = required.filter(e => !webhook.enabled_events.includes(e))
      
      if (missing.length > 0) {
        console.log(`   ⚠️  Événements manquants: ${missing.join(', ')}`)
        warnings.push('Événements webhook incomplets')
      } else {
        console.log(`   ✅ Tous les événements requis configurés`)
      }
      
      if (!webhook.url.includes('/api/stripe/webhook')) {
        console.log(`   ⚠️  URL incorrecte: ${webhook.url}`)
        warnings.push('URL webhook incorrecte')
      }
    }
  } catch (error) {
    console.log(`❌ Erreur récupération webhook: ${error.message}`)
    errors.push('Webhook inaccessible')
  }

  console.log('\n' + '='.repeat(80) + '\n')

  // RÉSUMÉ
  console.log('📊 RÉSUMÉ FINAL\n')
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log('🎉 🎉 🎉 TOUT EST PARFAIT ! 🎉 🎉 🎉\n')
    console.log('✅ Configuration Stripe 100% opérationnelle')
  } else {
    if (errors.length > 0) {
      console.log('❌ ERREURS CRITIQUES:\n')
      errors.forEach(err => console.log(`   - ${err}`))
      console.log('')
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  AVERTISSEMENTS:\n')
      warnings.forEach(warn => console.log(`   - ${warn}`))
      console.log('')
    }
  }

  console.log('='.repeat(80) + '\n')
  
  return { errors, warnings }
}

testCompletFlux().catch(err => {
  console.error('❌ Erreur fatale:', err.message)
  process.exit(1)
})

