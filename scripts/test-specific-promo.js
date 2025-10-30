#!/usr/bin/env node

/**
 * Test d'un code promo spécifique par ID
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

const PROMO_ID = 'promo_1SNyifH23JS5N2cDONe5Hzdp'

console.log('🔍 Test du code promo spécifique\n')
console.log(`ID: ${PROMO_ID}\n`)

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY non trouvée')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover'
})

async function testPromo() {
  try {
    console.log('📋 Test 1: Récupération par ID...')
    const promo = await stripe.promotionCodes.retrieve(PROMO_ID, {
      expand: ['coupon']
    })
    
    console.log('\n✅ Code promo trouvé par ID !')
    console.log(`   Code: ${promo.code}`)
    console.log(`   Actif: ${promo.active ? 'OUI ✅' : 'NON ❌'}`)
    console.log(`   Utilisations: ${promo.times_redeemed}${promo.max_redemptions ? `/${promo.max_redemptions}` : ''}`)
    
    if (promo.expires_at) {
      const expiresAt = new Date(promo.expires_at * 1000)
      const isExpired = expiresAt < new Date()
      console.log(`   Expiration: ${expiresAt.toLocaleDateString()} ${isExpired ? '❌ EXPIRÉ' : '✅'}`)
    } else {
      console.log(`   Expiration: Jamais ✅`)
    }
    
    const coupon = promo.coupon
    const discount = coupon.percent_off 
      ? `${coupon.percent_off}%`
      : `${(coupon.amount_off / 100).toFixed(2)}€`
    
    console.log(`   Réduction: ${discount}`)
    console.log(`   Durée: ${coupon.duration}`)
    
    console.log(`\n📋 Test 2: Recherche par code "${promo.code}"...`)
    const searchResults = await stripe.promotionCodes.list({
      code: promo.code,
      active: true,
      limit: 1,
      expand: ['data.coupon']
    })
    
    if (searchResults.data.length > 0) {
      console.log(`✅ Code trouvé par recherche !`)
      console.log(`   ID trouvé: ${searchResults.data[0].id}`)
      console.log(`   ${searchResults.data[0].id === PROMO_ID ? '✅ ID CORRESPOND !' : '⚠️ ID différent'}`)
    } else {
      console.log(`❌ Code NON trouvé par recherche`)
      console.log(`⚠️  Raisons possibles:`)
      console.log(`   - Le code n'est pas actif (active: ${promo.active})`)
      console.log(`   - Le code a expiré`)
      console.log(`   - Problème de casse (majuscules/minuscules)`)
    }
    
    console.log(`\n📋 Test 3: Recherche en MAJUSCULES "${promo.code.toUpperCase()}"...`)
    const searchUpper = await stripe.promotionCodes.list({
      code: promo.code.toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.coupon']
    })
    
    if (searchUpper.data.length > 0) {
      console.log(`✅ Trouvé en majuscules !`)
    } else {
      console.log(`❌ Non trouvé en majuscules`)
    }
    
    console.log(`\n📋 Test 4: Recherche SANS filtre actif...`)
    const searchAll = await stripe.promotionCodes.list({
      code: promo.code,
      limit: 1,
      expand: ['data.coupon']
    })
    
    if (searchAll.data.length > 0) {
      console.log(`✅ Trouvé sans filtre actif !`)
      console.log(`   Actif: ${searchAll.data[0].active}`)
    } else {
      console.log(`❌ Non trouvé même sans filtre`)
    }
    
    console.log('\n🎯 Recommandations:')
    
    if (!promo.active) {
      console.log('❌ PROBLÈME: Le code n\'est PAS ACTIF')
      console.log('   Solution: Allez dans Stripe Dashboard et activez-le')
      console.log(`   URL: https://dashboard.stripe.com/promotion_codes/${PROMO_ID}`)
    }
    
    if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
      console.log('❌ PROBLÈME: Le code a EXPIRÉ')
      console.log('   Solution: Créez un nouveau code ou supprimez la date d\'expiration')
    }
    
    if (promo.max_redemptions && promo.times_redeemed >= promo.max_redemptions) {
      console.log('❌ PROBLÈME: Le code a atteint sa limite d\'utilisations')
      console.log('   Solution: Augmentez la limite ou créez un nouveau code')
    }
    
    if (promo.active && (!promo.expires_at || promo.expires_at * 1000 > Date.now())) {
      console.log('✅ Le code devrait fonctionner !')
      console.log(`   Testez avec le code: ${promo.code}`)
      console.log(`   Sur: https://athlink.fr/dashboard/upgrade`)
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message)
    if (error.type === 'StripeAuthenticationError') {
      console.error('   → Vérifiez votre STRIPE_SECRET_KEY')
    }
    if (error.statusCode === 404) {
      console.error('   → Ce code promo n\'existe pas ou n\'est pas accessible avec cette clé')
    }
  }
}

testPromo()

