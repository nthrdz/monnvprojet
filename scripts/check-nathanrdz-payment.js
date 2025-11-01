/**
 * Vérifier le paiement de nathanrdz8314@gmail.com
 */

require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')
const { PrismaClient } = require('@prisma/client')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const prisma = new PrismaClient()

async function checkPayment() {
  console.log("============================================")
  console.log("🔍 VÉRIFICATION DU PAIEMENT nathanrdz8314@gmail.com")
  console.log("============================================\n")

  const targetEmail = 'nathanrdz8314@gmail.com'

  try {
    // 1. Vérifier dans la DB
    console.log("📋 1. VÉRIFICATION DANS LA BASE DE DONNÉES...\n")
    
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        profile: true
      }
    })

    if (user) {
      console.log(`✅ Utilisateur trouvé dans la DB:`)
      console.log(`   Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Plan actuel: ${user.profile?.plan || 'Aucun'}`)
      console.log(`   Username: ${user.profile?.username || 'Aucun'}`)
      console.log()
    } else {
      console.log(`❌ Aucun utilisateur trouvé dans la DB pour ${targetEmail}\n`)
    }

    // 2. Vérifier dans Stripe
    console.log("📋 2. VÉRIFICATION DANS STRIPE...\n")
    
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.line_items.data.price']
    })

    console.log(`✅ ${sessions.data.length} sessions trouvées\n`)

    const userSessions = sessions.data.filter(s => s.customer_email === targetEmail)
    
    if (userSessions.length > 0) {
      console.log(`✅ ${userSessions.length} session(s) trouvée(s) pour ${targetEmail}:\n`)
      
      for (const session of userSessions) {
        const statusIcon = session.status === 'complete' ? '✅' : '⏳'
        console.log(`${statusIcon} Session ${session.id}`)
        console.log(`   Montant: ${session.amount_total ? session.amount_total / 100 : 0}€`)
        console.log(`   Status: ${session.status}`)
        console.log(`   Payment Status: ${session.payment_status}`)
        console.log(`   Date: ${new Date(session.created * 1000).toLocaleString('fr-FR')}`)
        if (session.line_items?.data?.[0]?.price?.id) {
          const priceId = session.line_items.data[0].price.id
          console.log(`   Price ID: ${priceId}`)
          
          // Déterminer le plan
          if (priceId === process.env.STRIPE_PRICE_ID_ELITE_MONTHLY) {
            console.log(`   Plan: Elite Mensuel ⭐`)
          } else if (priceId === process.env.STRIPE_PRICE_ID_PRO_MONTHLY) {
            console.log(`   Plan: Pro Mensuel 🚀`)
          }
        }
        console.log()
      }
      
      // Trouver une session complete
      const completeSession = userSessions.find(s => s.status === 'complete')
      
      if (completeSession) {
        console.log("✅ PAIEMENT RÉUSSI TROUVÉ !\n")
        console.log("💡 ACTION RECOMMANDÉE:")
        if (!user) {
          console.log("   ⚠️  CET UTILISATEUR N'EXISTE PAS DANS LA DB !")
          console.log("   Il faut qu'il se crée un compte pour que le paiement soit associé.")
        } else if (user.profile?.plan === 'Gratuit' || !user.profile?.plan) {
          console.log("   ⚠️  LE PLAN N'A PAS ÉTÉ MIS À JOUR DANS LA DB !")
          console.log("   Le webhook n'a probablement pas fonctionné.")
          console.log("   Utilisez l'admin force-upgrade ou relancez le script de sync.")
        } else {
          console.log("   ✅ Tout est OK ! Le plan est bien mis à jour.")
        }
      } else {
        console.log("❌ AUCUN PAIEMENT COMPLETE TROUVÉ\n")
        console.log("💡 Les sessions sont soit 'open' soit 'expired', pas 'complete'.")
      }
    } else {
      console.log(`❌ Aucune session trouvée pour ${targetEmail}\n`)
    }

  } catch (error) {
    console.error("\n❌ ERREUR:")
    console.error(error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkPayment()

