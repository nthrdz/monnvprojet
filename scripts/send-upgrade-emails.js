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

// Template email simplifié pour Node.js
function getEmailHTML(username, plan) {
  const benefits = plan === 'ELITE' ? {
    price: '25,90€',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    features: [
      '✅ Profil 100% personnalisé',
      '✅ Analytics avancées en temps réel',
      '✅ Export PDF de tes performances',
      '✅ Gestion illimitée de sponsors',
      '✅ Galerie photo et vidéo illimitée',
      '✅ Accès au système d\'affiliation (40% de commission)',
      '✅ Badge "ELITE" sur ton profil',
      '✅ Support prioritaire 24/7'
    ]
  } : {
    price: '9,90€',
    color: '#4A90E2',
    gradient: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
    features: [
      '✅ Profil personnalisé',
      '✅ Analytics de base',
      '✅ Jusqu\'à 5 sponsors',
      '✅ Galerie photo (10 images)',
      '✅ Badge "PRO" sur ton profil',
      '✅ Support par email'
    ]
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passe au plan ${plan} - Athlink</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0;">🚀 Athlink</h1>
              <p style="color: #cccccc; font-size: 16px; margin: 0;">Le profil digital des athlètes</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              
              <p style="color: #333333; font-size: 18px; margin: 0 0 20px 0;">
                Salut <strong>${username}</strong> ! 👋
              </p>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Tu utilises actuellement <strong>Athlink FREE</strong>, et c'est super ! Mais tu passes à côté de fonctionnalités <strong>incroyables</strong> qui pourraient propulser ta carrière sportive au niveau supérieur. 🔥
              </p>

              <div style="background: ${benefits.gradient}; border-radius: 12px; padding: 30px; margin: 0 0 30px 0; text-align: center;">
                <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0;">Plan ${plan}</h2>
                <p style="color: #ffffff; font-size: 42px; font-weight: bold; margin: 0;">
                  ${benefits.price}<span style="font-size: 24px;">/mois</span>
                </p>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">
                  Sans engagement • Résiliable à tout moment
                </p>
              </div>

              <h3 style="color: #333333; font-size: 20px; margin: 0 0 20px 0;">🎯 Ce que tu obtiens :</h3>

              ${benefits.features.map(f => `
                <p style="color: #555555; font-size: 15px; margin: 0 0 10px 0; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0;">
                  ${f}
                </p>
              `).join('')}

              ${plan === 'ELITE' ? `
              <div style="background-color: #FFF8E1; border-left: 4px solid #FFD700; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <p style="color: #F57F17; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  🎁 BONUS ELITE : Système d'affiliation
                </p>
                <p style="color: #666666; font-size: 14px; margin: 0;">
                  Gagne <strong>40% de commission récurrente</strong> sur chaque athlète que tu parraine. Un filleul ELITE = <strong>10,36€/mois à vie</strong> ! 💰
                </p>
              </div>
              ` : ''}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://athlink.fr/dashboard/upgrade?plan=${plan}" style="display: inline-block; background: ${benefits.gradient}; color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 18px 50px; border-radius: 50px;">
                      🚀 Passer ${plan} maintenant
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 30px 0;">
                <p style="color: #666666; font-size: 15px; font-style: italic; margin: 0 0 15px 0;">
                  "Depuis que je suis passé ${plan}, j'ai trouvé 3 nouveaux sponsors et ma visibilité a explosé !"
                </p>
                <p style="color: #999999; font-size: 13px; margin: 0;">— Nathan R., Athlète ELITE</p>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">✅ Paiement sécurisé avec Stripe</p>
                <p style="color: #666666; font-size: 14px; margin: 0;">✅ Résiliable à tout moment</p>
              </div>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999999; font-size: 13px; margin: 0 0 10px 0;">Athlink - Le profil digital des athlètes</p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                <a href="https://athlink.fr" style="color: #4A90E2; text-decoration: none;">athlink.fr</a> •
                <a href="https://athlink.fr/${username}" style="color: #4A90E2; text-decoration: none;">Ton profil</a>
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

    for (const profile of freeUsers) {
      for (const plan of plansToPromote) {
        try {
          const subject = plan === 'ELITE' 
            ? '👑 Deviens ELITE et gagne jusqu\'à 40% de commission'
            : '🚀 Débloque tout le potentiel de ton profil Athlink'

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

