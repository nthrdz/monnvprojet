import { PrismaClient } from "@prisma/client"
import { config } from "dotenv"
import { resolve } from "path"

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), ".env.local") })

const prisma = new PrismaClient()

async function deleteUsers() {
  try {
    // Emails des utilisateurs à supprimer
    const emailsToDelete = [
      "contact@athlink.fr",           // 5. nathan (@RODRIGUEZ)
      "nathanrdz8314@gmail.com",      // 4. nathan (@RODRIGUEZzzzzz)
      "nathanrdz834@gmail.com"        // 1. nathan (@RODRIGUEZnjhihi)
    ]

    console.log("🗑️  Suppression des utilisateurs...\n")

    for (const email of emailsToDelete) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true }
      })

      if (!user) {
        console.log(`⚠️  Utilisateur non trouvé: ${email}`)
        continue
      }

      console.log(`📋 Suppression de: ${user.profile?.displayName || user.name} (@${user.profile?.username})`)
      console.log(`   Email: ${email}`)
      console.log(`   Plan: ${user.profile?.plan || "N/A"}`)

      // Supprimer l'utilisateur (cascade supprimera automatiquement le profil)
      await prisma.user.delete({
        where: { email }
      })

      console.log(`✅ Utilisateur supprimé avec succès\n`)
    }

    console.log("✅ Suppression terminée")
  } catch (error) {
    console.error("❌ Erreur:", error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteUsers()


