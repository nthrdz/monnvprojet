"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  MousePointer, 
  Eye, 
  Zap,
  Info,
  Download,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HeatmapPoint {
  x: number
  y: number
  intensity: number
  clicks: number
  element?: string
}

interface ClickHeatmapProps {
  data: HeatmapPoint[]
  profileElements?: {
    avatar: { x: number; y: number; width: number; height: number }
    links: Array<{ x: number; y: number; width: number; height: number; title: string }>
    sponsors: Array<{ x: number; y: number; width: number; height: number }>
  }
  className?: string
}

export function ClickHeatmap({ data, profileElements, className }: ClickHeatmapProps) {
  const [showTooltip, setShowTooltip] = useState<{ x: number; y: number; clicks: number; element?: string } | null>(null)
  const [intensity, setIntensity] = useState(1)
  const [showGrid, setShowGrid] = useState(false)

  // Calculer les statistiques
  const totalClicks = data.reduce((sum, point) => sum + point.clicks, 0)
  const avgClicks = totalClicks / data.length
  const maxClicks = Math.max(...data.map(p => p.clicks))

  // Grouper les points par zones
  const topZones = data
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  const getHeatColor = (intensity: number) => {
    if (intensity > 0.8) return "bg-red-500"
    if (intensity > 0.6) return "bg-orange-500"
    if (intensity > 0.4) return "bg-yellow-500"
    if (intensity > 0.2) return "bg-green-500"
    return "bg-blue-500"
  }

  const handleExport = () => {
    const csvRows = []
    
    // En-tête ludique
    csvRows.push('🔥 HEATMAP DE VOS CLICS - ANALYSE SIMPLIFIÉE')
    csvRows.push(`📅 Généré le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`)
    csvRows.push('')
    
    // Résumé rapide
    csvRows.push('📊 RÉSUMÉ EN UN COUP D\'ŒIL')
    csvRows.push('Ce qui compte vraiment:')
    csvRows.push(`✅ ${totalClicks} clics au total sur votre profil`)
    csvRows.push(`🎯 ${maxClicks} clics sur votre zone la plus populaire`)
    csvRows.push(`📈 ${avgClicks.toFixed(0)} clics en moyenne par zone`)
    csvRows.push(`📍 ${data.length} zones différentes ont été cliquées`)
    csvRows.push('')
    
    // Top 5 avec émojis et explications
    csvRows.push('🏆 TOP 5 DES ZONES LES PLUS CLIQUÉES')
    csvRows.push('Vos visiteurs adorent ces éléments:')
    csvRows.push('')
    csvRows.push(['Classement', 'Nombre de Clics', 'Emplacement', 'Type d\'Élément', 'Conseil'].join(','))
    
    topZones.forEach((zone, index) => {
      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
      const elementNames: { [key: string]: string } = {
        'link': '🔗 Lien',
        'header': '👤 En-tête',
        'sponsor': '💼 Sponsor',
        'media': '📸 Média',
        'race': '🏃 Course',
        'unknown': '❓ Autre'
      }
      const tips = [
        'C\'est votre star ! Mettez-le en avant',
        'Excellent engagement ! Gardez-le visible',
        'Très bon résultat ! Optimisez-le encore',
        'Bon potentiel ! Testez différentes positions',
        'Intéressant ! Analysez pourquoi ça marche'
      ]
      
      csvRows.push([
        `${medals[index]} ${index + 1}`,
        `${zone.clicks} clics`,
        `Position: ${zone.x.toFixed(0)}% horizontal, ${zone.y.toFixed(0)}% vertical`,
        elementNames[zone.element || 'unknown'] || '❓ Autre',
        tips[index]
      ].join(','))
    })
    
    csvRows.push('')
    csvRows.push('💡 CONSEILS D\'OPTIMISATION')
    csvRows.push('Comment améliorer votre profil:')
    
    // Conseils personnalisés basés sur les données
    if (maxClicks > avgClicks * 3) {
      csvRows.push('⚡ Vous avez une zone super performante ! Dupliquez ce qui marche ailleurs')
    }
    if (data.length > 15) {
      csvRows.push('👀 Beaucoup de zones cliquées = profil engageant ! Continuez comme ça')
    }
    if (totalClicks > 100) {
      csvRows.push('🎉 Excellent trafic ! Vos visiteurs sont actifs')
    }
    
    csvRows.push('📍 Placez vos éléments importants dans les zones les plus cliquées')
    csvRows.push('🎨 Testez différentes dispositions et comparez les résultats')
    csvRows.push('🔄 Exportez régulièrement pour suivre l\'évolution')
    csvRows.push('')
    
    // Données détaillées pour les curieux
    csvRows.push('📋 DONNÉES DÉTAILLÉES (pour les experts)')
    csvRows.push(['Zone', 'Clics', 'Position X', 'Position Y', 'Intensité', 'Type'].join(','))
    
    data.forEach((point, index) => {
      const elementEmojis: { [key: string]: string } = {
        'link': '🔗',
        'header': '👤',
        'sponsor': '💼',
        'media': '📸',
        'race': '🏃',
        'unknown': '❓'
      }
      
      csvRows.push([
        `Zone ${index + 1}`,
        point.clicks,
        `${point.x.toFixed(1)}%`,
        `${point.y.toFixed(1)}%`,
        `${(point.intensity * 100).toFixed(0)}%`,
        `${elementEmojis[point.element || 'unknown']} ${point.element || 'autre'}`
      ].join(','))
    })
    
    csvRows.push('')
    csvRows.push('📖 LÉGENDE')
    csvRows.push('Position X: Distance depuis la gauche (0% = tout à gauche, 100% = tout à droite)')
    csvRows.push('Position Y: Distance depuis le haut (0% = tout en haut, 100% = tout en bas)')
    csvRows.push('Intensité: Popularité relative de la zone (100% = zone la plus cliquée)')
    csvRows.push('')
    csvRows.push('💪 Besoin d\'aide ? Contactez le support AthLink !')
    csvRows.push('🚀 Continuez à optimiser votre profil pour maximiser l\'engagement !')
    
    // Créer et télécharger
    const csv = csvRows.join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }) // BOM pour Excel
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `athlink-heatmap-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Heatmap des clics
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Visualisation interactive des zones les plus cliquées
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showGrid ? "Masquer" : "Afficher"} grille
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de clics</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString('fr-FR')}</p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Moyenne par zone</p>
                <p className="text-2xl font-bold text-gray-900">{avgClicks.toFixed(1)}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zone la plus active</p>
                <p className="text-2xl font-bold text-gray-900">{maxClicks}</p>
              </div>
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap principale */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Carte de chaleur</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Intensité:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 h-[600px] overflow-hidden">
                {/* Grille optionnelle */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-20">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-gray-300" />
                    ))}
                  </div>
                )}

                {/* Simulation du profil */}
                <div className="relative w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Avatar simulé */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-gray-200 rounded-full" />
                  
                  {/* Nom simulé */}
                  <div className="absolute top-36 left-1/2 -translate-x-1/2 w-48 h-8 bg-gray-300 rounded" />
                  
                  {/* Bio simulée */}
                  <div className="absolute top-48 left-1/2 -translate-x-1/2 w-64 h-12 bg-gray-200 rounded" />
                  
                  {/* Liens simulés */}
                  <div className="absolute top-64 left-1/2 -translate-x-1/2 w-80 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-full h-14 bg-gray-200 rounded-lg" />
                    ))}
                  </div>

                  {/* Points de chaleur */}
                  {data.map((point, index) => (
                    <motion.div
                      key={index}
                      className={cn(
                        "absolute rounded-full cursor-pointer transition-all",
                        getHeatColor(point.intensity)
                      )}
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        width: `${Math.max(12, point.intensity * 30 * intensity)}px`,
                        height: `${Math.max(12, point.intensity * 30 * intensity)}px`,
                        transform: "translate(-50%, -50%)",
                        opacity: 0.4 + (point.intensity * 0.4)
                      }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2 + (index % 3),
                        repeat: Infinity,
                        delay: index * 0.05
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setShowTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                          clicks: point.clicks,
                          element: point.element
                        })
                      }}
                      onMouseLeave={() => setShowTooltip(null)}
                    />
                  ))}

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm"
                        style={{
                          left: showTooltip.x,
                          top: showTooltip.y - 60,
                          transform: "translateX(-50%)"
                        }}
                      >
                        <div className="font-semibold">{showTooltip.clicks} clics</div>
                        {showTooltip.element && (
                          <div className="text-xs text-gray-300">{showTooltip.element}</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Légende */}
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Faible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-gray-600">Moyen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-gray-600">Élevé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span className="text-gray-600">Très élevé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-gray-600">Maximum</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top zones */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top 5 zones</CardTitle>
              <p className="text-sm text-gray-600">
                Zones les plus cliquées
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topZones.map((zone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full",
                      index === 0 ? "bg-yellow-500" : "bg-gray-400"
                    )}>
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {zone.element || `Zone ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        Position: {zone.x.toFixed(0)}%, {zone.y.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{zone.clicks}</p>
                    <p className="text-xs text-gray-600">clics</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Info Elite */}
          <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-black text-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Fonctionnalité Elite</p>
                  <p className="text-gray-300 text-xs">
                    La heatmap des clics vous permet d'optimiser la disposition de votre profil 
                    en identifiant les zones les plus attractives pour vos visiteurs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

