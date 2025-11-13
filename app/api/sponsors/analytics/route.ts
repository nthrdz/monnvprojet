import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour récupérer les analytics détaillées des sponsors
 * GET /api/sponsors/analytics
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

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        sponsors: {
          orderBy: { clicks: 'desc' }, // Trier par nombre de clics
          select: {
            id: true,
            name: true,
            logoUrl: true,
            websiteUrl: true,
            promoCode: true,
            clicks: true,
            promoCodeCopies: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      )
    }

    // Calculer les statistiques globales
    const totalClicks = profile.sponsors.reduce((sum, s) => sum + s.clicks, 0)
    const totalPromoCopies = profile.sponsors.reduce((sum, s) => sum + s.promoCodeCopies, 0)
    const averageClicksPerSponsor = profile.sponsors.length > 0 
      ? Math.round(totalClicks / profile.sponsors.length) 
      : 0

    // Calculer le taux de conversion (copies de code / clics)
    const conversionRate = totalClicks > 0 
      ? ((totalPromoCopies / totalClicks) * 100).toFixed(1)
      : '0.0'

    // Sponsor le plus performant
    const topSponsor = profile.sponsors[0] || null

    // Sponsors avec code promo vs sans
    const sponsorsWithPromo = profile.sponsors.filter(s => s.promoCode).length
    const sponsorsWithoutPromo = profile.sponsors.length - sponsorsWithPromo

    return NextResponse.json({
      sponsors: profile.sponsors,
      stats: {
        totalSponsors: profile.sponsors.length,
        totalClicks,
        totalPromoCopies,
        averageClicksPerSponsor,
        conversionRate: parseFloat(conversionRate),
        topSponsor,
        sponsorsWithPromo,
        sponsorsWithoutPromo
      }
    })

  } catch (error: any) {
    console.error('Erreur récupération analytics sponsors:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

