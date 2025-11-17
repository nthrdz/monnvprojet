import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
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
    
    if (!session?.user?.id) {
      console.error("❌ Utilisateur non authentifié")
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    console.log("✅ Utilisateur authentifié:", session.user.id)

    // 🎯 Étape 2: Récupérer fp_tid depuis req.body (conforme aux instructions FirstPromoter)
    // Référence: https://docs.firstpromoter.com
    // Le client envoie fp_tid via axios.post() ou fetch()
    const { plan, billingCycle, referralCode, fp_tid } = await req.json()
    console.log("📦 Données reçues - Plan:", plan, "Cycle:", billingCycle || "monthly")
    if (referralCode) {
      console.log("🎁 Code de parrainage:", referralCode)
    }
    if (fp_tid) {
      console.log("🎯 fp_tid reçu depuis le client:", fp_tid)
    }
    
    // 🎯 Récupérer le FirstPromoter Tracking ID (tid)
    // Méthode principale: depuis req.body.fp_tid (transmis par le client)
    // Fallback: depuis les cookies côté serveur (si non transmis)
    let trackingId = fp_tid // D'abord, utiliser celui transmis depuis le client (méthode recommandée)
    
    if (!trackingId) {
      // Méthode 1: Utiliser l'API cookies() de Next.js (méthode recommandée)
      try {
        const cookieStore = await cookies()
        const fpromTidCookie = cookieStore.get('_fprom_tid')
        if (fpromTidCookie?.value) {
          trackingId = decodeURIComponent(fpromTidCookie.value)
          console.log("🎯 FirstPromoter Tracking ID récupéré via cookies() API:", trackingId)
        }
      } catch (error) {
        console.log("⚠️ Impossible d'utiliser cookies() API, utilisation du fallback")
      }
      
      // Méthode 2: Fallback - lire depuis les headers HTTP (compatible avec tous les cas)
      if (!trackingId) {
        const cookieHeader = req.headers.get('cookie') || ''
        const cookieMatch = cookieHeader.match(/_fprom_tid=([^;]+)/)
        if (cookieMatch) {
          trackingId = decodeURIComponent(cookieMatch[1])
          console.log("🎯 FirstPromoter Tracking ID récupéré depuis headers HTTP:", trackingId)
        }
      }
    }
    
    if (trackingId) {
      console.log("✅ FirstPromoter Tracking ID (fp_tid) final:", trackingId)
    } else {
      console.log("⚠️ Aucun FirstPromoter Tracking ID trouvé")
      console.log("   → L'utilisateur n'est peut-être pas arrivé via un lien d'affiliation")
    }

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

    // Récupérer le profil de l'utilisateur
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    })

    if (!profile) {
      console.error("❌ Profil non trouvé pour userId:", session.user.id)
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    console.log("✅ Profil trouvé:", profile.username, "-", profile.user.email)

    // Préparer les paramètres de la session Stripe Checkout
    const sessionParams: any = {
      customer_email: profile.user.email,
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/payment-success?plan=${plan}&cycle=${cycle}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/upgrade?canceled=true`,
      
      // ✅ Activer les codes promo dans le terminal de paiement
      allow_promotion_codes: true,
      
      // ❌ Désactiver Stripe Link (paiement classique uniquement)
      payment_method_types: ['card'],
      
      metadata: {
        userId: session.user.id,
        profileId: profile.id,
        plan: plan,
        billingCycle: cycle,
        ...(referralCode && { referralCode }),
        // 🎯 FirstPromoter Tracking ID - conforme aux instructions FirstPromoter
        // Le fp_tid est récupéré depuis req.body.fp_tid (transmis par le client)
        // et ajouté dans les métadonnées de la session Stripe Checkout
        ...(trackingId && { fp_tid: trackingId }),
      },
      subscription_data: {
        // ⚡ Pas de période d'essai - activation immédiate (pas de trial_period_days = pas de trial)
        metadata: {
          userId: session.user.id,
          profileId: profile.id,
          plan: plan,
          billingCycle: cycle,
          ...(trackingId && { fp_tid: trackingId }), // 🎯 FirstPromoter Tracking ID pour le tracking des paiements récurrents
        }
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

