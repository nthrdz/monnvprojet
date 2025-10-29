"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Share2, 
  Copy, 
  CheckCircle, 
  Clock, 
  BarChart3,
  ExternalLink,
  Gift,
  Target,
  CreditCard,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlassSectionHeader } from "@/components/ui-pro/glass-section-header"
import { GlassStats } from "@/components/ui-pro/glass-stats"
import { GlassLinkCard } from "@/components/ui-pro/glass-link-card"

interface AffiliateData {
  affiliate: {
    id: string
    affiliateCode: string
    status: string
    commissionRate: number
    totalEarnings: number
    totalReferrals: number
    totalConversions: number
    approvedAt: string | null
    createdAt: string
  }
  stats: {
    total: {
      referrals: number
      conversions: number
      earnings: number
    }
    byStatus: Record<string, { count: number; earnings: number }>
    monthly: Record<string, { count: number; earnings: number }>
  }
  commissions: {
    pending: { amount: number; count: number }
    paid: { amount: number; count: number }
  }
  recentReferrals: Array<{
    id: string
    status: string
    createdAt: string
    referredUser: {
      name: string
      email: string
      createdAt: string
    } | null
  }>
  recentCommissions: Array<{
    id: string
    amount: number
    type: string
    status: string
    createdAt: string
  }>
}

export default function AffiliateDashboard() {
  const [data, setData] = useState<AffiliateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchAffiliateData()
  }, [])

  const fetchAffiliateData = async () => {
    try {
      const response = await fetch('/api/affiliate/dashboard')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Erreur récupération données:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = async () => {
    if (!data?.affiliate.affiliateCode) return
    
    const referralLink = `${window.location.origin}?ref=${data.affiliate.affiliateCode}`
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500/20 text-green-400'
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400'
      case 'SUSPENDED': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Approuvé'
      case 'PENDING': return 'En attente'
      case 'SUSPENDED': return 'Suspendu'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-4">Aucune donnée d'affiliation</h1>
            <p className="text-gray-400 mb-8">Vous n'êtes pas encore ambassadeur.</p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Devenir ambassadeur
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <GlassSectionHeader
            title="Dashboard Ambassadeur"
            subtitle="Gérez vos parrainages et commissions"
            icon={Target}
          />
          
          <div className="flex items-center gap-4 mt-4">
            <Badge className={getStatusColor(data.affiliate.status)}>
              {getStatusText(data.affiliate.status)}
            </Badge>
            <span className="text-sm text-gray-400">
              Taux de commission: {Math.round(data.affiliate.commissionRate * 100)}%
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassStats
            title="Total Parrainages"
            value={data.stats.total.referrals}
            icon={Users}
            trend={data.stats.monthly.PENDING?.count || 0}
            trendLabel="Ce mois"
          />
          <GlassStats
            title="Conversions"
            value={data.stats.total.conversions}
            icon={CheckCircle}
            trend={data.stats.monthly.CONVERTED?.count || 0}
            trendLabel="Ce mois"
          />
          <GlassStats
            title="Gains Totaux"
            value={`${data.stats.total.earnings.toFixed(2)}€`}
            icon={DollarSign}
            trend={data.commissions.pending.amount}
            trendLabel="En attente"
          />
        </div>

        {/* Referral Link */}
        <div className="mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Share2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Lien de parrainage</h3>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 bg-white/10 rounded-lg p-3 font-mono text-sm text-gray-300">
                {`${window.location.origin}?ref=${data.affiliate.affiliateCode}`}
              </div>
              <Button
                onClick={copyReferralLink}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            
            <p className="text-sm text-gray-400 mt-2">
              Partagez ce lien pour parrainer de nouveaux utilisateurs
            </p>
          </Card>
        </div>

        {/* Commissions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Commissions en attente</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {data.commissions.pending.amount.toFixed(2)}€
            </div>
            <p className="text-sm text-gray-400">
              {data.commissions.pending.count} commission(s) en attente de paiement
            </p>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Commissions payées</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {data.commissions.paid.amount.toFixed(2)}€
            </div>
            <p className="text-sm text-gray-400">
              {data.commissions.paid.count} commission(s) payée(s)
            </p>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Parrainages récents</h3>
            </div>
            
            <div className="space-y-3">
              {data.recentReferrals.length > 0 ? (
                data.recentReferrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {referral.referredUser?.name || 'Utilisateur anonyme'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(referral.status)}>
                      {getStatusText(referral.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucun parrainage récent</p>
              )}
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <DollarSign className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Commissions récentes</h3>
            </div>
            
            <div className="space-y-3">
              {data.recentCommissions.length > 0 ? (
                data.recentCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">
                        {commission.amount.toFixed(2)}€
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(commission.status)}>
                      {getStatusText(commission.status)}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">Aucune commission récente</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
