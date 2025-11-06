/**
 * 🧪 Script de test Rewardful en production
 * 
 * Vérifie que Rewardful est correctement configuré sur athlink.fr
 */

const https = require('https');

console.log('\n🧪 TEST REWARDFUL EN PRODUCTION\n');
console.log('='.repeat(60));

// Test 1 : Vérifier que le SDK Rewardful est chargé
console.log('\n✅ Test 1 : Vérification du SDK Rewardful...\n');

https.get('https://athlink.fr', (res) => {
  let html = '';

  res.on('data', (chunk) => {
    html += chunk;
  });

  res.on('end', () => {
    // Vérifier la présence du script Rewardful
    const hasRewardfulScript = html.includes('r.wdfl.co/rw.js');
    const hasRewardfulKey = html.includes('data-rewardful="bf940c"');
    const hasRewardfulInit = html.includes('window,\'rewardful\'');

    console.log('📊 Résultats :\n');
    
    if (hasRewardfulScript) {
      console.log('✅ Script Rewardful chargé : https://r.wdfl.co/rw.js');
    } else {
      console.log('❌ Script Rewardful NON trouvé dans le HTML');
    }

    if (hasRewardfulKey) {
      console.log('✅ Clé API publique présente : data-rewardful="bf940c"');
    } else {
      console.log('❌ Clé API publique NON trouvée');
    }

    if (hasRewardfulInit) {
      console.log('✅ Initialisation Rewardful détectée : window.rewardful');
    } else {
      console.log('❌ Initialisation Rewardful NON trouvée');
    }

    console.log('\n' + '='.repeat(60));

    if (hasRewardfulScript && hasRewardfulKey && hasRewardfulInit) {
      console.log('\n🎉 SUCCÈS : Rewardful est correctement configuré !\n');
      console.log('📝 Prochaines étapes :\n');
      console.log('1. Ouvre https://athlink.fr/?via=nathan');
      console.log('2. Ouvre la Console (F12)');
      console.log('3. Tape : window.rewardful');
      console.log('4. Tu devrais voir : {q: []}');
      console.log('\n🧪 Pour tester une conversion complète :');
      console.log('   → Lis le guide : TESTER_REWARDFUL.md');
    } else {
      console.log('\n⚠️  PROBLÈME : Rewardful n\'est pas encore configuré\n');
      console.log('🔧 Solutions possibles :\n');
      console.log('1. Attends 2-3 minutes que Vercel finisse de déployer');
      console.log('2. Vérifie que les clés sont bien ajoutées sur Vercel :');
      console.log('   - NEXT_PUBLIC_REWARDFUL_API_KEY=bf940c');
      console.log('   - REWARDFUL_API_SECRET=88e0491c7cc82914f5377020f3655e2d');
      console.log('3. Va sur Vercel Dashboard → Deployments');
      console.log('4. Vérifie que le dernier déploiement est "Ready"');
      console.log('5. Si nécessaire, redéploie manuellement');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n');
  });

}).on('error', (err) => {
  console.error('❌ Erreur lors de la requête :', err.message);
  console.log('\n⚠️  Impossible de contacter athlink.fr');
  console.log('Vérifie ta connexion internet et réessaie.\n');
});

