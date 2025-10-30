import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer l'affilié
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
          take: 50
        }
        // TODO: Activer après migration DB
        // clicks: {
        //   orderBy: { createdAt: 'desc' },
        //   take: 100
        // }
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas encore ambassadeur' },
        { status: 404 }
      )
    }

    // Calculer les stats
    const totalClicks = affiliate.totalClicks
    const totalReferrals = affiliate.referrals.length
    const totalConversions = affiliate.referrals.filter(r => r.status === 'CONVERTED').length
    const pendingReferrals = affiliate.referrals.filter(r => r.status === 'PENDING').length
    const totalEarnings = affiliate.totalEarnings
    const pendingCommissions = affiliate.commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0)
    const paidCommissions = affiliate.commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0)
    
    // Taux de conversion
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0'

    // Stats des 30 derniers jours
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // TODO: Activer après migration DB pour les clics détaillés
    const last30DaysClicks = 0 // affiliate.clicks.filter(c => c.createdAt >= thirtyDaysAgo).length
    const last30DaysConversions = affiliate.referrals.filter(r => r.convertedAt && r.convertedAt >= thirtyDaysAgo).length
    const last30DaysEarnings = affiliate.commissions
      .filter(c => c.createdAt >= thirtyDaysAgo)
      .reduce((sum, c) => sum + c.amount, 0)

    // Clics par jour (derniers 30 jours) - TODO: Activer après migration DB
    const clicksByDay = {} as Record<string, number>

    // Conversions par jour (derniers 30 jours)
    const conversionsByDay = affiliate.referrals
      .filter(r => r.convertedAt && r.convertedAt >= thirtyDaysAgo)
      .reduce((acc, referral) => {
        const date = referral.convertedAt!.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // Revenus par jour (derniers 30 jours)
    const earningsByDay = affiliate.commissions
      .filter(c => c.createdAt >= thirtyDaysAgo)
      .reduce((acc, commission) => {
        const date = commission.createdAt.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + commission.amount
        return acc
      }, {} as Record<string, number>)

    // Top 5 conversions récentes
    const recentConversions = affiliate.referrals
      .filter(r => r.status === 'CONVERTED')
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        date: r.convertedAt,
        userName: r.referredUser?.profile?.displayName || 'Utilisateur',
        value: r.conversionValue,
        commission: r.commissionEarned,
        plan: r.conversionType
      }))

    // Générer les liens de parrainage
    const baseUrl = process.env.NEXTAUTH_URL || 'https://athlink.fr'
    const referralLinks = {
      signup: `${baseUrl}/signup?ref=${affiliate.affiliateCode}`,
      home: `${baseUrl}?ref=${affiliate.affiliateCode}`,
      pro: `${baseUrl}/pricing?ref=${affiliate.affiliateCode}&plan=PRO`,
      elite: `${baseUrl}/pricing?ref=${affiliate.affiliateCode}&plan=ELITE`,
    }

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        code: affiliate.affiliateCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        approvedAt: affiliate.approvedAt,
        stripeAccountId: affiliate.stripeAccountId,
        stripeAccountStatus: affiliate.stripeAccountStatus,
      },
      stats: {
        totalClicks,
        totalReferrals,
        totalConversions,
        pendingReferrals,
        totalEarnings,
        pendingCommissions,
        paidCommissions,
        conversionRate: parseFloat(conversionRate),
        last30Days: {
          clicks: last30DaysClicks,
          conversions: last30DaysConversions,
          earnings: last30DaysEarnings
        }
      },
      charts: {
        clicksByDay,
        conversionsByDay,
        earningsByDay
      },
      recentConversions,
      referralLinks,
      commissions: affiliate.commissions.map(c => ({
        id: c.id,
        amount: c.amount,
        type: c.type,
        status: c.status,
        description: c.description,
        createdAt: c.createdAt,
        paidAt: c.paidAt,
        paymentMethod: c.paymentMethod
      }))
    })
  } catch (error) {
    console.error('Erreur dashboard affilié:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du dashboard' },
      { status: 500 }
    )
  }
}
