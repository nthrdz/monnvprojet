import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover"
})

/**
 * Validation de codes promo Stripe
 * 
 * Les codes promo sont créés directement dans Stripe Dashboard :
 * 1. Allez sur https://dashboard.stripe.com/coupons
 * 2. Créez un coupon (pourcentage ou montant fixe)
 * 3. Créez un code promo lié à ce coupon
 * 4. Le code sera automatiquement validé ici !
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ 
        error: "Code promo requis",
        valid: false 
      }, { status: 400 })
    }

    // Rechercher le code promo dans Stripe avec le coupon inclus
    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.coupon']
    })

    if (promoCodes.data.length === 0) {
      return NextResponse.json({ 
        error: "Code promo invalide ou expiré",
        valid: false 
      }, { status: 404 })
    }

    const promoCode = promoCodes.data[0]
    
    // Récupérer les détails du coupon (avec type assertion car expand n'est pas typé)
    const coupon = (promoCode as any).coupon

    // Vérifier que le code est toujours actif
    if (!promoCode.active) {
      return NextResponse.json({ 
        error: "Ce code promo n'est plus actif",
        valid: false 
      }, { status: 400 })
    }

    // Vérifier la date d'expiration
    if (promoCode.expires_at && promoCode.expires_at * 1000 < Date.now()) {
      return NextResponse.json({ 
        error: "Ce code promo a expiré",
        valid: false 
      }, { status: 400 })
    }

    // Vérifier les utilisations maximum
    if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
      return NextResponse.json({ 
        error: "Ce code promo a atteint sa limite d'utilisation",
        valid: false 
      }, { status: 400 })
    }

    // Construire la réponse
    const discount = coupon.percent_off 
      ? `${coupon.percent_off}%`
      : coupon.amount_off 
        ? `${(coupon.amount_off / 100).toFixed(2)}€`
        : "Offre spéciale"

    const duration = coupon.duration === 'forever' 
      ? 'permanent'
      : coupon.duration === 'once'
        ? 'première facturation'
        : `${coupon.duration_in_months} mois`

    return NextResponse.json({
      valid: true,
      stripePromoCodeId: promoCode.id,
      stripeCouponId: coupon.id,
      code: promoCode.code,
      discount,
      duration,
      percentOff: coupon.percent_off || null,
      amountOff: coupon.amount_off ? coupon.amount_off / 100 : null,
      description: coupon.name || `${discount} de réduction pendant ${duration}`,
      restrictions: {
        firstTimeTransaction: promoCode.restrictions?.first_time_transaction || false,
        minimumAmount: promoCode.restrictions?.minimum_amount 
          ? promoCode.restrictions.minimum_amount / 100 
          : null
      }
    })

  } catch (error) {
    console.error("Erreur validation code promo Stripe:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la validation du code promo",
      valid: false 
    }, { status: 500 })
  }
}
