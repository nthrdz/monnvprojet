import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupérer les informations d'affiliation
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
      include: {
        referrals: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            referredUser: {
              select: {
                name: true,
                email: true,
                createdAt: true
              }
            }
          }
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!affiliate) {
      return NextResponse.json({ error: "Aucune affiliation trouvée" }, { status: 404 })
    }

    // Statistiques détaillées
    const stats = await prisma.referral.groupBy({
      by: ['status'],
      where: { affiliateId: affiliate.id },
      _count: { status: true },
      _sum: { commissionEarned: true }
    })

    const monthlyStats = await prisma.referral.groupBy({
      by: ['status'],
      where: {
        affiliateId: affiliate.id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _count: { status: true },
      _sum: { commissionEarned: true }
    })

    // Calculer les commissions en attente
    const pendingCommissions = await prisma.commission.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: 'PENDING'
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    // Calculer les commissions payées
    const paidCommissions = await prisma.commission.aggregate({
      where: {
        affiliateId: affiliate.id,
        status: 'PAID'
      },
      _sum: { amount: true },
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        totalEarnings: affiliate.totalEarnings,
        totalReferrals: affiliate.totalReferrals,
        totalConversions: affiliate.totalConversions,
        approvedAt: affiliate.approvedAt,
        createdAt: affiliate.createdAt
      },
      stats: {
        total: {
          referrals: affiliate.totalReferrals,
          conversions: affiliate.totalConversions,
          earnings: affiliate.totalEarnings
        },
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = {
            count: stat._count.status,
            earnings: stat._sum.commissionEarned || 0
          }
          return acc
        }, {} as Record<string, { count: number; earnings: number }>),
        monthly: monthlyStats.reduce((acc, stat) => {
          acc[stat.status] = {
            count: stat._count.status,
            earnings: stat._sum.commissionEarned || 0
          }
          return acc
        }, {} as Record<string, { count: number; earnings: number }>)
      },
      commissions: {
        pending: {
          amount: pendingCommissions._sum.amount || 0,
          count: pendingCommissions._count.id || 0
        },
        paid: {
          amount: paidCommissions._sum.amount || 0,
          count: paidCommissions._count.id || 0
        }
      },
      recentReferrals: affiliate.referrals,
      recentCommissions: affiliate.commissions
    })

  } catch (error: any) {
    console.error("Erreur dashboard affiliation:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    )
  }
}
