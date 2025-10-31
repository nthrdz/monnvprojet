// Script pour vérifier si le webhook est en mode TEST ou LIVE
require('dotenv').config({ path: '.env.local' })

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

console.log('\n🔍 VÉRIFICATION DU MODE DU WEBHOOK\n')
console.log('=' .repeat(60))

// Vérifier le mode des clés API
const secretKey = process.env.STRIPE_SECRET_KEY
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (secretKey.startsWith('sk_live_')) {
  console.log('\n✅ Clé secrète : MODE LIVE')
} else if (secretKey.startsWith('sk_test_')) {
  console.log('\n⚠️  Clé secrète : MODE TEST')
} else {
  console.log('\n❌ Clé secrète : FORMAT INVALIDE')
}

if (publishableKey.startsWith('pk_live_')) {
  console.log('✅ Clé publique : MODE LIVE')
} else if (publishableKey.startsWith('pk_test_')) {
  console.log('⚠️  Clé publique : MODE TEST')
} else {
  console.log('❌ Clé publique : FORMAT INVALIDE')
}

console.log('\n' + '=' .repeat(60))

// Récupérer la liste des webhooks
console.log('\n🎣 Récupération des webhooks Stripe...\n')

stripe.webhookEndpoints.list({ limit: 100 })
  .then(webhooks => {
    if (webhooks.data.length === 0) {
      console.log('❌ Aucun webhook trouvé.')
      console.log('\n⚠️  Vous devez créer un webhook sur : https://dashboard.stripe.com/webhooks\n')
      return
    }

    console.log(`✅ ${webhooks.data.length} webhook(s) trouvé(s) en MODE ${secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'} :\n`)

    webhooks.data.forEach((webhook, index) => {
      console.log(`\n📌 Webhook #${index + 1}`)
      console.log(`   ID : ${webhook.id}`)
      console.log(`   URL : ${webhook.url}`)
      console.log(`   Status : ${webhook.status}`)
      console.log(`   Événements (${webhook.enabled_events.length}) :`)
      webhook.enabled_events.forEach(event => {
        if (['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted'].includes(event)) {
          console.log(`      ✅ ${event}`)
        } else {
          console.log(`      ⚪ ${event}`)
        }
      })
      console.log(`   Secret : ${webhook.secret.substring(0, 10)}...`)
    })

    console.log('\n' + '=' .repeat(60))

    // Vérifier si le webhook secret dans .env correspond à un webhook existant
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const matchingWebhook = webhooks.data.find(w => w.secret === webhookSecret)

    if (matchingWebhook) {
      console.log('\n✅ ✅ ✅ WEBHOOK SECRET VALIDE ET CONFIGURÉ ! ✅ ✅ ✅')
      console.log(`\n   Le webhook dans .env.local correspond à :`)
      console.log(`   URL : ${matchingWebhook.url}`)
      console.log(`   Status : ${matchingWebhook.status}`)
      console.log(`   Mode : ${secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`)
      
      // Vérifier les événements nécessaires
      const requiredEvents = ['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted']
      const hasAllEvents = requiredEvents.every(event => matchingWebhook.enabled_events.includes(event))
      
      if (hasAllEvents) {
        console.log(`\n   ✅ Tous les événements requis sont configurés !`)
      } else {
        console.log(`\n   ⚠️  ATTENTION : Il manque des événements requis !`)
        console.log(`\n   Événements requis :`)
        requiredEvents.forEach(event => {
          if (matchingWebhook.enabled_events.includes(event)) {
            console.log(`      ✅ ${event}`)
          } else {
            console.log(`      ❌ ${event} (MANQUANT)`)
          }
        })
      }
    } else {
      console.log('\n❌ ❌ ❌ WEBHOOK SECRET INVALIDE ! ❌ ❌ ❌')
      console.log('\n   Le STRIPE_WEBHOOK_SECRET dans .env.local ne correspond à aucun webhook.')
      console.log('\n   Solutions possibles :')
      console.log('   1. Vous avez copié le mauvais secret')
      console.log('   2. Le webhook a été supprimé')
      console.log('   3. Le webhook est en mode TEST mais vos clés sont en mode LIVE (ou vice-versa)')
      console.log('\n   Allez sur https://dashboard.stripe.com/webhooks et copiez le bon secret.')
    }

    console.log('\n' + '=' .repeat(60))
  })
  .catch(err => {
    console.log('❌ Erreur lors de la récupération des webhooks:', err.message)
    console.log('\n⚠️  Vérifiez vos clés Stripe.')
  })

