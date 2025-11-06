/**
 * 🧪 Tester la configuration Resend
 * 
 * Ce script envoie un email de test à ton adresse pour vérifier que tout fonctionne
 */

require('dotenv').config({ path: '.env.local' })

async function testResend() {
  console.log('\n🧪 TEST DE LA CONFIGURATION RESEND\n')
  console.log('='.repeat(70))

  // 1. Vérifier que RESEND_API_KEY existe
  console.log('\n✅ Étape 1 : Vérification de la clé API...\n')
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERREUR: RESEND_API_KEY n\'est pas définie dans .env.local\n')
    console.log('📝 Pour configurer Resend:')
    console.log('1. Va sur https://resend.com/api-keys')
    console.log('2. Crée une nouvelle clé API')
    console.log('3. Ajoute dans .env.local: RESEND_API_KEY=re_xxxxxxxxx\n')
    process.exit(1)
  }

  console.log('✅ RESEND_API_KEY trouvée :', process.env.RESEND_API_KEY.substring(0, 10) + '...')

  // 2. Importer Resend
  console.log('\n✅ Étape 2 : Chargement de Resend...\n')
  
  try {
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    console.log('✅ Resend chargé avec succès')

    // 3. Envoyer un email de test
    console.log('\n✅ Étape 3 : Envoi d\'un email de test...\n')
    
    // Demander l'email de destination
    const testEmail = process.argv[2] || 'contact@athlink.fr'
    
    console.log(`📧 Destinataire : ${testEmail}`)
    console.log('⏳ Envoi en cours...\n')

    const data = await resend.emails.send({
      from: 'Athlink <noreply@athlink.fr>',
      to: [testEmail],
      subject: '🧪 Test Resend - Configuration réussie !',
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Resend</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
              <h1 style="color: #ffffff; font-size: 32px; margin: 0;">🎉</h1>
              <h2 style="color: #ffffff; font-size: 24px; margin: 10px 0 0 0;">Resend fonctionne !</h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px;">
              
              <p style="color: #333333; font-size: 18px; margin: 0 0 20px 0;">
                Bravo ! 🚀
              </p>

              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Ta configuration <strong>Resend</strong> est correcte et fonctionnelle.
              </p>

              <div style="background-color: #f0f9ff; border-left: 4px solid #4A90E2; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <p style="color: #333333; font-size: 15px; margin: 0 0 10px 0; font-weight: bold;">
                  ✅ Ce qui fonctionne :
                </p>
                <ul style="color: #555555; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>Clé API Resend valide</li>
                  <li>Envoi d'emails opérationnel</li>
                  <li>Templates HTML fonctionnels</li>
                </ul>
              </div>

              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <p style="color: #333333; font-size: 15px; margin: 0 0 10px 0; font-weight: bold;">
                  🚀 Prochaines étapes :
                </p>
                <ol style="color: #555555; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li>Envoyer les emails d'upgrade aux utilisateurs FREE</li>
                  <li>Configurer le domaine athlink.fr sur Resend (optionnel)</li>
                  <li>Suivre les résultats dans le dashboard Resend</li>
                </ol>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://athlink.fr/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%); color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 15px 40px; border-radius: 50px;">
                      Accéder au Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #999999; font-size: 13px; text-align: center; margin: 20px 0 0 0;">
                Pour envoyer la campagne d'emails, exécute :<br>
                <code style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 4px; font-size: 12px;">
                  node scripts/send-upgrade-emails.js ELITE
                </code>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; border-radius: 0 0 16px 16px;">
              <p style="color: #999999; font-size: 13px; margin: 0;">
                Athlink - Le profil digital des athlètes
              </p>
              <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                <a href="https://athlink.fr" style="color: #4A90E2; text-decoration: none;">athlink.fr</a>
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
    })

    console.log('✅ Email envoyé avec succès !')
    console.log(`   ID : ${data.id}`)
    console.log(`   Status : ${data.error ? 'Erreur' : 'Envoyé'}`)
    
    if (data.error) {
      console.error('\n❌ Erreur Resend :', data.error)
    } else {
      console.log('\n' + '='.repeat(70))
      console.log('\n🎉 TEST RÉUSSI !\n')
      console.log('📧 Vérifie ta boîte email (et les spams) pour voir l\'email de test.\n')
      console.log('📊 Pour suivre l\'email, va sur :')
      console.log(`   https://resend.com/emails/${data.id}\n`)
      console.log('🚀 Tu peux maintenant envoyer la campagne d\'emails :')
      console.log('   node scripts/send-upgrade-emails.js ELITE\n')
    }

  } catch (error) {
    console.error('\n❌ ERREUR:', error.message)
    
    if (error.message.includes('Invalid')) {
      console.log('\n⚠️  Ta clé API Resend est invalide.')
      console.log('📝 Vérifie que tu as bien copié la clé complète depuis https://resend.com/api-keys\n')
    }
  }

  console.log('='.repeat(70) + '\n')
}

// Si aucun email fourni, utiliser contact@athlink.fr par défaut
if (process.argv.length < 3) {
  console.log('\n💡 Usage: node scripts/test-resend.js <email>')
  console.log('   Exemple: node scripts/test-resend.js contact@athlink.fr\n')
  console.log('   Par défaut, l\'email sera envoyé à: contact@athlink.fr\n')
}

testResend()

