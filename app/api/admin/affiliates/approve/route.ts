import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

// Email admin autorisés (à adapter selon vos besoins)
const ADMIN_EMAILS = ['contact@athlink.fr', 'admin@athlink.fr']

export async function POST(req: NextRequest) {
  // Initialiser Resend uniquement si la clé est disponible
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
  try {
    const session = await auth()
    
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { affiliateId } = body

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'ID affilié requis' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut de l'affilié
    const affiliate = await prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date()
      },
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    // Envoyer un email de confirmation à l'affilié
    try {
      const userEmail = affiliate.user.email
      if (userEmail && resend) {
        await resend.emails.send({
          from: 'Athlink <notifications@athlink.fr>',
          to: userEmail,
          subject: '🎉 Votre candidature ambassadeur a été approuvée !',
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
                  .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .code-box { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; font-family: monospace; font-size: 18px; font-weight: bold; text-align: center; margin: 15px 0; }
                  .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                  .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 32px;">🎉 Félicitations !</h1>
                  </div>
                  <div class="content">
                    <p>Bonjour ${affiliate.user.profile?.displayName || 'Ambassadeur'},</p>
                    
                    <div class="success-box">
                      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #155724;">
                        Votre candidature pour devenir ambassadeur Athlink a été approuvée !
                      </p>
                    </div>
                    
                    <p>Vous pouvez maintenant commencer à promouvoir Athlink et gagner des commissions sur chaque vente.</p>
                    
                    <div class="info-box">
                      <h3 style="margin-top: 0; color: #667eea;">🔗 Votre code d'affiliation</h3>
                      <div class="code-box">
                        ${affiliate.affiliateCode}
                      </div>
                      <p style="text-align: center; margin: 10px 0 0 0; font-size: 14px; color: #666;">
                        Utilisez ce code dans vos liens de parrainage
                      </p>
                    </div>
                    
                    <div class="info-box">
                      <h3 style="margin-top: 0; color: #667eea;">💰 Vos conditions</h3>
                      <ul style="margin: 10px 0;">
                        <li><strong>Commission :</strong> 40% sur chaque vente</li>
                        <li><strong>Plan PRO (9,99€) :</strong> Vous gagnez 3,99€</li>
                        <li><strong>Plan ELITE (19,99€) :</strong> Vous gagnez 7,99€</li>
                        <li><strong>Paiement minimum :</strong> 50€</li>
                        <li><strong>Mode de paiement :</strong> Stripe Connect</li>
                      </ul>
                    </div>
                    
                    <div style="text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL}/dashboard/affiliate" class="button">
                        Accéder à mon dashboard
                      </a>
                    </div>
                    
                    <h3>🚀 Prochaines étapes</h3>
                    <ol>
                      <li>Connectez-vous à votre dashboard ambassadeur</li>
                      <li>Récupérez vos liens de parrainage personnalisés</li>
                      <li>Partagez-les sur vos réseaux sociaux</li>
                      <li>Suivez vos clics et conversions en temps réel</li>
                      <li>Recevez vos commissions automatiquement</li>
                    </ol>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 30px;">
                      Vous avez des questions ? Répondez directement à cet email ou contactez-nous à contact@athlink.fr
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
      console.error('Erreur envoi email approbation:', emailError)
    }

    return NextResponse.json({
      success: true,
      affiliate,
      message: 'Affilié approuvé avec succès'
    })
  } catch (error) {
    console.error('Erreur approbation affilié:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation' },
      { status: 500 }
    )
  }
}

