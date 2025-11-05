/**
 * Script pour créer un profil affilié pour un utilisateur
 * Usage: node scripts/create-affiliate-profile.js <email>
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const emailToAddAffiliate = process.argv[2] || 'nathan@athlink.fr'

async function createAffiliateProfile(email) {
  console.log('\n🎁 CRÉATION DU PROFIL AFFILIÉ')
  console.log('=' .repeat(60))
  console.log(`Email: ${email}`)
  console.log('=' .repeat(60))

  try {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        affiliate: true
      }
    })

    if (!user) {
      console.log('\n❌ Utilisateur non trouvé avec cet email.')
      return
    }

    console.log(`\n✅ Utilisateur trouvé: ${user.name || 'N/A'} (@${user.profile?.username || 'N/A'})`)

    // Vérifier si l'utilisateur a déjà un profil affilié
    if (user.affiliate) {
      console.log('\n⚠️  Cet utilisateur a DÉJÀ un profil affilié !')
      console.log(`   - Code affilié: ${user.affiliate.affiliateCode}`)
      console.log(`   - Statut: ${user.affiliate.status}`)
      console.log(`   - Lien Rewardful: ${user.affiliate.rewardfulAffiliateLink || 'Non défini'}`)
      console.log('\nSi vous voulez mettre à jour le lien Rewardful, utilisez l\'interface du dashboard.')
      return
    }

    // Générer un code affilié unique basé sur le username
    const username = user.profile?.username || user.email.split('@')[0]
    let affiliateCode = username.toLowerCase()

    // Vérifier si le code existe déjà
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode }
    })

    if (existingAffiliate) {
      // Ajouter un suffixe aléatoire si le code existe déjà
      affiliateCode = `${username}_${Math.random().toString(36).substring(2, 8)}`.toLowerCase()
    }

    // Créer le profil affilié
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        affiliateCode: affiliateCode,
        status: 'APPROVED', // Approuvé automatiquement
        commissionRate: 0.40, // 40%
        approvedAt: new Date()
      }
    })

    console.log('\n✅✅✅ PROFIL AFFILIÉ CRÉÉ AVEC SUCCÈS ✅✅✅')
    console.log(`\n📊 DÉTAILS DU PROFIL AFFILIÉ:`)
    console.log(`   - ID: ${affiliate.id}`)
    console.log(`   - Code affilié: ${affiliate.affiliateCode}`)
    console.log(`   - Statut: ${affiliate.status}`)
    console.log(`   - Taux de commission: ${affiliate.commissionRate * 100}%`)
    console.log(`   - Date d'approbation: ${affiliate.approvedAt?.toLocaleDateString('fr-FR')}`)
    
    console.log(`\n🔗 LIENS D'AFFILIATION:`)
    console.log(`   - Lien Athlink: https://athlink.fr/?via=${username}`)
    console.log(`   - Code de parrainage: ${affiliateCode}`)
    
    console.log(`\n💰 COMMISSIONS:`)
    console.log(`   - Plan PRO (9,90€/mois): 3,96€/mois`)
    console.log(`   - Plan ELITE (25,90€/mois): 10,36€/mois`)
    
    console.log(`\n👉 PROCHAINES ÉTAPES:`)
    console.log(`   1. Va sur https://athlink.fr/dashboard/affiliate`)
    console.log(`   2. Clique sur "J'ai déjà mon lien Rewardful"`)
    console.log(`   3. Colle ton lien dashboard Rewardful`)
    console.log(`   4. Clique sur "Sauvegarder"`)
    
    console.log('\n')

  } catch (error) {
    console.error('\n❌ ERREUR lors de la création du profil affilié:', error)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la création
createAffiliateProfile(emailToAddAffiliate)

