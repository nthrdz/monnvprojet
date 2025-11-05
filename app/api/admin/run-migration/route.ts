import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * API temporaire pour exécuter la migration de réinitialisation de mot de passe
 * À SUPPRIMER après exécution
 */
export async function POST() {
  try {
    console.log("🔧 Exécution de la migration password reset...")

    // Exécuter le SQL brut pour ajouter les colonnes
    await prisma.$executeRaw`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT;
    `
    
    console.log("✅ Colonne resetPasswordToken ajoutée")

    await prisma.$executeRaw`
      ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3);
    `
    
    console.log("✅ Colonne resetPasswordExpires ajoutée")

    // Créer l'index unique (si pas déjà existant)
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
      `
      console.log("✅ Index unique créé")
    } catch (indexError) {
      console.log("⚠️ Index déjà existant ou erreur:", indexError)
    }

    console.log("✅✅✅ Migration terminée avec succès !")

    return NextResponse.json({
      success: true,
      message: "Migration exécutée avec succès. Les colonnes resetPasswordToken et resetPasswordExpires ont été ajoutées."
    })

  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

