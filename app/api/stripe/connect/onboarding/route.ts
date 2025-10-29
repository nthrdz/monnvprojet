import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe, STRIPE_CONFIG } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Vérifier si l'utilisateur a déjà un compte Stripe Connect
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAffiliate?.stripeAccountId) {
      return NextResponse.json({ 
        error: "Compte Stripe Connect déjà créé",
        accountId: existingAffiliate.stripeAccountId
      }, { status: 400 })
    }

    // Créer un compte Stripe Connect
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR', // Vous pouvez le rendre dynamique
      email: session.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        email: session.user.email,
        first_name: session.user.name?.split(' ')[0] || '',
        last_name: session.user.name?.split(' ').slice(1).join(' ') || '',
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            weekly_anchor: 'friday',
          },
        },
      },
    })

    // Créer ou mettre à jour l'affilié dans notre base
    const affiliate = await prisma.affiliate.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        affiliateCode: generateAffiliateCode(),
        status: 'PENDING',
        commissionRate: STRIPE_CONFIG.affiliateSettings.defaultCommissionRate,
        stripeAccountId: account.id,
      },
      update: {
        stripeAccountId: account.id,
      }
    })

    // Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: STRIPE_CONFIG.connectUrls.return,
      return_url: STRIPE_CONFIG.connectUrls.return,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
      affiliateCode: affiliate.affiliateCode
    })

  } catch (error: any) {
    console.error("Erreur création compte Stripe Connect:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    )
  }
}

function generateAffiliateCode(): string {
  const prefix = "AMB"
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}${randomPart}`
}



