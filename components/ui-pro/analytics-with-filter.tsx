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
        // Fallback sur des données simulées
        setData(generateMockData(days))
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error)
      setData(generateMockData(getDaysFromRange(range)))
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les données au montage et lors du changement de période
  useEffect(() => {
    loadData(timeRange)
  }, [timeRange])

  // Générer des données simulées si besoin
  const generateMockData = (days: number) => {
    return {
      views: {
        total: Math.floor(Math.random() * 1000) + days * 10,
        unique: Math.floor(Math.random() * 800) + days * 8,
        byDate: Array.from({ length: Math.min(days, 30) }, (_, i) => ({
          date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          views: Math.floor(Math.random() * 100) + 20,
          uniqueViews: Math.floor(Math.random() * 80) + 15,
          clicks: Math.floor(Math.random() * 30) + 5
        }))
      },
      clicks: {
        total: Math.floor(Math.random() * 300) + days * 3,
        byLink: Array.from({ length: 5 }, (_, i) => ({
          linkTitle: `Lien ${i + 1}`,
          clicks: Math.floor(Math.random() * 50) + 10,
          percentage: Math.floor(Math.random() * 40) + 10
        })),
        byHour: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          clicks: Math.floor(Math.random() * 20) + 2
        }))
      },
      demographics: {
        countries: [
          { country: "France", visitors: Math.floor(Math.random() * 400) + 100, percentage: 60 },
          { country: "Belgique", visitors: Math.floor(Math.random() * 200) + 50, percentage: 20 },
          { country: "Suisse", visitors: Math.floor(Math.random() * 150) + 30, percentage: 15 },
          { country: "Canada", visitors: Math.floor(Math.random() * 80) + 20, percentage: 5 }
        ],
        devices: [
          { device: "Mobile", count: Math.floor(Math.random() * 500) + 200, percentage: 64 },
          { device: "Desktop", count: Math.floor(Math.random() * 300) + 100, percentage: 36 }
        ],
        browsers: [
          { browser: "Chrome", count: Math.floor(Math.random() * 500) + 200, percentage: 59 },
          { browser: "Safari", count: Math.floor(Math.random() * 200) + 100, percentage: 26 },
          { browser: "Firefox", count: Math.floor(Math.random() * 80) + 30, percentage: 10 },
          { browser: "Edge", count: Math.floor(Math.random() * 40) + 20, percentage: 5 }
        ]
      },
      heatmap: Array.from({ length: 20 }, () => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        intensity: Math.random(),
        clicks: Math.floor(Math.random() * 20) + 1
      }))
    }
  }

  if (!data || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
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

