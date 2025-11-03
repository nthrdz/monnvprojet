import { Resend } from 'resend'

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Envoyer un email de bienvenue après inscription
 */
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Athlink <onboarding@athlink.app>',
      to,
      subject: '🎉 Bienvenue sur Athlink !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827; font-size: 28px; font-weight: bold;">Bienvenue ${name} ! 👋</h1>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Nous sommes ravis de t'accueillir sur Athlink, le link-in-bio conçu pour les athlètes.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin: 24px 0;">
            <h2 style="color: white; font-size: 20px; margin: 0 0 12px 0;">Prochaines étapes :</h2>
            <ul style="color: white; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Personnalise ton profil athlink.app/${name.toLowerCase().replace(/\s+/g, '')}</li>
              <li>Ajoute tes liens importants</li>
              <li>Partage tes prochaines compétitions</li>
              <li>Ajoute tes sponsors et partenaires</li>
            </ul>
          </div>
          
          <a href="https://athlink.app/dashboard" 
             style="display: inline-block; background: #111827; color: white; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; margin: 12px 0;">
            Accéder à mon dashboard
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
            Si tu as des questions, n'hésite pas à nous contacter.<br>
            L'équipe Athlink 💪
          </p>
        </div>
      `
    })
    
    console.log('✅ Email de bienvenue envoyé à:', to)
    return { success: true }
  } catch (error) {
    console.error('❌ Erreur envoi email de bienvenue:', error)
    return { success: false, error }
  }
}

/**
 * Envoyer une notification de nouvelle demande de coaching
 */
export async function sendBookingNotification(
  coachEmail: string,
  clientName: string,
  clientEmail: string,
  service: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: 'Athlink Coaching <coaching@athlink.app>',
      to: coachEmail,
      subject: `📩 Nouvelle demande de réservation de ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827; font-size: 24px; font-weight: bold;">Nouvelle demande de réservation 📩</h1>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #111827;">
            <p style="margin: 8px 0;"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${clientEmail}</p>
            <p style="margin: 8px 0;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 8px 0;"><strong>Message:</strong></p>
            <p style="color: #4b5563; margin: 12px 0; padding: 12px; background: white; border-radius: 8px;">
              ${message}
            </p>
          </div>
          
          <a href="https://athlink.app/dashboard/coaching" 
             style="display: inline-block; background: #111827; color: white; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; margin: 12px 0;">
            Voir dans mon dashboard
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
            Réponds rapidement pour ne pas manquer cette opportunité !<br>
            L'équipe Athlink 💪
          </p>
        </div>
      `
    })
    
    console.log('✅ Notification de réservation envoyée à:', coachEmail)
    return { success: true }
  } catch (error) {
    console.error('❌ Erreur envoi notification réservation:', error)
    return { success: false, error }
  }
}

/**
 * Envoyer une notification de nouveau parrainage (Programme Ambassadeur)
 */
export async function sendAffiliateSignupNotification(
  affiliateEmail: string,
  affiliateName: string,
  newUserEmail: string,
  planType: string
) {
  try {
    const commission = planType === 'ELITE' ? '10,36€' : '3,96€'
    
    await resend.emails.send({
      from: 'Athlink Programme Ambassadeur <affiliate@athlink.app>',
      to: affiliateEmail,
      subject: '🎉 Nouveau parrainage réussi !',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827; font-size: 28px; font-weight: bold;">Félicitations ${affiliateName} ! 🎉</h1>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Un nouvel athlète s'est inscrit via ton lien et a souscrit au plan <strong>${planType}</strong> !
          </p>
          
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
            <p style="color: white; font-size: 16px; margin: 0 0 8px 0;">Tu gagnes chaque mois :</p>
            <p style="color: white; font-size: 48px; font-weight: bold; margin: 0;">${commission}</p>
            <p style="color: white; font-size: 14px; margin: 8px 0 0 0; opacity: 0.9;">Tant qu'il reste abonné</p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Email du nouveau membre:</strong> ${newUserEmail}</p>
            <p style="margin: 8px 0;"><strong>Plan choisi:</strong> ${planType}</p>
          </div>
          
          <a href="https://athlink.app/dashboard/affiliate" 
             style="display: inline-block; background: #111827; color: white; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; margin: 12px 0;">
            Voir mes gains
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
            Continue à partager Athlink pour gagner encore plus !<br>
            L'équipe Athlink 💰
          </p>
        </div>
      `
    })
    
    console.log('✅ Notification parrainage envoyée à:', affiliateEmail)
    return { success: true }
  } catch (error) {
    console.error('❌ Erreur envoi notification parrainage:', error)
    return { success: false, error }
  }
}

export { resend }

