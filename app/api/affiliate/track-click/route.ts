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

    // Mettre à jour le compteur de clics de l'affilié
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalClicks: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      clickId: click.id,
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
      where: { affiliateCode },
      include: {
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 100
        }
      }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Code d\'affiliation invalide' },
        { status: 404 }
      )
    }

    // Statistiques des clics
    const totalClicks = affiliate.clicks.length
    const uniqueIps = new Set(affiliate.clicks.map(c => c.ipAddress)).size
    const convertedClicks = affiliate.clicks.filter(c => c.converted).length
    const conversionRate = totalClicks > 0 ? (convertedClicks / totalClicks * 100).toFixed(2) : '0'

    // Clics par jour (derniers 30 jours)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const clicksByDay = affiliate.clicks
      .filter(c => c.createdAt >= thirtyDaysAgo)
      .reduce((acc, click) => {
        const date = click.createdAt.toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    return NextResponse.json({
      success: true,
      stats: {
        totalClicks,
        uniqueIps,
        convertedClicks,
        conversionRate: parseFloat(conversionRate),
        clicksByDay
      },
      recentClicks: affiliate.clicks.slice(0, 20).map(c => ({
        id: c.id,
        createdAt: c.createdAt,
        referrerUrl: c.referrerUrl,
        landingPage: c.landingPage,
        converted: c.converted,
        utmSource: c.utmSource,
        country: c.country
      }))
    })
  } catch (error) {
    console.error('Erreur récupération stats clics:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    )
  }
}

