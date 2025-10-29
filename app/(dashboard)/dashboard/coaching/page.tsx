import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PlanBadge } from "@/components/ui-pro/plan-badge"
import { CoachingDashboardClient } from "./coaching-dashboard-client"
import { TrendingUp, Users, Euro, Calendar, Target, BarChart3, Clock, CheckCircle } from "lucide-react"

export default async function CoachingPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      plan: true,
      displayName: true,
      username: true,
      stats: true
    }
  })

  if (!profile) {
    redirect("/dashboard")
  }

  // Vérifier que l'utilisateur a le plan COACH ou ELITE
  if (profile.plan !== "COACH" && profile.plan !== "ELITE") {
    redirect("/dashboard")
  }

  // Calculer les statistiques depuis les stats JSON
  const stats = profile.stats as any || {}
  const trainingPlans = stats.trainingPlans || []
  const bookings = stats.bookings || []

  const totalPlans = trainingPlans.length
  const activePlans = trainingPlans.filter((plan: any) => plan.isActive).length
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((booking: any) => booking.status === "PENDING").length
  const confirmedBookings = bookings.filter((booking: any) => booking.status === "CONFIRMED").length
  const completedBookingsArray = bookings.filter((booking: any) => booking.status === "COMPLETED")
  const completedBookings = completedBookingsArray.length
  const totalRevenue = completedBookingsArray.reduce((sum: number, booking: any) => sum + booking.price, 0)
  const monthlyRevenue = completedBookingsArray
    .filter((booking: any) => {
      const bookingDate = new Date(booking.date)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, booking: any) => sum + booking.price, 0)

  const dashboardStats = {
    totalPlans,
    activePlans,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    totalRevenue,
    monthlyRevenue
  }

  return (
    <div className="space-y-8">
      {/* Header Centre de Coaching */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 mb-8 sm:mb-10 lg:mb-12 bg-white rounded-b-2xl sm:rounded-b-3xl border-b border-gray-200 shadow-lg">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-black" />
                </div>
                <PlanBadge plan="COACH" size="lg" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-gray-900">
                Centre de Coaching
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 font-medium mb-6">
                Développe ton business de coaching professionnel
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700 font-medium">Interface Professionnelle</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <TrendingUp className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700 font-medium">Analytics Temps Réel</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                  <Users className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700 font-medium">Gestion Clients</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600 font-medium">Plans Actifs</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activePlans}</div>
                <div className="text-xs text-gray-500">sur {totalPlans}</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600 font-medium">Réservations</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
                <div className="text-xs text-gray-500">{pendingBookings} en attente</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600 font-medium">Revenus</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(0)}€</div>
                <div className="text-xs text-gray-500">{monthlyRevenue.toFixed(0)}€ ce mois</div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600 font-medium">Complétées</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedBookings}</div>
                <div className="text-xs text-gray-500">séances terminées</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component avec interface ultra-pro */}
      <CoachingDashboardClient 
        initialStats={dashboardStats}
        profileId={profile.id}
        coachName={profile.displayName}
        username={profile.username}
      />
    </div>
  )
}
