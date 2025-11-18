"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RaceLogo } from "@/components/ui-pro/race-logo"
import { toast } from "sonner"
import Image from "next/image"
import NextLink from "next/link"
import { useI18n } from "@/components/providers/i18n-provider"
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Timer,
  Search,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

type Race = {
  id: string
  name: string
  date: string
  location?: string | null
  distance?: string | null
  result?: string | null
  status: string
  url?: string | null
  logoUrl?: string | null
}

export function CompetitionsContent() {
  const { t, locale } = useI18n()
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isExtractingLogo, setIsExtractingLogo] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    distance: "",
    result: "",
    status: "upcoming",
    url: "",
    logoUrl: ""
  })

  useEffect(() => {
    fetchRaces()
    fetchUsername()
  }, [])

  async function fetchUsername() {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      setUsername(data.profile?.username || null)
    } catch (error) {
      console.error("Erreur lors du chargement du username")
    }
  }

  async function fetchRaces() {
    try {
      const res = await fetch("/api/races")
      if (res.ok) {
        const data = await res.json()
        setRaces(data.races || [])
      }
    } catch (error) {
      toast.error(t('sources.competitions.errorLoad'))
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/races/${editingId}` : "/api/races"
      const method = editingId ? "PATCH" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error(t('sources.competitions.errorSave'))

      toast.success(editingId ? t('sources.competitions.modified') : t('sources.competitions.created'))
      setFormData({
        name: "",
        date: "",
        location: "",
        distance: "",
        result: "",
        status: "upcoming",
        url: "",
        logoUrl: ""
      })
      setEditingId(null)
      setShowForm(false)
      fetchRaces()
    } catch (error) {
      toast.error(t('sources.competitions.errorSave'))
    }
  }

  async function deleteRace(id: string) {
    if (!confirm(t('sources.competitions.confirmDelete'))) return
    
    try {
      const res = await fetch(`/api/races/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(t('sources.competitions.errorDelete'))
      
      toast.success(t('sources.competitions.deleted'))
      fetchRaces()
    } catch (error) {
      toast.error(t('sources.competitions.errorDelete'))
    }
  }

  function editRace(race: Race) {
    setEditingId(race.id)
    setShowForm(true)
    setFormData({
      name: race.name,
      date: race.date,
      location: race.location || "",
      distance: race.distance || "",
      result: race.result || "",
      status: race.status,
      url: race.url || "",
      logoUrl: race.logoUrl || ""
    })
  }

  function getStatusInfo(status: string) {
    switch (status) {
      case "completed":
        return { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: locale === 'fr' ? "Terminée" : "Completed" }
      case "upcoming":
        return { icon: Timer, color: "text-blue-600", bg: "bg-blue-100", label: t('sources.competitions.upcoming') }
      case "cancelled":
        return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", label: locale === 'fr' ? "Annulée" : "Cancelled" }
      default:
        return { icon: Timer, color: "text-gray-600", bg: "bg-gray-100", label: locale === 'fr' ? "Inconnue" : "Unknown" }
    }
  }

  function getDaysUntil(dateString: string) {
    const raceDate = new Date(dateString)
    const today = new Date()
    const diffTime = raceDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return t('sources.competitions.past')
    if (diffDays === 0) return locale === 'fr' ? "Aujourd'hui" : "Today"
    if (diffDays === 1) return locale === 'fr' ? "Demain" : "Tomorrow"
    return locale === 'fr' ? `${diffDays} jours` : `${diffDays} days`
  }

  const upcomingRaces = races.filter(race => race.status === "upcoming")
  const completedRaces = races.filter(race => race.status === "completed")
  const totalRaces = races.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{locale === 'fr' ? 'Total Courses' : 'Total Races'}</p>
              <p className="text-2xl font-bold text-gray-900">{totalRaces}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('sources.competitions.upcoming')}</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingRaces.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{locale === 'fr' ? 'Terminées' : 'Completed'}</p>
              <p className="text-2xl font-bold text-gray-900">{completedRaces.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('sources.competitions.title')}</h2>
          <p className="text-gray-600">{t('sources.competitions.description')}</p>
        </div>
        <div className="flex items-center gap-3">
          {username && (
            <NextLink href={`/${username}`} target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-lg"
              >
                <Globe className="w-4 h-4" />
                {t('sources.competitions.viewPublic')}
              </motion.button>
            </NextLink>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(!showForm)
              setEditingId(null)
              setFormData({
                name: "",
                date: "",
                location: "",
                distance: "",
                result: "",
                status: "upcoming",
                url: "",
                logoUrl: ""
              })
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {showForm ? t('common.cancel') : t('sources.competitions.add')}
          </motion.button>
        </div>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? (locale === 'fr' ? 'Modifier la course' : 'Edit competition') : (locale === 'fr' ? 'Ajouter une nouvelle course' : 'Add a new competition')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('sources.competitions.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={locale === 'fr' ? 'Marathon de Paris' : 'Paris Marathon'}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">{t('sources.competitions.date')} *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">{t('sources.competitions.location')}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={locale === 'fr' ? 'Paris, France' : 'Paris, France'}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="distance">{t('sources.competitions.distance')}</Label>
                    <Input
                      id="distance"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      placeholder="42.195 km"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">{t('sources.competitions.status')}</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">{t('sources.competitions.upcoming')}</SelectItem>
                        <SelectItem value="completed">{locale === 'fr' ? 'Terminée' : 'Completed'}</SelectItem>
                        <SelectItem value="cancelled">{locale === 'fr' ? 'Annulée' : 'Cancelled'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="result">{t('sources.competitions.result')}</Label>
                    <Input
                      id="result"
                      value={formData.result}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                      placeholder="3h 45min"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="url">{t('sources.competitions.url')}</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">{t('sources.competitions.logo')} URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="logoUrl"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="flex-1"
                      />
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          if (!formData.url) {
                            toast.error(t('sources.competitions.errorExtract'))
                            return
                          }
                          
                          setIsExtractingLogo(true)
                          try {
                            const res = await fetch("/api/races/extract-logo", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ url: formData.url })
                            })

                            if (res.ok) {
                              const data = await res.json()
                              if (data.logoUrl) {
                                setFormData({ ...formData, logoUrl: data.logoUrl })
                                toast.success(locale === 'fr' ? 'Logo extrait avec succès !' : 'Logo extracted successfully!')
                              } else {
                                toast.error(locale === 'fr' ? 'Aucun logo trouvé sur ce site' : 'No logo found on this site')
                              }
                            } else {
                              toast.error(t('sources.competitions.errorExtract'))
                            }
                          } catch (error) {
                            toast.error(t('sources.competitions.errorExtract'))
                          } finally {
                            setIsExtractingLogo(false)
                          }
                        }}
                        disabled={isExtractingLogo || !formData.url}
                        className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {isExtractingLogo ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        {t('sources.competitions.extractLogo')}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Aperçu du logo */}
                {formData.logoUrl && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200">
                      <Image
                        src={formData.logoUrl}
                        alt="Logo preview"
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{locale === 'fr' ? 'Aperçu du logo' : 'Logo preview'}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    {editingId ? t('common.edit') : t('common.add')}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Races List */}
      <div className="space-y-4">
        <AnimatePresence>
          {races.map((race, index) => {
            const statusInfo = getStatusInfo(race.status)
            const StatusIcon = statusInfo.icon
            const daysUntil = getDaysUntil(race.date)
            
            return (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {race.logoUrl ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200">
                            <Image
                              src={race.logoUrl}
                              alt={race.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                e.currentTarget.parentElement?.nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200">
                            <span className="text-xs text-gray-400">{locale === 'fr' ? 'Pas de logo' : 'No logo'}</span>
                          </div>
                        )}
                        <div className={`w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center ${race.logoUrl ? 'hidden' : ''}`}>
                          <Trophy className="w-8 h-8 text-yellow-600" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{race.name}</h3>
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            statusInfo.bg,
                            statusInfo.color
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(race.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                          </div>
                          {race.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {race.location}
                            </div>
                          )}
                          {race.distance && (
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              {race.distance}
                            </div>
                          )}
                          {race.result && (
                            <div className="flex items-center gap-2">
                              <Trophy className="w-4 h-4" />
                              {race.result}
                            </div>
                          )}
                        </div>
                        
                        {race.status === "upcoming" && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <Clock className="w-4 h-4" />
                              {daysUntil}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {race.url && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open(race.url || '#', '_blank')}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={locale === 'fr' ? 'Voir le site' : 'View website'}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => editRace(race)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('common.edit')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteRace(race.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {races.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('sources.competitions.noRaces')}</h3>
            <p className="text-gray-600 mb-4">{t('sources.competitions.addFirst')}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              {locale === 'fr' ? 'Ajouter ma première course' : 'Add my first competition'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}