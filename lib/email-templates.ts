/**
 * 📧 Templates d'emails pour Resend
 */

export const upgradeEmailTemplate = (username: string, plan: 'PRO' | 'ELITE') => {
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
          
          <!-- Header simple -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 5px 0; font-weight: 600;">
                Athlink
              </h2>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              
              <!-- Message personnel -->
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

              <!-- Tarif simple -->
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

              <!-- CTA discret -->
              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                Si ça t'intéresse, tu peux activer le plan ${plan} directement depuis ton dashboard : <a href="https://athlink.fr/dashboard/upgrade?plan=${plan}" style="color: #2563eb; text-decoration: underline;">athlink.fr/dashboard/upgrade</a>
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 20px 0;">
                Évidemment, c'est sans engagement et tu peux résilier à tout moment. Le paiement est géré de manière sécurisée par Stripe.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                Si tu as des questions ou si tu veux discuter de comment mieux utiliser ton profil, n'hésite pas à me répondre directement.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; line-height: 1.7; margin: 0 0 5px 0;">
                Sportivement,
              </p>
              <p style="color: #1a1a1a; font-size: 16px; line-height: 1.7; margin: 0; font-weight: 500;">
                L'équipe Athlink
              </p>

            </td>
          </tr>

          <!-- Footer minimaliste -->
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

export const upgradeEmailSubject = (plan: 'PRO' | 'ELITE') => {
  const subjects = {
    PRO: 'Une question sur ton profil Athlink',
    ELITE: 'Ton profil Athlink - quelques idées pour aller plus loin'
  }
  return subjects[plan]
}

/**
 * 📧 Template pour notification admin (nouvelle inscription)
 */
export const newSignupAdminNotification = (data: {
  username: string
  plan: 'FREE' | 'PRO' | 'ELITE'
  sport?: string
  signupDate: string
  profileUrl: string
}) => {
  const planColors = {
    FREE: '#6B7280',
    PRO: '#3B82F6',
    ELITE: '#F59E0B'
  }

  const sportDisplay = data.sport && data.sport !== 'OTHER' 
    ? `<p style="color: #555555; font-size: 15px; margin: 0;"><strong>Sport :</strong> ${data.sport}</p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle inscription Athlink</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 40px; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); border-radius: 12px 12px 0 0;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;">
                🎉 Nouvelle inscription Athlink
              </h1>
            </td>
          </tr>

          <!-- Contenu -->
          <tr>
            <td style="padding: 30px 40px;">
              
              <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Un nouvel utilisateur vient de créer son compte sur Athlink !
              </p>

              <!-- Card informations -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 0 0 20px 0; border-left: 4px solid ${planColors[data.plan]};">
                
                <div style="margin-bottom: 15px;">
                  <p style="color: #111827; font-size: 18px; margin: 0 0 5px 0; font-weight: 600;">
                    ${data.username}
                  </p>
                  <p style="color: #6B7280; font-size: 14px; margin: 0;">
                    @${data.username}
                  </p>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                  <p style="color: #555555; font-size: 15px; margin: 0 0 10px 0;">
                    <strong>Plan :</strong> <span style="display: inline-block; background-color: ${planColors[data.plan]}; color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600;">${data.plan}</span>
                  </p>
                  <p style="color: #555555; font-size: 15px; margin: 0 0 10px 0;">
                    <strong>Date d'inscription :</strong> ${data.signupDate}
                  </p>
                  ${sportDisplay}
                </div>

              </div>

              <!-- Bouton profil public -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0 0 0;">
                <tr>
                  <td align="center">
                    <a href="${data.profileUrl}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 8px;">
                      👤 Voir le profil public
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
                Notification automatique Athlink Admin
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

