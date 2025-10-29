"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users, 
  Download,
  Calendar,
  MapPin,
  Clock,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ClickHeatmap } from "./click-heatmap"

interface AnalyticsData {
  views: {
    total: number
    unique: number
    byDate: Array<{ date: string; views: number; uniqueViews: number }>
  }
  clicks: {
    total: number
    byLink: Array<{ linkTitle: string; clicks: number; percentage: number }>
    byHour: Array<{ hour: number; clicks: number }>
  }
  demographics: {
    countries: Array<{ country: string; visitors: number; percentage: number }>
    devices: Array<{ device: string; count: number; percentage: number }>
    browsers: Array<{ browser: string; count: number; percentage: number }>
  }
  heatmap: Array<{
    x: number
    y: number
    intensity: number
    clicks: number
  }>
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData
  userPlan: "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH"
  onExportPDF?: () => void
  className?: string
  timeRange?: string
  onTimeRangeChange?: (range: string) => void
}

export function AdvancedAnalytics({ 
  data, 
  userPlan, 
  onExportPDF,
  className,
  timeRange: externalTimeRange,
  onTimeRangeChange
}: AdvancedAnalyticsProps) {
  const [internalTimeRange, setInternalTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")
  
  // Utiliser le timeRange externe s'il est fourni, sinon utiliser l'interne
  const timeRange = externalTimeRange || internalTimeRange
  const setTimeRange = onTimeRangeChange || setInternalTimeRange

  const canAccessAdvancedFeatures = userPlan === "PRO" || userPlan === "ELITE" || userPlan === "ATHLETE_PRO" || userPlan === "COACH"
  const canAccessEliteFeatures = userPlan === "ELITE" || userPlan === "ATHLETE_PRO"

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "clicks", label: "Clics", icon: MousePointer },
    { id: "demographics", label: "Démographie", icon: Users },
    ...(canAccessEliteFeatures ? [{ id: "heatmap", label: "Heatmap", icon: MapPin }] : [])
  ]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 70) return "bg-green-500"
    if (percentage >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPeriodLabel = (range: string) => {
    switch (range) {
      case "24h": return "Dernières 24 heures"
      case "7d": return "7 derniers jours"
      case "30d": return "30 derniers jours"
      case "90d": return "90 derniers jours"
      case "1y": return "Dernière année"
      default: return "Période personnalisée"
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header avec sélecteur de période */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avancées</h2>
          <p className="text-gray-600">
            {canAccessAdvancedFeatures 
              ? `Analyses détaillées - ${getPeriodLabel(timeRange)}` 
              : "Upgrade vers Pro pour accéder aux analytics avancées"
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              {canAccessEliteFeatures && <SelectItem value="90d">90 jours</SelectItem>}
              {canAccessEliteFeatures && <SelectItem value="1y">1 an</SelectItem>}
            </SelectContent>
          </Select>
          
          {canAccessAdvancedFeatures && onExportPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
            >
              <Download className="w-4 h-4" />
              Exporter PDF
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenu des tabs */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Vues totales</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(data.views.total)}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-500 flex-shrink-0" />
                  </div>
                  <div className="mt-auto flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% vs période précédente
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Visiteurs uniques</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(data.views.unique)}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500 flex-shrink-0" />
                  </div>
                  <div className="mt-auto flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% vs période précédente
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Clics total</p>
                      <p className="text-2xl font-bold text-gray-900">{formatNumber(data.clicks.total)}</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-purple-500 flex-shrink-0" />
                  </div>
                  <div className="mt-auto flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +15% vs période précédente
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Taux de clic</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {data.views.total > 0 ? ((data.clicks.total / data.views.total) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-500 flex-shrink-0" />
                  </div>
                  <div className="mt-auto flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +3% vs période précédente
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique d'évolution des vues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Évolution des vues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {data.views.byDate.slice(-30).map((day: any, index: number) => {
                    const maxViews = Math.max(...data.views.byDate.map((d: any) => d.views))
                    const height = (day.views / maxViews) * 100
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer relative group min-w-[8px]"
                        title={`${new Date(day.date).toLocaleDateString('fr-FR')} - ${day.views} vues`}
                      >
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}<br />
                          {day.views} vues
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                  <span>{data.views.byDate[0]?.date ? new Date(data.views.byDate[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : ''}</span>
                  <span>Aujourd'hui</span>
                </div>
              </CardContent>
            </Card>

            {/* Top 5 des zones les plus cliquées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Top 5 des zones les plus cliquées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.clicks.byLink.slice(0, 5).map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                        index === 0 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{link.linkTitle}</p>
                        <p className="text-sm text-gray-600">{link.clicks} clics ({link.percentage}%)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "clicks" && canAccessAdvancedFeatures && (
          <div className="space-y-6">
            {/* Stats rapides des clics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total de clics</p>
                      <p className="text-3xl font-bold text-gray-900">{formatNumber(data.clicks.total)}</p>
                    </div>
                    <MousePointer className="w-10 h-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Moyenne par lien</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {data.clicks.byLink.length > 0 
                          ? Math.round(data.clicks.total / data.clicks.byLink.length) 
                          : 0}
                      </p>
                    </div>
                    <BarChart3 className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lien le plus cliqué</p>
                      <p className="text-xl font-bold text-gray-900">
                        {data.clicks.byLink[0]?.clicks || 0} clics
                      </p>
                      <p className="text-sm text-gray-500">{data.clicks.byLink[0]?.linkTitle || 'N/A'}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clics par lien */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Performance des liens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.clicks.byLink.map((link, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{link.linkTitle}</p>
                          <p className="text-sm text-gray-600">{link.clicks} clics totaux</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-40 bg-gray-200 rounded-full h-3">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${link.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn("h-3 rounded-full", getPercentageColor(link.percentage))}
                          />
                        </div>
                        <Badge variant="secondary" className="min-w-[60px] text-center">{link.percentage}%</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clics par heure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activité par heure de la journée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-48 flex items-end justify-between gap-1">
                    {data.clicks.byHour.map((hour, index) => {
                      const maxClicks = Math.max(...data.clicks.byHour.map(h => h.clicks))
                      const height = maxClicks > 0 ? (hour.clicks / maxClicks) * 100 : 0
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(10, height)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.02 }}
                          className="flex-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t hover:from-purple-600 hover:to-purple-500 transition-colors cursor-pointer relative group"
                          title={`${hour.hour}h - ${hour.clicks} clics`}
                        >
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            {hour.hour}h00<br />
                            {hour.clicks} clics
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>00h</span>
                    <span>06h</span>
                    <span>12h</span>
                    <span>18h</span>
                    <span>23h</span>
                  </div>
                  
                  {/* Insights sur les heures de pointe */}
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-900 mb-1">💡 Heure de pointe</p>
                    <p className="text-xs text-purple-700">
                      La plupart de vos visiteurs cliquent entre {
                        data.clicks.byHour.reduce((max, h) => h.clicks > max.clicks ? h : max).hour
                      }h et {
                        (data.clicks.byHour.reduce((max, h) => h.clicks > max.clicks ? h : max).hour + 2) % 24
                      }h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "demographics" && canAccessAdvancedFeatures && (
          <div className="space-y-6">
            {/* Stats démographiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pays principaux</p>
                      <p className="text-3xl font-bold text-gray-900">{data.demographics.countries.length}</p>
                    </div>
                    <Globe className="w-10 h-10 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Type d'appareil dominant</p>
                      <p className="text-xl font-bold text-gray-900">
                        {data.demographics.devices[0]?.device || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">{data.demographics.devices[0]?.percentage}% du trafic</p>
                    </div>
                    <Smartphone className="w-10 h-10 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Navigateur principal</p>
                      <p className="text-xl font-bold text-gray-900">
                        {data.demographics.browsers[0]?.browser || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">{data.demographics.browsers[0]?.percentage}% des visites</p>
                    </div>
                    <Monitor className="w-10 h-10 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grille de détails démographiques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pays */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    Répartition géographique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.demographics.countries.map((country, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{
                              country.country === 'France' ? '🇫🇷' :
                              country.country === 'Belgique' ? '🇧🇪' :
                              country.country === 'Suisse' ? '🇨🇭' :
                              country.country === 'Canada' ? '🇨🇦' : '🌍'
                            }</span>
                            <span className="text-sm font-medium text-gray-900">{country.country}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{country.percentage}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${country.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="bg-blue-500 h-2 rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-600">{formatNumber(country.visitors)} visiteurs</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Appareils */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-500" />
                    Types d'appareils
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {data.demographics.devices.map((device, index) => {
                      const Icon = device.device === "Mobile" ? Smartphone : Monitor
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{device.device}</p>
                                <p className="text-xs text-gray-600">{formatNumber(device.count)} visites</p>
                              </div>
                            </div>
                            <Badge className="bg-green-500 text-white">{device.percentage}%</Badge>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${device.percentage}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="bg-green-500 h-3 rounded-full"
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                    
                    {/* Insights */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-900 mb-1">📱 Recommandation</p>
                      <p className="text-xs text-green-700">
                        {data.demographics.devices[0]?.device === 'Mobile' 
                          ? 'La majorité de vos visiteurs sont sur mobile. Assurez-vous que votre profil est optimisé pour mobile.'
                          : 'La majorité de vos visiteurs sont sur desktop. Profitez de l\'espace pour des visuels plus grands.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigateurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-500" />
                    Navigateurs utilisés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.demographics.browsers.map((browser, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{
                              browser.browser === 'Chrome' ? '🔵' :
                              browser.browser === 'Safari' ? '🧭' :
                              browser.browser === 'Firefox' ? '🦊' :
                              browser.browser === 'Edge' ? '🌐' : '💻'
                            }</span>
                            <span className="text-sm font-medium text-gray-900">{browser.browser}</span>
                          </div>
                          <Badge variant="secondary">{browser.percentage}%</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${browser.percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="bg-purple-500 h-2 rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-600">{formatNumber(browser.count)} utilisateurs</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte de compatibilité */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Profil de votre audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-4xl mb-2">{
                      data.demographics.countries[0]?.country === 'France' ? '🇫🇷' : '🌍'
                    }</p>
                    <p className="font-medium text-gray-900">Localisation principale</p>
                    <p className="text-sm text-gray-600">{data.demographics.countries[0]?.country}</p>
                    <p className="text-xs text-blue-600 mt-2">{data.demographics.countries[0]?.percentage}% de l'audience</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-4xl mb-2">{
                      data.demographics.devices[0]?.device === 'Mobile' ? '📱' : '💻'
                    }</p>
                    <p className="font-medium text-gray-900">Appareil préféré</p>
                    <p className="text-sm text-gray-600">{data.demographics.devices[0]?.device}</p>
                    <p className="text-xs text-green-600 mt-2">{data.demographics.devices[0]?.percentage}% des visites</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-4xl mb-2">{
                      data.demographics.browsers[0]?.browser === 'Chrome' ? '🔵' :
                      data.demographics.browsers[0]?.browser === 'Safari' ? '🧭' : '💻'
                    }</p>
                    <p className="font-medium text-gray-900">Navigateur favori</p>
                    <p className="text-sm text-gray-600">{data.demographics.browsers[0]?.browser}</p>
                    <p className="text-xs text-purple-600 mt-2">{data.demographics.browsers[0]?.percentage}% des utilisateurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "heatmap" && canAccessEliteFeatures && (
          <ClickHeatmap 
            data={data.heatmap.map(point => ({
              ...point,
              element: point.y < 30 ? "En-tête" : point.y < 60 ? "Liens" : "Sponsors"
            }))}
          />
        )}
      </div>

      {/* Limitation pour plan gratuit */}
      {!canAccessAdvancedFeatures && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Analytics avancées disponibles
            </h3>
            <p className="text-yellow-700 mb-4">
              Upgrade vers Pro ou Elite pour accéder aux analyses détaillées, 
              démographie des visiteurs, et bien plus encore.
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Voir les plans
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
