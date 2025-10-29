import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SharePageClient } from "./share-client"

export default async function SharePage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
    }
  })

  if (!profile) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 mb-8 sm:mb-10 lg:mb-12 bg-gradient-hero rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
        {/* Shapes animés */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-primary-700 via-quaternary-700 to-tertiary-700 bg-clip-text text-transparent">
            Partage ton profil
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-primary-600 font-semibold">
            Ton lien unique pour tes réseaux sociaux
          </p>
        </div>
      </div>

      {/* Client Component */}
      <SharePageClient 
        username={profile.username}
        displayName={profile.displayName}
        avatarUrl={profile.avatarUrl}
        bio={profile.bio}
      />
    </div>
  )
}

