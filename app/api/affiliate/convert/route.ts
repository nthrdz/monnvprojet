import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { stripe, STRIPE_CONFIG } from '@/lib/stripe'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      referralCode, 
      userId, 
      planType, 
      stripeCustomerId, 
      stripeSubscriptionId,
      stripePaymentIntentId 
    } = body

    if (!referralCode || !userId || !planType) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Trouver le referral en attente
    const referral = await prisma.referral.findFirst({
      where: {
        referralCode,
        status: 'PENDING'
      },
      include: {
        affiliate: {
          include: {
            user: {
              include: {
                profile: true
              }
            }
          }
        }
      }
    })

    if (!referral) {
      return NextResponse.json(
        { error: 'Referral non trouvé ou déjà converti' },
        { status: 404 }
      )
    }

    // Vérifier que l'affilié est approuvé
    if (referral.affiliate.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Affilié non approuvé' },
        { status: 403 }
      )
    }

    // Calculer la commission (40% du prix du plan)
    const planPrices = STRIPE_CONFIG.planPrices as Record<string, number>
    const planPrice = planPrices[planType as keyof typeof planPrices] || 0
    const commissionAmount = planPrice * 0.40 // 40%

    // Mettre à jour le referral
    const updatedReferral = await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'CONVERTED',
        referredUserId: userId,
        convertedAt: new Date(),
        conversionValue: planPrice,
        commissionEarned: commissionAmount,
        stripeCustomerId,
        stripeSubscriptionId,
        stripePaymentIntentId,
      }
    })

    // Créer la commission
    const commission = await prisma.commission.create({
      data: {
        affiliateId: referral.affiliateId,
        referralId: referral.id,
        amount: commissionAmount,
        type: 'REFERRAL',
        status: 'PENDING',
        description: `Commission 40% - Plan ${planType} - ${planPrice}€`,
        stripeSubscriptionId,
        stripePaymentIntentId,
      }
    })

    // Mettre à jour les stats de l'affilié
    await prisma.affiliate.update({
      where: { id: referral.affiliateId },
      data: {
        totalReferrals: { increment: 1 },
        totalConversions: { increment: 1 },
        totalEarnings: { increment: commissionAmount }
      }
    })

    // Mettre à jour le clic correspondant si trouvé
    // TODO: Activer après migration de la base de données
    /*
    const recentClick = await prisma.affiliateClick.findFirst({
      where: {
        affiliateId: referral.affiliateId,
        converted: false,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (recentClick) {
      await prisma.affiliateClick.update({
        where: { id: recentClick.id },
        data: {
          converted: true,
          convertedAt: new Date(),
          referralId: referral.id
        }
      })
    }
    */

    // Envoyer un email de notification à l'affilié
    try {
      if (referral.affiliate.applicationEmail) {
        await resend.emails.send({
          from: 'Athlink <notifications@athlink.fr>',
          to: referral.affiliate.applicationEmail,
          subject: '🎉 Nouvelle conversion - Vous avez gagné une commission !',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                  .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                  .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
                  .amount { font-size: 36px; font-weight: bold; color: #155724; }
                  .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">🎉 Nouvelle conversion !</h1>
                  </div>
                  <div class="content">
                    <p>Bonjour ${referral.affiliate.user.profile?.displayName || 'Ambassadeur'},</p>
                    
                    <div class="success-box">
                      <p style="margin: 0 0 10px 0;">Vous avez gagné :</p>
                      <div class="amount">${commissionAmount.toFixed(2)} €</div>
                      <p style="margin: 10px 0 0 0; color: #155724;">Commission 40%</p>
                    </div>
                    
                    <p>Félicitations ! Un utilisateur s'est inscrit avec votre code de parrainage et a souscrit à un plan payant.</p>
                    
                    <div class="info-box">
                      <h3 style="margin-top: 0; color: #667eea;">📊 Détails de la conversion</h3>
                      <p><strong>Plan souscrit :</strong> ${planType}</p>
                      <p><strong>Valeur :</strong> ${planPrice.toFixed(2)} €</p>
                      <p><strong>Votre commission :</strong> ${commissionAmount.toFixed(2)} € (40%)</p>
                      <p><strong>Code utilisé :</strong> ${referralCode}</p>
                    </div>
                    
                    <div style="text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL}/dashboard/affiliate" class="button">
                        Voir mon dashboard
                      </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                      💡 <strong>Rappel :</strong> Les commissions sont versées automatiquement via Stripe Connect dès que vous atteignez 50€.
                    </p>
                  </div>
                  <div class="footer">
                    <p>Athlink - Programme ambassadeur</p>
                    <p>contact@athlink.fr</p>
                  </div>
                </div>
              </body>
            </html>
          `
        })
      }
    } catch (emailError) {
      console.error('Erreur envoi email conversion:', emailError)
    }

    // Si l'affilié a un compte Stripe Connect et que le total dépasse le minimum, créer un transfert
    if (referral.affiliate.stripeAccountId && referral.affiliate.totalEarnings >= STRIPE_CONFIG.affiliateSettings.minimumPayout) {
      try {
        // Créer un transfert Stripe vers le compte Connect de l'affilié
        const transfer = await stripe.transfers.create({
          amount: Math.round(commissionAmount * 100), // Convertir en centimes
          currency: 'eur',
          destination: referral.affiliate.stripeAccountId,
          description: `Commission affiliation - ${referralCode}`,
          metadata: {
            affiliateId: referral.affiliateId,
            referralId: referral.id,
            commissionId: commission.id,
            planType
          }
        })

        // Mettre à jour la commission
        await prisma.commission.update({
          where: { id: commission.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            paymentMethod: 'stripe_connect',
            stripeTransferId: transfer.id,
            paymentReference: transfer.id
          }
        })
      } catch (stripeError) {
        console.error('Erreur transfert Stripe:', stripeError)
        // La commission reste en PENDING
      }
    }

    return NextResponse.json({
      success: true,
      referral: updatedReferral,
      commission,
      message: 'Conversion enregistrée avec succès'
    })
  } catch (error) {
    console.error('Erreur conversion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la conversion' },
      { status: 500 }
    )
  }
}
