import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier le plan de l'utilisateur
    const profile = await prisma.profile.findFirst({
      where: { userId: session.user.id },
      include: { user: true }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est PRO ou ELITE
    if (profile.plan !== 'PRO' && profile.plan !== 'ELITE') {
      return NextResponse.json(
        { error: 'Vous devez être abonné PRO ou ELITE pour devenir ambassadeur' },
        { status: 403 }
      )
    }

    // Vérifier si l'utilisateur n'est pas déjà affilié
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { error: 'Vous avez déjà une candidature en cours ou vous êtes déjà ambassadeur' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { reason, expectations } = body

    // Générer un code d'affiliation unique
    const affiliateCode = `${profile.username.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // Créer l'affilié en attente
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        affiliateCode,
        status: 'PENDING',
        commissionRate: 0.40, // 40%
        // applicationEmail: session.user.email, // TODO: Activer après migration DB
        notes: `Email: ${session.user.email}\n\nRaison: ${reason}\n\nAttentes: ${expectations}`
      }
    })

    // Envoyer un email de notification à l'admin
    try {
      await resend.emails.send({
        from: 'Athlink <notifications@athlink.fr>',
        to: 'contact@athlink.fr',
        replyTo: session.user.email,
        subject: '🎯 Nouvelle candidature ambassadeur Athlink',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .label { font-weight: bold; color: #667eea; margin-top: 15px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🎯 Nouvelle candidature ambassadeur</h1>
                </div>
                <div class="content">
                  <p>Bonjour,</p>
                  <p>Une nouvelle candidature pour devenir ambassadeur Athlink a été reçue !</p>
                  
                  <div class="info-box">
                    <p class="label">👤 Utilisateur</p>
                    <p><strong>${profile.displayName}</strong> (@${profile.username})</p>
                    
                    <p class="label">📧 Email</p>
                    <p>${session.user.email}</p>
                    
                    <p class="label">💎 Plan actuel</p>
                    <p>${profile.plan}</p>
                    
                    <p class="label">🔗 Code d'affiliation généré</p>
                    <p><strong>${affiliateCode}</strong></p>
                    
                    <p class="label">📝 Raison de la candidature</p>
                    <p>${reason}</p>
                    
                    <p class="label">🎯 Attentes</p>
                    <p>${expectations}</p>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${process.env.NEXTAUTH_URL}/dashboard/admin/affiliates" class="button">
                      Voir les candidatures
                    </a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    <strong>Action requise :</strong> Connectez-vous au dashboard admin pour approuver ou rejeter cette candidature.
                  </p>
                </div>
                <div class="footer">
                  <p>Athlink - Plateforme de gestion pour athlètes</p>
                  <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
              </div>
            </body>
          </html>
        `
      })
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      // On continue même si l'email échoue
    }

    // Envoyer un email de confirmation au candidat
    try {
      await resend.emails.send({
        from: 'Athlink <notifications@athlink.fr>',
        to: session.user.email,
        subject: '✅ Votre candidature ambassadeur Athlink a été reçue',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">✅ Candidature reçue !</h1>
                </div>
                <div class="content">
                  <p>Bonjour ${profile.displayName},</p>
                  
                  <div class="success-box">
                    <p style="margin: 0; font-weight: bold; color: #155724;">
                      🎉 Votre candidature pour devenir ambassadeur Athlink a bien été reçue !
                    </p>
                  </div>
                  
                  <p>Notre équipe va examiner votre candidature dans les plus brefs délais.</p>
                  
                  <div class="info-box">
                    <h3 style="margin-top: 0; color: #667eea;">📋 Récapitulatif</h3>
                    <p><strong>Code d'affiliation :</strong> ${affiliateCode}</p>
                    <p><strong>Commission :</strong> 40% sur chaque vente</p>
                    <p><strong>Statut :</strong> En attente d'approbation</p>
                  </div>
                  
                  <h3>🎯 Prochaines étapes</h3>
                  <ol>
                    <li>Nous examinons votre profil et votre candidature</li>
                    <li>Vous recevrez un email une fois votre candidature approuvée</li>
                    <li>Vous pourrez alors accéder à votre dashboard ambassadeur</li>
                    <li>Vous recevrez votre lien d'affiliation unique et vos statistiques</li>
                  </ol>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    Vous avez des questions ? Répondez directement à cet email !
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
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError)
    }

    return NextResponse.json({
      success: true,
      affiliate,
      message: 'Candidature envoyée avec succès ! Vous recevrez une réponse par email.'
    })
  } catch (error) {
    console.error('Erreur application affilié:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la candidature' },
      { status: 500 }
    )
  }
}
