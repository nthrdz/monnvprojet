/**
 * 📧 Envoyer des emails d'upgrade à tous les utilisateurs FREE
 * 
 * Usage:
 *   node scripts/send-upgrade-emails.js [PRO|ELITE|BOTH]
 * 
 * Exemples:
 *   node scripts/send-upgrade-emails.js ELITE  (envoie uniquement pour ELITE)
 *   node scripts/send-upgrade-emails.js BOTH   (envoie PRO et ELITE)
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Template email conversationnel optimisé pour boîte de réception principale
function getEmailHTML(username, plan) {
  const benefits = plan === 'ELITE' ? {
    price: '25,90€',
    features: [
      'Profil 100% personnalisé avec ton branding',
      'Analytics avancées en temps réel',
      'Export PDF de tes performances',
      'Gestion illimitée de sponsors',
      'Galerie photo et vidéo illimitée',
      'Système d\'affiliation (40% de commission)',
      'Badge ELITE sur ton profil',
      'Support prioritaire',
      'Accès aux futures fonctionnalités en avant-première'
    ]
  } : {
    price: '9,90€',
    features: [
      'Profil personnalisé',
      'Analytics de base',
      'Jusqu\'à 5 sponsors',
      'Galerie photo (10 images)',
      'Badge PRO sur ton profil',
      'Support par email'
    ]
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Une question sur ton profil Athlink</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 5px 0; font-weight: 600;">Athlink</h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px;">
              
              <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Bonjour ${username},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                J'espère que tu vas bien et que ton profil Athlink t'aide dans ton développement sportif.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Je voulais te parler rapidement de quelque chose qui pourrait t'intéresser. En ce moment, plusieurs athlètes nous demandent comment aller plus loin avec leur profil, notamment pour :
              </p>

              <ul style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0; padding-left: 20px;">
                <li style="margin-bottom: 10px;">Comprendre d'où vient leur audience</li>
                <li style="margin-bottom: 10px;">Mettre en avant leurs sponsors de manière professionnelle</li>
                <li style="margin-bottom: 10px;">Avoir des statistiques détaillées sur leurs performances</li>
                ${plan === 'ELITE' ? '<li style="margin-bottom: 10px;">Monétiser leur profil via le système d\'affiliation</li>' : ''}
              </ul>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                C'est pour ça que nous avons créé le plan ${plan}, qui inclut ces fonctionnalités et bien plus.
              </p>

              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 0 0 25px 0;">
                <p style="color: #1a1a1a; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">
                  Plan ${plan} - ${benefits.price}/mois
                </p>
                <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 0;">
                  ${benefits.features.join(' • ')}
                </p>
              </div>

              ${plan === 'ELITE' ? `
              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Petit plus intéressant : avec le plan ELITE, tu as accès à notre système d'affiliation. Concrètement, chaque personne que tu recommandes et qui s'inscrit te rapporte 40% de commission récurrente. Certains athlètes génèrent déjà plusieurs centaines d'euros par mois avec ça.
              </p>
              ` : ''}

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                Si ça t'intéresse, tu peux activer le plan ${plan} directement depuis ton dashboard : <a href="https://athlink.fr/dashboard/upgrade?plan=${plan}" style="color: #2563eb; text-decoration: underline;">athlink.fr/dashboard/upgrade</a>
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Évidemment, c'est sans engagement et tu peux résilier à tout moment. Le paiement est géré de manière sécurisée par Stripe.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                Si tu as des questions ou si tu veux discuter de comment mieux utiliser ton profil, n'hésite pas à me répondre directement.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 5px 0;">
                Sportivement,
              </p>
              <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7; margin: 0; font-weight: 500;">
                L'équipe Athlink
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding: 20px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.6;">
                Athlink - Le profil digital des athlètes<br>
                Tu reçois cet email car tu as un compte sur athlink.fr
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
}

async function sendUpgradeEmails(targetPlan = 'BOTH') {
  console.log('\n📧 ENVOI D\'EMAILS D\'UPGRADE AUX UTILISATEURS FREE\n')
  console.log('='.repeat(70))

  try {
    // Vérifier que RESEND_API_KEY est définie
    if (!process.env.RESEND_API_KEY) {
      console.error('\n❌ ERREUR: RESEND_API_KEY n\'est pas définie dans .env.local\n')
      console.log('📝 Pour configurer Resend:')
      console.log('1. Va sur https://resend.com/api-keys')
      console.log('2. Crée une nouvelle clé API')
      console.log('3. Ajoute dans .env.local: RESEND_API_KEY=re_xxxxxxxxx\n')
      process.exit(1)
    }

    // Récupérer tous les utilisateurs FREE
    const freeUsers = await prisma.profile.findMany({
      where: {
        plan: 'FREE'
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    console.log(`\n📊 Utilisateurs FREE trouvés : ${freeUsers.length}\n`)

    if (freeUsers.length === 0) {
      console.log('✅ Aucun utilisateur FREE à contacter.\n')
      return
    }

    // Déterminer quels plans promouvoir
    const plansToPromote = targetPlan === 'BOTH' ? ['PRO', 'ELITE'] : [targetPlan]

    console.log(`📤 Plan(s) à promouvoir : ${plansToPromote.join(', ')}\n`)
    console.log('⏳ Envoi en cours...\n')

    let successCount = 0
    let errorCount = 0

    // Importer dynamiquement Resend
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Ajouter llllolrdz@gmail.com (ELITE) à la liste d'envoi
    const extraRecipient = {
      username: 'nnthrdz',
      user: { email: 'llllolrdz@gmail.com' }
    }

    for (const profile of freeUsers) {
      for (const plan of plansToPromote) {
        try {
          const subject = plan === 'ELITE' 
            ? 'Ton profil Athlink - quelques idées pour aller plus loin'
            : 'Une question sur ton profil Athlink'

          const html = getEmailHTML(profile.username, plan)

          // Envoyer l'email
          const data = await resend.emails.send({
            from: 'Athlink <noreply@athlink.fr>',
            to: [profile.user.email],
            subject: subject,
            html: html
          })

          console.log(`✅ ${profile.username} (${profile.user.email}) - ${plan} - Envoyé (${data.id})`)
          successCount++

          // Attendre 500ms entre chaque email pour éviter rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
          console.error(`❌ ${profile.username} (${profile.user.email}) - ${plan} - ERREUR: ${error.message}`)
          errorCount++
        }
      }
    }

    // Envoyer aussi à llllolrdz@gmail.com
    console.log('\n📤 Envoi à l\'utilisateur supplémentaire (llllolrdz@gmail.com)...\n')
    for (const plan of plansToPromote) {
      try {
        const subject = plan === 'ELITE' 
          ? 'Ton profil Athlink - quelques idées pour aller plus loin'
          : 'Une question sur ton profil Athlink'

        const html = getEmailHTML(extraRecipient.username, plan)

        const data = await resend.emails.send({
          from: 'Athlink <noreply@athlink.fr>',
          to: [extraRecipient.user.email],
          subject: subject,
          html: html
        })

        console.log(`✅ ${extraRecipient.username} (${extraRecipient.user.email}) - ${plan} - Envoyé (${data.id})`)
        successCount++

        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`❌ ${extraRecipient.username} (${extraRecipient.user.email}) - ${plan} - ERREUR: ${error.message}`)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(70))
    console.log('\n📊 RÉSUMÉ\n')
    console.log(`   Total utilisateurs FREE  : ${freeUsers.length}`)
    console.log(`   Emails envoyés          : ${successCount}`)
    console.log(`   Erreurs                 : ${errorCount}`)
    console.log('\n✅ Campagne d\'emails terminée !\n')

  } catch (error) {
    console.error('\n❌ Erreur lors de l\'envoi des emails:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Récupérer le plan depuis les arguments
const targetPlan = process.argv[2] || 'BOTH'

if (!['PRO', 'ELITE', 'BOTH'].includes(targetPlan)) {
  console.log('\n❌ Usage: node scripts/send-upgrade-emails.js [PRO|ELITE|BOTH]\n')
  console.log('Exemples:')
  console.log('  node scripts/send-upgrade-emails.js ELITE  (envoie uniquement pour ELITE)')
  console.log('  node scripts/send-upgrade-emails.js PRO    (envoie uniquement pour PRO)')
  console.log('  node scripts/send-upgrade-emails.js BOTH   (envoie les deux)\n')
  process.exit(1)
}

sendUpgradeEmails(targetPlan)

