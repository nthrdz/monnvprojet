import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

/**
 * API pour créer une session Stripe Checkout avec code promo
 * 
 * Crée une session de paiement Stripe avec :
 * - Le plan sélectionné (PRO ou ELITE)
 * - Le code promo appliqué (si fourni et valide)
 * - Redirection vers Stripe Checkout pour le paiement
 */
export async function POST(req: NextRequest) {
  console.log("============================================================")
  console.log("🚀 API /api/stripe/create-checkout-session appelée")
  console.log("============================================================")
  
  try {
    const session = await auth()
    
    // ⚠️ TEMPORAIRE : Permettre les requêtes sans auth pour les tests
    // En production, décommentez ce bloc :
    /*
    if (!session?.user?.id) {
      console.error("❌ Utilisateur non authentifié")
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }
    */

    console.log("✅ Utilisateur:", session?.user?.id || "TEST MODE")

    const { plan, promoCode, billingCycle } = await req.json()
    console.log("📦 Données reçues - Plan:", plan, "Cycle:", billingCycle || "monthly", "PromoCode:", promoCode || "aucun")

    // ⚠️ IMPORTANT : Créez ces prix dans Stripe Dashboard !
    // 1. Allez sur https://dashboard.stripe.com/products
    // 2. Créez un produit "Athlink PRO" avec 2 prix : mensuel (9.99€) et annuel (99€)
    // 3. Créez un produit "Athlink ELITE" avec 2 prix : mensuel (19.99€) et annuel (199€)
    // 4. Remplacez les IDs ci-dessous par vos vrais Price IDs
    const priceIds: Record<string, Record<string, string>> = {
      PRO: {
        monthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY || 'price_PRO_MONTHLY_A_CREER',
        yearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY || 'price_PRO_YEARLY_A_CREER'
      },
      ELITE: {
        monthly: process.env.STRIPE_PRICE_ID_ELITE_MONTHLY || 'price_ELITE_MONTHLY_A_CREER',
        yearly: process.env.STRIPE_PRICE_ID_ELITE_YEARLY || 'price_ELITE_YEARLY_A_CREER'
      }
    }

    const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly'

    if (!priceIds[plan] || !priceIds[plan][cycle]) {
      console.error("❌ Plan ou cycle invalide:", plan, cycle)
      return NextResponse.json({ 
        error: 'Plan ou cycle de facturation invalide',
        validPlans: ['PRO', 'ELITE'],
        validCycles: ['monthly', 'yearly']
      }, { status: 400 })
    }

    const selectedPriceId = priceIds[plan][cycle]

    console.log("✅ Plan valide:", plan)
    console.log("✅ Cycle:", cycle)
    console.log("💰 Price ID Stripe:", selectedPriceId)

    // Récupérer le profil de l'utilisateur (ou utiliser des données de test)
    let customerEmail = 'test@test.com'
    let userId = 'test-user-id'
    let profileId = 'test-profile-id'

    if (session?.user?.id) {
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        include: { user: true }
      })

      if (!profile) {
        console.error("❌ Profil non trouvé pour userId:", session.user.id)
        return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
      }

      customerEmail = profile.user.email
      userId = session.user.id
      profileId = profile.id
      console.log("✅ Profil trouvé:", profile.username, "-", profile.user.email)
    } else {
      console.log("⚠️  Mode TEST : Utilisation d'un email de test")
    }

    // Préparer les paramètres de la session Stripe Checkout
    const sessionParams: any = {
      customer_email: customerEmail,
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&plan=${plan}&cycle=${cycle}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/upgrade?canceled=true`,
      metadata: {
        userId: userId,
        profileId: profileId,
        plan: plan,
        billingCycle: cycle,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          profileId: profileId,
          plan: plan,
          billingCycle: cycle,
        }
      }
    }

    // 🎫 Si un code promo est fourni, le valider et l'appliquer
    if (promoCode) {
      console.log("🎫 Validation du code promo:", promoCode)
      
      try {
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

          // Vérifier que le code promo est encore valide
          const isValid = validatedPromo.active && 
            (!validatedPromo.expires_at || validatedPromo.expires_at * 1000 > Date.now()) &&
            (!validatedPromo.max_redemptions || validatedPromo.times_redeemed < validatedPromo.max_redemptions)

          if (isValid && coupon) {
            // ✅ APPLIQUER LE CODE PROMO À LA SESSION STRIPE
            sessionParams.discounts = [
              {
                promotion_code: validatedPromo.id,
              },
            ]

            // Ajouter le code promo dans les metadata
            sessionParams.metadata.promoCode = promoCode.toUpperCase()
            sessionParams.metadata.promoCodeId = validatedPromo.id
            sessionParams.metadata.couponId = coupon.id
            
            if (sessionParams.subscription_data) {
              sessionParams.subscription_data.metadata.promoCode = promoCode.toUpperCase()
            }

            const discount = coupon.percent_off 
              ? `${coupon.percent_off}%`
              : coupon.amount_off 
                ? `${(coupon.amount_off / 100).toFixed(2)}€`
                : "Offre spéciale"

            console.log("✅✅✅ CODE PROMO APPLIQUÉ ! ✅✅✅")
            console.log("   - Code:", promoCode.toUpperCase())
            console.log("   - Réduction:", discount)
            console.log("   - ID Stripe:", validatedPromo.id)
          } else {
            console.warn("⚠️ Code promo invalide ou expiré:", promoCode)
            return NextResponse.json({ 
              error: 'Code promo invalide ou expiré',
              code: promoCode.toUpperCase()
            }, { status: 400 })
          }
        } else {
          console.warn("⚠️ Code promo non trouvé:", promoCode)
          return NextResponse.json({ 
            error: 'Code promo non trouvé',
            code: promoCode.toUpperCase()
          }, { status: 400 })
        }
      } catch (promoError: any) {
        console.error("❌ Erreur validation code promo:", promoError)
        return NextResponse.json({ 
          error: 'Erreur lors de la validation du code promo',
          details: promoError.message
        }, { status: 400 })
      }
    }

    // 🎯 Créer la session Stripe Checkout
    console.log("🎯 Création de la session Stripe Checkout...")
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams)

    console.log("✅ Session Stripe créée avec succès !")
    console.log("   - Session ID:", checkoutSession.id)
    console.log("   - URL:", checkoutSession.url)
    console.log("============================================================")

    return NextResponse.json({ 
      url: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error: any) {
    console.error("❌❌❌ ERREUR création session Stripe ❌❌❌")
    console.error("Type:", error.type)
    console.error("Message:", error.message)
    console.error("Code:", error.code)
    console.error("Stack:", error.stack)
    console.log("============================================================")
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la session de paiement',
        details: error.message,
        type: error.type,
        hint: process.env.NODE_ENV === 'development' 
          ? "Vérifiez que les Price IDs sont correctement configurés dans Stripe Dashboard"
          : undefined
      },
      { status: 500 }
    )
  }
}

