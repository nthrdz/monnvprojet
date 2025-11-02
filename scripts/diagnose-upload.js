/**
 * Script de diagnostic complet pour l'upload d'images
 */

console.log("============================================")
console.log("🔍 DIAGNOSTIC SYSTÈME D'UPLOAD")
console.log("============================================\n")

// 1. Vérifier les variables d'environnement
console.log("📋 1. VARIABLES D'ENVIRONNEMENT\n")

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL'
]

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 50)}...`)
  } else {
    console.log(`❌ ${varName}: MANQUANT`)
  }
})

console.log("\n============================================")
console.log("📦 2. TEST SUPABASE CLIENT\n")

try {
  const { supabase } = require('./lib/supabase')
  
  if (!supabase) {
    console.log("❌ Supabase client est NULL")
    console.log("   → Les variables d'environnement sont probablement manquantes")
  } else {
    console.log("✅ Supabase client initialisé")
    
    // Test de connexion au bucket
    console.log("\n📋 3. TEST BUCKET SUPABASE\n")
    
    supabase.storage
      .from('athlink-images')
      .list('', { limit: 1 })
      .then(({ data, error }) => {
        if (error) {
          console.log("❌ Erreur bucket:", error.message)
          if (error.message.includes('not found')) {
            console.log("\n🔧 SOLUTION: Le bucket 'athlink-images' n'existe pas !")
            console.log("   → Crée-le dans Supabase Dashboard:")
            console.log("   → 1. Va sur https://supabase.com/dashboard/project/ioyklugzwavjyondimwd/storage/buckets")
            console.log("   → 2. Clique sur 'New bucket'")
            console.log("   → 3. Nom: athlink-images")
            console.log("   → 4. Public: OUI")
            console.log("   → 5. Clique sur 'Create bucket'")
          }
        } else {
          console.log("✅ Bucket 'athlink-images' accessible")
          console.log(`   → ${data ? data.length : 0} fichier(s) trouvé(s)`)
        }
        
        console.log("\n============================================")
        console.log("📊 RÉSUMÉ\n")
        
        const allGood = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
                       supabase && 
                       !error
        
        if (allGood) {
          console.log("✅ TOUT EST CONFIGURÉ CORRECTEMENT !")
          console.log("   L'upload devrait fonctionner.")
        } else {
          console.log("❌ PROBLÈMES DÉTECTÉS")
          console.log("   Voir les erreurs ci-dessus.")
        }
        console.log("============================================")
      })
  }
} catch (error) {
  console.log("❌ Erreur lors du chargement de Supabase:", error.message)
}

