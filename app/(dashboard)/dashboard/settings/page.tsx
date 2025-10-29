import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      username: true,
      plan: true,
      theme: true,
      isPublic: true,
      customDomain: true,
      stats: true
    }
  })

  if (!profile) {
    redirect("/dashboard")
  }

  // Extraire les données du code promo depuis stats
  const stats = profile.stats as any
  const promoCodeUsed = stats?.promoCodeUsed || null
  const trialEndsAt = stats?.trialEndsAt || null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative -mx-10 -mt-10 px-10 pt-12 pb-24 mb-12 bg-gradient-hero rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-primary-700 via-quaternary-700 to-tertiary-700 bg-clip-text text-transparent">
            Paramètres
          </h1>
          <p className="text-lg text-primary-600 font-semibold">
            Personnalisez votre expérience et gérez vos préférences
          </p>
        </div>
      </div>

      <SettingsClient 
        profileId={profile.id}
        username={profile.username}
        userPlan={profile.plan as "FREE" | "PRO" | "ELITE"}
        initialCustomDomain={profile.customDomain || ""}
        promoCodeUsed={promoCodeUsed}
        trialEndsAt={trialEndsAt}
      />
    </div>
  )
}