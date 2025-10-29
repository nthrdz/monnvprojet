import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import Image from "next/image"
import { ModernProfileCard } from "@/components/ui-pro/modern-profile-card"
import { ShareProfileButton } from "@/components/ui-pro/share-profile-button"
import { ScrollToTop } from "@/components/ui-pro/scroll-to-top"
import { ViewTracker } from "@/components/analytics/view-tracker"
import { ClickTracker } from "@/components/analytics/click-tracker"

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: { displayName: true, bio: true, avatarUrl: true }
  })

  if (!profile) return {}

  return {
    title: `${profile.displayName} | Athlink`,
    description: profile.bio || `Profil de ${profile.displayName}`,
    openGraph: {
      images: profile.avatarUrl ? [profile.avatarUrl] : []
    }
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      links: { where: { isActive: true }, orderBy: { position: 'asc' } },
      races: { 
        orderBy: { date: 'asc' }
      },
      sponsors: { orderBy: { position: 'asc' }, take: 4 },
      media: { orderBy: { position: 'asc' }, take: 6 }
    }
  })

  if (!profile || !profile.isPublic) {
    notFound()
  }

  // Logique d'affichage du sport
  let displaySport: string = profile.sport
  
  const stats = profile.stats as { originalSport?: string } | null
  if (stats?.originalSport) {
    displaySport = stats.originalSport
  } else {
    const enumSports = ["RUNNING", "CYCLING", "TRIATHLON", "SWIMMING", "SKIING", "OTHER"]
    
    if (enumSports.includes(profile.sport)) {
      const sportLabels: Record<string, string> = {
        RUNNING: "Course à pied",
        CYCLING: "Cyclisme", 
        TRIATHLON: "Triathlon",
        SWIMMING: "Natation",
        SKIING: "Ski",
        OTHER: "Autre"
      }
      displaySport = sportLabels[profile.sport] || profile.sport
    } else {
      displaySport = profile.sport
    }
  }

  // Track view
  try {
    await prisma.analytics.create({
      data: {
        profileId: profile.id,
        views: 1,
        uniqueViews: 1,
        linkClicks: 0,
      }
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
  }


  return (
    <>
      {/* Analytics Tracking */}
      <ViewTracker profileId={profile.id} />
      
      {/* Floating Buttons */}
      <ShareProfileButton username={username} displayName={profile.displayName} />
      <ScrollToTop />

      {/* Modern Profile Card Layout avec Click Tracking */}
      <ClickTracker profileId={profile.id}>
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-8 px-4">
        
        {/* Image de fond floutée - Photo de profil agrandie */}
        <div className="absolute inset-0 overflow-hidden">
          {profile.avatarUrl ? (
            <>
              <Image
                src={profile.avatarUrl}
                alt="Background"
                fill
                className="object-cover scale-110"
                style={{ filter: 'blur(80px)' }}
                priority
              />
              {/* Overlay sombre pour contraste */}
              <div className="absolute inset-0 bg-black/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          )}
        </div>

        {/* Carte de profil centrale */}
        <div className="relative z-10 w-full">
          <ModernProfileCard
            displayName={profile.displayName}
            bio={profile.bio}
            location={profile.location}
            avatarUrl={profile.avatarUrl}
            sport={displaySport}
            instagram={profile.instagram}
            strava={profile.strava}
            youtube={profile.youtube}
            tiktok={profile.tiktok}
            plan={profile.plan as "FREE" | "PRO" | "ELITE"}
            links={profile.links}
            races={profile.races}
            sponsors={profile.sponsors}
            media={profile.media}
            username={username}
            hasCoachingServices={profile.plan === "COACH" || profile.plan === "ELITE"}
          />
        </div>
        </div>
      </ClickTracker>
    </>
  )
}

