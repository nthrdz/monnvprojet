import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PlanType } from "@prisma/client"
import Link from "next/link"
import { DashboardStats } from "@/components/ui-pro/dashboard-stats"
import { DashboardGoals } from "@/components/ui-pro/dashboard-goals"
import { RaceLogo } from "@/components/ui-pro/race-logo"
import { PlanBadge } from "@/components/ui-pro/plan-badge"
import { canUserAccessFeature, getUserFeatureLimit } from "@/lib/features"

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

  const totalLinkClicks = await prisma.link.aggregate({
    where: { profileId: profile.id },
    _sum: { clicks: true }
  })

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 mb-8 sm:mb-10 lg:mb-12 bg-gradient-hero rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
        {/* Shapes animés */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-primary-700 via-quaternary-700 to-tertiary-700 bg-clip-text text-transparent">
                Bienvenue, {profile.displayName}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-600 font-semibold">
                Voici tes performances cette semaine
              </p>
            </div>
            <PlanBadge plan={profile.plan as "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH"} size="lg" />
          </div>
        </div>
      </div>

      {/* Stats Grid avec overlap */}
      <div className="-mt-8 sm:-mt-12 lg:-mt-16">
        <DashboardStats
          views={analytics._sum.views || 0}
          uniqueViews={analytics._sum.uniqueViews || 0}
          linksCount={profile._count.links}
          racesCount={profile._count.races}
        />
      </div>

      {/* All Races - Compact */}
      {profile.races.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-standard p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Mes Compétitions</span>
            </h2>
            <Link 
              href="/dashboard/races"
              className="text-sm text-yellow-600 hover:text-black font-medium"
            >
              Voir toutes →
            </Link>
          </div>
          
          {/* Séparer les compétitions à venir et passées */}
          {(() => {
            const upcomingRaces = profile.races.filter(race => new Date(race.date) >= new Date()).slice(0, 2)
            const pastRaces = profile.races.filter(race => new Date(race.date) < new Date()).slice(0, 2)
            
            return (
              <div className="space-y-4">
                {/* Compétitions à venir */}
                {upcomingRaces.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-yellow-600 mb-2 uppercase tracking-wide">
                      À venir ({upcomingRaces.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {upcomingRaces.map((race) => {
                        const daysUntil = Math.ceil((new Date(race.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                        return (
                          <div key={race.id} className="flex items-center justify-between p-3 sm:p-2 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {(race as any).logoUrl && (
            <RaceLogo 
              src={(race as any).logoUrl} 
              alt={`Logo ${race.name}`}
              className="w-4 h-4 rounded-sm object-contain border shadow-sm p-0.5"
              variant="dark"
            />
                                )}
                                <h4 className="font-medium text-gray-900 text-xs truncate">{race.name}</h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{new Date(race.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                {race.location && <span>• {race.location}</span>}
                                {race.distance && <span>• {race.distance}</span>}
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 bg-yellow-500 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                              {daysUntil}j
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* Compétitions passées */}
                {pastRaces.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                      Passées ({pastRaces.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {pastRaces.map((race) => {
                        const daysAgo = Math.ceil((Date.now() - new Date(race.date).getTime()) / (1000 * 60 * 60 * 24))
                        return (
                          <div key={race.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {(race as any).logoUrl && (
            <RaceLogo 
              src={(race as any).logoUrl} 
              alt={`Logo ${race.name}`}
              className="w-4 h-4 rounded-sm object-contain border shadow-sm p-0.5"
              variant="dark"
            />
                                )}
                                <h4 className="font-medium text-gray-900 text-xs truncate">{race.name}</h4>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{new Date(race.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                {race.location && <span>• {race.location}</span>}
                                {race.distance && <span>• {race.distance}</span>}
                              </div>
                            </div>
                            {race.result ? (
                              <span className="px-1.5 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                                {race.result}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-gray-400 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                                {daysAgo}j
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* Lien vers toutes les compétitions si il y en a plus */}
                {profile.races.length > 4 && (
                  <div className="text-center pt-2">
                    <Link 
                      href="/dashboard/races"
                      className="text-sm text-gray-500 hover:text-yellow-600 font-medium"
                    >
                      +{profile.races.length - 4} autres compétitions →
                    </Link>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Objectifs */}
      <DashboardGoals
        views={analytics._sum.views || 0}
        sponsorsCount={profile.sponsors.length}
        linkClicks={analytics._sum.linkClicks || 0}
      />


      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/profile" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-ocean" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-primary-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-blue-600 transition-colors">
              Éditer Profil
            </h3>
            <p className="text-gray-600 text-sm">
              Mets à jour tes informations personnelles
            </p>
          </div>
        </Link>
        
        <Link href="/dashboard/races" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-energy" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">
              Mes Compétitions
            </h3>
            <p className="text-gray-600 text-sm">
              Gère ton calendrier de compétitions
            </p>
          </div>
        </Link>
        
        <Link href={`/${profile.username}`} target="_blank" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-performance" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-green-100 to-primary-green-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-primary-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-green-600 transition-colors">
              Voir Profil Public
            </h3>
            <p className="text-gray-600 text-sm">
              Aperçu de ton profil en ligne
            </p>
          </div>
        </Link>
      </div>

      {/* Upgrade Banner si FREE */}
      {profile.plan === "FREE" && (
        <div className="relative bg-gradient-premium rounded-3xl shadow-elevated overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20" />
          
          <div className="relative z-10 p-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-accent-600 to-success-600 bg-clip-text text-transparent">
                  Passe en Athlete Pro
                </h3>
                <p className="text-lg text-gray-700 font-medium">
                  Sync Strava, analytics avancées, domaine perso et plus encore
                </p>
              </div>
              <Link 
                href="/dashboard/upgrade"
                className="inline-flex items-center gap-2 bg-white text-primary-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg whitespace-nowrap shadow-floating hover:shadow-glow-purple transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Upgrader l'abonnement
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Section Upgrader l'abonnement */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Upgrader l'abonnement
            </h2>
            <p className="text-gray-600 text-lg">
              Débloque tout le potentiel de ton profil d'athlète
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Plan Free */}
            <div className={`relative rounded-2xl p-6 transition-all ${
              profile.plan === PlanType.FREE 
                ? "bg-white border-2 border-yellow-500 shadow-lg" 
                : "bg-white border border-gray-200 shadow hover:shadow-lg"
            }`}>
              {profile.plan === PlanType.FREE && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Plan Actuel
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-1 text-gray-900">Free</h3>
              <p className="text-sm mb-4 text-gray-600">Parfait pour commencer</p>
              <div className="mb-4">
                <div className="text-4xl font-black text-gray-900">Gratuit</div>
              </div>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">1 lien</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">0 sponsors</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Galerie 2 médias</span>
                </div>
              </div>
            </div>

            {/* Plan Pro */}
            <div className={`relative rounded-2xl p-6 transition-all ${
              profile.plan === PlanType.PRO 
                ? "bg-gradient-to-br from-gray-800 to-black text-white border-2 border-yellow-500 shadow-lg" 
                : "bg-gradient-to-br from-gray-800 to-black text-white shadow-lg hover:shadow-xl"
            }`}>
              {profile.plan === PlanType.PRO && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  Plan Actuel
                </div>
              )}
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                Populaire
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-1">Pro</h3>
              <p className="text-sm mb-4 text-white/90">Pour les athlètes sérieux</p>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">9.90€</span>
                  <span className="text-lg text-white/80">/mois</span>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/90">Liens illimités</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/90">Sponsors illimités</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-white mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/90">Analytics avancées</span>
                </div>
              </div>
              {profile.plan === PlanType.PRO ? (
                <div className="w-full block py-3 rounded-xl font-bold text-center bg-white/20 text-white cursor-not-allowed">
                  Plan actuel
                </div>
              ) : (
                <Link
                  href="/dashboard/upgrade"
                  className="w-full block py-3 rounded-xl font-bold text-center bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Passer Pro
                </Link>
              )}
            </div>

            {/* Plan Elite */}
            <div className={`relative rounded-2xl p-6 transition-all ${
              profile.plan === PlanType.ELITE 
                ? "bg-white border-2 border-yellow-500 shadow-lg" 
                : "bg-white border border-gray-200 shadow hover:shadow-lg"
            }`}>
              {profile.plan === PlanType.ELITE && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  Plan Actuel
                </div>
              )}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black mb-1 text-gray-900">Elite</h3>
              <p className="text-sm mb-4 text-gray-600">Pour les professionnels</p>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900">25.90€</span>
                  <span className="text-lg text-gray-600">/mois</span>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Tout du plan Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Analytics illimitées</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Export données (PDF)</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Service de coaching</span>
                </div>
              </div>
              {profile.plan === PlanType.ELITE ? (
                <div className="w-full block py-3 rounded-xl font-bold text-center bg-gray-100 text-gray-600 cursor-not-allowed">
                  Plan actuel
                </div>
              ) : (
                <Link
                  href="/dashboard/upgrade"
                  className="w-full block py-3 rounded-xl font-bold text-center bg-gradient-to-r from-gray-800 to-black text-white hover:from-gray-900 hover:to-gray-700 transition-all"
                >
                  Passer Elite
                </Link>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Link 
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Voir tous les plans et tarifs
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
