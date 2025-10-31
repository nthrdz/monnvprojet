// Script de debug approfondi du webhook (v2)
require('dotenv').config({ path: '.env.local' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

console.log('\n' + '='.repeat(70))
console.log('🔍 DEBUG WEBHOOK - VERSION 2')
console.log('='.repeat(70) + '\n')

async function debugWebhook() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  console.log('📋 Secret dans .env.local:')
  console.log(`   ${webhookSecret}`)
  console.log(`   Longueur: ${webhookSecret ? webhookSecret.length : 0} caractères`)
  
  // Vérifier les espaces invisibles
  const trimmed = webhookSecret.trim()
  if (webhookSecret !== trimmed) {
    console.log(`   ⚠️  ATTENTION: Le secret contient des espaces avant/après !`)
    console.log(`   Après trim: "${trimmed}"`)
  }
  
  console.log('')
  
  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 })
    
    console.log(`📊 Nombre total de webhooks: ${webhooks.data.length}\n`)
    
    if (webhooks.data.length === 0) {
      console.log('❌ Aucun webhook trouvé dans Stripe')
      return
    }
    
    webhooks.data.forEach((webhook, index) => {
      console.log(`\n${'─'.repeat(70)}`)
      console.log(`📌 WEBHOOK #${index + 1}`)
      console.log(`${'─'.repeat(70)}`)
      console.log(`ID:                ${webhook.id}`)
      console.log(`URL:               ${webhook.url}`)
      console.log(`Status:            ${webhook.status}`)
      console.log(`Créé le:           ${new Date(webhook.created * 1000).toLocaleString('fr-FR')}`)
      console.log(`API Version:       ${webhook.api_version || 'default'}`)
      console.log(``)
      console.log(`Événements configurés (${webhook.enabled_events.length}):`)
      
      const required = ['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted']
      webhook.enabled_events.forEach(event => {
        const emoji = required.includes(event) ? '✅' : '⚪'
        console.log(`   ${emoji} ${event}`)
      })
      
      // Vérifier que tous les événements requis sont présents
      const missingEvents = required.filter(event => !webhook.enabled_events.includes(event))
      if (missingEvents.length > 0) {
        console.log(`\n   ⚠️  Événements manquants:`)
        missingEvents.forEach(event => console.log(`      ❌ ${event}`))
      } else {
        console.log(`\n   ✅ Tous les événements requis sont configurés`)
      }
      
      // Vérifier l'URL
      console.log(`\n🌐 VÉRIFICATION DE L'URL:`)
      if (webhook.url.includes('/api/stripe/webhook')) {
        console.log(`   ✅ URL correcte: contient /api/stripe/webhook`)
      } else {
        console.log(`   ❌ URL incorrecte: ne contient pas /api/stripe/webhook`)
        console.log(`   URL actuelle: ${webhook.url}`)
        console.log(`   URL attendue: https://athlink.fr/api/stripe/webhook`)
      }
    })
    
    console.log(`\n${'='.repeat(70)}`)
    console.log(`\n📊 RÉSUMÉ\n`)
    
    // L'API Stripe ne retourne pas le secret dans la liste
    // On ne peut donc pas le comparer directement
    console.log('ℹ️  NOTE: Stripe ne retourne pas le secret dans l\'API')
    console.log('   Le secret est visible uniquement sur le Dashboard\n')
    
    const webhook = webhooks.data[0] // On prend le premier webhook
    
    if (webhook) {
      console.log('✅ Webhook trouvé:')
      console.log(`   ID: ${webhook.id}`)
      console.log(`   URL: ${webhook.url}`)
      console.log(`   Status: ${webhook.status}`)
      
      if (webhook.url.includes('/api/stripe/webhook')) {
        console.log(`\n✅ ✅ ✅ L'URL EST CORRECTE ! ✅ ✅ ✅`)
      } else {
        console.log(`\n❌ L'URL EST INCORRECTE`)
      }
      
      const required = ['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted']
      const missingEvents = required.filter(event => !webhook.enabled_events.includes(event))
      
      if (missingEvents.length === 0) {
        console.log(`✅ LES 3 ÉVÉNEMENTS SONT CONFIGURÉS`)
      } else {
        console.log(`❌ IL MANQUE DES ÉVÉNEMENTS`)
      }
      
      console.log(`\n📝 Pour vérifier que le secret est correct:`)
      console.log(`   1. Allez sur: https://dashboard.stripe.com/webhooks`)
      console.log(`   2. Cliquez sur le webhook "${webhook.id}"`)
      console.log(`   3. Cherchez "Signing secret" et cliquez sur "Révéler"`)
      console.log(`   4. Vérifiez qu'il correspond exactement à:`)
      console.log(`      ${webhookSecret}`)
      
      console.log(`\n🧪 TESTER LE WEBHOOK:`)
      console.log(`   Sur la page Stripe du webhook, envoyez un événement de test`)
      console.log(`   Sélectionnez: checkout.session.completed`)
      console.log(`   Si ça réussit ✅, le webhook est opérationnel !`)
    }
    
    console.log(`\n${'='.repeat(70)}\n`)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

debugWebhook()

