import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const trackReferralSchema = z.object({
  affiliateCode: z.string().min(1),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  referrerUrl: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = trackReferralSchema.parse(body)

    // Vérifier que le code d'affiliation existe et est approuvé
    const affiliate = await prisma.affiliate.findUnique({
      where: { 
        affiliateCode: validatedData.affiliateCode,
        status: 'APPROVED'
      }
    })

    if (!affiliate) {
      return NextResponse.json({ 
        error: "Code d'affiliation invalide ou non approuvé" 
      }, { status: 404 })
    }

    // Créer un enregistrement de tracking
    const referral = await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referralCode: validatedData.affiliateCode,
        ipAddress: validatedData.ipAddress,
        userAgent: validatedData.userAgent,
        referrerUrl: validatedData.referrerUrl,
        utmSource: validatedData.utmSource,
        utmMedium: validatedData.utmMedium,
        utmCampaign: validatedData.utmCampaign,
        status: 'PENDING'
      }
    })

    // Mettre à jour le compteur de parrainages
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalReferrals: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      referralId: referral.id,
      message: "Parrainage tracké avec succès"
    })

  } catch (error: any) {
    console.error("Erreur tracking parrainage:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}
