'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GlassSectionHeader } from '@/components/ui-pro/glass-section-header'
import { 
  Copy, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Euro, 
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Share2,
  BarChart3,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface DashboardData {
  affiliate: {
    id: string
    code: string
    status: string
    commissionRate: number
    approvedAt: string | null
    stripeAccountId: string | null
    stripeAccountStatus: string | null
  }
  stats: {
    totalClicks: number
    totalReferrals: number
    totalConversions: number
    pendingReferrals: number
    totalEarnings: number
    pendingCommissions: number
    paidCommissions: number
    conversionRate: number
    last30Days: {
      clicks: number
      conversions: number
      earnings: number
    }
  }
  charts: {
    clicksByDay: Record<string, number>
    conversionsByDay: Record<string, number>
    earningsByDay: Record<string, number>
  }
  recentConversions: Array<{
    id: string
    date: string
    userName: string
    value: number
    commission: number
    plan: string
  }>
  referralLinks: {
    signup: string
    home: string
    pro: string
    elite: string
  }
  commissions: Array<{
    id: string
    amount: number
    type: string
    status: string
    description: string
    createdAt: string
    paidAt: string | null
    paymentMethod: string | null
  }>
}

export default function AffiliateDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Vérifier le profil et le plan
    fetch('/api/profile')
      .then(res => res.json())
      .then(profileData => {
        setProfile(profileData)
        
        // Vérifier si l'utilisateur est PRO ou ELITE
        if (profileData.plan !== 'PRO' && profileData.plan !== 'ELITE') {
          toast.error('Vous devez être abonné PRO ou ELITE pour accéder au programme ambassadeur')
          router.push('/dashboard/upgrade')
          return
        }

        // Charger les données du dashboard
        return fetch('/api/affiliate/dashboard')
      })
      .then(res => res?.json())
      .then(dashboardData => {
        if (dashboardData?.success) {
          setData(dashboardData)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Erreur chargement dashboard:', error)
        setLoading(false)
      })
  }, [session, status, router])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copié !`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si pas de données, afficher le formulaire de candidature
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Devenez Ambassadeur Athlink
              </h1>
              <p className="text-gray-600">
                Gagnez 40% de commission sur chaque vente générée
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Euro className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Commission de 40%
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Touchez 40% sur chaque abonnement PRO (3,99€) ou ELITE (7,99€) généré
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Dashboard en temps réel
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Suivez vos clics, conversions et gains en temps réel
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Paiement automatique
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Vos commissions sont versées automatiquement via Stripe Connect
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/dashboard/affiliate/apply">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Postuler maintenant
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Si en attente d'approbation
  if (data.affiliate.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-yellow-200">
            <div className="text-center">
              <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Candidature en cours
              </h1>
              <p className="text-gray-600 mb-6">
                Votre candidature est en cours d'examen par notre équipe.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4" />
                En attente d'approbation
              </div>
              <p className="text-gray-500 text-sm mt-6">
                Vous recevrez un email dès que votre candidature sera approuvée.
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Dashboard complet pour affilié approuvé
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Ambassadeur
            </h1>
            <p className="text-gray-600">
              Code : <span className="font-mono font-semibold text-purple-600">{data.affiliate.code}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Actif
          </div>
        </div>

        {/* Stats principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <MousePointerClick className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.stats.totalClicks}
            </div>
            <div className="text-sm text-gray-600 mt-1">Clics totaux</div>
            <div className="text-xs text-blue-600 mt-2">
              +{data.stats.last30Days.clicks} ce mois
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.stats.totalConversions}
            </div>
            <div className="text-sm text-gray-600 mt-1">Conversions</div>
            <div className="text-xs text-purple-600 mt-2">
              +{data.stats.last30Days.conversions} ce mois
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Euro className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.stats.totalEarnings.toFixed(2)}€
            </div>
            <div className="text-sm text-gray-600 mt-1">Gains totaux</div>
            <div className="text-xs text-green-600 mt-2">
              +{data.stats.last30Days.earnings.toFixed(2)}€ ce mois
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {data.stats.conversionRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Taux de conversion</div>
            <div className="text-xs text-gray-500 mt-2">
              {data.stats.pendingReferrals} en attente
            </div>
          </Card>
        </div>

        {/* Liens de parrainage */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <GlassSectionHeader
            title="🔗 Vos liens de parrainage"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Object.entries(data.referralLinks).map(([key, url]) => (
              <div key={key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs font-semibold text-gray-700 uppercase mb-1">
                    {key === 'signup' && '📝 Inscription'}
                    {key === 'home' && '🏠 Accueil'}
                    {key === 'pro' && '⭐ Plan PRO'}
                    {key === 'elite' && '💎 Plan ELITE'}
                  </div>
                  <div className="text-sm text-gray-600 truncate font-mono">
                    {url}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(url, 'Lien')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversions récentes */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <GlassSectionHeader
            title="🎉 Conversions récentes"
          />
          <div className="mt-4 space-y-3">
            {data.recentConversions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune conversion pour le moment. Partagez vos liens !
              </div>
            ) : (
              data.recentConversions.map(conversion => (
                <div key={conversion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {conversion.userName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(conversion.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      +{conversion.commission?.toFixed(2)}€
                    </div>
                    <div className="text-xs text-gray-500">
                      Vente: {conversion.value?.toFixed(2)}€
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Commissions */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <GlassSectionHeader
            title="💰 Historique des commissions"
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">En attente</div>
                <div className="text-2xl font-bold text-blue-600">
                  {data.stats.pendingCommissions.toFixed(2)}€
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Payé</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.stats.paidCommissions.toFixed(2)}€
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {data.commissions.slice(0, 10).map(commission => (
                <div key={commission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {commission.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(commission.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {commission.amount.toFixed(2)}€
                      </div>
                      <div className={`text-xs ${
                        commission.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {commission.status === 'PAID' ? '✓ Payé' : '⏳ En attente'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
