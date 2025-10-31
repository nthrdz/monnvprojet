// Script pour vérifier que toutes les variables d'environnement sont configurées
require('dotenv').config({ path: '.env.local' })

console.log('\n🔍 VÉRIFICATION DE LA CONFIGURATION STRIPE\n')

const requiredVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_PRICE_ID_PRO_MONTHLY',
  'STRIPE_PRICE_ID_ELITE_MONTHLY',
  'STRIPE_PRICE_ID_PRO_YEARLY',
  'STRIPE_PRICE_ID_ELITE_YEARLY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY'
]

let allOk = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (!value || value === 'votre_' || value.includes('xxxxx')) {
    console.log(`❌ ${varName} : MANQUANT ou NON CONFIGURÉ`)
    allOk = false
  } else {
    // Afficher seulement les premiers et derniers caractères pour la sécurité
    const masked = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : `${value.substring(0, 4)}...`
    console.log(`✅ ${varName} : ${masked}`)
  }
})

console.log('\n' + '='.repeat(60) + '\n')

if (allOk) {
  console.log('✅ ✅ ✅ TOUTES LES VARIABLES SONT CONFIGURÉES ! ✅ ✅ ✅\n')
  console.log('🚀 Vous pouvez maintenant tester les paiements Stripe\n')
} else {
  console.log('❌ ❌ ❌ CERTAINES VARIABLES MANQUENT ! ❌ ❌ ❌\n')
  console.log('📝 Veuillez configurer les variables manquantes dans .env.local\n')
  process.exit(1)
}

// Test de connexion à Stripe
console.log('🔌 Test de connexion à Stripe...\n')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

stripe.prices.list({ limit: 5 })
  .then(prices => {
    console.log(`✅ Connexion Stripe réussie ! ${prices.data.length} prix trouvés\n`)
    
    // Vérifier que les Price IDs existent
    const priceIds = [
      { name: 'PRO_MONTHLY', id: process.env.STRIPE_PRICE_ID_PRO_MONTHLY },
      { name: 'ELITE_MONTHLY', id: process.env.STRIPE_PRICE_ID_ELITE_MONTHLY },
      { name: 'PRO_YEARLY', id: process.env.STRIPE_PRICE_ID_PRO_YEARLY },
      { name: 'ELITE_YEARLY', id: process.env.STRIPE_PRICE_ID_ELITE_YEARLY }
    ]
    
    console.log('🔍 Vérification des Price IDs...\n')
    
    const checkPromises = priceIds.map(async ({ name, id }) => {
      try {
        const price = await stripe.prices.retrieve(id)
        console.log(`✅ ${name} : ${price.id} → ${price.unit_amount / 100}€ / ${price.recurring.interval}`)
        return true
      } catch (error) {
        console.log(`❌ ${name} : Price ID invalide (${id})`)
        return false
      }
    })
    
    Promise.all(checkPromises).then(results => {
      console.log('\n' + '='.repeat(60) + '\n')
      if (results.every(r => r)) {
        console.log('🎉 🎉 🎉 CONFIGURATION STRIPE 100% OPÉRATIONNELLE ! 🎉 🎉 🎉\n')
      } else {
        console.log('❌ Certains Price IDs sont invalides. Vérifiez votre configuration.\n')
      }
    })
  })
  .catch(err => {
    console.log('❌ Erreur de connexion Stripe:', err.message)
    console.log('\n⚠️  Vérifiez que STRIPE_SECRET_KEY est correct\n')
  })

