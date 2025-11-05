import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * API pour demander la réinitialisation du mot de passe
 * Génère un token unique et envoie un email avec le lien de réinitialisation
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    console.log("🔒 Demande de réinitialisation de mot de passe pour:", email)

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // ⚠️ Pour la sécurité, on renvoie toujours un message de succès
    // même si l'email n'existe pas (évite l'énumération des emails)
    if (!user) {
      console.log("⚠️ Email non trouvé, mais on renvoie quand même un succès")
      return NextResponse.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé"
      })
    }

    // Vérifier que l'utilisateur a un mot de passe (pas OAuth uniquement)
    if (!user.password) {
      console.log("⚠️ Utilisateur OAuth sans mot de passe")
      return NextResponse.json({
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé"
      })
    }

    // Générer un token aléatoire sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Le token expire dans 1 heure
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 heure

    // Sauvegarder le token dans la DB
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires
      }
    })

    console.log("✅ Token généré:", resetToken.substring(0, 10) + "...")
    console.log("⏰ Expire à:", resetTokenExpires.toISOString())

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`
    
    console.log("\n🔗🔗🔗 LIEN DE RÉINITIALISATION 🔗🔗🔗")
    console.log(resetUrl)
    console.log("🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗🔗\n")

    // Envoyer l'email
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY non configurée")
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    try {
      console.log("📧 Tentative d'envoi d'email via Resend...")
      console.log("   - De: Athlink <noreply@athlink.fr>")
      console.log("   - À:", user.email)
      
      const emailResult = await resend.emails.send({
        from: 'Athlink <noreply@athlink.fr>',
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe Athlink',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🔐 Réinitialisation de mot de passe</h1>
                </div>
                <div class="content">
                  <p>Bonjour ${user.name || 'Athlète'},</p>
                  
                  <p>Vous avez demandé à réinitialiser votre mot de passe Athlink.</p>
                  
                  <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                  
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">
                      Réinitialiser mon mot de passe
                    </a>
                  </div>
                  
                  <div class="warning">
                    <strong>⏰ Attention :</strong> Ce lien expire dans <strong>1 heure</strong>.
                  </div>
                  
                  <p style="color: #666; font-size: 14px;">
                    Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                    <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                  
                  <p style="color: #999; font-size: 13px;">
                    <strong>Vous n'avez pas demandé cette réinitialisation ?</strong><br>
                    Ignorez cet email. Votre mot de passe restera inchangé.
                  </p>
                </div>
                <div class="footer">
                  <p>Athlink - Plateforme pour athlètes</p>
                  <p>contact@athlink.fr</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      console.log("✅ Email de réinitialisation envoyé à:", user.email)
      console.log("📬 ID de l'email Resend:", emailResult)

      return NextResponse.json({
        success: true,
        message: "Un email de réinitialisation a été envoyé"
      })

    } catch (emailError: any) {
      console.error("❌ Erreur envoi email:", emailError)
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('❌ Erreur forgot-password:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

