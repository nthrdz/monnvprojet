"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Calendar, Clock, Euro, Target, Check, X, BookOpen, Users, Download, Lock } from "lucide-react"
import { PdfPurchaseModal } from "./pdf-purchase-modal"

interface TrainingPlan {
  id: string
  title: string
  description: string
  price: number
  duration: number
  difficulty: string
  category: string
  pdfFileName?: string
  sessions: any[]
  _count: {
    sessions: number
    subscribers: number
  }
}

interface CoachingPublicClientProps {
  coachName: string
  coachBio: string | null
  coachAvatar: string | null
  trainingPlans: TrainingPlan[]
  availabilities: any[]
  username: string
}

export function CoachingPublicClient({
  coachName,
  coachBio,
  coachAvatar,
  trainingPlans,
  availabilities,
  username
}: CoachingPublicClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [viewMode, setViewMode] = useState<"plans" | "booking">("plans")
  const [showPdfPurchase, setShowPdfPurchase] = useState(false)
  const [selectedPlanForPdf, setSelectedPlanForPdf] = useState<TrainingPlan | null>(null)

  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    service: "",
    message: ""
  })

  const difficultyLabels: Record<string, string> = {
    DEBUTANT: "Débutant",
    INTERMEDIAIRE: "Intermédiaire",
    AVANCE: "Avancé"
  }

  const difficultyColors: Record<string, string> = {
    DEBUTANT: "bg-green-100 text-green-800",
    INTERMEDIAIRE: "bg-yellow-100 text-yellow-800",
    AVANCE: "bg-red-100 text-red-800"
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleBookingSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/public/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachUsername: username,
          ...bookingForm
        })
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setBookingForm({
          clientName: "",
          clientEmail: "",
          clientPhone: "",
          service: "",
          message: ""
        })
        
        // Masquer le message de succès après 5 secondes
        setTimeout(() => {
          setSubmitSuccess(false)
        }, 5000)
      } else {
        const error = await response.json()
        setSubmitError(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setSubmitError("Impossible d'envoyer la demande. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePdfPurchase = (plan: TrainingPlan) => {
    setSelectedPlanForPdf(plan)
    setShowPdfPurchase(true)
  }

  return (
    <div className="space-y-8">
      {/* Coach Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {coachAvatar ? (
            <Image
              src={coachAvatar}
              alt={coachName}
              width={120}
              height={120}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center border-4 border-white/20">
              <span className="text-3xl font-bold text-primary-blue-600">
                {coachName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{coachName}</h2>
            <p className="text-lg text-yellow-400 mb-3">Coach Certifié</p>
            {coachBio && (
              <p className="text-gray-300 mb-4">{coachBio}</p>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <BookOpen className="w-4 h-4 text-primary-blue-400" />
                <span className="text-sm">{trainingPlans.length} Plans disponibles</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary-green-400" />
                <span className="text-sm">Coaching personnalisé</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setViewMode("plans")}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            viewMode === "plans"
              ? "bg-gradient-ocean text-gray-900"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          Plans d'Entraînement
        </button>
        <button
          onClick={() => setViewMode("booking")}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            viewMode === "booking"
              ? "bg-gradient-ocean text-gray-900"
              : "bg-white/5 text-white hover:bg-white/10"
          }`}
        >
          Réserver une Séance
        </button>
      </div>

      {/* Training Plans View */}
      {viewMode === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingPlans.length > 0 ? (
            trainingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-primary-blue-400/50 transition-all cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Header avec badge aligné */}
                <div className="flex items-center justify-between mb-4 min-h-[3rem]">
                  <h3 className="text-xl font-bold text-white flex-1 pr-3">{plan.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${difficultyColors[plan.difficulty]}`}>
                    {difficultyLabels[plan.difficulty]}
                  </span>
                </div>

                {/* Description avec hauteur fixe */}
                <div className="flex-1 mb-4">
                  <p className="text-gray-300 text-sm line-clamp-3 h-[4.5rem] overflow-hidden">{plan.description}</p>
                </div>

                {/* Détails du programme avec alignement uniforme */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4 text-primary-blue-400 flex-shrink-0" />
                    <span className="min-w-0 flex-1">{plan.duration} semaines</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Target className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="min-w-0 flex-1">{plan._count.sessions} séances</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="w-4 h-4 text-primary-green-400 flex-shrink-0" />
                    <span className="min-w-0 flex-1">{plan._count.subscribers} abonnés</span>
                  </div>
                </div>

                {/* Footer avec alignement uniforme */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center justify-between mb-3 min-h-[2rem]">
                    <div className="flex items-center gap-2">
                      <Euro className="w-5 h-5 text-primary-green-400 flex-shrink-0" />
                      <span className="text-2xl font-bold text-white">{plan.price}€</span>
                    </div>
                    {plan.pdfFileName && (
                      <div className="flex items-center gap-1 text-xs text-gray-300 flex-shrink-0">
                        <Download className="w-3 h-3" />
                        <span>PDF disponible</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlan(plan)
                      }}
                      className="flex-1 px-3 py-2 bg-primary-blue-500 hover:bg-primary-blue-600 rounded-lg font-medium transition-colors text-sm"
                    >
                      Voir plus
                    </button>
                    {plan.pdfFileName && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePdfPurchase(plan)
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        Acheter PDF
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-white mb-2">Aucun plan disponible</p>
              <p className="text-gray-400">Les plans d'entraînement seront bientôt disponibles</p>
            </div>
          )}
        </div>
      )}

      {/* Booking View */}
      {viewMode === "booking" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-center">Demander une réservation</h3>
            <p className="text-gray-300 text-center mb-8">
              Remplis ce formulaire et {coachName} te contactera pour confirmer ta réservation
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={bookingForm.clientName}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-blue-400 focus:ring-2 focus:ring-primary-blue-400/20 transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={bookingForm.clientEmail}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-blue-400 focus:ring-2 focus:ring-primary-blue-400/20 transition-all"
                  placeholder="jean@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={bookingForm.clientPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-blue-400 focus:ring-2 focus:ring-primary-blue-400/20 transition-all"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type de service *
                </label>
                <select
                  value={bookingForm.service}
                  onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-blue-400 focus:ring-2 focus:ring-primary-blue-400/20 transition-all"
                >
                  <option value="">Sélectionner un service</option>
                  <option value="coaching">Coaching personnalisé</option>
                  <option value="consultation">Consultation technique</option>
                  <option value="suivi">Suivi de performance</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-primary-blue-400 focus:ring-2 focus:ring-primary-blue-400/20 transition-all resize-none"
                  placeholder="Dis-nous en plus sur tes objectifs..."
                />
              </div>

              {/* Messages de succès/erreur */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-400">Demande envoyée avec succès !</p>
                    <p className="text-sm text-green-300/80 mt-1">
                      {coachName} a reçu votre demande et vous contactera bientôt pour confirmer les détails.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
                >
                  <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Erreur</p>
                    <p className="text-sm text-red-300/80 mt-1">{submitError}</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleBookingSubmit}
                disabled={!bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.service || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl hover:from-gray-900 hover:to-black hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  "Envoyer la demande"
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                En envoyant ce formulaire, tu acceptes d'être contacté par {coachName}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Plan Details Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{selectedPlan.title}</h3>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 leading-relaxed">{selectedPlan.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-5 h-5 text-primary-green-400" />
                      <span className="text-sm text-gray-400">Prix</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPlan.price}€</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-primary-blue-400" />
                      <span className="text-sm text-gray-400">Durée</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPlan.duration} semaines</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm text-gray-400">Séances</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPlan._count.sessions}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-sm text-gray-400">Abonnés</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{selectedPlan._count.subscribers}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSelectedPlan(null)
                      setViewMode("booking")
                      setBookingForm(prev => ({ ...prev, service: `Plan: ${selectedPlan.title}` }))
                    }}
                    className="w-full py-4 bg-gradient-ocean text-gray-900 font-bold rounded-xl hover:shadow-glow-blue transition-all"
                  >
                    Contacter pour ce plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Purchase Modal */}
      <PdfPurchaseModal
        plan={selectedPlanForPdf}
        isOpen={showPdfPurchase}
        onClose={() => {
          setShowPdfPurchase(false)
          setSelectedPlanForPdf(null)
        }}
        coachName={coachName}
      />
    </div>
  )
}

