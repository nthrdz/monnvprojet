"use client"

import { useState, useEffect } from "react"
import { AdvancedAnalytics } from "./advanced-analytics"

interface AnalyticsWithFilterProps {
  userPlan: "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH"
  username: string
}

export function AnalyticsWithFilter({ userPlan, username }: AnalyticsWithFilterProps) {
  const [data, setData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [isLoading, setIsLoading] = useState(true)

  const handleExportPDF = async () => {
    try {
      const days = getDaysFromRange(timeRange)
      const response = await fetch('/api/analytics/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ days })
      })
      
      if (!response.ok) throw new Error('Erreur export PDF')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `athlink-analytics-${username}-${timeRange}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur export PDF:', error)
      alert('Erreur lors de l\'export PDF des données')
    }
  }

  // Convertir le timeRange en nombre de jours
  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case "24h": return 1
      case "7d": return 7
      case "30d": return 30
      case "90d": return 90
      case "1y": return 365
      default: return 7
    }
  }

  // Charger les données selon la période
  const loadData = async (range: string) => {
    setIsLoading(true)
    try {
      const days = getDaysFromRange(range)
      const response = await fetch(`/api/analytics/data?days=${days}`)
      
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        // ❌ NE PAS utiliser de données simulées - afficher un message d'erreur
        console.error('Erreur API analytics:', response.status)
        setData(null)
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error)
      // ❌ NE PAS utiliser de données simulées - afficher un message d'erreur
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les données au montage et lors du changement de période
  useEffect(() => {
    loadData(timeRange)
  }, [timeRange])

  // Afficher un état de chargement ou d'erreur
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  // Si pas de données (erreur API ou pas de visites)
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600">
            Partagez votre profil public pour commencer à collecter des statistiques sur vos visiteurs.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Les données démographiques s'afficheront automatiquement dès que vous recevrez des visites.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdvancedAnalytics
      data={data}
      userPlan={userPlan}
      onExportPDF={handleExportPDF}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
    />
  )
}

