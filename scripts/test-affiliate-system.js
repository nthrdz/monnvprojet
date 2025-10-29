/**
 * Script de test pour le système d'affiliation
 * Exécuter avec: node scripts/test-affiliate-system.js
 */

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function testAffiliateSystem() {
  console.log('🧪 Test du système d\'affiliation AthLink')
  console.log('=====================================\n')

  try {
    // 1. Test de candidature d'affiliation
    console.log('1. Test de candidature d\'affiliation...')
    const applyResponse = await fetch(`${BASE_URL}/api/affiliate/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bankAccount: 'FR76 1234 5678 9012 3456 7890 123',
        paypalEmail: 'test@example.com',
        notes: 'Test d\'affiliation automatique'
      })
    })

    if (applyResponse.ok) {
      const applyData = await applyResponse.json()
      console.log('✅ Candidature soumise:', applyData.affiliate.affiliateCode)
      
      const affiliateCode = applyData.affiliate.affiliateCode
      
      // 2. Test de tracking de parrainage
      console.log('\n2. Test de tracking de parrainage...')
      const trackResponse = await fetch(`${BASE_URL}/api/affiliate/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateCode: affiliateCode,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Test Browser)',
          referrerUrl: 'https://google.com',
          utmSource: 'test',
          utmMedium: 'email',
          utmCampaign: 'test-campaign'
        })
      })

      if (trackResponse.ok) {
        const trackData = await trackResponse.json()
        console.log('✅ Parrainage tracké:', trackData.referralId)
        
        // 3. Test de conversion
        console.log('\n3. Test de conversion...')
        const convertResponse = await fetch(`${BASE_URL}/api/affiliate/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralId: trackData.referralId,
            userId: 'test-user-id',
            conversionType: 'SIGNUP',
            conversionValue: 29.99
          })
        })

        if (convertResponse.ok) {
          const convertData = await convertResponse.json()
          console.log('✅ Conversion enregistrée:', convertData.commission.amount + '€')
        } else {
          console.log('❌ Erreur conversion:', await convertResponse.text())
        }
      } else {
        console.log('❌ Erreur tracking:', await trackResponse.text())
      }
    } else {
      console.log('❌ Erreur candidature:', await applyResponse.text())
    }

    // 4. Test de validation de code promo avec parrainage
    console.log('\n4. Test d\'inscription avec code de parrainage...')
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123',
        name: 'Test User',
        username: `testuser${Date.now()}`,
        sport: 'Course à pied',
        referralCode: 'AMB123456' // Code de test
      })
    })

    if (signupResponse.ok) {
      console.log('✅ Inscription avec parrainage réussie')
    } else {
      console.log('❌ Erreur inscription:', await signupResponse.text())
    }

    console.log('\n🎉 Tests terminés!')
    console.log('\nPour tester manuellement:')
    console.log(`1. Allez sur ${BASE_URL}/dashboard/affiliate/apply`)
    console.log('2. Soumettez une candidature')
    console.log('3. Une fois approuvé, partagez votre lien de parrainage')
    console.log('4. Testez l\'inscription avec le code de parrainage')

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message)
  }
}

// Fonction pour tester les APIs d'administration
async function testAdminAPIs() {
  console.log('\n🔧 Test des APIs d\'administration...')
  
  try {
    // Test de récupération des affiliés
    const affiliatesResponse = await fetch(`${BASE_URL}/api/admin/affiliates`)
    
    if (affiliatesResponse.ok) {
      const data = await affiliatesResponse.json()
      console.log('✅ Récupération des affiliés:', data.affiliates.length, 'ambassadeurs')
    } else {
      console.log('❌ Erreur récupération affiliés:', await affiliatesResponse.text())
    }
  } catch (error) {
    console.error('❌ Erreur API admin:', error.message)
  }
}

// Exécuter les tests
if (require.main === module) {
  testAffiliateSystem()
    .then(() => testAdminAPIs())
    .catch(console.error)
}

module.exports = { testAffiliateSystem, testAdminAPIs }
