import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve } from "path"

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const prisma = new PrismaClient()

async function listUsers() {
  try {
    console.log("📊 Récupération de la liste des utilisateurs...\n")

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        profile: {
          select: {
            username: true,
            displayName: true,
            plan: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ Total d'utilisateurs: ${users.length}\n`)
    console.log("=" .repeat(80))
    console.log("LISTE DES UTILISATEURS")
    console.log("=" .repeat(80))
    console.log()

    // Compter par plan
    const planCounts: Record<string, number> = {}
    
    users.forEach((user) => {
      const plan = user.profile?.plan || "AUCUN"
      planCounts[plan] = (planCounts[plan] || 0) + 1
    })

    console.log("📈 Répartition par plan:")
    Object.entries(planCounts).forEach(([plan, count]) => {
      console.log(`   ${plan}: ${count} utilisateur(s)`)
    })
    console.log()
    console.log("=" .repeat(80))
    console.log()

    // Afficher la liste détaillée
    users.forEach((user, index) => {
      const profile = user.profile
      const plan = profile?.plan || "AUCUN"
      const displayName = profile?.displayName || user.name || "Sans nom"
      const username = profile?.username || "N/A"
      const email = user.email
      const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : "N/A"

      console.log(`${index + 1}. ${displayName}`)
      console.log(`   Email: ${email}`)
      console.log(`   Username: @${username}`)
      console.log(`   Plan: ${plan}`)
      console.log(`   Inscription: ${createdAt}`)
      console.log()
    })

    console.log("=" .repeat(80))
    console.log(`✅ Total: ${users.length} utilisateur(s)`)
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()

