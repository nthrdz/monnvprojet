import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PlanBadge } from "@/components/ui-pro/plan-badge"
import { TrainingPlansClient } from "./training-plans-client"

export default async function TrainingPlansPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      plan: true,
      displayName: true,
      id: true,
      stats: true
    }
  })

  if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
    redirect("/dashboard")
  }

  // Récupérer les plans d'entraînement depuis le champ stats (temporaire)
  const profileStats = profile.stats as any || {}
  const trainingPlans = profileStats.trainingPlans || []

  // Statistiques
  const stats = {
    totalPlans: trainingPlans.length,
    totalSessions: trainingPlans.reduce((acc: number, plan: any) => acc + (plan.sessions?.length || 0), 0),
    totalSubscribers: trainingPlans.reduce((acc: number, plan: any) => acc + (plan.subscribers?.length || 0), 0),
    totalRevenue: trainingPlans.reduce((acc: number, plan: any) => acc + (plan.price * (plan.subscribers?.length || 0)), 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 mb-8 sm:mb-10 lg:mb-12 bg-gradient-hero rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <a
                href="/dashboard/coaching"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium transition-colors mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au Centre de Coaching
              </a>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-primary-700 via-quaternary-700 to-tertiary-700 bg-clip-text text-transparent">
                Plans d'Entraînement
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-600 font-semibold">
                Crée et vends tes programmes personnalisés
              </p>
            </div>
            <PlanBadge plan="COACH" size="lg" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Plans créés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Séances totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-green-100 to-primary-green-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Abonnés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toFixed(0)}€</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <TrainingPlansClient 
        initialPlans={trainingPlans}
        profileId={profile.id}
      />
    </div>
  )
}
