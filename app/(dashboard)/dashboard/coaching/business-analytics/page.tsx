import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PlanBadge } from "@/components/ui-pro/plan-badge"
import { BusinessAnalyticsClient } from "./business-analytics-client"

export default async function BusinessAnalyticsPage() {
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

  // Récupérer les données depuis le champ stats (temporaire)
  const profileStats = profile.stats as any || {}
  const bookings = profileStats.bookings || []
  const trainingPlans = profileStats.trainingPlans || []

  // Calculer les métriques
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Revenus
  const completedBookings = bookings.filter((b: any) => b.status === "COMPLETED")
  const totalRevenue = completedBookings.reduce((acc: number, b: any) => acc + (b.price || 0), 0)
  
  const currentMonthBookings = completedBookings.filter((b: any) => {
    const bookingDate = new Date(b.date)
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
  })
  const monthlyRevenue = currentMonthBookings.reduce((acc: number, b: any) => acc + (b.price || 0), 0)

  // Clients
  const uniqueClients = new Set(completedBookings.map((b: any) => b.clientEmail)).size
  const upcomingBookings = bookings.filter((b: any) => 
    new Date(b.date) >= now && b.status === "CONFIRMED"
  )

  // Plans d'entraînement
  const totalSubscribers = trainingPlans.reduce((acc: number, plan: any) => 
    acc + (plan.subscribers?.length || 0), 0
  )
  const trainingRevenue = trainingPlans.reduce((acc: number, plan: any) => 
    acc + (plan.price * (plan.subscribers?.length || 0)), 0
  )

  // Taux de conversion (réservations confirmées / réservations totales)
  const totalBookingsCount = bookings.length
  const confirmedBookingsCount = bookings.filter((b: any) => 
    b.status === "CONFIRMED" || b.status === "COMPLETED"
  ).length
  const conversionRate = totalBookingsCount > 0 
    ? (confirmedBookingsCount / totalBookingsCount * 100) 
    : 0

  const stats = {
    totalRevenue,
    monthlyRevenue,
    uniqueClients,
    upcomingBookings: upcomingBookings.length,
    totalSubscribers,
    trainingRevenue,
    conversionRate,
    averageBookingValue: completedBookings.length > 0 
      ? totalRevenue / completedBookings.length 
      : 0
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
                Analytics Business
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-600 font-semibold">
                Suis tes revenus et optimise ton business
              </p>
            </div>
            <PlanBadge plan="COACH" size="lg" />
          </div>
        </div>
      </div>

      {/* Client Component */}
      <BusinessAnalyticsClient 
        stats={stats}
        bookings={bookings}
        trainingPlans={trainingPlans}
        coachName={profile.displayName}
      />
    </div>
  )
}
