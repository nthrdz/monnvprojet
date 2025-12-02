"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Lock, CreditCard, Check, AlertCircle } from "lucide-react"

interface TrainingPlan {
  id: string
  title: string
  description: string
  price: number
  pdfFileName?: string
}

interface PdfPurchaseModalProps {
  plan: TrainingPlan | null
  isOpen: boolean
  onClose: () => void
  coachName: string
  coachUsername: string
  paypalEmail: string | null
}

export function PdfPurchaseModal({ plan, isOpen, onClose, coachName, coachUsername, paypalEmail }: PdfPurchaseModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [error, setError] = useState("")

  if (!plan) return null

  const handlePurchase = async () => {
    if (!formData.clientName || !formData.clientEmail) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!paypalEmail) {
      setError("Le coach n'a pas configuré son email PayPal. Veuillez contacter le coach directement.")
      return
    }

    if (!plan) {
      setError("Plan d'entraînement introuvable")
      return
    }

    if (!plan.id) {
      setError("ID du plan manquant")
      return
    }

    if (plan.price === undefined || plan.price === null) {
      setError("Prix du plan manquant")
      return
    }

    if (!coachUsername) {
      setError("Nom d'utilisateur du coach manquant")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const requestData = {
        planId: plan.id,
        coachUsername: coachUsername,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        amount: Number(plan.price)
      }

      console.log("🚀 Création de l'ordre PayPal...")
      console.log("📦 Données envoyées:", requestData)
      console.log("📋 Plan complet:", plan)

      // Créer un ordre PayPal via l'API
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      })

      console.log("📡 Réponse reçue, status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
        console.error("❌ Erreur API:", errorData)
        throw new Error(errorData.error || "Erreur lors de la création de l'ordre PayPal")
      }

      const data = await response.json()
      console.log("✅ Données reçues:", data)

      const { approvalUrl } = data

      if (!approvalUrl) {
        console.error("❌ URL d'approbation manquante dans la réponse")
        console.error("📋 Réponse complète:", data)
        throw new Error("URL d'approbation PayPal manquante. Veuillez réessayer.")
      }

      console.log("🔗 Redirection vers PayPal:", approvalUrl)

      // Rediriger vers PayPal pour le paiement
      window.location.href = approvalUrl
    } catch (err: any) {
      console.error("❌ Erreur création ordre PayPal:", err)
      setError(err.message || "Erreur lors de la création du paiement PayPal. Veuillez réessayer.")
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setFormData({ clientName: "", clientEmail: "", clientPhone: "" })
    setError("")
    setPaymentSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Accès Payant</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Contenu premium</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {paymentSuccess ? (
              /* Succès */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Redirection vers PayPal</h4>
                <p className="text-gray-600 mb-4">
                  Vous allez être redirigé vers PayPal pour effectuer le paiement. Après confirmation du paiement, vous recevrez automatiquement le PDF par email.
                </p>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Important :</strong> Le PDF vous sera envoyé automatiquement par email dès que le paiement sera confirmé.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Formulaire de paiement */
              <>
                {/* Plan Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{plan.title}</h4>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-[10px] sm:text-xs text-gray-500">PDF</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{plan.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500">Coach: {coachName}</span>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-primary-blue-600">{plan.price}€</div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Accès illimité</div>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-red-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Paiement Info */}
                {!paypalEmail ? (
                  <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                      <span className="text-xs sm:text-sm font-medium text-yellow-700">Email PayPal non configuré</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-yellow-600">
                      Le coach n'a pas encore configuré son email PayPal. Veuillez le contacter directement pour effectuer l'achat.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-blue-600" />
                      <span className="text-xs sm:text-sm font-medium text-primary-blue-700">Paiement via PayPal</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-blue-600">
                      Vous serez redirigé vers PayPal pour effectuer le paiement. Le PDF vous sera envoyé automatiquement par email après confirmation du paiement.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing || !formData.clientName || !formData.clientEmail}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white rounded-lg sm:rounded-xl font-bold hover:from-primary-blue-700 hover:to-primary-blue-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg text-sm sm:text-base"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Traitement...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Payer {plan.price}€
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

