import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

/**
 * API de test pour vérifier un code promo spécifique
 * Usage: GET /api/test-promo?id=promo_xxx OU ?code=BIENVENUE
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const promoId = searchParams.get('id')
    const promoCode = searchParams.get('code')

    console.log('🧪 Test Promo API')
    console.log('ID:', promoId)
    console.log('Code:', promoCode)

    let result: any = {
      timestamp: new Date().toISOString(),
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyType: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST' : 'LIVE'
    }

    // Test 1: Par ID
    if (promoId) {
      console.log('🔍 Recherche par ID:', promoId)
      try {
        const promo = await stripe.promotionCodes.retrieve(promoId, {
          expand: ['coupon']
        })
        
        const coupon = (promo as any).coupon
        
        // Vérifier que le coupon existe
        if (!coupon) {
          throw new Error('Coupon non trouvé pour ce code promo')
        }
        
        const discount = coupon.percent_off 
          ? `${coupon.percent_off}%`
          : coupon.amount_off 
            ? `${(coupon.amount_off / 100).toFixed(2)}€`
            : 'Réduction'

        result.byId = {
          found: true,
          id: promo.id,
          code: promo.code,
          active: promo.active,
          discount,
          duration: coupon.duration || 'once',
          timesRedeemed: promo.times_redeemed,
          maxRedemptions: promo.max_redemptions,
          expiresAt: promo.expires_at ? new Date(promo.expires_at * 1000).toISOString() : null,
          isExpired: promo.expires_at ? promo.expires_at * 1000 < Date.now() : false
        }
        console.log('✅ Trouvé par ID')
      } catch (error: any) {
        result.byId = {
          found: false,
          error: error.message
        }
        console.log('❌ Non trouvé par ID:', error.message)
      }
    }

    // Test 2: Par Code
    if (promoCode) {
      console.log('🔍 Recherche par code:', promoCode)
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode.toUpperCase(),
          active: true,
          limit: 1,
          expand: ['data.coupon']
        })

        if (promoCodes.data.length > 0) {
          const promo = promoCodes.data[0]
          const coupon = (promo as any).coupon
          
          if (!coupon) {
            throw new Error('Coupon non trouvé pour ce code promo')
          }
          
          const discount = coupon.percent_off 
            ? `${coupon.percent_off}%`
            : coupon.amount_off 
              ? `${(coupon.amount_off / 100).toFixed(2)}€`
              : 'Réduction'

          result.byCode = {
            found: true,
            id: promo.id,
            code: promo.code,
            active: promo.active,
            discount,
            duration: coupon.duration || 'once',
            timesRedeemed: promo.times_redeemed,
            maxRedemptions: promo.max_redemptions
          }
          console.log('✅ Trouvé par code')
        } else {
          result.byCode = {
            found: false,
            searched: promoCode.toUpperCase()
          }
          console.log('❌ Non trouvé par code')
        }
      } catch (error: any) {
        result.byCode = {
          found: false,
          error: error.message
        }
        console.log('❌ Erreur recherche code:', error.message)
      }
    }

    // Test 3: Lister tous les codes actifs
    console.log('🔍 Liste tous les codes actifs')
    try {
      const allCodes = await stripe.promotionCodes.list({
        active: true,
        limit: 10,
        expand: ['data.coupon']
      })

      result.allActiveCodes = allCodes.data.map(promo => ({
        id: promo.id,
        code: promo.code,
        timesRedeemed: promo.times_redeemed
      }))
      console.log(`✅ ${allCodes.data.length} codes actifs trouvés`)
    } catch (error: any) {
      result.allActiveCodes = {
        error: error.message
      }
      console.log('❌ Erreur liste codes:', error.message)
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error: any) {
    console.error('❌ Erreur test promo:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.type
    }, { status: 200 })
  }
}

