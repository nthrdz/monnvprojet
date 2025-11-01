import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Stripe from 'stripe'
import { Resend } from 'resend'

/**
 * Webhook Stripe pour gérer les événements de paiement
 * 
 * Événements gérés :
 * - checkout.session.completed : Paiement réussi, activer le plan
 * - invoice.payment_succeeded : Renouvellement d'abonnement
 * - customer.subscription.deleted : Annulation d'abonnement
 */
export async function POST(req: NextRequest) {
  // Initialiser Resend uniquement si la clé est disponible
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  
  console.log("============================================================")
  console.log("🎣 WEBHOOK STRIPE REÇU")
  console.log("============================================================")
  
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    console.error("❌ Pas de signature Stripe dans les headers")
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET non configurée !")
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    console.log("✅ Signature webhook valide")
    console.log("📦 Type d'événement:", event.type)
  } catch (err: any) {
    console.error("❌ Échec de la vérification de la signature webhook:", err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    // 🎯 ÉVÉNEMENT : Paiement réussi (checkout completé)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log("💰 Checkout session complété !")
      console.log("   - Session ID:", session.id)
      console.log("   - Customer:", session.customer)
      console.log("   - Customer Email:", session.customer_email)
      console.log("   - Amount:", session.amount_total ? session.amount_total / 100 : 0, "€")
      
      let userId = session.metadata?.userId
      const profileId = session.metadata?.profileId
      let plan = session.metadata?.plan
      const promoCode = session.metadata?.promoCode

      console.log("📋 Metadata:")
      console.log("   - User ID:", userId)
      console.log("   - Profile ID:", profileId)
      console.log("   - Plan:", plan)
      console.log("   - Promo Code:", promoCode || "aucun")

      // 🔍 Si pas de metadata (Payment Link), identifier par email et price
      if (!userId || !plan) {
        console.log("⚠️ Pas de metadata - Identification par email et Price ID...")
        
        if (!session.customer_email) {
          console.error("❌ Impossible d'identifier l'utilisateur (pas d'email)")
          return NextResponse.json({ error: 'Missing customer email' }, { status: 400 })
        }

        // Trouver l'utilisateur par email
        const user = await prisma.user.findUnique({
          where: { email: session.customer_email },
          include: { profile: true }
        })

        if (!user || !user.profile) {
          console.error("❌ Utilisateur non trouvé pour l'email:", session.customer_email)
          return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        userId = user.id
        console.log("✅ Utilisateur identifié par email:", user.email)

        // Identifier le plan par le Price ID
        // Récupérer les line_items car Stripe ne les inclut pas par défaut dans le webhook
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'line_items.data.price']
        })

        if (fullSession.line_items && fullSession.line_items.data.length > 0) {
          const priceId = fullSession.line_items.data[0].price?.id
          console.log("💰 Price ID:", priceId)

          // Mapper Price ID vers Plan
          const priceIdMapping: Record<string, string> = {
            [process.env.STRIPE_PRICE_ID_ELITE_MONTHLY || '']: 'ELITE',
            [process.env.STRIPE_PRICE_ID_ELITE_YEARLY || '']: 'ELITE',
            [process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '']: 'PRO',
            [process.env.STRIPE_PRICE_ID_PRO_YEARLY || '']: 'PRO',
          }

          plan = priceId ? priceIdMapping[priceId] : undefined

          if (!plan) {
            console.error("❌ Plan non identifié pour Price ID:", priceId)
            console.error("❌ Price IDs configurés:", Object.keys(priceIdMapping).filter(k => k))
            return NextResponse.json({ error: 'Unknown price ID' }, { status: 400 })
          }

          console.log("✅ Plan identifié:", plan)
        } else {
          console.error("❌ Pas de line_items dans la session")
          return NextResponse.json({ error: 'No line items' }, { status: 400 })
        }
      }

      // Récupérer le profil
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { user: true }
      })

      if (!profile) {
        console.error("❌ Profil non trouvé pour userId:", userId)
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }

      console.log("✅ Profil trouvé:", profile.username)

      // Préparer les données de mise à jour
      const stats = profile.stats as any || {}
      const updateData: any = {
        plan: plan as any,
        stats: {
          ...stats,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          lastPaymentAt: new Date().toISOString(),
          paymentMethod: 'stripe',
        }
      }

      // Si un code promo a été utilisé, l'enregistrer
      if (promoCode) {
        updateData.stats.promoCodeUsed = promoCode
        updateData.stats.promoAppliedAt = new Date().toISOString()
        updateData.stats.promoCodeId = session.metadata?.promoCodeId
        updateData.stats.couponId = session.metadata?.couponId
        console.log("🎫 Code promo utilisé:", promoCode)
      }

      // 🎯 METTRE À JOUR LE PLAN DE L'UTILISATEUR
      await prisma.profile.update({
        where: { userId },
        data: updateData
      })

      console.log("✅✅✅ PLAN ACTIVÉ AVEC SUCCÈS ! ✅✅✅")
      console.log("   - Utilisateur:", userId)
      console.log("   - Nouveau plan:", plan)
      console.log("   - Customer ID:", session.customer)
      console.log("   - Subscription ID:", session.subscription)

      // 📧 Envoyer un email de confirmation
      try {
        if (resend) {
          await resend.emails.send({
          from: 'Athlink <notifications@athlink.fr>',
          to: profile.user.email,
          subject: `🎉 Bienvenue dans Athlink ${plan} !`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .success-box { background: #d4edda; border: 2px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                  .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
                  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🎉 Bienvenue dans Athlink ${plan} !</h1>
                  </div>
                  <div class="content">
                    <p>Bonjour ${profile.displayName},</p>
                    
                    <div class="success-box">
                      <h2 style="margin: 0 0 10px 0; color: #155724;">✅ Paiement confirmé !</h2>
                      <p style="margin: 0; color: #155724;">Votre abonnement <strong>${plan}</strong> est maintenant actif</p>
                    </div>
                    
                    ${promoCode ? `
                      <div class="feature" style="background: #fff3cd; border-left-color: #ffc107;">
                        <h3 style="margin-top: 0; color: #856404;">🎁 Code promo appliqué</h3>
                        <p style="margin: 0; color: #856404;">Code <strong>${promoCode}</strong> utilisé avec succès !</p>
                      </div>
                    ` : ''}
                    
                    <h3 style="color: #667eea;">🚀 Vos nouvelles fonctionnalités</h3>
                    
                    ${plan === 'PRO' ? `
                      <div class="feature">
                        <strong>✅ Profil personnalisé</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Design premium et domaine personnalisé</p>
                      </div>
                      <div class="feature">
                        <strong>✅ Analytics avancés</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Suivez vos performances en détail</p>
                      </div>
                      <div class="feature">
                        <strong>✅ Liens illimités</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Partagez autant de liens que vous voulez</p>
                      </div>
                    ` : `
                      <div class="feature">
                        <strong>✅ Toutes les fonctionnalités PRO</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">+ Coaching et plans d'entraînement</p>
                      </div>
                      <div class="feature">
                        <strong>✅ Monétisation</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Vendez vos services et contenus</p>
                      </div>
                      <div class="feature">
                        <strong>✅ Support prioritaire</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Assistance dédiée 24/7</p>
                      </div>
                    `}
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                         style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                        Accéder à mon dashboard
                      </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                      Besoin d'aide ? Répondez simplement à cet email, nous sommes là pour vous !
                    </p>
                  </div>
                  <div class="footer">
                    <p>Athlink - Plateforme de gestion pour athlètes</p>
                    <p>contact@athlink.fr</p>
                  </div>
                </div>
              </body>
            </html>
          `
        })
        console.log("📧 Email de confirmation envoyé à:", profile.user.email)
        }
      } catch (emailError) {
        console.error("❌ Erreur envoi email:", emailError)
        // On continue même si l'email échoue
      }
    }

    // 🎯 ÉVÉNEMENT : Renouvellement d'abonnement
    else if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      
      console.log("💰 Paiement d'invoice réussi !")
      console.log("   - Invoice ID:", invoice.id)
      console.log("   - Customer:", invoice.customer)
      console.log("   - Amount:", invoice.amount_paid / 100, "€")
      console.log("   - Subscription:", (invoice as any).subscription)
      
      // Vous pouvez ajouter une logique pour enregistrer les paiements récurrents
    }

    // 🎯 ÉVÉNEMENT : Annulation d'abonnement
    else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      
      console.log("❌ Abonnement annulé !")
      console.log("   - Subscription ID:", subscription.id)
      console.log("   - Customer:", subscription.customer)
      
      // Trouver l'utilisateur par subscription ID
      const profile = await prisma.profile.findFirst({
        where: {
          stats: {
            path: ['stripeSubscriptionId'],
            equals: subscription.id
          }
        },
        include: { user: true }
      })

      if (profile) {
        // Rétrograder vers le plan FREE
        await prisma.profile.update({
          where: { id: profile.id },
          data: { plan: 'FREE' }
        })
        
        console.log("✅ Utilisateur rétrogradé vers FREE:", profile.userId)
        
        // Envoyer un email
        try {
          if (resend) {
            await resend.emails.send({
            from: 'Athlink <notifications@athlink.fr>',
            to: profile.user.email,
            subject: 'Votre abonnement Athlink a été annulé',
            html: `
              <p>Bonjour ${profile.displayName},</p>
              <p>Votre abonnement Athlink a été annulé.</p>
              <p>Vous avez été rétrogradé vers le plan FREE.</p>
              <p>Vous pouvez vous réabonner à tout moment depuis votre dashboard.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/dashboard/upgrade">Réabonnez-vous</a></p>
            `
          })
          }
        } catch (emailError) {
          console.error("❌ Erreur envoi email annulation:", emailError)
        }
      }
    }

    console.log("✅ Webhook traité avec succès")
    console.log("============================================================")
    
    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error("❌❌❌ ERREUR traitement webhook ❌❌❌")
    console.error("Type:", error.type)
    console.error("Message:", error.message)
    console.error("Stack:", error.stack)
    console.log("============================================================")
    
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    )
  }
}

// Important : Désactiver le parsing automatique du body pour les webhooks Stripe
export const dynamic = 'force-dynamic'

