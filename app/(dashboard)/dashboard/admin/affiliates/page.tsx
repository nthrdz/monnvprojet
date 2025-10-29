"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  Eye,
  Edit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { GlassSectionHeader } from "@/components/ui-pro/glass-section-header"

interface Affiliate {
  id: string
  affiliateCode: string
  status: string
  commissionRate: number
  totalEarnings: number
  totalReferrals: number
  totalConversions: number
  approvedAt: string | null
  createdAt: string
  user: {
    name: string
    email: string
    createdAt: string
  }
  stats: {
    referrals: number
    commissions: number
  }
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAffiliates()
  }, [])

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/admin/affiliates')
      if (response.ok) {
        const result = await response.json()
        setAffiliates(result.affiliates)
      }
    } catch (error) {
      console.error('Erreur récupération affiliés:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAffiliateStatus = async (affiliateId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/affiliates?id=${affiliateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        await fetchAffiliates()
        setShowModal(false)
        setSelectedAffiliate(null)
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
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

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         affiliate.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <GlassSectionHeader
            title="Gestion des Ambassadeurs"
            subtitle="Administrez le programme d'affiliation"
            icon={Users}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{affiliates.length}</p>
                <p className="text-gray-400">Total Ambassadeurs</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {affiliates.filter(a => a.status === 'APPROVED').length}
                </p>
                <p className="text-gray-400">Approuvés</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {affiliates.reduce((sum, a) => sum + a.totalEarnings, 0).toFixed(2)}€
                </p>
                <p className="text-gray-400">Commissions payées</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, email ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="PENDING">En attente</option>
            <option value="APPROVED">Approuvés</option>
            <option value="SUSPENDED">Suspendus</option>
          </select>
        </div>

        {/* Affiliates Table */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ambassadeur</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Parrainages</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Conversions</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Gains</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{affiliate.user.name}</p>
                        <p className="text-sm text-gray-400">{affiliate.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-purple-400 font-mono text-sm">{affiliate.affiliateCode}</code>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(affiliate.status)}>
                        {getStatusText(affiliate.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-white">{affiliate.totalReferrals}</td>
                    <td className="px-6 py-4 text-white">{affiliate.totalConversions}</td>
                    <td className="px-6 py-4 text-white">{affiliate.totalEarnings.toFixed(2)}€</td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => {
                          setSelectedAffiliate(affiliate)
                          setShowModal(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal */}
        {showModal && selectedAffiliate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Gérer {selectedAffiliate.user.name}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Code d'affiliation</p>
                  <p className="text-white font-mono">{selectedAffiliate.affiliateCode}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Statut actuel</p>
                  <Badge className={getStatusColor(selectedAffiliate.status)}>
                    {getStatusText(selectedAffiliate.status)}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Taux de commission</p>
                  <p className="text-white">{Math.round(selectedAffiliate.commissionRate * 100)}%</p>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedAffiliate.status !== 'APPROVED' && (
                  <Button
                    onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'APPROVED')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </Button>
                )}
                
                {selectedAffiliate.status !== 'SUSPENDED' && (
                  <Button
                    onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'SUSPENDED')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Suspendre
                  </Button>
                )}
                
                <Button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedAffiliate(null)
                  }}
                  variant="ghost"
                  className="text-gray-400"
                >
                  Fermer
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
