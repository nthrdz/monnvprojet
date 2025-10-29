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
}

export function PdfPurchaseModal({ plan, isOpen, onClose, coachName }: PdfPurchaseModalProps) {
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

    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("/api/coaching/access-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          clientEmail: formData.clientEmail,
          clientName: formData.clientName
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentSuccess(true)
        // Rediriger vers le PDF après 2 secondes
        setTimeout(() => {
          window.open(result.pdfUrl, '_blank')
        }, 2000)
      } else {
        setError(result.error || "Erreur lors du paiement")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
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
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-blue-500 to-primary-blue-600 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Accès Payant</h3>
                  <p className="text-sm text-gray-600">Contenu premium</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
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
                <h4 className="text-xl font-bold text-gray-900 mb-2">Paiement Réussi !</h4>
                <p className="text-gray-600 mb-4">
                  Vous allez être redirigé vers le PDF dans quelques secondes...
                </p>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-700">
                    <strong>Accès valide 24h</strong> - Téléchargez votre PDF maintenant
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Formulaire de paiement */
              <>
                {/* Plan Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{plan.title}</h4>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Coach: {coachName}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-blue-600">{plan.price}€</div>
                      <div className="text-xs text-gray-500">Accès 24h</div>
                    </div>
                  </div>
                </div>

                {/* Formulaire */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                      placeholder="jean@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                {/* Erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Paiement Info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-primary-blue-600" />
                    <span className="text-sm font-medium text-primary-blue-700">Paiement Sécurisé</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    Mode démo - Le paiement est simulé. En production, Stripe sera intégré.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing || !formData.clientName || !formData.clientEmail}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white rounded-xl font-bold hover:from-primary-blue-700 hover:to-primary-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
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

