require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPromoCodes() {
  console.log('🧪 Test des codes promo...\n')

  try {
    // Test 1: Code ELITE
    console.log('1️⃣ Test du code ELITE...')
    const eliteResponse = await fetch('http://localhost:3000/api/promo-codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ELITE' })
    })
    
    const eliteData = await eliteResponse.json()
    console.log('✅ ELITE:', eliteData)
    console.log('   → Type:', eliteData.type)
    console.log('   → Plan:', eliteData.plan)
    console.log('   → Description:', eliteData.description)
    console.log('')

    // Test 2: Code ATHLINK100
    console.log('2️⃣ Test du code ATHLINK100...')
    const athlinkResponse = await fetch('http://localhost:3000/api/promo-codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ATHLINK100' })
    })
    
    const athlinkData = await athlinkResponse.json()
    console.log('✅ ATHLINK100:', athlinkData)
    console.log('   → Type:', athlinkData.type)
    console.log('   → Plan:', athlinkData.plan)
    console.log('   → Duration:', athlinkData.duration, 'jours')
    console.log('   → Description:', athlinkData.description)
    console.log('')

    // Test 3: Code invalide
    console.log('3️⃣ Test d\'un code invalide...')
    const invalidResponse = await fetch('http://localhost:3000/api/promo-codes/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'INVALID' })
    })
    
    const invalidData = await invalidResponse.json()
    console.log('❌ Code invalide:', invalidData)
    console.log('   → Valid:', invalidData.valid)
    console.log('   → Error:', invalidData.error)
    console.log('')

    // Test 4: Test d'inscription avec code ELITE
    console.log('4️⃣ Test d\'inscription avec code ELITE...')
    const eliteUserData = {
      name: 'Test Elite User',
      username: 'test-elite-' + Date.now(),
      email: 'test-elite-' + Date.now() + '@example.com',
      password: 'testpassword123',
      sport: 'RUNNING'
    }
    
    console.log('   → UserData:', JSON.stringify(eliteUserData, null, 2))
    
    const eliteSignupResponse = await fetch('http://localhost:3000/api/promo-codes/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promoCode: 'ELITE',
        userData: eliteUserData
      })
    })
    
    const signupData = await signupResponse.json()
    console.log('   → Status:', signupResponse.status)
    console.log('   → Response:', JSON.stringify(signupData, null, 2))
    
    if (signupResponse.ok) {
      console.log('✅ Inscription réussie avec ELITE:')
      console.log('   → Plan:', signupData.user.plan)
      console.log('   → Promo applied:', signupData.user.promoApplied)
      console.log('   → Trial ends:', signupData.user.trialEndsAt)
    } else {
      console.log('❌ Erreur inscription:', signupData.error)
    }

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error)
  }
}

// Fonction pour nettoyer les comptes de test
async function cleanupTestAccounts() {
  console.log('\n🧹 Nettoyage des comptes de test...')
  
  try {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test-elite-' } },
          { email: { contains: 'test-athlink-' } }
        ]
      }
    })
    
    console.log(`✅ ${deletedUsers.count} comptes de test supprimés`)
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error)
  }
}

// Exécution
async function main() {
  await testPromoCodes()
  await cleanupTestAccounts()
  
  await prisma.$disconnect()
  console.log('\n🎉 Tests terminés !')
}

main().catch(console.error)
