import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    console.log("🚀 API /api/upgrade-plan appelée")
    
    // Vérifier la configuration Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY non configurée !")
      return NextResponse.json({ 
        error: "Configuration Stripe manquante. Ajoutez STRIPE_SECRET_KEY dans Vercel.",
        details: "STRIPE_SECRET_KEY is not set"
      }, { status: 500 })
    }
    
    console.log("✅ STRIPE_SECRET_KEY présente, type:", process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE')
    
    const session = await auth()
    
    if (!session?.user?.id) {
      console.error("❌ Session non valide:", session)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }
    
    console.log("✅ Utilisateur authentifié:", session.user.id)

    const { plan, promoCode } = await request.json()
    console.log("📦 Données reçues - Plan:", plan, "PromoCode:", promoCode || "aucun")

    if (!["FREE", "PRO", "ELITE"].includes(plan)) {
      console.error("❌ Plan invalide:", plan, "- Seuls FREE, PRO, ELITE sont acceptés")
      return NextResponse.json({ 
        error: "Plan invalide. Seuls FREE, PRO et ELITE sont disponibles.",
        received: plan,
        valid: ["FREE", "PRO", "ELITE"]
      }, { status: 400 })
    }

    console.log("✅ Plan valide:", plan)

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
        console.log("🎫 Validation du code promo:", promoCode)
        
        // Valider le code promo via Stripe
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode.toUpperCase(),
          active: true,
          limit: 1,
          expand: ['data.coupon']
        })
        
        console.log("📊 Stripe a retourné", promoCodes.data.length, "code(s)")

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
      } catch (stripeError: any) {
        console.error("❌ Erreur validation Stripe promo code:", stripeError)
        console.error("Type d'erreur:", stripeError.type)
        console.error("Message:", stripeError.message)
        // On continue sans le code promo plutôt que de bloquer l'upgrade
      }
    }

    // Mettre à jour le plan
    console.log("💾 Mise à jour du profil en base de données...")
    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData
    })

    console.log("✅ Plan mis à jour avec succès:", profile.plan)

    return NextResponse.json({ 
      success: true, 
      plan: profile.plan,
      message: `Plan mis à jour vers ${plan}`,
      promoApplied: stripePromoCodeId ? true : false,
      discountInfo: discountInfo || null
    })
  } catch (error: any) {
    console.error("❌❌❌ ERREUR DÉTAILLÉE lors de la mise à jour du plan ❌❌❌")
    console.error("Type d'erreur:", error.constructor.name)
    console.error("Message:", error.message)
    console.error("Stack:", error.stack)
    
    // Erreur Stripe spécifique
    if (error.type) {
      console.error("Type Stripe:", error.type)
      console.error("Code Stripe:", error.code)
    }
    
    // Erreur Prisma spécifique
    if (error.code) {
      console.error("Code Prisma:", error.code)
    }
    
    return NextResponse.json(
      { 
        error: "Erreur lors de la mise à jour du plan",
        details: error.message || "Erreur inconnue",
        type: error.type || error.constructor.name,
        hint: "Vérifiez les logs Vercel Functions pour plus de détails"
      },
      { status: 500 }
    )
  }
}

