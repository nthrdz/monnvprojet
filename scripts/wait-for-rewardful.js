/**
 * ⏳ Attendre que Rewardful soit actif en production
 * 
 * Ce script vérifie toutes les 10 secondes si Rewardful est chargé sur athlink.fr
 */

const https = require('https');

let attemptCount = 0;
const maxAttempts = 30; // 5 minutes maximum (30 x 10 secondes)

function checkRewardful() {
  attemptCount++;
  
  const timeElapsed = Math.floor(attemptCount * 10 / 60);
  const minutesText = timeElapsed > 0 ? `${timeElapsed} minute${timeElapsed > 1 ? 's' : ''}` : `${attemptCount * 10} secondes`;
  
  console.log(`\n⏳ Tentative ${attemptCount}/${maxAttempts} (${minutesText})...`)

  https.get('https://athlink.fr', (res) => {
    let html = '';

    res.on('data', (chunk) => {
      html += chunk;
    });

    res.on('end', () => {
      const hasRewardfulScript = html.includes('r.wdfl.co/rw.js');
      const hasRewardfulKey = html.includes('data-rewardful="bf940c"');
      const hasRewardfulInit = html.includes('window,\'rewardful\'');

      if (hasRewardfulScript && hasRewardfulKey && hasRewardfulInit) {
        console.log('\n' + '='.repeat(70))
        console.log('\n🎉 SUCCÈS : Rewardful est maintenant actif en production !\n')
        console.log('✅ Script Rewardful chargé : https://r.wdfl.co/rw.js')
        console.log('✅ Clé API publique présente : data-rewardful="bf940c"')
        console.log('✅ Initialisation Rewardful détectée : window.rewardful')
        console.log('\n📊 Temps écoulé :', minutesText)
        console.log('\n🔗 Ton lien affilié est maintenant fonctionnel :')
        console.log('   https://athlink.fr/?via=nathan')
        console.log('\n🧪 Pour tester le tracking :')
        console.log('1. Ouvre : https://athlink.fr/?via=nathan')
        console.log('2. Console (F12) : document.cookie')
        console.log('3. Cherche : rewardful.referral=nathan')
        console.log('\n📈 Dashboard Rewardful :')
        console.log('   https://app.getrewardful.com/dashboard')
        console.log('\n' + '='.repeat(70) + '\n')
        process.exit(0);
      } else {
        console.log('   ❌ Rewardful pas encore chargé...')
        
        if (attemptCount >= maxAttempts) {
          console.log('\n' + '='.repeat(70))
          console.log('\n⚠️  TIMEOUT : Rewardful n\'est toujours pas actif après 5 minutes\n')
          console.log('🔧 Actions à faire :')
          console.log('1. Va sur https://vercel.com/dashboard')
          console.log('2. Vérifie que le dernier build est "Ready" (pas "Building" ou "Failed")')
          console.log('3. Si "Failed", vérifie les logs d\'erreur')
          console.log('4. Si "Building", attends encore 2-3 minutes')
          console.log('5. Vérifie que les variables d\'environnement sont sur Vercel :')
          console.log('   - NEXT_PUBLIC_REWARDFUL_API_KEY=bf940c')
          console.log('   - REWARDFUL_API_SECRET=88e0491c7cc82914f5377020f3655e2d')
          console.log('\n📝 Guide complet : ACTIVER_REWARDFUL.md\n')
          console.log('='.repeat(70) + '\n')
          process.exit(1);
        } else {
          // Attendre 10 secondes avant de réessayer
          setTimeout(checkRewardful, 10000);
        }
      }
    });

  }).on('error', (err) => {
    console.error('   ❌ Erreur réseau :', err.message)
    if (attemptCount < maxAttempts) {
      setTimeout(checkRewardful, 10000);
    } else {
      process.exit(1);
    }
  });
}

console.log('\n⏳ SURVEILLANCE DE L\'ACTIVATION REWARDFUL\n')
console.log('='.repeat(70))
console.log('\n🔍 Vérification de https://athlink.fr toutes les 10 secondes...')
console.log('⏱️  Timeout maximum : 5 minutes (30 tentatives)')
console.log('⌨️  Pour arrêter : Ctrl+C\n')

checkRewardful();

