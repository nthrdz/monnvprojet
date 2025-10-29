import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const convertReferralSchema = z.object({
  referralId: z.string().optional(),
  affiliateCode: z.string().optional(),
  userId: z.string(),
  conversionType: z.enum(['SIGNUP', 'UPGRADE', 'PAYMENT']),
  conversionValue: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = convertReferralSchema.parse(body)

    let referral = null

    // Si on a un referralId, l'utiliser directement
    if (validatedData.referralId) {
      referral = await prisma.referral.findUnique({
        where: { id: validatedData.referralId },
        include: { affiliate: true }
      })
    }
    // Sinon, chercher par code d'affiliation et userId
    else if (validatedData.affiliateCode) {
      referral = await prisma.referral.findFirst({
        where: {
          referralCode: validatedData.affiliateCode,
          referredUserId: validatedData.userId,
          status: 'PENDING'
        },
        include: { affiliate: true }
      })
    }

    if (!referral) {
      return NextResponse.json({ 
        error: "Parrainage non trouvé" 
      }, { status: 404 })
    }

    if (referral.status !== 'PENDING') {
      return NextResponse.json({ 
        error: "Ce parrainage a déjà été traité" 
      }, { status: 400 })
    }

    // Calculer la commission
    const commissionRate = referral.affiliate.commissionRate
    const conversionValue = validatedData.conversionValue || 0
    const commissionEarned = conversionValue * commissionRate

    // Mettre à jour le parrainage
    const updatedReferral = await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
        conversionType: validatedData.conversionType,
        conversionValue,
        commissionEarned,
        referredUserId: validatedData.userId
      }
    })

    // Mettre à jour les statistiques de l'affilié
    await prisma.affiliate.update({
      where: { id: referral.affiliateId },
      data: {
        totalConversions: {
          increment: 1
        },
        totalEarnings: {
          increment: commissionEarned
        }
      }
    })

    // Créer une commission
    const commission = await prisma.commission.create({
      data: {
        affiliateId: referral.affiliateId,
        referralId: referral.id,
        amount: commissionEarned,
        type: 'REFERRAL',
        status: 'PENDING',
        description: `Commission pour ${validatedData.conversionType.toLowerCase()}`
      }
    })

    return NextResponse.json({
      success: true,
      referral: {
        id: updatedReferral.id,
        status: updatedReferral.status,
        commissionEarned: updatedReferral.commissionEarned,
        convertedAt: updatedReferral.convertedAt
      },
      commission: {
        id: commission.id,
        amount: commission.amount,
        status: commission.status
      },
      message: "Conversion enregistrée avec succès"
    })

  } catch (error: any) {
    console.error("Erreur conversion parrainage:", error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la conversion" },
      { status: 500 }
    )
  }
}
