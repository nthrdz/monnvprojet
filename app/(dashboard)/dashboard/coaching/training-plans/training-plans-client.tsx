"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Eye, Users, Clock, Euro, Calendar, Target, TrendingUp, List, Upload, FileText, X } from "lucide-react"
import { SessionsManager } from "./sessions-manager"

interface TrainingPlan {
  id: string
  title: string
  description: string
  price: number
  duration: number
  difficulty: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE"
  category: string
  isActive: boolean
  pdfFileUrl?: string // URL du fichier PDF
  pdfFileName?: string // Nom du fichier PDF
  createdAt: string
  _count: {
    sessions: number
    subscribers: number
  }
}

interface TrainingPlansClientProps {
  initialPlans: TrainingPlan[]
  profileId: string
}

export function TrainingPlansClient({ initialPlans, profileId }: TrainingPlansClientProps) {
  const [plans, setPlans] = useState<TrainingPlan[]>(initialPlans)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null)
  const [showSessionsManager, setShowSessionsManager] = useState(false)
  const [selectedPlanForSessions, setSelectedPlanForSessions] = useState<TrainingPlan | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    duration: 4,
    difficulty: "DEBUTANT" as const,
    category: "",
    isActive: true,
    pdfFile: null as File | null,
    pdfFileName: ""
  })

  const categories = [
    "Cardio", "Musculation", "Yoga", "Pilates", "CrossFit", "Running", 
    "Cycling", "Swimming", "Boxing", "Dance", "HIIT", "Stretching"
  ]

  const difficultyLabels = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire", 
    AVANCE: "Avancé"
  }

  const difficultyColors = {
    DEBUTANT: "bg-green-100 text-green-800",
    INTERMEDIAIRE: "bg-yellow-100 text-yellow-800",
    AVANCE: "bg-red-100 text-red-800"
  }

  const handleCreatePlan = async () => {
    try {
      // D'abord uploader le PDF si il y en a un
      let pdfFileUrl = null
      let pdfFileName = null
      if (formData.pdfFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('pdfFile', formData.pdfFile)
        uploadFormData.append('planId', `temp_${Date.now()}`) // ID temporaire

        const uploadResponse = await fetch("/api/coaching/upload-pdf", {
          method: "POST",
          body: uploadFormData
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          alert(`Erreur upload PDF: ${errorData.error}`)
          return
        }

        const uploadResult = await uploadResponse.json()
        pdfFileUrl = uploadResult.fileUrl
        pdfFileName = uploadResult.originalName
      }

      // Ensuite créer le plan
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs du formulaire
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('duration', formData.duration.toString())
      formDataToSend.append('difficulty', formData.difficulty)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('isActive', formData.isActive.toString())
      formDataToSend.append('profileId', profileId)
      
      // Ajouter les informations du fichier PDF si uploadé
      if (pdfFileUrl && pdfFileName) {
        formDataToSend.append('pdfFileUrl', pdfFileUrl)
        formDataToSend.append('pdfFileName', pdfFileName)
      }

      const response = await fetch("/api/coaching/training-plans", {
        method: "POST",
        body: formDataToSend
      })

      if (response.ok) {
        const newPlan = await response.json()
        setPlans([newPlan, ...plans])
        setShowCreateForm(false)
        resetForm()
        alert("Plan d'entraînement créé avec succès !")
      } else {
        const errorData = await response.json()
        alert(`Erreur création plan: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      alert("Une erreur est survenue lors de la création du plan")
    }
  }

  const handleUpdatePlan = async () => {
    if (!editingPlan) return

    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs du formulaire
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('duration', formData.duration.toString())
      formDataToSend.append('difficulty', formData.difficulty)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('isActive', formData.isActive.toString())
      
      // Ajouter le fichier PDF s'il existe (nouveau fichier)
      if (formData.pdfFile) {
        formDataToSend.append('pdfFile', formData.pdfFile)
      }
      // Si pas de nouveau fichier mais qu'il y avait un nom de fichier existant
      else if (formData.pdfFileName) {
        formDataToSend.append('pdfFileName', formData.pdfFileName)
      }

      const response = await fetch(`/api/coaching/training-plans/${editingPlan.id}`, {
        method: "PUT",
        body: formDataToSend
      })

      if (response.ok) {
        const updatedPlan = await response.json()
        setPlans(plans.map(plan => plan.id === editingPlan.id ? updatedPlan : plan))
        setEditingPlan(null)
        resetForm()
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) return

    try {
      const response = await fetch(`/api/coaching/training-plans/${planId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setPlans(plans.filter(plan => plan.id !== planId))
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: 0,
      duration: 4,
      difficulty: "DEBUTANT",
      category: "",
      isActive: true,
      pdfFile: null,
      pdfFileName: ""
    })
  }

  const openEditForm = (plan: TrainingPlan) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      difficulty: plan.difficulty,
      category: plan.category,
      isActive: plan.isActive,
      pdfFile: null, // On ne charge pas le fichier existant lors de l'édition
      pdfFileName: plan.pdfFileName || ""
    })
    setEditingPlan(plan)
    setShowCreateForm(true)
  }

  const openSessionsManager = (plan: TrainingPlan) => {
    setSelectedPlanForSessions(plan)
    setShowSessionsManager(true)
  }

  const handleSessionsChange = () => {
    // Rafraîchir les données du plan pour mettre à jour le compteur de sessions
    const updatedPlans = plans.map(plan => {
      if (plan.id === selectedPlanForSessions?.id) {
        return { ...plan, _count: { ...plan._count, sessions: plan._count.sessions + 1 } }
      }
      return plan
    })
    setPlans(updatedPlans)
  }

  if (showSessionsManager && selectedPlanForSessions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSessionsManager(false)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sessions - {selectedPlanForSessions.title}</h2>
            <p className="text-gray-600">Gère les séances de ce plan d'entraînement</p>
          </div>
        </div>
        
        <SessionsManager 
          trainingPlanId={selectedPlanForSessions.id}
          planDuration={selectedPlanForSessions.duration}
          onSessionsChange={handleSessionsChange}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Plans d'Entraînement</h2>
          <p className="text-gray-600">Gère tes programmes et suivi tes performances</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingPlan(null)
            setShowCreateForm(true)
          }}
          className="inline-flex items-center gap-2 bg-gradient-ocean text-gray-900 hover:shadow-glow-blue px-6 py-3 rounded-full font-bold shadow-elevated transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Créer un Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-standard hover:shadow-elevated p-6 border border-gray-200 transition-all hover:-translate-y-1"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[plan.difficulty]}`}>
                  {difficultyLabels[plan.difficulty]}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditForm(plan)}
                  className="p-2 text-gray-400 hover:text-primary-blue-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-primary-green-600" />
                <span className="text-sm text-gray-600">{plan.price}€</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-blue-600" />
                <span className="text-sm text-gray-600">{plan.duration} semaines</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">{plan._count.sessions} séances</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">{plan._count.subscribers} abonnés</span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {plan.category}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                plan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {plan.isActive ? "Actif" : "Inactif"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openSessionsManager(plan)}
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  <List className="w-4 h-4" />
                  Sessions
                </button>
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="flex items-center gap-1 text-primary-blue-600 hover:text-primary-blue-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Détails
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center mx-auto mb-6">
            <Target className="w-12 h-12 text-primary-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun plan créé</h3>
          <p className="text-gray-600 mb-6">Commence par créer ton premier plan d'entraînement</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-ocean text-gray-900 hover:shadow-glow-blue px-6 py-3 rounded-full font-bold shadow-elevated transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Créer mon premier plan
          </button>
        </div>
      )}

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
              setEditingPlan(null)
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPlan ? "Modifier le plan" : "Créer un nouveau plan"}
              </h3>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du plan *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="Ex: Programme Running Débutant"
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
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="Décris ton programme d'entraînement..."
                  />
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée (semaines) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Difficulty and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    >
                      <option value="DEBUTANT">Débutant</option>
                      <option value="INTERMEDIAIRE">Intermédiaire</option>
                      <option value="AVANCE">Avancé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PDF Upload Section */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                      Ajouter un PDF (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-blue-400 transition-colors">
                      {formData.pdfFile ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-3 p-3 bg-primary-blue-50 rounded-lg">
                            <FileText className="w-6 h-6 text-primary-blue-600" />
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-gray-900">{formData.pdfFileName}</p>
                              <p className="text-xs text-gray-500">
                                {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, pdfFile: null, pdfFileName: "" })}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm text-gray-600 mb-3">
                              Ajoute ton programme d'entraînement en PDF
                            </p>
                            <input
                              id="pdf-upload"
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  // Vérifier que c'est bien un PDF
                                  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                                    // Vérifier la taille (max 50MB)
                                    if (file.size <= 50 * 1024 * 1024) {
                                      setFormData({
                                        ...formData,
                                        pdfFile: file,
                                        pdfFileName: file.name
                                      })
                                    } else {
                                      alert("Le fichier est trop volumineux (max 50MB)")
                                    }
                                  } else {
                                    alert("Veuillez sélectionner un fichier PDF")
                                  }
                                }
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="pdf-upload"
                              className="inline-block bg-primary-blue-600 hover:bg-primary-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition-colors"
                            >
                              Choisir un fichier PDF
                            </label>
                            <p className="text-xs text-gray-400 mt-3">
                              Formats acceptés: PDF (max 50MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-primary-blue-600 rounded focus:ring-primary-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Plan actif (visible pour les clients)
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingPlan(null)
                      resetForm()
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={editingPlan ? handleUpdatePlan : handleCreatePlan}
                    className="flex-1 px-6 py-3 bg-gradient-ocean text-gray-900 rounded-xl font-bold hover:shadow-glow-blue transition-all"
                  >
                    {editingPlan ? "Mettre à jour" : "Créer le plan"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Details Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.title}</h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600">{selectedPlan.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-5 h-5 text-primary-green-600" />
                      <span className="font-medium text-gray-900">Prix</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlan.price}€</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary-blue-600" />
                      <span className="font-medium text-gray-900">Durée</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlan.duration} semaines</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-gray-900">Séances</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlan._count.sessions}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Abonnés</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedPlan._count.subscribers}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[selectedPlan.difficulty]}`}>
                    {difficultyLabels[selectedPlan.difficulty]}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {selectedPlan.category}
                  </span>
                </div>

                {/* PDF Download Button */}
                {selectedPlan.pdfFileUrl && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={selectedPlan.pdfFileUrl}
                      download={selectedPlan.pdfFileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-gradient-to-r from-primary-blue-500 to-primary-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-blue-600 hover:to-primary-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <FileText className="w-5 h-5" />
                      <span>Télécharger le PDF</span>
                      <span className="text-sm opacity-80">({selectedPlan.pdfFileName})</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
