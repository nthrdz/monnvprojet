import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

// Vérifier si l'utilisateur est admin (vous pouvez adapter cette logique)
async function isAdmin(userId: string): Promise<boolean> {
  // Pour l'instant, on considère que tous les utilisateurs sont admin
  // Vous pouvez implémenter une logique plus sophistiquée
  return true
}

const updateAffiliateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'SUSPENDED']).optional(),
  commissionRate: z.number().min(0).max(1).optional(),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const whereClause = status ? { status: status as "PENDING" | "APPROVED" | "SUSPENDED" } : {}

    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              referrals: true,
              commissions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.affiliate.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      affiliates: affiliates.map(affiliate => ({
        id: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        totalEarnings: affiliate.totalEarnings,
        totalReferrals: affiliate.totalReferrals,
        totalConversions: affiliate.totalConversions,
        approvedAt: affiliate.approvedAt,
        createdAt: affiliate.createdAt,
        user: affiliate.user,
        stats: affiliate._count
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Erreur récupération affiliés:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !(await isAdmin(session.user.id))) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const affiliateId = searchParams.get('id')
    
    if (!affiliateId) {
      return NextResponse.json({ error: "ID d'affilié requis" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateAffiliateSchema.parse(body)

    const updateData: any = { ...validatedData }
    
    // Si on approuve l'affilié, ajouter la date d'approbation
    if (validatedData.status === 'APPROVED') {
      updateData.approvedAt = new Date()
    }
    
    // Si on suspend l'affilié, ajouter la date de suspension
    if (validatedData.status === 'SUSPENDED') {
      updateData.suspendedAt = new Date()
    }

    const affiliate = await prisma.affiliate.update({
      where: { id: affiliateId },
      data: updateData,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        approvedAt: affiliate.approvedAt,
        suspendedAt: affiliate.suspendedAt,
        user: affiliate.user
      },
      message: "Affilié mis à jour avec succès"
    })

  } catch (error: any) {
    console.error("Erreur mise à jour affilié:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
}
