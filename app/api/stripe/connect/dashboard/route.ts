import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer les informations de l'affilié
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!affiliate?.stripeAccountId) {
      return NextResponse.json({ error: "Compte Stripe Connect non trouvé" }, { status: 404 })
    }

    // Récupérer les informations du compte Stripe
    const account = await stripe.accounts.retrieve(affiliate.stripeAccountId)
    
    // Récupérer le lien du dashboard Stripe
    const loginLink = await stripe.accounts.createLoginLink(affiliate.stripeAccountId)

    // Récupérer les transferts (commissions payées)
    const transfers = await stripe.transfers.list({
      destination: affiliate.stripeAccountId,
      limit: 10
    })

    // Récupérer les paiements liés aux abonnements
    const charges = await stripe.charges.list({
      limit: 10,
      expand: ['data.invoice', 'data.invoice.subscription']
    })

    // Calculer les statistiques
    const totalEarnings = transfers.data.reduce((sum, transfer) => sum + transfer.amount, 0) / 100
    const totalReferrals = affiliate.totalReferrals
    const totalConversions = affiliate.totalConversions

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        totalEarnings,
        totalReferrals,
        totalConversions,
        stripeAccountId: affiliate.stripeAccountId,
        stripeDashboardUrl: loginLink.url,
        accountStatus: account.details_submitted ? 'active' : 'pending',
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        createdAt: affiliate.createdAt
      },
      recentTransfers: transfers.data.map(transfer => ({
        id: transfer.id,
        amount: transfer.amount / 100,
        currency: transfer.currency,
        status: transfer.status,
        created: new Date(transfer.created * 1000)
      })),
      recentCharges: charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency,
        status: charge.status,
        description: charge.description,
        created: new Date(charge.created * 1000)
      }))
    })

  } catch (error: any) {
    console.error("Erreur récupération dashboard Stripe:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    )
  }
}



