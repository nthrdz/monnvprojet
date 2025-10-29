"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  Target, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Euro, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Eye,
  Settings,
  Star,
  Award,
  Zap,
  Shield,
  Sparkles
} from "lucide-react"

interface DashboardStats {
  totalPlans: number
  activePlans: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  totalRevenue: number
  monthlyRevenue: number
}

interface CoachingDashboardClientProps {
  initialStats: DashboardStats
  profileId: string
  coachName: string
  username: string
}

export function CoachingDashboardClient({ initialStats, profileId, coachName, username }: CoachingDashboardClientProps) {
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [isLoading, setIsLoading] = useState(false)

  // Simuler le rechargement des stats
  const refreshStats = async () => {
    setIsLoading(true)
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const serviceCards = [
    {
      id: "training-plans",
      title: "Plans d'Entraînement",
      description: "Créer et vendre tes programmes d'entraînement",
      icon: Target,
      color: "yellow",
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient: "from-yellow-50 to-yellow-100",
      iconBg: "from-yellow-100 to-yellow-200",
      href: "/dashboard/coaching/training-plans",
      stats: {
        primary: stats.totalPlans,
        secondary: `${stats.activePlans} actifs`,
        trend: "+12%"
      },
      features: [
        "Programmes personnalisés",
        "Upload PDF intégré",
        "Tarification flexible",
        "Suivi des progrès",
        "Analytics de performance"
      ],
      status: "active",
      badge: "100% Fonctionnel"
    },
    {
      id: "bookings",
      title: "Gestion Réservations",
      description: "Calendrier professionnel et système de booking",
      icon: Calendar,
      color: "yellow",
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient: "from-yellow-50 to-yellow-100",
      iconBg: "from-yellow-100 to-yellow-200",
      href: "/dashboard/coaching/bookings",
      stats: {
        primary: stats.totalBookings,
        secondary: `${stats.pendingBookings} en attente`,
        trend: "+8%"
      },
      features: [
        "Calendrier interactif",
        "Réservations en ligne",
        "Paiements intégrés",
        "Rappels automatiques",
        "Gestion des créneaux"
      ],
      status: "active",
      badge: "Interface Pro"
    },
    {
      id: "analytics",
      title: "Analytics Business",
      description: "Suivi des revenus et performance commerciale",
      icon: BarChart3,
      color: "yellow",
      gradient: "from-yellow-400 to-yellow-500",
      bgGradient: "from-yellow-50 to-yellow-100",
      iconBg: "from-yellow-100 to-yellow-200",
      href: "/dashboard/coaching/business-analytics",
      stats: {
        primary: `${stats.totalRevenue.toFixed(0)}€`,
        secondary: `${stats.monthlyRevenue.toFixed(0)}€ ce mois`,
        trend: "+15%"
      },
      features: [
        "Suivi des revenus",
        "Conversion clients",
        "Rapports détaillés",
        "Prévisions de revenus",
        "Dashboard temps réel"
      ],
      status: "active",
      badge: "Analytics Avancées"
    }
  ]

  const quickActions = [
    {
      title: "Créer un Plan",
      description: "Nouveau programme d'entraînement",
      icon: Plus,
      href: "/dashboard/coaching/training-plans",
      color: "gray"
    },
    {
      title: "Nouvelle Réservation",
      description: "Ajouter un rendez-vous",
      icon: Calendar,
      href: "/dashboard/coaching/bookings",
      color: "gray"
    },
    {
      title: "Voir Analytics",
      description: "Performance business",
      icon: BarChart3,
      href: "/dashboard/coaching/business-analytics",
      color: "gray"
    },
    {
      title: "Page Publique",
      description: "Voir ton profil coaching",
      icon: Eye,
      href: `/${username}/coaching`,
      color: "gray"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={action.href} className="group block">
                <div className="bg-white rounded-2xl shadow-standard hover:shadow-elevated p-6 transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl bg-${action.color}-100 group-hover:bg-${action.color}-200 flex items-center justify-center mb-4 transition-colors`}>
                    <IconComponent className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                    {action.description}
                  </p>
                  <ArrowRight className={`w-4 h-4 text-${action.color}-500 mt-2 group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Services Cards */}
      <div className="grid lg:grid-cols-3 gap-8">
        {serviceCards.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={service.href} className="group block h-full">
                <div className="relative bg-white rounded-3xl shadow-standard hover:shadow-elevated p-8 transition-all duration-500 group-hover:-translate-y-2 h-full overflow-hidden border border-gray-100">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Top Border */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient}`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Title & Description */}
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-500 transition-colors">
                        {service.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-gray-900">
                          {service.stats.primary}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{service.stats.secondary}</div>
                          <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {service.stats.trend}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <div className={`w-2 h-2 bg-${service.color}-500 rounded-full`} />
                          <span className="text-sm text-gray-700 group-hover:text-gray-600 transition-colors">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Zap className="w-4 h-4" />
                        <span>Interface Pro</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                        <span className="text-sm font-medium">Accéder</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-standard p-8 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Performance Globale</h3>
            <p className="text-gray-600">Vue d'ensemble de ton activité de coaching</p>
          </div>
          
          <button
            onClick={refreshStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
            Actualiser
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Plans Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Plans d'Entraînement</div>
                <div className="text-lg font-bold text-gray-900">{stats.totalPlans}</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stats.activePlans}/{stats.totalPlans} actifs
            </div>
          </div>

          {/* Bookings Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Réservations</div>
                <div className="text-lg font-bold text-gray-900">{stats.totalBookings}</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stats.pendingBookings} en attente
            </div>
          </div>

          {/* Revenue Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Euro className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Revenus Total</div>
                <div className="text-lg font-bold text-gray-900">{stats.totalRevenue.toFixed(0)}€</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stats.monthlyRevenue.toFixed(0)}€ ce mois
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Taux de Succès</div>
                <div className="text-lg font-bold text-gray-900">
                  {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {stats.completedBookings} séances terminées
            </div>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative bg-white rounded-3xl p-8 text-center overflow-hidden border border-gray-200 shadow-lg"
      >
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-black" />
          </div>
          
          <h3 className="text-3xl font-black text-gray-900 mb-4">
            Prêt à développer ton business ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
            Utilise toutes les fonctionnalités professionnelles d'Athlink pour créer une expérience coaching exceptionnelle et développer ton activité.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/coaching/training-plans"
              className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Créer mon premier plan
            </Link>
            <Link
              href={`/${username}/coaching`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              <Eye className="w-5 h-5" />
              Voir ma page publique
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
