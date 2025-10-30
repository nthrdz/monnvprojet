import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

// Configuration Stripe Connect pour l'affiliation
export const STRIPE_CONFIG = {
  // ID de votre compte Stripe (remplacez par votre vrai ID)
  platformAccountId: process.env.STRIPE_PLATFORM_ACCOUNT_ID,
  
  // URLs de redirection pour Stripe Connect
  connectUrls: {
    onboarding: process.env.NEXTAUTH_URL + '/api/stripe/connect/onboarding',
    dashboard: process.env.NEXTAUTH_URL + '/api/stripe/connect/dashboard',
    return: process.env.NEXTAUTH_URL + '/dashboard/affiliate',
  },
  
  // Configuration des commissions d'affiliation
  affiliateSettings: {
    // Commission par défaut (40% = 0.40)
    defaultCommissionRate: 0.40,
    
    // Commission minimum
    minCommissionRate: 0.40, // 40%
    
    // Commission maximum
    maxCommissionRate: 0.40, // 40%
    
    // Paiement minimum avant versement
    minimumPayout: 50, // 50€
  },
  
  // Prix des plans pour le calcul des commissions
  planPrices: {
    PRO: 9.99, // Prix mensuel PRO
    ELITE: 19.99, // Prix mensuel ELITE
    ATHLETE_PRO: 9.99,
    COACH: 29.99,
  }
}

// Types pour l'affiliation Stripe
export interface StripeAffiliate {
  id: string
  accountId: string
  email: string
  name: string
  status: 'pending' | 'active' | 'suspended'
  commissionRate: number
  totalEarnings: number
  totalReferrals: number
  createdAt: Date
}

export interface StripeReferral {
  id: string
  affiliateId: string
  customerId: string
  subscriptionId?: string
  amount: number
  commission: number
  status: 'pending' | 'paid' | 'cancelled'
  createdAt: Date
}



