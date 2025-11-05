import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * API temporaire pour exécuter la migration de réinitialisation de mot de passe
 * À SUPPRIMER après exécution
 */
export async function POST() {
  try {
    console.log("🔧 Exécution de la migration password reset...")

    // Exécuter chaque commande SQL séparément
    const sql1 = 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT'
    await prisma.$executeRawUnsafe(sql1)
    console.log("✅ Colonne resetPasswordToken ajoutée")

    const sql2 = 'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3)'
    await prisma.$executeRawUnsafe(sql2)
    console.log("✅ Colonne resetPasswordExpires ajoutée")

    // Créer l'index unique
    try {
      const sql3 = 'CREATE UNIQUE INDEX IF NOT EXISTS "User_resetPasswordToken_key" ON "User"("resetPasswordToken")'
      await prisma.$executeRawUnsafe(sql3)
      console.log("✅ Index unique créé")
    } catch (indexError: any) {
      console.log("⚠️ Index déjà existant ou erreur:", indexError.message)
    }

    console.log("✅✅✅ Migration terminée avec succès !")

    return NextResponse.json({
      success: true,
      message: "Migration exécutée avec succès. Les colonnes resetPasswordToken et resetPasswordExpires ont été ajoutées.",
      details: "Vous pouvez maintenant utiliser la fonctionnalité de réinitialisation de mot de passe !"
    })

  } catch (error: any) {
    console.error('❌ Erreur lors de la migration:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 })
  }
}

/**
 * GET pour vérifier si la migration a déjà été exécutée
 */
export async function GET() {
  try {
    // Essayer de sélectionner les colonnes pour voir si elles existent
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('resetPasswordToken', 'resetPasswordExpires')
    `

    return NextResponse.json({
      success: true,
      columns: result,
      migrated: Array.isArray(result) && result.length === 2
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

