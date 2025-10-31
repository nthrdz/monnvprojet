// Script de debug approfondi du webhook
require('dotenv').config({ path: '.env.local' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

console.log('\n' + '='.repeat(70))
console.log('🔍 DEBUG APPROFONDI DU WEBHOOK')
console.log('='.repeat(70) + '\n')

async function debugWebhook() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  console.log('📋 Secret dans .env.local:')
  console.log(`   ${webhookSecret}`)
  console.log(`   Longueur: ${webhookSecret ? webhookSecret.length : 0} caractères`)
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
      console.log(`Secret (début):    ${webhook.secret.substring(0, 20)}...`)
      console.log(`Secret (longueur): ${webhook.secret.length} caractères`)
      console.log(``)
      console.log(`Événements configurés (${webhook.enabled_events.length}):`)
      webhook.enabled_events.forEach(event => {
        const required = ['checkout.session.completed', 'invoice.payment_succeeded', 'customer.subscription.deleted']
        const emoji = required.includes(event) ? '✅' : '⚪'
        console.log(`   ${emoji} ${event}`)
      })
      
      // Comparaison des secrets
      console.log(``)
      console.log(`🔐 COMPARAISON DES SECRETS:`)
      console.log(`   Secret Stripe:    "${webhook.secret}"`)
      console.log(`   Secret .env:      "${webhookSecret}"`)
      console.log(`   Identiques:       ${webhook.secret === webhookSecret ? '✅ OUI' : '❌ NON'}`)
      
      if (webhook.secret !== webhookSecret) {
        console.log(``)
        console.log(`   ⚠️  DIFFÉRENCES DÉTECTÉES:`)
        console.log(`   - Longueur Stripe: ${webhook.secret.length}`)
        console.log(`   - Longueur .env:   ${webhookSecret.length}`)
        
        // Chercher des espaces ou caractères invisibles
        const hasLeadingSpace = webhookSecret !== webhookSecret.trim()
        const hasTrailingSpace = webhookSecret !== webhookSecret.trim()
        
        if (hasLeadingSpace || hasTrailingSpace) {
          console.log(`   - ⚠️  Le secret dans .env contient des espaces invisibles !`)
        }
        
        // Comparer caractère par caractère
        const maxLen = Math.max(webhook.secret.length, webhookSecret.length)
        let firstDiff = -1
        for (let i = 0; i < maxLen; i++) {
          if (webhook.secret[i] !== webhookSecret[i]) {
            firstDiff = i
            break
          }
        }
        
        if (firstDiff !== -1) {
          console.log(`   - Première différence à la position ${firstDiff}`)
          console.log(`     Stripe: "${webhook.secret[firstDiff]}" (code: ${webhook.secret.charCodeAt(firstDiff)})`)
          console.log(`     .env:   "${webhookSecret[firstDiff]}" (code: ${webhookSecret.charCodeAt(firstDiff)})`)
        }
      }
    })
    
    console.log(`\n${'='.repeat(70)}`)
    console.log(`\n📊 RÉSUMÉ\n`)
    
    const matchingWebhook = webhooks.data.find(w => w.secret === webhookSecret)
    
    if (matchingWebhook) {
      console.log('✅ ✅ ✅ WEBHOOK SECRET VALIDE ! ✅ ✅ ✅')
      console.log(`\n   URL correcte: ${matchingWebhook.url}`)
      console.log(`   Status: ${matchingWebhook.status}`)
      
      // Vérifier que l'URL contient /api/stripe/webhook
      if (!matchingWebhook.url.includes('/api/stripe/webhook')) {
        console.log(`\n   ⚠️  ATTENTION: L'URL ne contient pas /api/stripe/webhook`)
        console.log(`   URL actuelle: ${matchingWebhook.url}`)
        console.log(`   URL attendue: ...athlink.fr/api/stripe/webhook`)
      } else {
        console.log(`\n   ✅ URL correcte avec /api/stripe/webhook`)
      }
    } else {
      console.log('❌ LE SECRET NE CORRESPOND À AUCUN WEBHOOK')
      console.log(`\n   Nombre de webhooks trouvés: ${webhooks.data.length}`)
      console.log(`   Secret cherché: ${webhookSecret}`)
      console.log(`\n   💡 ACTIONS POSSIBLES:`)
      console.log(`   1. Vérifiez que le secret n'a pas d'espaces avant/après`)
      console.log(`   2. Copiez à nouveau le secret depuis Stripe Dashboard`)
      console.log(`   3. Assurez-vous d'être en mode LIVE dans Stripe`)
    }
    
    console.log(`\n${'='.repeat(70)}\n`)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

debugWebhook()

