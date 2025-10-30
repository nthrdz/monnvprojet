import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

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
  console.log("============================================================")
  console.log("🚀 API /api/promo-codes/validate appelée")
  console.log("============================================================")
  
  try {
    const { code } = await request.json()

    console.log("📥 Code reçu:", code)
    console.log("📥 Type:", typeof code)
    console.log("📥 Longueur:", code?.length)

    if (!code) {
      console.error("❌ Aucun code fourni")
      return NextResponse.json({ 
        error: "Code promo requis",
        valid: false 
      }, { status: 400 })
    }

    // Vérifier que les clés Stripe sont configurées
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY non configurée !")
      return NextResponse.json({ 
        error: "Configuration Stripe manquante. Ajoutez STRIPE_SECRET_KEY dans Vercel.",
        valid: false 
      }, { status: 200 })
    }

    const keyType = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'
    console.log("✅ STRIPE_SECRET_KEY configurée, type:", keyType)
    console.log("🔑 Clé:", process.env.STRIPE_SECRET_KEY.substring(0, 20) + "...")

    console.log("🔗 Connexion à Stripe API...")
    console.log("🔍 Recherche du code:", code.toUpperCase())

    // Rechercher le code promo dans Stripe avec le coupon inclus
    const promoCodes = await stripe.promotionCodes.list({
      code: code.toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.coupon']
    })

    console.log("📊 Résultats Stripe:", promoCodes.data.length, "code(s) trouvé(s)")
    
    if (promoCodes.data.length > 0) {
      const promo = promoCodes.data[0]
      console.log("✅ Code trouvé:")
      console.log("   - ID:", promo.id)
      console.log("   - Code:", promo.code)
      console.log("   - Actif:", promo.active)
      console.log("   - Utilisations:", promo.times_redeemed, "/", promo.max_redemptions || "∞")
      console.log("   - Expire:", promo.expires_at ? new Date(promo.expires_at * 1000).toISOString() : "jamais")
    }

    if (promoCodes.data.length === 0) {
      console.log("❌ Aucun code trouvé pour:", code.toUpperCase())
      console.log("💡 Vérifiez dans Stripe Dashboard que:")
      console.log("   1. Le code existe")
      console.log("   2. Le code est ACTIF")
      console.log("   3. Le code n'a pas expiré")
      console.log("   4. Vous utilisez les bonnes clés Stripe (" + keyType + ")")
      
      return NextResponse.json({ 
        error: "Code promo invalide ou expiré",
        valid: false,
        debug: {
          searchedCode: code.toUpperCase(),
          stripeKeyType: keyType,
          hint: "Vérifiez que le code existe et est actif dans Stripe Dashboard"
        }
      }, { status: 200 }) // 200 au lieu de 404 pour ne pas casser le frontend
    }

    const promoCode = promoCodes.data[0]
    
    // Récupérer les détails du coupon (avec type assertion car expand n'est pas typé)
    const coupon = (promoCode as any).coupon

    // Vérifier que le code est toujours actif
    if (!promoCode.active) {
      return NextResponse.json({ 
        error: "Ce code promo n'est plus actif",
        valid: false 
      }, { status: 200 })
    }

    // Vérifier la date d'expiration
    if (promoCode.expires_at && promoCode.expires_at * 1000 < Date.now()) {
      return NextResponse.json({ 
        error: "Ce code promo a expiré",
        valid: false 
      }, { status: 200 })
    }

    // Vérifier les utilisations maximum
    if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
      return NextResponse.json({ 
        error: "Ce code promo a atteint sa limite d'utilisation",
        valid: false 
      }, { status: 200 })
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

    console.log("✅✅✅ CODE PROMO VALIDE ! ✅✅✅")
    console.log("📦 Données retournées:")
    console.log("   - Réduction:", discount)
    console.log("   - Durée:", duration)
    console.log("   - ID Stripe:", promoCode.id)

    const responseData = {
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
    }
    
    console.log("📤 Envoi de la réponse:", JSON.stringify(responseData, null, 2))
    console.log("============================================================")
    
    return NextResponse.json(responseData)

  } catch (error: any) {
    console.error("❌ Erreur validation code promo Stripe:", error)
    console.error("Détails:", error.message)
    console.error("Type:", error.type)
    console.error("Stack:", error.stack)
    
    return NextResponse.json({ 
      error: "Erreur lors de la validation du code promo",
      valid: false,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 200 }) // 200 au lieu de 500 pour ne pas casser le frontend
  }
}
