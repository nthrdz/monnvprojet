/**
 * Script pour exécuter la migration de réinitialisation de mot de passe
 * Usage: node scripts/run-password-reset-migration.js
 */

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Début de la migration password reset...\n')

  try {
    // 1. Ajouter la colonne resetPasswordToken
    console.log('📝 Ajout de la colonne resetPasswordToken...')
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT'
    )
    console.log('✅ resetPasswordToken ajoutée\n')

    // 2. Ajouter la colonne resetPasswordExpires
    console.log('📝 Ajout de la colonne resetPasswordExpires...')
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3)'
    )
    console.log('✅ resetPasswordExpires ajoutée\n')

    // 3. Créer l'index unique
    console.log('📝 Création de l\'index unique sur resetPasswordToken...')
    try {
      await prisma.$executeRawUnsafe(
        'CREATE UNIQUE INDEX IF NOT EXISTS "User_resetPasswordToken_key" ON "User"("resetPasswordToken")'
      )
      console.log('✅ Index créé\n')
    } catch (err) {
      console.log('⚠️  Index déjà existant (normal si déjà exécuté)\n')
    }

    // 4. Vérifier que les colonnes existent
    console.log('🔍 Vérification des colonnes...')
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      AND column_name IN ('resetPasswordToken', 'resetPasswordExpires')
    `
    
    console.log('Colonnes trouvées:', columns)
    
    if (Array.isArray(columns) && columns.length === 2) {
      console.log('\n✅✅✅ MIGRATION RÉUSSIE ! ✅✅✅')
      console.log('\nVous pouvez maintenant utiliser la fonctionnalité de réinitialisation de mot de passe.')
      console.log('Testez sur : https://athlink.fr/forgot-password\n')
    } else {
      console.log('\n⚠️  Attention: Seulement', columns.length, 'colonne(s) trouvée(s)')
    }

  } catch (error) {
    console.error('\n❌ ERREUR lors de la migration:')
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

