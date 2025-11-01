/**
 * Script de diagnostic du système d'upgrade
 * Vérifie que tout est bien configuré pour les upgrades
 */

// Charger les variables d'environnement
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')
const Stripe = require('stripe')

const prisma = new PrismaClient()

async function main() {
  console.log("============================================")
  console.log("🔍 DIAGNOSTIC SYSTÈME D'UPGRADE")
  console.log("============================================\n")

  // 1. Vérifier les variables d'environnement
  console.log("📋 1. Vérification des variables d'environnement\n")
  
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID_ELITE_MONTHLY',
    'STRIPE_PRICE_ID_ELITE_YEARLY',
    'STRIPE_PRICE_ID_PRO_MONTHLY',
    'STRIPE_PRICE_ID_PRO_YEARLY',
    'DATABASE_URL',
  ]

  let allEnvVarsPresent = true
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: ${envVar.includes('SECRET') || envVar.includes('URL') ? '***' : process.env[envVar].substring(0, 20) + '...'}`)
    } else {
      console.log(`❌ ${envVar}: MANQUANT`)
      allEnvVarsPresent = false
    }
  }

  if (!allEnvVarsPresent) {
    console.log("\n❌ Certaines variables sont manquantes. Vérifiez votre .env.local")
    process.exit(1)
  }

  // 2. Vérifier la connexion Stripe
  console.log("\n📋 2. Vérification de la connexion Stripe\n")
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  
  try {
    const account = await stripe.balance.retrieve()
    console.log(`✅ Connexion Stripe réussie`)
    console.log(`   Mode: ${process.env.STRIPE_SECRET_KEY.includes('test') ? 'TEST' : 'LIVE'}`)
  } catch (error) {
    console.log(`❌ Erreur connexion Stripe: ${error.message}`)
    process.exit(1)
  }

  // 3. Vérifier que les Price IDs existent dans Stripe
  console.log("\n📋 3. Vérification des Price IDs dans Stripe\n")
  
  const priceIds = {
    'ELITE_MONTHLY': process.env.STRIPE_PRICE_ID_ELITE_MONTHLY,
    'ELITE_YEARLY': process.env.STRIPE_PRICE_ID_ELITE_YEARLY,
    'PRO_MONTHLY': process.env.STRIPE_PRICE_ID_PRO_MONTHLY,
    'PRO_YEARLY': process.env.STRIPE_PRICE_ID_PRO_YEARLY,
  }

  for (const [name, priceId] of Object.entries(priceIds)) {
    try {
      const price = await stripe.prices.retrieve(priceId)
      console.log(`✅ ${name}: ${priceId}`)
      console.log(`   - Montant: ${price.unit_amount / 100}€`)
      console.log(`   - Récurrence: ${price.recurring?.interval || 'N/A'}`)
    } catch (error) {
      console.log(`❌ ${name}: ${priceId} - ${error.message}`)
    }
  }

  // 4. Vérifier le webhook
  console.log("\n📋 4. Vérification du webhook Stripe\n")
  
  try {
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 })
    
    if (webhooks.data.length === 0) {
      console.log("⚠️  Aucun webhook configuré dans Stripe")
    } else {
      console.log(`✅ ${webhooks.data.length} webhook(s) configuré(s):\n`)
      
      for (const webhook of webhooks.data) {
        console.log(`   📍 URL: ${webhook.url}`)
        console.log(`   - Status: ${webhook.status}`)
        console.log(`   - Événements: ${webhook.enabled_events.join(', ')}`)
        console.log(`   - Secret: ${webhook.secret?.substring(0, 20)}...`)
        
        // Vérifier si c'est le bon webhook
        if (webhook.url.includes('athlink.fr') || webhook.url.includes('vercel.app')) {
          if (webhook.enabled_events.includes('checkout.session.completed')) {
            console.log(`   ✅ Ce webhook écoute bien checkout.session.completed`)
          } else {
            console.log(`   ⚠️  Ce webhook N'écoute PAS checkout.session.completed`)
          }
        }
        console.log()
      }
    }
  } catch (error) {
    console.log(`❌ Erreur récupération webhooks: ${error.message}`)
  }

  // 5. Vérifier la base de données
  console.log("📋 5. Vérification de la base de données\n")
  
  try {
    const usersCount = await prisma.user.count()
    const profilesCount = await prisma.profile.count()
    
    console.log(`✅ Connexion DB réussie`)
    console.log(`   - Utilisateurs: ${usersCount}`)
    console.log(`   - Profils: ${profilesCount}`)
    
    // Compter les profils par plan
    const plans = await prisma.profile.groupBy({
      by: ['plan'],
      _count: true
    })
    
    console.log(`\n   Distribution des plans:`)
    for (const plan of plans) {
      console.log(`   - ${plan.plan}: ${plan._count} utilisateur(s)`)
    }
    
  } catch (error) {
    console.log(`❌ Erreur connexion DB: ${error.message}`)
    process.exit(1)
  }

  // 6. Tester un utilisateur spécifique
  console.log("\n📋 6. Test d'un utilisateur\n")
  
  const testEmail = process.argv[2]
  if (testEmail) {
    console.log(`🔍 Recherche de l'utilisateur: ${testEmail}\n`)
    
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      include: { profile: true }
    })
    
    if (user) {
      console.log(`✅ Utilisateur trouvé:`)
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Email: ${user.email}`)
      console.log(`   - Nom: ${user.name}`)
      
      if (user.profile) {
        console.log(`\n   Profil:`)
        console.log(`   - ID: ${user.profile.id}`)
        console.log(`   - Username: ${user.profile.username}`)
        console.log(`   - Plan: ${user.profile.plan}`)
        console.log(`   - Stats: ${JSON.stringify(user.profile.stats, null, 2)}`)
      } else {
        console.log(`\n   ❌ Pas de profil associé`)
      }
    } else {
      console.log(`❌ Utilisateur non trouvé`)
    }
  } else {
    console.log(`ℹ️  Pour tester un utilisateur spécifique, lancez:`)
    console.log(`   node scripts/debug-upgrade-system.js email@example.com`)
  }

  console.log("\n============================================")
  console.log("✅ DIAGNOSTIC TERMINÉ")
  console.log("============================================\n")

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error("❌ Erreur:", e)
  await prisma.$disconnect()
  process.exit(1)
})

