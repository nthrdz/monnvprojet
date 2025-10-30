import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { affiliateCode, referrerUrl, landingPage, utmSource, utmMedium, utmCampaign } = body

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Code d\'affiliation requis' },
        { status: 400 }
      )
    }

    // Trouver l'affilié
    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Code d\'affiliation invalide' },
        { status: 404 }
      )
    }

    // Vérifier que l'affilié est approuvé
    if (affiliate.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Affilié non approuvé' },
        { status: 403 }
      )
    }

    // Récupérer les informations de la requête
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Créer un enregistrement de clic
    // TODO: Activer après migration de la base de données
    /*
    const click = await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ipAddress,
        userAgent,
        referrerUrl,
        landingPage,
        utmSource,
        utmMedium,
        utmCampaign,
      }
    })
    */

    // Mettre à jour le compteur de clics de l'affilié
    // TODO: Activer après migration DB
    /*
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: {
          increment: 1
        }
      }
    })
    */

    return NextResponse.json({
      success: true,
      clickId: 'pending-migration',
      message: 'Clic enregistré'
    })
  } catch (error) {
    console.error('Erreur tracking clic:', error)
    return NextResponse.json(
      { error: 'Erreur lors du tracking' },
      { status: 500 }
    )
  }
}

// GET pour récupérer les stats de clics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const affiliateCode = searchParams.get('code')

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Code d\'affiliation requis' },
        { status: 400 }
      )
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode }
      // TODO: Activer après migration de la base de données
      /*
      include: {
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 100
        }
      }
      */
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Code d\'affiliation invalide' },
        { status: 404 }
      )
    }

    // Statistiques des clics (temporairement basées sur totalClicks de l'affilié)
    const totalClicks = affiliate.totalClicks || 0
    const totalConversions = affiliate.totalConversions || 0
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(2) : '0'

    return NextResponse.json({
      success: true,
      stats: {
        totalClicks,
        uniqueIps: 0, // TODO: Activer après migration
        convertedClicks: totalConversions,
        conversionRate: parseFloat(conversionRate),
        clicksByDay: {} // TODO: Activer après migration
      },
      recentClicks: [] // TODO: Activer après migration
    })
  } catch (error) {
    console.error('Erreur récupération stats clics:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    )
  }
}

