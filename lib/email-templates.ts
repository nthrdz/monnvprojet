/**
 * 📧 Templates d'emails pour Resend
 */

export const upgradeEmailTemplate = (username: string, plan: 'PRO' | 'ELITE') => {
  const benefits = plan === 'ELITE' ? {
    price: '25,90€',
    features: [
      '✅ Profil 100% personnalisé',
      '✅ Analytics avancées en temps réel',
      '✅ Export PDF de tes performances',
      '✅ Gestion illimitée de sponsors',
      '✅ Galerie photo et vidéo illimitée',
      '✅ Accès au système d\'affiliation (40% de commission)',
      '✅ Badge "ELITE" sur ton profil',
      '✅ Support prioritaire 24/7',
      '✅ Accès aux futures fonctionnalités en avant-première'
    ]
  } : {
    price: '9,90€',
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header avec logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 40px 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0 0 10px 0; font-weight: bold;">
                🚀 Athlink
              </h1>
              <p style="color: #cccccc; font-size: 16px; margin: 0;">
                Le profil digital des athlètes
              </p>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Salutation -->
              <p style="color: #333333; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
                Salut <strong>${username}</strong> ! 👋
              </p>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Tu utilises actuellement <strong>Athlink FREE</strong>, et c'est super ! Mais tu passes à côté de fonctionnalités <strong>incroyables</strong> qui pourraient propulser ta carrière sportive au niveau supérieur. 🔥
              </p>

              <!-- Badge plan -->
              <div style="background: linear-gradient(135deg, ${plan === 'ELITE' ? '#FFD700' : '#4A90E2'} 0%, ${plan === 'ELITE' ? '#FFA500' : '#357ABD'} 100%); border-radius: 12px; padding: 30px; margin: 0 0 30px 0; text-align: center;">
                <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 10px 0; font-weight: bold;">
                  Plan ${plan}
                </h2>
                <p style="color: #ffffff; font-size: 42px; font-weight: bold; margin: 0;">
                  ${benefits.price}<span style="font-size: 24px;">/mois</span>
                </p>
                <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 10px 0 0 0;">
                  Sans engagement • Résiliable à tout moment
                </p>
              </div>

              <!-- Liste des avantages -->
              <h3 style="color: #333333; font-size: 20px; margin: 0 0 20px 0; font-weight: bold;">
                🎯 Ce que tu obtiens avec ${plan} :
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                ${benefits.features.map(feature => `
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                      <p style="color: #555555; font-size: 15px; margin: 0; line-height: 1.5;">
                        ${feature}
                      </p>
                    </td>
                  </tr>
                `).join('')}
              </table>

              ${plan === 'ELITE' ? `
              <!-- Bonus ELITE -->
              <div style="background-color: #FFF8E1; border-left: 4px solid #FFD700; padding: 20px; margin: 0 0 30px 0; border-radius: 8px;">
                <p style="color: #F57F17; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">
                  🎁 BONUS ELITE : Système d'affiliation
                </p>
                <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;">
                  Gagne <strong>40% de commission récurrente</strong> sur chaque athlète que tu parraine. Un seul filleul ELITE = <strong>10,36€/mois à vie</strong> ! 💰
                </p>
              </div>
              ` : ''}

              <!-- CTA Principal -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://athlink.fr/dashboard/upgrade?plan=${plan}" style="display: inline-block; background: linear-gradient(135deg, ${plan === 'ELITE' ? '#FFD700' : '#4A90E2'} 0%, ${plan === 'ELITE' ? '#FFA500' : '#357ABD'} 100%); color: #ffffff; font-size: 18px; font-weight: bold; text-decoration: none; padding: 18px 50px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: transform 0.2s;">
                      🚀 Passer ${plan} maintenant
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Témoignage -->
              <div style="background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 0 0 30px 0;">
                <p style="color: #666666; font-size: 15px; font-style: italic; margin: 0 0 15px 0; line-height: 1.6;">
                  "Depuis que je suis passé ${plan}, j'ai trouvé 3 nouveaux sponsors et ma visibilité a explosé. Le retour sur investissement est incroyable !"
                </p>
                <p style="color: #999999; font-size: 13px; margin: 0;">
                  — Nathan R., Athlète ELITE
                </p>
              </div>

              <!-- Garantie -->
              <div style="text-align: center; margin: 0 0 20px 0;">
                <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                  ✅ Paiement sécurisé avec Stripe
                </p>
                <p style="color: #666666; font-size: 14px; margin: 0;">
                  ✅ Résiliable à tout moment, sans frais cachés
                </p>
              </div>

              <!-- Questions -->
              <p style="color: #999999; font-size: 13px; text-align: center; margin: 30px 0 0 0; line-height: 1.5;">
                Des questions ? Réponds simplement à cet email, on est là pour t'aider ! 💪
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999999; font-size: 13px; margin: 0 0 10px 0;">
                Athlink - Le profil digital des athlètes
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0 0 15px 0;">
                <a href="https://athlink.fr" style="color: #4A90E2; text-decoration: none;">athlink.fr</a> •
                <a href="https://athlink.fr/${username}" style="color: #4A90E2; text-decoration: none;">Ton profil</a> •
                <a href="https://athlink.fr/dashboard" style="color: #4A90E2; text-decoration: none;">Dashboard</a>
              </p>
              <p style="color: #cccccc; font-size: 11px; margin: 0;">
                Tu reçois cet email car tu es inscrit sur Athlink.
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

export const upgradeEmailSubject = (plan: 'PRO' | 'ELITE') => {
  const subjects = {
    PRO: '🚀 Débloque tout le potentiel de ton profil Athlink',
    ELITE: '👑 Deviens ELITE et gagne jusqu\'à 40% de commission'
  }
  return subjects[plan]
}

