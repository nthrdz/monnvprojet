import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour récupérer les statistiques d'affiliation d'un utilisateur
 * GET /api/affiliate/stats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Trouver l'affilié de l'utilisateur
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        referrals: {
          include: {
            referredUser: {
              include: {
                profile: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!affiliate) {
      // Si l'utilisateur n'est pas encore affilié, retourner des stats vides
      return NextResponse.json({
        totalReferrals: 0,
        totalConversions: 0,
        totalEarnings: 0,
        totalClicks: 0,
        commissionRate: 0.40,
        status: 'NOT_REGISTERED',
        referrals: [],
        commissions: [],
        recentConversions: []
      })
    }

    // Calculer les conversions récentes (30 derniers jours)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentConversions = affiliate.referrals.filter(
      r => r.status === 'CONVERTED' && r.convertedAt && r.convertedAt >= thirtyDaysAgo
    )

    // Statistiques des commissions
    const pendingCommissions = affiliate.commissions.filter(c => c.status === 'PENDING')
    const paidCommissions = affiliate.commissions.filter(c => c.status === 'PAID')
    const totalPendingAmount = pendingCommissions.reduce((sum, c) => sum + c.amount, 0)
    const totalPaidAmount = paidCommissions.reduce((sum, c) => sum + c.amount, 0)

    return NextResponse.json({
      totalReferrals: affiliate.totalReferrals,
      totalConversions: affiliate.totalConversions,
      totalEarnings: affiliate.totalEarnings,
      totalClicks: affiliate.totalClicks,
      commissionRate: affiliate.commissionRate,
      status: affiliate.status,
      affiliateCode: affiliate.affiliateCode,
      stripeAccountStatus: affiliate.stripeAccountStatus,
      
      // Stats détaillées
      pendingCommissionsCount: pendingCommissions.length,
      paidCommissionsCount: paidCommissions.length,
      totalPendingAmount,
      totalPaidAmount,
      
      // Conversions récentes (30 derniers jours)
      recentConversionsCount: recentConversions.length,
      recentConversions: recentConversions.map(r => ({
        id: r.id,
        userName: r.referredUser?.name || 'Utilisateur',
        userEmail: r.referredUser?.email,
        displayName: r.referredUser?.profile?.displayName || 'Athlète',
        plan: r.referredUser?.profile?.plan || 'FREE',
        convertedAt: r.convertedAt,
        commissionEarned: r.commissionEarned
      })),

      // Toutes les conversions
      referrals: affiliate.referrals.map(r => ({
        id: r.id,
        status: r.status,
        userName: r.referredUser?.name || 'En attente',
        userEmail: r.referredUser?.email,
        displayName: r.referredUser?.profile?.displayName || 'En attente',
        plan: r.referredUser?.profile?.plan || 'FREE',
        referralCode: r.referralCode,
        conversionType: r.conversionType,
        convertedAt: r.convertedAt,
        conversionValue: r.conversionValue,
        commissionEarned: r.commissionEarned,
        createdAt: r.createdAt
      })),

      // Commissions récentes
      commissions: affiliate.commissions.map(c => ({
        id: c.id,
        amount: c.amount,
        type: c.type,
        status: c.status,
        description: c.description,
        paidAt: c.paidAt,
        createdAt: c.createdAt
      }))
    })

  } catch (error) {
    console.error('Erreur récupération stats affiliation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}

