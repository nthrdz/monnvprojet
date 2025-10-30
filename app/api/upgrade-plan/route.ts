import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover"
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      console.error("Session non valide:", session)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { plan, promoCode } = await request.json()

    if (!["FREE", "ATHLETE_PRO", "COACH"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    console.log("Tentative de mise à jour du plan pour userId:", session.user.id, "vers:", plan)

    // Vérifier si le profil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, stats: true, plan: true }
    })

    if (!existingProfile) {
      console.error("Profil non trouvé pour userId:", session.user.id)
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Préparer les données de mise à jour
    const updateData: any = { plan }
    let stripePromoCodeId: string | null = null
    let discountInfo: any = null

    // Si un code promo est fourni, le valider via Stripe
    if (promoCode) {
      try {
        // Valider le code promo via Stripe
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode.toUpperCase(),
          active: true,
          limit: 1,
          expand: ['data.coupon']
        })

        if (promoCodes.data.length > 0) {
          const validatedPromo = promoCodes.data[0]
          const coupon = (validatedPromo as any).coupon

          // Vérifier que le code est encore valide
          if (validatedPromo.active && 
              (!validatedPromo.expires_at || validatedPromo.expires_at * 1000 > Date.now()) &&
              (!validatedPromo.max_redemptions || validatedPromo.times_redeemed < validatedPromo.max_redemptions)) {
            
            stripePromoCodeId = validatedPromo.id
            
            // Calculer les infos de réduction
            const discount = coupon.percent_off 
              ? `${coupon.percent_off}%`
              : coupon.amount_off 
                ? `${(coupon.amount_off / 100).toFixed(2)}€`
                : "Offre spéciale"

            discountInfo = {
              code: promoCode.toUpperCase(),
              stripePromoCodeId,
              stripeCouponId: coupon.id,
              discount,
              percentOff: coupon.percent_off || null,
              amountOff: coupon.amount_off ? coupon.amount_off / 100 : null,
              duration: coupon.duration,
              durationInMonths: coupon.duration_in_months || null
            }

            // Ajouter aux stats du profil
            const stats = existingProfile.stats as any || {}
            updateData.stats = {
              ...stats,
              promoCodeUsed: promoCode.toUpperCase(),
              promoAppliedAt: new Date().toISOString(),
              stripePromoCodeId,
              discountInfo
            }

            console.log("✅ Code promo Stripe validé:", discountInfo)
          } else {
            console.warn("⚠️ Code promo invalide ou expiré:", promoCode)
          }
        } else {
          console.warn("⚠️ Code promo non trouvé dans Stripe:", promoCode)
        }
      } catch (stripeError) {
        console.error("❌ Erreur validation Stripe promo code:", stripeError)
        // On continue sans le code promo plutôt que de bloquer l'upgrade
      }
    }

    // Mettre à jour le plan
    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData
    })

    console.log("Plan mis à jour avec succès:", profile.plan)

    return NextResponse.json({ 
      success: true, 
      plan: profile.plan,
      message: `Plan mis à jour vers ${plan}`,
      promoApplied: stripePromoCodeId ? true : false,
      discountInfo: discountInfo || null
    })
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour du plan:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la mise à jour",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    )
  }
}

