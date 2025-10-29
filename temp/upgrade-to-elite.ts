import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Charger les variables d'environnement
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function upgradeToElite() {
  try {
    // Trouver le premier profil (ou vous pouvez spécifier un username)
    const profile = await prisma.profile.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!profile) {
      console.log('❌ Aucun profil trouvé')
      return
    }

    console.log(`📝 Profil trouvé: ${profile.username} (${profile.displayName})`)
    console.log(`📊 Plan actuel: ${profile.plan}`)

    // Mettre à jour le plan vers ELITE
    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: { plan: 'ELITE' }
    })

    console.log(`✅ Plan mis à jour vers: ${updated.plan}`)
    console.log(`🎉 Vous avez maintenant accès à toutes les fonctionnalités Elite !`)
    console.log(`\n📋 Fonctionnalités débloquées:`)
    console.log(`   - Compétitions illimitées`)
    console.log(`   - Sponsors illimités`)
    console.log(`   - Galerie médias illimitée`)
    console.log(`   - Analytics illimitées`)
    console.log(`   - Heatmap des clics`)
    console.log(`   - Démographie visiteurs`)
    console.log(`   - Export données (CSV)`)
    console.log(`   - Notifications en temps réel`)
    console.log(`   - Domaine personnalisé`)
    console.log(`   - Badge "Elite" sur le profil`)
    console.log(`   - Support prioritaire`)

  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

upgradeToElite()

