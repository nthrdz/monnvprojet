/**
 * Script pour générer les clés secrètes nécessaires
 * Exécuter avec: node scripts/generate-secrets.js
 */

const crypto = require('crypto')

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64')
}

function generateRandomString(length = 16) {
  return crypto.randomBytes(length).toString('hex')
}

console.log('🔐 Génération des clés secrètes pour AthLink')
console.log('==========================================\n')

console.log('📋 Variables d\'environnement à ajouter dans Vercel :')
console.log('')

console.log('🔑 NextAuth Secret :')
console.log(`NEXTAUTH_SECRET=${generateSecret(32)}`)
console.log('')

console.log('🌐 NextAuth URL (remplacez par votre domaine Vercel) :')
console.log('NEXTAUTH_URL=https://votre-domaine.vercel.app')
console.log('')

console.log('💳 Stripe (remplacez par vos vraies clés) :')
console.log('STRIPE_SECRET_KEY=sk_live_...')
console.log('STRIPE_PUBLISHABLE_KEY=pk_live_...')
console.log('STRIPE_WEBHOOK_SECRET=whsec_...')
console.log('STRIPE_PLATFORM_ACCOUNT_ID=acct_...')
console.log('')

console.log('🗄️ Base de données (remplacez par votre URL Supabase) :')
console.log('DATABASE_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres')
console.log('')

console.log('🔍 Google OAuth (optionnel) :')
console.log('GOOGLE_CLIENT_ID=your-google-client-id')
console.log('GOOGLE_CLIENT_SECRET=your-google-client-secret')
console.log('')

console.log('📝 Instructions :')
console.log('1. Copiez ces variables dans Vercel > Settings > Environment Variables')
console.log('2. Remplacez les valeurs par vos vraies clés')
console.log('3. Redéployez votre application')
console.log('')

console.log('✅ Clés générées avec succès !')



