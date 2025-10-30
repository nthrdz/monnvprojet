import { NextResponse } from "next/server"

/**
 * API de diagnostic complète
 * Vérifie TOUTES les configurations nécessaires
 * 
 * Usage: GET /api/diagnostic
 */
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  }

  // Check 1: Stripe Secret Key
  diagnostics.checks.stripeSecretKey = {
    configured: !!process.env.STRIPE_SECRET_KEY,
    type: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') 
      ? 'TEST' 
      : process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
        ? 'LIVE'
        : 'INVALID',
    length: process.env.STRIPE_SECRET_KEY?.length || 0
  }

  // Check 2: Stripe Publishable Key
  diagnostics.checks.stripePublishableKey = {
    configured: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    type: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_')
      ? 'TEST'
      : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')
        ? 'LIVE'
        : 'INVALID'
  }

  // Check 3: Stripe Webhook Secret
  diagnostics.checks.stripeWebhookSecret = {
    configured: !!process.env.STRIPE_WEBHOOK_SECRET
  }

  // Check 4: Database
  diagnostics.checks.database = {
    configured: !!process.env.DATABASE_URL
  }

  // Check 5: NextAuth
  diagnostics.checks.nextAuth = {
    secret: !!process.env.NEXTAUTH_SECRET,
    url: !!process.env.NEXTAUTH_URL,
    urlValue: process.env.NEXTAUTH_URL
  }

  // Check 6: Google OAuth
  diagnostics.checks.googleOAuth = {
    clientId: !!process.env.GOOGLE_CLIENT_ID,
    clientSecret: !!process.env.GOOGLE_CLIENT_SECRET
  }

  // Check 7: Resend Email
  diagnostics.checks.resend = {
    configured: !!process.env.RESEND_API_KEY
  }

  // Check 8: Supabase
  diagnostics.checks.supabase = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }

  // Check 9: Test Stripe Connection
  if (diagnostics.checks.stripeSecretKey.configured) {
    try {
      const Stripe = require('stripe')
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-09-30.clover'
      })

      // Test simple: lister les coupons
      const coupons = await stripe.coupons.list({ limit: 1 })
      diagnostics.checks.stripeConnection = {
        success: true,
        message: 'Connexion Stripe réussie ✅'
      }
    } catch (error: any) {
      diagnostics.checks.stripeConnection = {
        success: false,
        error: error.message,
        type: error.type
      }
    }
  } else {
    diagnostics.checks.stripeConnection = {
      success: false,
      message: 'STRIPE_SECRET_KEY manquante'
    }
  }

  // Résumé
  const allChecks = Object.values(diagnostics.checks)
  const failedChecks = Object.entries(diagnostics.checks).filter(([key, check]: [string, any]) => {
    if (key === 'stripeConnection') return !check.success
    if (key === 'stripeSecretKey' || key === 'stripePublishableKey') {
      return !check.configured || check.type === 'INVALID'
    }
    return false
  })

  diagnostics.summary = {
    totalChecks: Object.keys(diagnostics.checks).length,
    failed: failedChecks.length,
    status: failedChecks.length === 0 ? '✅ TOUT EST OK' : '❌ PROBLÈMES DÉTECTÉS'
  }

  if (failedChecks.length > 0) {
    diagnostics.issues = failedChecks.map(([key, check]: [string, any]) => ({
      check: key,
      issue: check,
      solution: getSolution(key, check)
    }))
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}

function getSolution(checkName: string, check: any): string {
  switch (checkName) {
    case 'stripeSecretKey':
      if (!check.configured) {
        return 'Ajoutez STRIPE_SECRET_KEY dans Vercel → Settings → Environment Variables'
      }
      if (check.type === 'INVALID') {
        return 'La clé Stripe doit commencer par sk_test_ ou sk_live_'
      }
      return 'Vérifiez votre clé Stripe'
    
    case 'stripePublishableKey':
      if (!check.configured) {
        return 'Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans Vercel'
      }
      if (check.type === 'INVALID') {
        return 'La clé doit commencer par pk_test_ ou pk_live_'
      }
      return 'Vérifiez votre clé Stripe'
    
    case 'stripeConnection':
      return 'Vérifiez que la clé Stripe est valide et active dans Stripe Dashboard'
    
    default:
      return 'Vérifiez la configuration'
  }
}

