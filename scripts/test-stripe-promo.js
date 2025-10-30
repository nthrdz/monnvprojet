#!/usr/bin/env node

/**
 * Script de test pour vérifier la connexion Stripe et les codes promo
 * 
 * Usage: node scripts/test-stripe-promo.js
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

console.log('🔍 Test de connexion Stripe pour codes promo\n')

// Vérifier que la clé existe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ ERREUR: STRIPE_SECRET_KEY non trouvée dans .env.local')
  console.error('📝 Ajoutez: STRIPE_SECRET_KEY=sk_live_... ou sk_test_...')
  process.exit(1)
}

const keyType = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE'
console.log(`✅ Clé Stripe trouvée (${keyType} mode)`)
console.log(`🔑 Clé: ${process.env.STRIPE_SECRET_KEY.substring(0, 15)}...`)

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover'
})

async function testStripeConnection() {
  try {
    console.log('\n🔗 Test de connexion à Stripe API...')
    
    // Test 1: Lister les coupons
    console.log('\n📋 Test 1: Récupération des coupons')
    const coupons = await stripe.coupons.list({ limit: 5 })
    console.log(`✅ ${coupons.data.length} coupon(s) trouvé(s)`)
    
    if (coupons.data.length > 0) {
      console.log('\n📊 Coupons disponibles:')
      coupons.data.forEach((coupon, i) => {
        const discount = coupon.percent_off 
          ? `${coupon.percent_off}%`
          : `${(coupon.amount_off / 100).toFixed(2)}€`
        console.log(`  ${i + 1}. ${coupon.name || coupon.id} - ${discount}`)
      })
    } else {
      console.log('⚠️  Aucun coupon trouvé. Créez-en un dans Stripe Dashboard:')
      console.log(`   https://dashboard.stripe.com/${keyType === 'TEST' ? 'test/' : ''}coupons`)
    }
    
    // Test 2: Lister les codes promo
    console.log('\n📋 Test 2: Récupération des codes promo')
    const promoCodes = await stripe.promotionCodes.list({ 
      limit: 10,
      expand: ['data.coupon']
    })
    console.log(`✅ ${promoCodes.data.length} code(s) promo trouvé(s)`)
    
    if (promoCodes.data.length > 0) {
      console.log('\n🎁 Codes promo actifs:')
      promoCodes.data.forEach((promo, i) => {
        const coupon = promo.coupon
        const discount = coupon.percent_off 
          ? `${coupon.percent_off}%`
          : `${(coupon.amount_off / 100).toFixed(2)}€`
        const status = promo.active ? '✅ Actif' : '❌ Inactif'
        const uses = promo.times_redeemed || 0
        const maxUses = promo.max_redemptions ? `/${promo.max_redemptions}` : ''
        
        console.log(`  ${i + 1}. Code: ${promo.code}`)
        console.log(`     Réduction: ${discount}`)
        console.log(`     Statut: ${status}`)
        console.log(`     Utilisations: ${uses}${maxUses}`)
        console.log(`     Durée: ${coupon.duration}`)
        console.log('')
      })
    } else {
      console.log('⚠️  Aucun code promo trouvé.')
      console.log('\n📝 Pour créer un code promo:')
      console.log(`   1. Allez sur: https://dashboard.stripe.com/${keyType === 'TEST' ? 'test/' : ''}coupons`)
      console.log('   2. Créez un coupon (ex: 30% de réduction)')
      console.log('   3. Créez un code promo (ex: BIENVENUE)')
      console.log('   4. Relancez ce script pour vérifier')
    }
    
    // Test 3: Test de recherche d'un code spécifique
    console.log('\n📋 Test 3: Recherche de codes spécifiques')
    const testCodes = ['BIENVENUE', 'TEST', 'PROMO']
    
    for (const code of testCodes) {
      const results = await stripe.promotionCodes.list({
        code: code,
        active: true,
        limit: 1,
        expand: ['data.coupon']
      })
      
      if (results.data.length > 0) {
        const promo = results.data[0]
        const coupon = promo.coupon
        const discount = coupon.percent_off 
          ? `${coupon.percent_off}%`
          : `${(coupon.amount_off / 100).toFixed(2)}€`
        console.log(`✅ "${code}" trouvé → ${discount}`)
      } else {
        console.log(`❌ "${code}" non trouvé`)
      }
    }
    
    console.log('\n✅ Test terminé avec succès !')
    console.log('\n🎯 Prochaines étapes:')
    console.log('   1. Assurez-vous d\'avoir au moins 1 code promo actif dans Stripe')
    console.log('   2. Testez sur votre site: /dashboard/upgrade')
    console.log('   3. Les codes doivent maintenant fonctionner !')
    
  } catch (error) {
    console.error('\n❌ ERREUR lors du test Stripe:')
    console.error('Message:', error.message)
    console.error('Type:', error.type)
    
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n🔧 Solution: Vérifiez votre clé Stripe')
      console.error('   - Allez sur: https://dashboard.stripe.com/apikeys')
      console.error('   - Copiez la "Secret key"')
      console.error('   - Mettez à jour STRIPE_SECRET_KEY dans .env.local')
    }
    
    if (error.type === 'StripePermissionError') {
      console.error('\n🔧 Solution: La clé Stripe n\'a pas les permissions nécessaires')
    }
    
    process.exit(1)
  }
}

// Exécuter le test
testStripeConnection()

