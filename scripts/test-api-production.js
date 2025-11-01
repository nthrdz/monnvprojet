// Test de l'API en production
const fetch = require('node-fetch');

async function testProductionAPI() {
  console.log('🧪 Test de l\'API en production\n');
  
  const baseUrl = 'https://athlink.fr';
  
  try {
    console.log('📡 Test de /api/stripe/create-checkout-session...\n');
    
    const response = await fetch(`${baseUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: 'PRO',
        billingCycle: 'monthly',
        promoCode: null
      })
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const data = await response.json();
    
    console.log('\n📦 Réponse:');
    console.log(JSON.stringify(data, null, 2));
    
    if (response.status === 500) {
      console.log('\n❌ ERREUR 500 DÉTECTÉE');
      console.log('Message d\'erreur:', data.error);
      console.log('Détails:', data.details);
    }
    
  } catch (error) {
    console.error('❌ Erreur réseau:', error.message);
  }
}

testProductionAPI();

