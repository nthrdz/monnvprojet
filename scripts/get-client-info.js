/**
 * 🔍 Récupérer les informations d'un client spécifique
 */

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function getClientInfo(username) {
  console.log(`\n🔍 INFORMATIONS DU CLIENT : ${username}\n`)
  console.log('='.repeat(70))

  try {
    // Récupérer le profil avec toutes les relations
    const profile = await prisma.profile.findUnique({
      where: { username: username },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true
          }
        },
        links: true,
        races: true,
        sponsors: true,
        media: true,
        analytics: true
      }
    })

    if (!profile) {
      console.log(`\n❌ Aucun profil trouvé pour le username : ${username}\n`)
      return
    }

    // Informations de base
    console.log('\n📋 INFORMATIONS DE BASE')
    console.log('-'.repeat(70))
    console.log(`   Username        : ${profile.username}`)
    console.log(`   Email           : ${profile.user.email}`)
    console.log(`   Nom complet     : ${profile.user.name || 'Non renseigné'}`)
    console.log(`   Plan            : ${profile.plan}`)
    console.log(`   Sport           : ${profile.sport}`)
    console.log(`   Bio             : ${profile.bio || 'Aucune'}`)

    // Dates
    console.log('\n📅 DATES')
    console.log('-'.repeat(70))
    console.log(`   Inscription     : ${new Date(profile.createdAt).toLocaleString('fr-FR')}`)
    console.log(`   Dernière MAJ    : ${new Date(profile.updatedAt).toLocaleString('fr-FR')}`)
    console.log(`   Email vérifié   : ${profile.user.emailVerified ? '✅ Oui' : '❌ Non'}`)

    // Avatar et médias
    console.log('\n🖼️  MÉDIAS')
    console.log('-'.repeat(70))
    console.log(`   Avatar          : ${profile.avatarUrl || 'Aucun'}`)
    console.log(`   Cover           : ${profile.coverUrl || 'Aucune'}`)

    // Réseaux sociaux
    console.log('\n🌐 RÉSEAUX SOCIAUX')
    console.log('-'.repeat(70))
    console.log(`   Instagram       : ${profile.instagram || 'Non renseigné'}`)
    console.log(`   Strava          : ${profile.strava || 'Non renseigné'}`)
    console.log(`   Twitter         : ${profile.twitter || 'Non renseigné'}`)
    console.log(`   YouTube         : ${profile.youtube || 'Non renseigné'}`)
    console.log(`   TikTok          : ${profile.tiktok || 'Non renseigné'}`)
    console.log(`   Telegram        : ${profile.telegram || 'Non renseigné'}`)
    console.log(`   WhatsApp        : ${profile.whatsapp || 'Non renseigné'}`)

    // Liens personnalisés
    console.log('\n🔗 LIENS PERSONNALISÉS')
    console.log('-'.repeat(70))
    if (profile.links && profile.links.length > 0) {
      profile.links.forEach((link, index) => {
        console.log(`   ${index + 1}. ${link.title}`)
        console.log(`      URL: ${link.url}`)
        console.log(`      Actif: ${link.isActive ? '✅' : '❌'}`)
        console.log(`      Créé le: ${new Date(link.createdAt).toLocaleDateString('fr-FR')}`)
        console.log('')
      })
    } else {
      console.log(`   Aucun lien personnalisé`)
    }

    // Compétitions
    console.log('\n🏆 COMPÉTITIONS')
    console.log('-'.repeat(70))
    if (profile.races && profile.races.length > 0) {
      profile.races.forEach((race, index) => {
        console.log(`   ${index + 1}. ${race.name}`)
        console.log(`      Date: ${new Date(race.date).toLocaleDateString('fr-FR')}`)
        console.log(`      Lieu: ${race.location || 'Non renseigné'}`)
        console.log(`      Distance: ${race.distance || 'Non renseigné'}`)
        console.log(`      Temps: ${race.time || 'Non renseigné'}`)
        console.log(`      Position: ${race.position || 'Non renseigné'}`)
        console.log('')
      })
    } else {
      console.log(`   Aucune compétition enregistrée`)
    }

    // Sponsors
    console.log('\n💼 SPONSORS')
    console.log('-'.repeat(70))
    if (profile.sponsors && profile.sponsors.length > 0) {
      profile.sponsors.forEach((sponsor, index) => {
        console.log(`   ${index + 1}. ${sponsor.name}`)
        console.log(`      Logo: ${sponsor.logoUrl || 'Aucun'}`)
        console.log(`      URL: ${sponsor.url || 'Non renseigné'}`)
        console.log(`      Actif: ${sponsor.isActive ? '✅' : '❌'}`)
        console.log('')
      })
    } else {
      console.log(`   Aucun sponsor`)
    }

    // Médias (photos, vidéos)
    console.log('\n📸 GALERIE MÉDIA')
    console.log('-'.repeat(70))
    if (profile.media && profile.media.length > 0) {
      profile.media.forEach((media, index) => {
        console.log(`   ${index + 1}. ${media.type || 'Media'}`)
        console.log(`      URL: ${media.url}`)
        console.log(`      Titre: ${media.title || 'Sans titre'}`)
        console.log(`      Description: ${media.description || 'Aucune'}`)
        console.log('')
      })
    } else {
      console.log(`   Aucun média`)
    }

    // Analytics
    console.log('\n📈 ANALYTICS')
    console.log('-'.repeat(70))
    if (profile.analytics && profile.analytics.length > 0) {
      const totalViews = profile.analytics.reduce((sum, a) => sum + (a.views || 0), 0)
      const totalClicks = profile.analytics.reduce((sum, a) => sum + (a.clicks || 0), 0)
      console.log(`   Total vues         : ${totalViews}`)
      console.log(`   Total clics        : ${totalClicks}`)
      console.log(`   Entrées analytics  : ${profile.analytics.length}`)
    } else {
      console.log(`   Aucune donnée analytics`)
    }

    // Statistiques (données Stripe, etc.)
    console.log('\n📊 STATISTIQUES & DONNÉES TECHNIQUES')
    console.log('-'.repeat(70))
    const stats = profile.stats || {}
    console.log(`   Stripe Customer ID    : ${stats.stripeCustomerId || 'Aucun'}`)
    console.log(`   Stripe Subscription   : ${stats.stripeSubscriptionId || 'Aucun'}`)
    console.log(`   Dernier paiement      : ${stats.lastPaymentAt || 'Aucun'}`)
    console.log(`   Méthode de paiement   : ${stats.paymentMethod || 'Aucune'}`)
    console.log(`   Code promo utilisé    : ${stats.promoCodeUsed || 'Aucun'}`)

    // Vérifier s'il est affilié
    console.log('\n🎁 AFFILIATION')
    console.log('-'.repeat(70))
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: profile.userId }
    })

    if (affiliate) {
      console.log(`   Affilié              : ✅ Oui`)
      console.log(`   Code affilié         : ${affiliate.affiliateCode}`)
      console.log(`   Statut               : ${affiliate.status}`)
      console.log(`   Taux de commission   : ${(affiliate.commissionRate * 100).toFixed(0)}%`)
      console.log(`   Total parrainages    : ${affiliate.totalReferrals}`)
      console.log(`   Total conversions    : ${affiliate.totalConversions}`)
      console.log(`   Gains totaux         : ${affiliate.totalEarnings.toFixed(2)}€`)
      console.log(`   Lien Rewardful       : ${affiliate.rewardfulAffiliateLink || 'Non configuré'}`)
    } else {
      console.log(`   Affilié              : ❌ Non`)
    }

    // URL du profil public
    console.log('\n🌍 PROFIL PUBLIC')
    console.log('-'.repeat(70))
    console.log(`   URL : https://athlink.fr/${profile.username}`)

    console.log('\n' + '='.repeat(70))
    console.log('\n✅ Informations récupérées avec succès !\n')

  } catch (error) {
    console.error('\n❌ Erreur lors de la récupération des informations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Récupérer le username depuis les arguments de ligne de commande
const username = process.argv[2]

if (!username) {
  console.log('\n❌ Usage: node scripts/get-client-info.js <username>\n')
  console.log('Exemple: node scripts/get-client-info.js pascal_gama\n')
  process.exit(1)
}

getClientInfo(username)

