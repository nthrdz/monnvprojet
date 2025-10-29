"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Users, Calendar, Euro, Target, Download, Filter } from "lucide-react"

interface Stats {
  totalRevenue: number
  monthlyRevenue: number
  uniqueClients: number
  upcomingBookings: number
  totalSubscribers: number
  trainingRevenue: number
  conversionRate: number
  averageBookingValue: number
}

interface BusinessAnalyticsClientProps {
  stats: Stats
  bookings: any[]
  trainingPlans: any[]
  coachName: string
}

export function BusinessAnalyticsClient({ stats, bookings, trainingPlans, coachName }: BusinessAnalyticsClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "bookings" | "clients">("revenue")

  // Calculer les données pour les graphiques
  const chartData = useMemo(() => {
    const now = new Date()
    const periods = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365
    }
    const days = periods[selectedPeriod]
    
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayBookings = bookings.filter((b: any) => {
        const bookingDate = new Date(b.date).toISOString().split('T')[0]
        return bookingDate === dateStr && b.status === "COMPLETED"
      })
      
      data.push({
        date: dateStr,
        revenue: dayBookings.reduce((acc: number, b: any) => acc + (b.price || 0), 0),
        bookings: dayBookings.length,
        clients: new Set(dayBookings.map((b: any) => b.clientEmail)).size
      })
    }
    
    return data
  }, [selectedPeriod, bookings])

  // Calculer les tendances
  const trends = useMemo(() => {
    const half = Math.floor(chartData.length / 2)
    const firstHalf = chartData.slice(0, half)
    const secondHalf = chartData.slice(half)
    
    const firstHalfRevenue = firstHalf.reduce((acc, d) => acc + d.revenue, 0)
    const secondHalfRevenue = secondHalf.reduce((acc, d) => acc + d.revenue, 0)
    
    const revenueGrowth = firstHalfRevenue > 0 
      ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue * 100) 
      : 0
    
    return {
      revenue: revenueGrowth,
      isPositive: revenueGrowth >= 0
    }
  }, [chartData])

  // Top clients
  const topClients = useMemo(() => {
    const clientMap = new Map()
    bookings.filter((b: any) => b.status === "COMPLETED").forEach((b: any) => {
      const current = clientMap.get(b.clientEmail) || { name: b.clientName, email: b.clientEmail, revenue: 0, bookings: 0 }
      current.revenue += b.price || 0
      current.bookings += 1
      clientMap.set(b.clientEmail, current)
    })
    
    return Array.from(clientMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [bookings])

  // Top services
  const topServices = useMemo(() => {
    const serviceMap = new Map()
    bookings.filter((b: any) => b.status === "COMPLETED").forEach((b: any) => {
      const current = serviceMap.get(b.service) || { service: b.service, revenue: 0, bookings: 0 }
      current.revenue += b.price || 0
      current.bookings += 1
      serviceMap.set(b.service, current)
    })
    
    return Array.from(serviceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [bookings])

  const maxChartValue = Math.max(...chartData.map(d => d[selectedMetric]))

  const exportData = () => {
    const csv = [
      ["Date", "Revenus", "Réservations", "Clients"],
      ...chartData.map(d => [d.date, d.revenue, d.bookings, d.clients])
    ].map(row => row.join(",")).join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${coachName}-${selectedPeriod}.csv`
    a.click()
  }

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-green-100 to-primary-green-200 flex items-center justify-center">
              <Euro className="w-6 h-6 text-primary-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${trends.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trends.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trends.revenue).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(0)}€</p>
          <p className="text-xs text-gray-500 mt-2">Ce mois : {stats.monthlyRevenue.toFixed(0)}€</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Clients uniques</p>
          <p className="text-3xl font-bold text-gray-900">{stats.uniqueClients}</p>
          <p className="text-xs text-gray-500 mt-2">Réservations à venir : {stats.upcomingBookings}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Taux de conversion</p>
          <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2">Réservations confirmées</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-standard p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Valeur moyenne</p>
          <p className="text-3xl font-bold text-gray-900">{stats.averageBookingValue.toFixed(0)}€</p>
          <p className="text-xs text-gray-500 mt-2">Par réservation</p>
        </motion.div>
      </div>

      {/* Chart Section - Simplifié */}
      <div className="bg-white rounded-2xl shadow-standard border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Évolution des performances</h3>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border-none"
            >
              <option value="7d">7 jours</option>
              <option value="30d">30 jours</option>
              <option value="90d">90 jours</option>
              <option value="1y">1 an</option>
            </select>
            <button
              onClick={exportData}
              className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              title="Exporter en CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-0.5">
          {chartData.map((data, index) => {
            const height = maxChartValue > 0 ? (data.revenue / maxChartValue * 100) : 0
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full flex flex-col items-center">
                  <div className="text-[10px] font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {data.revenue}€
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.4, delay: index * 0.005 }}
                    className="w-full bg-gray-900 group-hover:bg-gray-700 transition-colors"
                    style={{ minHeight: height > 0 ? "2px" : "0" }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">Revenus sur les {selectedPeriod === "7d" ? "7 derniers jours" : selectedPeriod === "30d" ? "30 derniers jours" : selectedPeriod === "90d" ? "90 derniers jours" : "12 derniers mois"}</p>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clients */}
        <div className="bg-white rounded-2xl shadow-standard border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Clients</h3>
          {topClients.length > 0 ? (
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-blue-600">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.bookings} réservations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-green-600">{client.revenue.toFixed(0)}€</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucun client pour le moment</p>
          )}
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl shadow-standard border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Services Populaires</h3>
          {topServices.length > 0 ? (
            <div className="space-y-3">
              {topServices.map((service, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{service.service}</p>
                    <p className="font-bold text-primary-green-600">{service.revenue.toFixed(0)}€</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-green-400 rounded-full"
                        style={{ width: `${(service.bookings / bookings.filter((b: any) => b.status === "COMPLETED").length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{service.bookings} sessions</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucun service pour le moment</p>
          )}
        </div>
      </div>

      {/* Training Plans Revenue */}
      {trainingPlans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-standard border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenus Plans d'Entraînement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 rounded-xl">
              <p className="text-sm text-primary-blue-600 mb-1">Plans actifs</p>
              <p className="text-2xl font-bold text-primary-blue-900">{trainingPlans.filter((p: any) => p.isActive).length}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-primary-green-50 to-primary-green-100 rounded-xl">
              <p className="text-sm text-primary-green-600 mb-1">Abonnés totaux</p>
              <p className="text-2xl font-bold text-primary-green-900">{stats.totalSubscribers}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p className="text-sm text-green-600 mb-1">Revenus générés</p>
              <p className="text-2xl font-bold text-green-900">{stats.trainingRevenue.toFixed(0)}€</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
