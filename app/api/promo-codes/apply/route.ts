import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

/**
 * API pour inscription avec code promo Stripe
 * 
 * Valide le code promo via Stripe et crée le compte utilisateur
 * avec les avantages du code promo appliqués
 */
export async function POST(request: NextRequest) {
  console.log("============================================================")
  console.log("🚀 API /api/promo-codes/apply appelée (INSCRIPTION)")
  console.log("============================================================")
  
  try {
    const body = await request.json()
    const { promoCode, email, password, name, username, sport } = body

    console.log("📥 Données reçues:")
    console.log("   - Email:", email)
    console.log("   - Username:", username)
    console.log("   - Code promo:", promoCode || "aucun")

    // Validation des données
    if (!email || !password || !name || !username || !sport) {
      return NextResponse.json({ 
        error: "Tous les champs sont requis" 
      }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await prisma.profile.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 400 }
      )
    }

    // Variables pour le code promo
    let planType = "FREE" // Plan par défaut
    let promoDetails: any = null
    let stripePromoCodeId: string | null = null

    // Si un code promo est fourni, le valider via Stripe
    if (promoCode) {
      console.log("🎫 Validation du code promo Stripe:", promoCode)
      
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode.toUpperCase(),
          active: true,
          limit: 1,
          expand: ['data.coupon']
        })

        if (promoCodes.data.length > 0) {
          const validatedPromo = promoCodes.data[0]
          let coupon = (validatedPromo as any).coupon

          // Si le coupon n'est pas chargé via expand, le récupérer manuellement
          if (!coupon && (validatedPromo as any).coupon) {
            try {
              console.log("⚠️ Coupon non chargé via expand, récupération manuelle...")
              const promoCoupon = (validatedPromo as any).coupon
              const couponId = typeof promoCoupon === 'string' 
                ? promoCoupon 
                : promoCoupon.id
              
              coupon = await stripe.coupons.retrieve(couponId)
              console.log("✅ Coupon récupéré manuellement:", coupon.id)
            } catch (error: any) {
              console.error("❌ Impossible de récupérer le coupon:", error.message)
            }
          }

          // Vérifier que le coupon existe
          if (!coupon) {
            console.warn("⚠️ Code promo sans coupon valide:", promoCode)
            return NextResponse.json(
              { error: "Code promo invalide (coupon manquant)" },
              { status: 400 }
            )
          }

          // Vérifier que le code est valide
          if (validatedPromo.active && 
              (!validatedPromo.expires_at || validatedPromo.expires_at * 1000 > Date.now()) &&
              (!validatedPromo.max_redemptions || validatedPromo.times_redeemed < validatedPromo.max_redemptions)) {
            
            stripePromoCodeId = validatedPromo.id
            
            const discount = coupon.percent_off 
              ? `${coupon.percent_off}%`
              : coupon.amount_off 
                ? `${(coupon.amount_off / 100).toFixed(2)}€`
                : "Offre spéciale"

            promoDetails = {
              code: promoCode.toUpperCase(),
              stripePromoCodeId,
              stripeCouponId: coupon.id,
              discount,
              percentOff: coupon.percent_off || null,
              amountOff: coupon.amount_off ? coupon.amount_off / 100 : null,
              duration: coupon.duration,
              durationInMonths: coupon.duration_in_months || null,
              appliedAt: new Date().toISOString()
            }

            console.log("✅ Code promo Stripe validé:", promoDetails)
            
            // Note: Le plan reste FREE, le code promo sera appliqué lors du paiement
            // Vous pouvez modifier cette logique si vous voulez donner un plan spécifique
          } else {
            console.warn("⚠️ Code promo invalide ou expiré:", promoCode)
          }
        } else {
          console.warn("⚠️ Code promo non trouvé dans Stripe:", promoCode)
        }
      } catch (stripeError: any) {
        console.error("❌ Erreur validation Stripe:", stripeError.message)
        // On continue l'inscription même si le code promo échoue
      }
    }

    // Hacher le mot de passe
    console.log("🔐 Hashage du mot de passe...")
    const bcrypt = await import("bcryptjs")
    const hashedPassword = await bcrypt.hash(password, 12)

    // Préparer les stats avec le code promo
    const stats: any = {
      personalRecords: [],
      achievements: []
    }

    if (promoDetails) {
      stats.promoCodeUsed = promoDetails.code
      stats.promoAppliedAt = promoDetails.appliedAt
      stats.stripePromoCodeId = promoDetails.stripePromoCodeId
      stats.discountInfo = promoDetails
    }

    // Créer l'utilisateur et le profil
    console.log("💾 Création de l'utilisateur en base de données...")
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profile: {
          create: {
            username,
            displayName: name,
            sport: sport as any,
            plan: planType as any,
            stats
          }
        }
      },
      include: {
        profile: true
      }
    })

    console.log("✅ Utilisateur créé avec succès:", user.id)
    console.log("   - Plan:", user.profile?.plan)
    console.log("   - Code promo:", promoDetails ? "✅ Appliqué" : "❌ Aucun")
    console.log("============================================================")

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.profile?.username,
        plan: user.profile?.plan,
        promoApplied: promoDetails ? true : false,
        promoCode: promoDetails?.code || null,
        discount: promoDetails?.discount || null
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error("❌ Erreur application code promo:", error)
    console.error("   - Message:", error.message)
    console.error("   - Code:", error.code)
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email ou nom d'utilisateur déjà utilisé" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}
