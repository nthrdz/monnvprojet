"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Check, X, Sparkles } from "lucide-react"

interface PromoCodeFieldProps {
  value: string
  onChange: (value: string) => void
  onValidation: (isValid: boolean, promoData?: any) => void
}

interface PromoValidationResult {
  valid: boolean
  code?: string
  type?: string
  plan?: string
  duration?: number
  description?: string
}

export function PromoCodeField({ value, onChange, onValidation }: PromoCodeFieldProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<PromoValidationResult | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleValidate = async () => {
    if (!value.trim()) {
      setValidationResult(null)
      onValidation(false)
      setShowResult(false)
      return
    }

    setIsValidating(true)

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: value.trim() })
      })

      const result = await response.json()
      setValidationResult(result)
      setShowResult(true)
      onValidation(result.valid, result)

      // Masquer le résultat après 5 secondes
      setTimeout(() => {
        setShowResult(false)
      }, 5000)

    } catch (error) {
      console.error("Erreur validation code promo:", error)
      setValidationResult({ valid: false })
      setShowResult(true)
      onValidation(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase()
    onChange(newValue)
    
    // Reset validation quand l'utilisateur tape
    if (validationResult) {
      setValidationResult(null)
      setShowResult(false)
      onValidation(false)
    }
  }

  const getPromoIcon = () => {
    if (!validationResult) return <Gift className="w-4 h-4" />
    
    if (validationResult.valid) {
      if (validationResult.type === "plan_upgrade") {
        return <Sparkles className="w-4 h-4" />
      }
      return <Check className="w-4 h-4" />
    }
    
    return <X className="w-4 h-4" />
  }

  const getPromoColor = () => {
    if (!validationResult) return "text-gray-400"
    
    if (validationResult.valid) {
      if (validationResult.type === "plan_upgrade") {
        return "text-purple-500"
      }
      return "text-green-500"
    }
    
    return "text-red-500"
  }

  const getPromoMessage = () => {
    if (!validationResult) return null
    
    if (validationResult.valid) {
      if (validationResult.type === "plan_upgrade") {
        return `🎉 Accès ${validationResult.plan} gratuit !`
      }
      if (validationResult.type === "trial") {
        return `🎁 ${validationResult.duration} jours gratuits ${validationResult.plan} !`
      }
      return "✅ Code promo valide !"
    }
    
    return "❌ Code promo invalide"
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="Code promo (optionnel)"
            className={`w-full px-4 py-3 pl-12 border rounded-xl transition-all ${
              validationResult?.valid 
                ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500" 
                : validationResult?.valid === false
                ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-primary-blue-500"
            } focus:border-transparent`}
            maxLength={20}
          />
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${getPromoColor()}`}>
            {getPromoIcon()}
          </div>
        </div>
        
        <button
          onClick={handleValidate}
          disabled={!value.trim() || isValidating}
          className="px-4 py-3 bg-gradient-ocean text-gray-900 rounded-xl font-medium hover:shadow-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isValidating ? (
            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Gift className="w-4 h-4" />
          )}
          Vérifier
        </button>
      </div>

      {/* Résultat de validation */}
      <AnimatePresence>
        {showResult && validationResult && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`p-4 rounded-xl border-2 ${
              validationResult.valid
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                validationResult.valid
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}>
                {getPromoIcon()}
              </div>
              <div>
                <p className={`font-medium ${
                  validationResult.valid
                    ? "text-green-800"
                    : "text-red-800"
                }`}>
                  {getPromoMessage()}
                </p>
                {validationResult.valid && validationResult.description && (
                  <p className={`text-sm ${
                    validationResult.valid
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {validationResult.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Astuce codes promo */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Tu as un code promo ? Saisis-le pour bénéficier d'avantages exclusifs !
          </span>
        </div>
      </div>
    </div>
  )
}
