/**
 * 🧪 Script de test pour vérifier l'intégration FirstPromoter
 * 
 * Ce script vérifie :
 * 1. Si le SDK FirstPromoter est chargé
 * 2. Si les cookies sont créés
 * 3. Si le tracking ID est disponible
 */

console.log('🧪 TEST FIRSTPROMOTER')
console.log('===================\n')

// Vérifier si on est dans un navigateur
if (typeof window === 'undefined') {
  console.error('❌ Ce script doit être exécuté dans un navigateur')
  process.exit(1)
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runTests)
} else {
  runTests()
}

function runTests() {
  console.log('1️⃣ Vérification du SDK FirstPromoter...')
  
  // Vérifier si fpr existe
  if (typeof window.fpr === 'function') {
    console.log('✅ window.fpr est défini')
  } else {
    console.error('❌ window.fpr n\'est pas défini')
    console.log('   → Le script FirstPromoter n\'est peut-être pas chargé')
  }
  
  // Vérifier si FPROM existe
  if (window.FPROM) {
    console.log('✅ window.FPROM existe')
    console.log('   → FPROM.data:', window.FPROM.data)
    if (window.FPROM.data?.tid) {
      console.log('   ✅ Tracking ID trouvé:', window.FPROM.data.tid)
    } else {
      console.log('   ⚠️ Tracking ID non trouvé dans FPROM.data')
    }
  } else {
    console.error('❌ window.FPROM n\'existe pas')
    console.log('   → Le SDK FirstPromoter n\'est peut-être pas complètement chargé')
  }
  
  console.log('\n2️⃣ Vérification des cookies...')
  
  const cookies = document.cookie.split(';')
  let foundCookies = false
  
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name.startsWith('_fprom')) {
      foundCookies = true
      console.log(`✅ Cookie trouvé: ${name} = ${value}`)
    }
  })
  
  if (!foundCookies) {
    console.log('⚠️ Aucun cookie FirstPromoter trouvé')
    console.log('   → Cela peut être normal si vous n\'êtes pas arrivé via un lien d\'affiliation')
  }
  
  console.log('\n3️⃣ Test de récupération du Tracking ID...')
  
  function getFPTid() {
    // Méthode 1: window.FPROM.data.tid
    if (window.FPROM?.data?.tid) {
      return window.FPROM.data.tid
    }
    
    // Méthode 2: Cookie _fprom_tid
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === '_fprom_tid' && value) {
        return decodeURIComponent(value)
      }
    }
    
    return null
  }
  
  const tid = getFPTid()
  if (tid) {
    console.log('✅ Tracking ID récupéré:', tid)
  } else {
    console.log('⚠️ Aucun Tracking ID trouvé')
    console.log('   → Testez avec un lien d\'affiliation: https://athlink.fr/?fpr=ton_code')
  }
  
  console.log('\n4️⃣ Vérification de l\'URL actuelle...')
  const urlParams = new URLSearchParams(window.location.search)
  const fprParam = urlParams.get('fpr')
  if (fprParam) {
    console.log('✅ Paramètre fpr trouvé dans l\'URL:', fprParam)
    console.log('   → FirstPromoter devrait créer un cookie dans quelques secondes')
  } else {
    console.log('⚠️ Aucun paramètre fpr dans l\'URL')
    console.log('   → Testez avec: https://athlink.fr/?fpr=ton_code')
  }
  
  console.log('\n📊 RÉSUMÉ')
  console.log('==========')
  console.log('Pour tester complètement:')
  console.log('1. Visitez: https://athlink.fr/?fpr=ton_code')
  console.log('2. Attendez 2-3 secondes que le SDK charge')
  console.log('3. Ouvrez la console et vérifiez les cookies')
  console.log('4. Allez sur /dashboard/upgrade et vérifiez les logs')
}

