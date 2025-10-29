import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { profileId, linkId, x, y, element, userAgent, country } = await request.json()

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID requis" }, { status: 400 })
    }

    // Récupérer ou créer l'entrée analytics du jour
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let analytics = await prisma.analytics.findFirst({
      where: {
        profileId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    if (!analytics) {
      analytics = await prisma.analytics.create({
        data: {
          profileId,
          date: today,
          views: 0,
          uniqueViews: 0,
          linkClicks: 1,
          device: userAgent?.includes('Mobile') ? 'mobile' : 'desktop',
          country: country || null
        }
      })
    } else {
      analytics = await prisma.analytics.update({
        where: { id: analytics.id },
        data: {
          linkClicks: { increment: 1 }
        }
      })
    }

    // Stocker les données de heatmap dans les stats du profil
    if (x !== undefined && y !== undefined) {
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { stats: true }
      })

      const stats = (profile?.stats as any) || {}
      const heatmapData = stats.heatmap || []
      
      // Ajouter le nouveau point
      heatmapData.push({
        x,
        y,
        element,
        timestamp: new Date().toISOString(),
        linkId
      })

      // Garder seulement les 1000 derniers points
      const recentData = heatmapData.slice(-1000)

      await prisma.profile.update({
        where: { id: profileId },
        data: {
          stats: {
            ...stats,
            heatmap: recentData
          }
        }
      })
    }

    return NextResponse.json({ success: true, analyticsId: analytics.id })
  } catch (error) {
    console.error("Erreur tracking click:", error)
    return NextResponse.json(
      { error: "Erreur lors du tracking" },
      { status: 500 }
    )
  }
}

