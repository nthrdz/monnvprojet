import { PrismaClient } from "@prisma/client"
import { Resend } from "resend"
import { config } from "dotenv"
import { resolve } from "path"

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), ".env.local") })

const prisma = new PrismaClient()
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

async function sendUpgradePromotion() {
  try {
    if (!resend) {
      console.error("❌ RESEND_API_KEY non configurée")
      return
    }

    // Récupérer les utilisateurs FREE
    const freeUsers = await prisma.user.findMany({
      where: {
        profile: {
          plan: "FREE"
        }
      },
      include: {
        profile: {
          select: {
            displayName: true,
            username: true
          }
        }
      }
    })

    // Ajouter l'utilisateur spécifique
    const specificUser = await prisma.user.findUnique({
      where: { email: "llllolrdz@gmail.com" },
      include: {
        profile: {
          select: {
            displayName: true,
            username: true,
            plan: true
          }
        }
      }
    })

    const usersToEmail = [...freeUsers]
    if (specificUser && !freeUsers.find(u => u.email === specificUser.email)) {
      usersToEmail.push(specificUser)
    }

    console.log(`📧 Envoi d'emails de promotion à ${usersToEmail.length} utilisateur(s)...\n`)

    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Découvrez les fonctionnalités premium d'AthLink</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">AthLink</h1>
              <p style="margin: 10px 0 0 0; color: #d1d5db; font-size: 16px;">Votre link-in-bio pour athlètes</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">Bonjour {{DISPLAY_NAME}},</h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Nous espérons que vous profitez d'AthLink ! Nous avons pensé que vous seriez intéressé(e) par les fonctionnalités supplémentaires disponibles avec nos plans premium.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid #111827; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 20px; font-weight: 600;">✨ Fonctionnalités Premium</h3>
                
                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 16px;">🎨 Personnalisation avancée</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Thèmes personnalisés, couleurs sur mesure, et design unique pour votre profil.</p>
                </div>

                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 16px;">📊 Analytics détaillées</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Suivez vos statistiques de vues, clics, et engagement en temps réel.</p>
                </div>

                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 16px;">🔗 Liens illimités</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Ajoutez autant de liens que vous souhaitez à votre profil.</p>
                </div>

                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 16px;">🏆 Compétitions et sponsors</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Mettez en avant vos compétitions et partenaires sponsor.</p>
                </div>

                <div style="margin-bottom: 0;">
                  <p style="margin: 0 0 8px 0; color: #111827; font-weight: 600; font-size: 16px;">📸 Galerie média</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Partagez vos meilleures photos et vidéos avec votre communauté.</p>
                </div>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXTAUTH_URL || "https://athlink.fr"}/dashboard/upgrade" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Découvrir les plans premium</a>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Si vous avez des questions, n'hésitez pas à nous contacter. Nous sommes là pour vous aider à tirer le meilleur parti d'AthLink.
              </p>

              <p style="margin: 20px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                L'équipe AthLink
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px;">
                Vous recevez cet email car vous êtes inscrit(e) sur AthLink.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${process.env.NEXTAUTH_URL || "https://athlink.fr"}/dashboard/settings" style="color: #6b7280; text-decoration: underline;">Gérer mes préférences</a> | 
                <a href="mailto:contact@athlink.fr" style="color: #6b7280; text-decoration: underline;">Nous contacter</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    let successCount = 0
    let errorCount = 0

    for (const user of usersToEmail) {
      try {
        const displayName = user.profile?.displayName || user.name || "Athlète"
        const personalizedHtml = emailHtml.replace(/{{DISPLAY_NAME}}/g, displayName)

        const result = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "AthLink <noreply@athlink.fr>",
          to: user.email,
          subject: "Découvrez les fonctionnalités premium d'AthLink",
          html: personalizedHtml,
          headers: {
            "List-Unsubscribe": `<${process.env.NEXTAUTH_URL || "https://athlink.fr"}/dashboard/settings>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
          }
        })

        if (result.error) {
          console.error(`❌ Erreur pour ${user.email}:`, result.error)
          errorCount++
        } else {
          console.log(`✅ Email envoyé à: ${displayName} (${user.email})`)
          successCount++
        }

        // Attendre 500ms entre chaque email pour éviter rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        console.error(`❌ Erreur pour ${user.email}:`, error.message)
        errorCount++
      }
    }

    console.log(`\n✅ Envoi terminé:`)
    console.log(`   - Succès: ${successCount}`)
    console.log(`   - Erreurs: ${errorCount}`)
    console.log(`   - Total: ${usersToEmail.length}`)

  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    await prisma.$disconnect()
  }
}

sendUpgradePromotion()


