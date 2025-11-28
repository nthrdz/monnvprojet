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
      
      // 🎯 Vérifier si c'est un achat de plan de coaching
      if (session.metadata?.type === 'coaching_plan_purchase') {
        // Extract metadata for TypeScript type safety
        const metadata = session.metadata
        
        console.log("💳 Achat de plan de coaching détecté !")
        console.log("   - Plan ID:", metadata.planId)
        console.log("   - Coach:", metadata.coachUsername)
        console.log("   - Client:", metadata.clientName)
        console.log("   - Email:", metadata.clientEmail)
        console.log("   - Prix:", metadata.planPrice, "€")
        
        const coachProfile = await prisma.profile.findUnique({
          where: { id: metadata.coachProfileId },
          select: { id: true, stats: true, displayName: true }
        })
        
        if (!coachProfile) {
          console.error("❌ Profil coach non trouvé")
          return NextResponse.json({ error: 'Coach not found' }, { status: 404 })
        }
        
        // Enregistrer l'achat dans les stats du coach
        const stats = coachProfile.stats as any || {}
        const purchases = stats.purchases || []
        const trainingPlans = stats.trainingPlans || []
        
        const purchase = {
          id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          planId: metadata.planId,
          planTitle: metadata.planTitle,
          clientEmail: metadata.clientEmail,
          clientName: metadata.clientName,
          amount: parseFloat(metadata.planPrice),
          pdfFileUrl: metadata.pdfFileUrl,
          pdfFileName: metadata.pdfFileName,
          purchasedAt: new Date().toISOString(),
          status: 'completed',
          stripeSessionId: session.id,
          accessExpiresAt: null
        }
        
        purchases.push(purchase)
        
        // Mettre à jour le compteur d'abonnés du plan
        const updatedPlans = trainingPlans.map((plan: any) => {
          if (plan.id === metadata.planId) {
            return {
              ...plan,
              _count: {
                ...plan._count,
                subscribers: (plan._count?.subscribers || 0) + 1
              }
            }
          }
          return plan
        })
        
        await prisma.profile.update({
          where: { id: coachProfile.id },
          data: {
            stats: {
              ...stats,
              purchases,
              trainingPlans: updatedPlans
            }
          }
        })
        
        console.log("✅✅✅ ACHAT ENREGISTRÉ ! ✅✅✅")
        console.log("   - Purchase ID:", purchase.id)
        console.log("   - Coach:", coachProfile.displayName)
        console.log("   - Client:", metadata.clientName)
        console.log("   - Montant:", metadata.planPrice, "€")
        
        // 📧 Envoyer un email au client avec le PDF en pièce jointe
        try {
          if (resend && metadata.pdfFileUrl && metadata.pdfFileName) {
            // Télécharger le PDF depuis Supabase
            let pdfAttachment = null
            try {
              console.log("📥 Téléchargement du PDF depuis:", metadata.pdfFileUrl)
              const pdfResponse = await fetch(metadata.pdfFileUrl)
              if (pdfResponse.ok) {
                const pdfArrayBuffer = await pdfResponse.arrayBuffer()
                const pdfBuffer = Buffer.from(pdfArrayBuffer)
                pdfAttachment = {
                  filename: metadata.pdfFileName || 'plan-entrainement.pdf',
                  content: pdfBuffer
                }
                console.log("✅ PDF téléchargé et prêt à être attaché (taille:", pdfBuffer.length, "bytes)")
              } else {
                console.error("❌ Erreur téléchargement PDF:", pdfResponse.status, pdfResponse.statusText)
              }
            } catch (pdfError) {
              console.error("❌ Erreur lors du téléchargement du PDF:", pdfError)
            }

            await resend.emails.send({
              from: 'Athlink <notifications@athlink.fr>',
              to: metadata.clientEmail,
              subject: `✅ Votre plan d'entraînement "${metadata.planTitle}"`,
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
                      .btn { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                      .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1 style="margin: 0;">🎉 Achat confirmé !</h1>
                      </div>
                      <div class="content">
                        <p>Bonjour ${metadata.clientName},</p>
                        
                        <div class="success-box">
                          <h2 style="margin: 0 0 10px 0; color: #155724;">✅ Paiement réussi</h2>
                          <p style="margin: 0; color: #155724;">Vous avez accès au plan <strong>"${metadata.planTitle}"</strong></p>
                        </div>
                        
                        <h3 style="color: #667eea;">📄 Votre Plan d'Entraînement</h3>
                        <p><strong>Coach :</strong> ${coachProfile.displayName}</p>
                        <p><strong>Prix payé :</strong> ${metadata.planPrice}€</p>
                        
                        ${pdfAttachment ? `
                        <div style="background: #e3f2fd; border: 2px solid #2196f3; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                          <p style="margin: 0; color: #1976d2; font-weight: bold;">📎 Le PDF de votre plan d'entraînement est joint à cet email</p>
                        </div>
                        ` : `
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${metadata.pdfFileUrl}" 
                             class="btn">
                            📥 Télécharger le PDF
                          </a>
                        </div>
                        `}
                        
                        <p style="color: #666; font-size: 14px;">
                          💡 <strong>Astuce :</strong> Enregistrez ce PDF sur votre appareil pour y accéder à tout moment.
                        </p>
                      </div>
                      <div class="footer">
                        <p>Athlink - Plateforme de coaching pour athlètes</p>
                        <p>contact@athlink.fr</p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
              attachments: pdfAttachment ? [pdfAttachment] : undefined
            })
            console.log("📧 Email envoyé au client avec PDF:", metadata.clientEmail, pdfAttachment ? "(PDF attaché)" : "(lien uniquement)")
          } else if (resend) {
            // Fallback : envoyer l'email sans PDF si le téléchargement a échoué
            await resend.emails.send({
              from: 'Athlink <notifications@athlink.fr>',
              to: metadata.clientEmail,
              subject: `✅ Votre plan d'entraînement "${metadata.planTitle}"`,
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
                      .btn { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                      .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1 style="margin: 0;">🎉 Achat confirmé !</h1>
                      </div>
                      <div class="content">
                        <p>Bonjour ${metadata.clientName},</p>
                        
                        <div class="success-box">
                          <h2 style="margin: 0 0 10px 0; color: #155724;">✅ Paiement réussi</h2>
                          <p style="margin: 0; color: #155724;">Vous avez accès au plan <strong>"${metadata.planTitle}"</strong></p>
                        </div>
                        
                        <h3 style="color: #667eea;">📄 Votre Plan d'Entraînement</h3>
                        <p><strong>Coach :</strong> ${coachProfile.displayName}</p>
                        <p><strong>Prix payé :</strong> ${metadata.planPrice}€</p>
                        
                        ${metadata.pdfFileUrl ? `
                        <div style="text-align: center; margin: 30px 0;">
                          <a href="${metadata.pdfFileUrl}" 
                             class="btn">
                            📥 Télécharger le PDF
                          </a>
                        </div>
                        ` : ''}
                        
                        <p style="color: #666; font-size: 14px;">
                          💡 <strong>Astuce :</strong> Enregistrez ce PDF sur votre appareil pour y accéder à tout moment.
                        </p>
                      </div>
                      <div class="footer">
                        <p>Athlink - Plateforme de coaching pour athlètes</p>
                        <p>contact@athlink.fr</p>
                      </div>
                    </div>
                  </body>
                </html>
              `
            })
            console.log("📧 Email envoyé au client (sans PDF):", metadata.clientEmail)
          }
        } catch (emailError) {
          console.error("❌ Erreur envoi email client:", emailError)
        }
        
        // 📧 Notifier le coach de la vente
        try {
          if (resend) {
            const coachUser = await prisma.user.findFirst({
              where: { 
                profile: { id: coachProfile.id }
              },
              select: { email: true }
            })
            
            if (coachUser) {
              await resend.emails.send({
                from: 'Athlink <notifications@athlink.fr>',
                to: coachUser.email,
                subject: `💰 Nouvelle vente : ${metadata.planTitle}`,
                html: `
                  <h2>🎉 Nouvelle vente !</h2>
                  <p>Bonjour ${coachProfile.displayName},</p>
                  <p>Vous avez vendu un plan d'entraînement :</p>
                  <ul>
                    <li><strong>Plan :</strong> ${metadata.planTitle}</li>
                    <li><strong>Client :</strong> ${metadata.clientName}</li>
                    <li><strong>Email :</strong> ${metadata.clientEmail}</li>
                    <li><strong>Prix :</strong> ${metadata.planPrice}€</li>
                  </ul>
                  <p>Le client a reçu un email avec le lien de téléchargement du PDF.</p>
                  <p><a href="${process.env.NEXTAUTH_URL}/dashboard/coaching">Voir mes ventes</a></p>
                `
              })
              console.log("📧 Email envoyé au coach")
            }
          }
        } catch (emailError) {
          console.error("❌ Erreur envoi email coach:", emailError)
        }
        
        console.log("✅ Webhook coaching traité avec succès")
        return NextResponse.json({ received: true })
      }
      
      // 🎯 Sinon, c'est un paiement d'abonnement normal (PRO/ELITE)
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

      // 🎯 METTRE À JOUR LE PLAN DE L'UTILISATEUR (ACTIVATION IMMÉDIATE)
      // ⚡ L'utilisateur bascule immédiatement sur le nouveau plan, même en période d'essai
      await prisma.profile.update({
        where: { userId },
        data: updateData
      })

      console.log("✅✅✅ PLAN ACTIVÉ IMMÉDIATEMENT ! ✅✅✅")
      console.log("   - Utilisateur:", userId)
      console.log("   - Nouveau plan:", plan, "(activé instantanément)")
      console.log("   - Customer ID:", session.customer)
      console.log("   - Subscription ID:", session.subscription)

      // 🎁 AFFILIATION : Si un code de parrainage existe, enregistrer la conversion
      const referralCode = session.metadata?.referralCode
      if (referralCode) {
        console.log("\n🎁 Code de parrainage détecté:", referralCode)
        console.log("   - Appel de l'API affiliate/convert...")
        
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
          const affiliateResponse = await fetch(`${baseUrl}/api/affiliate/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              referralCode: referralCode,
              userId: userId,
              planType: plan,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              stripePaymentIntentId: session.payment_intent as string,
            })
          })

          if (affiliateResponse.ok) {
            const affiliateData = await affiliateResponse.json()
            console.log("✅ Conversion affilié enregistrée avec succès !")
            console.log("   - Commission:", affiliateData.commission?.amount, "€")
          } else {
            const errorData = await affiliateResponse.json()
            console.error("❌ Erreur enregistrement conversion:", errorData.error)
          }
        } catch (affiliateError) {
          console.error("❌ Erreur appel API affiliate/convert:", affiliateError)
          // On ne bloque pas le webhook si l'affiliation échoue
        }

        // 🎯 FIRSTPROMOTER : Les conversions sont trackées automatiquement via l'intégration Stripe
        // Le SDK FirstPromoter + l'intégration Stripe dans leur dashboard gèrent les conversions
        // Plus besoin d'appeler manuellement une API de conversion
        console.log("\n🎁 FirstPromoter trackera automatiquement cette conversion via Stripe")
      }

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

    // 🎯 ÉVÉNEMENT : Abonnement créé (même en trial)
    else if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription
      
      console.log("🆕 Nouvel abonnement créé !")
      console.log("   - Subscription ID:", subscription.id)
      console.log("   - Customer:", subscription.customer)
      console.log("   - Status:", subscription.status)
      console.log("   - Trial End:", subscription.trial_end ? new Date(subscription.trial_end * 1000).toLocaleString('fr-FR') : 'Aucun')
      
      // Récupérer le customer pour obtenir l'email
      const customer = await stripe.customers.retrieve(subscription.customer as string)
      const customerEmail = (customer as Stripe.Customer).email
      
      if (!customerEmail) {
        console.error("❌ Pas d'email pour le customer:", subscription.customer)
        return NextResponse.json({ error: 'No customer email' }, { status: 400 })
      }
      
      console.log("   - Email:", customerEmail)
      
      // Trouver l'utilisateur par email
      const user = await prisma.user.findUnique({
        where: { email: customerEmail },
        include: { profile: true }
      })
      
      if (!user || !user.profile) {
        console.error("❌ Utilisateur non trouvé pour l'email:", customerEmail)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      
      console.log("✅ Utilisateur trouvé:", user.email)
      
      // Identifier le plan par le Price ID de l'abonnement
      const priceId = subscription.items.data[0]?.price?.id
      console.log("💰 Price ID:", priceId)
      
      // Mapper Price ID vers Plan
      const priceIdMapping: Record<string, string> = {
        [process.env.STRIPE_PRICE_ID_ELITE_MONTHLY || '']: 'ELITE',
        [process.env.STRIPE_PRICE_ID_ELITE_YEARLY || '']: 'ELITE',
        [process.env.STRIPE_PRICE_ID_PRO_MONTHLY || '']: 'PRO',
        [process.env.STRIPE_PRICE_ID_PRO_YEARLY || '']: 'PRO',
      }
      
      const plan = priceId ? priceIdMapping[priceId] : undefined
      
      if (!plan) {
        console.error("❌ Plan non identifié pour Price ID:", priceId)
        return NextResponse.json({ error: 'Unknown price ID' }, { status: 400 })
      }
      
      console.log("✅ Plan identifié:", plan)
      
      // Préparer les données de mise à jour
      const stats = user.profile.stats as any || {}
      const updateData: any = {
        plan: plan as any,
        stats: {
          ...stats,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          activatedAt: new Date().toISOString(),
        }
      }
      
      // 🎯 METTRE À JOUR LE PLAN DE L'UTILISATEUR (MÊME EN TRIAL !)
      await prisma.profile.update({
        where: { userId: user.id },
        data: updateData
      })
      
      console.log("✅✅✅ PLAN ACTIVÉ (TRIAL OU PAYANT) ! ✅✅✅")
      console.log("   - Utilisateur:", user.id)
      console.log("   - Nouveau plan:", plan)
      console.log("   - Status:", subscription.status)
      console.log("   - Trial:", subscription.status === 'trialing' ? 'OUI' : 'NON')
      
      // 📧 Envoyer un email de confirmation
      try {
        if (resend) {
          const trialMessage = subscription.status === 'trialing' && subscription.trial_end
            ? `<div class="feature" style="background: #d1ecf1; border-left-color: #0c5460;">
                <h3 style="margin-top: 0; color: #0c5460;">🎁 Période d'essai activée</h3>
                <p style="margin: 0; color: #0c5460;">Profitez gratuitement de toutes les fonctionnalités jusqu'au ${new Date(subscription.trial_end * 1000).toLocaleDateString('fr-FR')} !</p>
              </div>`
            : ''
          
          await resend.emails.send({
            from: 'Athlink <notifications@athlink.fr>',
            to: user.email,
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
                      <p>Bonjour ${user.profile.displayName},</p>
                      
                      <div class="success-box">
                        <h2 style="margin: 0 0 10px 0; color: #155724;">✅ Abonnement activé !</h2>
                        <p style="margin: 0; color: #155724;">Votre plan <strong>${plan}</strong> est maintenant actif</p>
                      </div>
                      
                      ${trialMessage}
                      
                      <h3 style="color: #667eea;">🚀 Vos nouvelles fonctionnalités</h3>
                      
                      <div class="feature">
                        <strong>✅ Accès complet</strong>
                        <p style="margin: 5px 0 0 0; color: #666;">Toutes les fonctionnalités ${plan} disponibles immédiatement</p>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                           style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                          Accéder à mon dashboard
                        </a>
                      </div>
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
          console.log("📧 Email de confirmation envoyé à:", user.email)
        }
      } catch (emailError) {
        console.error("❌ Erreur envoi email:", emailError)
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
