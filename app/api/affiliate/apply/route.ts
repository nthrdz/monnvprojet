import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const applyAffiliateSchema = z.object({
  bankAccount: z.string().optional(),
  paypalEmail: z.string().email().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = applyAffiliateSchema.parse(body)

    // Vérifier si l'utilisateur a déjà une demande d'affiliation
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (existingAffiliate) {
      return NextResponse.json({ 
        error: "Vous avez déjà une demande d'affiliation en cours",
        status: existingAffiliate.status,
        affiliateCode: existingAffiliate.affiliateCode
      }, { status: 400 })
    }

    // Générer un code d'affiliation unique
    const generateAffiliateCode = () => {
      const prefix = "AMB"
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
      return `${prefix}${randomPart}`
    }

    let affiliateCode = generateAffiliateCode()
    
    // Vérifier l'unicité du code
    while (await prisma.affiliate.findUnique({ where: { affiliateCode } })) {
      affiliateCode = generateAffiliateCode()
    }

    // Créer la demande d'affiliation
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        affiliateCode,
        bankAccount: validatedData.bankAccount,
        paypalEmail: validatedData.paypalEmail,
        notes: validatedData.notes,
        status: "PENDING"
      },
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
        createdAt: affiliate.createdAt
      },
      message: "Demande d'affiliation soumise avec succès. Elle sera examinée par notre équipe."
    }, { status: 201 })

  } catch (error: any) {
    console.error("Erreur demande d'affiliation:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la soumission de la demande" },
      { status: 500 }
    )
  }
}
