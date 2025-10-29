"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Clock, Target, Calendar, Dumbbell } from "lucide-react"

interface TrainingSession {
  id: string
  title: string
  description: string
  weekNumber: number
  dayNumber: number
  duration: number
  exercises: any[]
  createdAt: string
}

interface SessionsManagerProps {
  trainingPlanId: string
  planDuration: number
  onSessionsChange: () => void
}

export function SessionsManager({ trainingPlanId, planDuration, onSessionsChange }: SessionsManagerProps) {
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    weekNumber: 1,
    dayNumber: 1,
    duration: 60,
    exercises: []
  })

  const daysOfWeek = [
    "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"
  ]

  useEffect(() => {
    fetchSessions()
  }, [trainingPlanId])

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/coaching/training-plans/${trainingPlanId}/sessions`)
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async () => {
    try {
      const response = await fetch(`/api/coaching/training-plans/${trainingPlanId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newSession = await response.json()
        setSessions([...sessions, newSession])
        setShowCreateForm(false)
        resetForm()
        onSessionsChange()
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette session ?")) return

    try {
      const response = await fetch(`/api/coaching/training-plans/${trainingPlanId}/sessions/${sessionId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setSessions(sessions.filter(session => session.id !== sessionId))
        onSessionsChange()
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      weekNumber: 1,
      dayNumber: 1,
      duration: 60,
      exercises: []
    })
  }

  const openEditForm = (session: TrainingSession) => {
    setFormData({
      title: session.title,
      description: session.description,
      weekNumber: session.weekNumber,
      dayNumber: session.dayNumber,
      duration: session.duration,
      exercises: session.exercises
    })
    setEditingSession(session)
    setShowCreateForm(true)
  }

  // Grouper les sessions par semaine
  const sessionsByWeek = sessions.reduce((acc, session) => {
    if (!acc[session.weekNumber]) {
      acc[session.weekNumber] = []
    }
    acc[session.weekNumber].push(session)
    return acc
  }, {} as Record<number, TrainingSession[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Sessions d'Entraînement</h3>
          <p className="text-gray-600">Gère les séances de ton programme</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingSession(null)
            setShowCreateForm(true)
          }}
          className="inline-flex items-center gap-2 bg-gradient-ocean text-gray-900 hover:shadow-glow-blue px-4 py-2 rounded-xl font-medium shadow-elevated transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Ajouter une session
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-6">
        {Array.from({ length: planDuration }, (_, i) => i + 1).map((week) => (
          <div key={week} className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              Semaine {week}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
                const session = sessionsByWeek[week]?.find(s => s.dayNumber === day)
                
                return (
                  <div key={day} className="min-h-[120px]">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {daysOfWeek[day - 1]}
                    </div>
                    
                    {session ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-primary-blue-50 to-primary-blue-100 border border-primary-blue-200 rounded-lg p-3 h-full"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-primary-blue-900 text-sm truncate">
                            {session.title}
                          </h5>
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEditForm(session)}
                              className="p-1 text-primary-blue-600 hover:text-primary-blue-700"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="p-1 text-primary-blue-600 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-primary-blue-700">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.duration}min</span>
                          </div>
                          {session.exercises.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Dumbbell className="w-3 h-3" />
                              <span>{session.exercises.length} exercices</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 h-full flex items-center justify-center hover:border-primary-blue-300 transition-colors">
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, weekNumber: week, dayNumber: day }))
                            setEditingSession(null)
                            setShowCreateForm(true)
                          }}
                          className="text-gray-400 hover:text-primary-blue-600 transition-colors"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowCreateForm(false)
              setEditingSession(null)
              resetForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingSession ? "Modifier la session" : "Créer une nouvelle session"}
              </h3>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la session *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="Ex: Cardio & Renforcement"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="Décris le contenu de cette session..."
                  />
                </div>

                {/* Week and Day */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semaine *
                    </label>
                    <select
                      value={formData.weekNumber}
                      onChange={(e) => setFormData({ ...formData, weekNumber: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    >
                      {Array.from({ length: planDuration }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Semaine {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jour *
                    </label>
                    <select
                      value={formData.dayNumber}
                      onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index + 1} value={index + 1}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (minutes) *
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingSession(null)
                      resetForm()
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateSession}
                    className="flex-1 px-6 py-3 bg-gradient-ocean text-gray-900 rounded-xl font-bold hover:shadow-glow-blue transition-all"
                  >
                    {editingSession ? "Mettre à jour" : "Créer la session"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
