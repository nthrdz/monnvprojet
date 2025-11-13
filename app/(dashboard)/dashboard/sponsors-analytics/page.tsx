"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { 
  Award, 
  TrendingUp, 
  MousePointer, 
  Copy, 
  ArrowLeft,
  ExternalLink,
  Percent,
  BarChart3
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

type Sponsor = {
  id: string
  name: string
  logoUrl?: string | null
  websiteUrl?: string | null
  promoCode?: string | null
  clicks: number
  promoCodeCopies: number
  createdAt: string
  updatedAt: string
}

type AnalyticsStats = {
  totalSponsors: number
  totalClicks: number
  totalPromoCopies: number
  averageClicksPerSponsor: number
  conversionRate: number
  topSponsor: Sponsor | null
  sponsorsWithPromo: number
  sponsorsWithoutPromo: number
}

export default function SponsorsAnalyticsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/sponsors/analytics')
      if (res.ok) {
        const data = await res.json()
        setSponsors(data.sponsors)
        setStats(data.stats)
      } else {
        toast.error('Erreur lors du chargement des analytics')
      }
    } catch (error) {
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Sponsors
          </h1>
          <p className="text-gray-600">
            Statistiques détaillées de performance de tes sponsors
          </p>
        </div>
        <Link
          href="/dashboard/sources#sponsors"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
      </div>

      {/* Stats globales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Clics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <MousePointer className="w-8 h-8 text-blue-600" />
                <div className="text-3xl font-bold text-blue-900">
                  {stats.totalClicks}
                </div>
              </div>
              <p className="text-sm font-medium text-blue-700">Total Clics</p>
              <p className="text-xs text-blue-600 mt-1">
                {stats.averageClicksPerSponsor} clics/sponsor
              </p>
            </Card>
          </motion.div>

          {/* Total Copies Code Promo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <Copy className="w-8 h-8 text-green-600" />
                <div className="text-3xl font-bold text-green-900">
                  {stats.totalPromoCopies}
                </div>
              </div>
              <p className="text-sm font-medium text-green-700">Codes Copiés</p>
              <p className="text-xs text-green-600 mt-1">
                Codes promo utilisés
              </p>
            </Card>
          </motion.div>

          {/* Taux de Conversion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <Percent className="w-8 h-8 text-purple-600" />
                <div className="text-3xl font-bold text-purple-900">
                  {stats.conversionRate}%
                </div>
              </div>
              <p className="text-sm font-medium text-purple-700">Conversion</p>
              <p className="text-xs text-purple-600 mt-1">
                Clics → Codes copiés
              </p>
            </Card>
          </motion.div>

          {/* Total Sponsors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
                <div className="text-3xl font-bold text-yellow-900">
                  {stats.totalSponsors}
                </div>
              </div>
              <p className="text-sm font-medium text-yellow-700">Sponsors</p>
              <p className="text-xs text-yellow-600 mt-1">
                {stats.sponsorsWithPromo} avec code promo
              </p>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Meilleur Sponsor */}
      {stats?.topSponsor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-6 h-6 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">
                🏆 Sponsor le Plus Performant
              </h2>
            </div>
            <div className="flex items-center gap-6">
              {stats.topSponsor.logoUrl && (
                <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-white border border-gray-200">
                  <Image
                    src={stats.topSponsor.logoUrl}
                    alt={stats.topSponsor.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {stats.topSponsor.name}
                </h3>
                <div className="flex gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Clics</p>
                    <p className="text-xl font-bold text-blue-600">
                      {stats.topSponsor.clicks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Codes Copiés</p>
                    <p className="text-xl font-bold text-green-600">
                      {stats.topSponsor.promoCodeCopies}
                    </p>
                  </div>
                  {stats.topSponsor.promoCode && (
                    <div>
                      <p className="text-sm text-gray-600">Code Promo</p>
                      <p className="text-lg font-mono font-bold text-gray-900">
                        {stats.topSponsor.promoCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Liste détaillée des sponsors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-gray-900" />
            <h2 className="text-2xl font-bold text-gray-900">
              Performance Détaillée
            </h2>
          </div>

          {sponsors.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun sponsor pour le moment</p>
              <Link
                href="/dashboard/sources#sponsors"
                className="inline-block mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Ajouter un sponsor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {/* Logo */}
                  {sponsor.logoUrl ? (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                      {sponsor.name}
                    </h3>
                    {sponsor.promoCode && (
                      <p className="text-sm text-gray-600">
                        Code: <span className="font-mono font-bold">{sponsor.promoCode}</span>
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {sponsor.clicks}
                      </p>
                      <p className="text-xs text-gray-600">Clics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {sponsor.promoCodeCopies}
                      </p>
                      <p className="text-xs text-gray-600">Codes Copiés</p>
                    </div>
                    {sponsor.clicks > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {((sponsor.promoCodeCopies / sponsor.clicks) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-600">Conv.</p>
                      </div>
                    )}
                  </div>

                  {/* Lien */}
                  {sponsor.websiteUrl && (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

