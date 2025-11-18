import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { DashboardClient } from "./dashboard-client"

// Force dynamic rendering pour toujours recharger depuis la DB
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      links: { where: { isActive: true }, orderBy: { position: 'asc' } },
      races: { orderBy: { date: 'asc' } },
      sponsors: true,
      _count: {
        select: { links: true, races: true, sponsors: true, media: true }
      }
    }
  })

  if (!profile) {
    await prisma.profile.create({
      data: {
        userId: session.user.id,
        username: session.user.email.split('@')[0],
        displayName: session.user.name || "Athlète",
        sport: "RUNNING",
        plan: "FREE"
      }
    })
    redirect("/dashboard")
  }

  // Analytics des 7 derniers jours
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const analytics = await prisma.analytics.aggregate({
    where: {
      profileId: profile.id,
      date: { gte: sevenDaysAgo }
    },
    _sum: {
      views: true,
      uniqueViews: true,
      linkClicks: true
    }
  })

  // Analytics de la semaine précédente (pour calculer les tendances)
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  
  const previousWeekAnalytics = await prisma.analytics.aggregate({
    where: {
      profileId: profile.id,
      date: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo
      }
    },
    _sum: {
      views: true,
      uniqueViews: true,
      linkClicks: true
    }
  })

  // Calculer les tendances (en pourcentage)
  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const viewsTrend = calculateTrend(
    analytics._sum.views || 0,
    previousWeekAnalytics._sum.views || 0
  )
  
  const uniqueViewsTrend = calculateTrend(
    analytics._sum.uniqueViews || 0,
    previousWeekAnalytics._sum.uniqueViews || 0
  )

  const totalLinkClicks = await prisma.link.aggregate({
    where: { profileId: profile.id },
    _sum: { clicks: true }
  })

  return (
    <DashboardClient
      profile={{
        id: profile.id,
        displayName: profile.displayName,
        plan: profile.plan,
        races: profile.races.map(race => ({
          id: race.id,
          name: race.name,
          date: race.date,
          location: race.location,
          distance: race.distance,
          result: race.result,
          logoUrl: (race as any).logoUrl
        })),
        sponsors: profile.sponsors,
        _count: profile._count
      }}
      analytics={analytics}
      viewsTrend={viewsTrend}
      uniqueViewsTrend={uniqueViewsTrend}
      totalLinkClicks={totalLinkClicks._sum.clicks || 0}
    />
  )
}
