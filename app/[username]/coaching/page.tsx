import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { CoachingPublicClient } from "./coaching-public-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props) {
  const { username } = params
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: { displayName: true },
  })

  if (!profile) {
    return {
      title: "Coaching non trouvé - Athlink",
      description: "Les services de coaching que vous recherchez n'existent pas.",
    }
  }

  return {
    title: `Services Coaching de ${profile.displayName} - Athlink`,
    description: `Découvrez les services de coaching personnalisé de ${profile.displayName}. Plans d'entraînement et réservations disponibles.`,
  }
}

export default async function CoachingPublicPage({ params }: Props) {
  const { username } = params

  const profile = await prisma.profile.findUnique({
    where: { username },
    select: {
      displayName: true,
      bio: true,
      avatarUrl: true,
      plan: true,
      isPublic: true,
      stats: true
    }
  })

  if (!profile || !profile.isPublic || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
    notFound()
  }

  // Récupérer les données coaching depuis stats
  const profileStats = profile.stats as any || {}
  const trainingPlans = (profileStats.trainingPlans || []).filter((p: any) => p.isActive)
  const bookings = profileStats.bookings || []
  const availabilities = profileStats.availabilities || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md p-4 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href={`/${username}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour au profil</span>
          </Link>
          <h1 className="text-xl font-bold">{profile.displayName}</h1>
          <div className="w-5 h-5" /> {/* Placeholder for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <CoachingPublicClient 
          coachName={profile.displayName}
          coachBio={profile.bio}
          coachAvatar={profile.avatarUrl}
          trainingPlans={trainingPlans}
          availabilities={availabilities}
          username={username}
        />
      </main>
    </div>
  )
}

