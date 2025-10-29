import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json({ error: "Username requis" }, { status: 400 })
    }

    // Trouver l'utilisateur par username
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: {
          include: {
            affiliate: true
          }
        }
      }
    })

    if (!profile?.user?.affiliate) {
      return NextResponse.json({
        isAffiliate: false,
        status: null,
        affiliateCode: null
      })
    }

    return NextResponse.json({
      isAffiliate: true,
      status: profile.user.affiliate.status,
      affiliateCode: profile.user.affiliate.affiliateCode,
      commissionRate: profile.user.affiliate.commissionRate,
      totalEarnings: profile.user.affiliate.totalEarnings,
      totalReferrals: profile.user.affiliate.totalReferrals,
      totalConversions: profile.user.affiliate.totalConversions
    })

  } catch (error: any) {
    console.error("Erreur vérification statut affilié:", error)
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    )
  }
}
