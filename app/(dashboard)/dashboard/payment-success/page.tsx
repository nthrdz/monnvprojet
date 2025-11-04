"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Sparkles } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [plan, setPlan] = useState<string | null>(null)

  useEffect(() => {
    const refreshSession = async () => {
      try {
        console.log("🔄 Rafraîchissement de la session après paiement...")
        
        // ⚡ Attendre 2 secondes pour laisser le webhook Stripe s'exécuter
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Essayer jusqu'à 8 fois avec un délai croissant
        let attempts = 0
        let updatedSession = null
        
        while (attempts < 8) {
          console.log(`🔄 Tentative ${attempts + 1}/8...`)
          
          // Forcer le rafraîchissement de la session NextAuth
          updatedSession = await update()
          
          // @ts-ignore
          const currentPlan = updatedSession?.user?.plan
          
          console.log(`📊 Plan actuel:`, currentPlan)
          
          // @ts-ignore
          if (currentPlan && currentPlan !== 'FREE') {
            // Plan activé !
            // @ts-ignore
            setPlan(currentPlan)
            console.log("✅ Plan activé:", currentPlan)
            break
          }
          
          attempts++
          
          // Attendre avant la prochaine tentative (délai croissant: 1.5s, 3s, 4.5s, etc.)
          if (attempts < 8) {
            await new Promise(resolve => setTimeout(resolve, 1500 * attempts))
          }
        }
        
        setIsRefreshing(false)
        
        // Rediriger vers le dashboard après 2 secondes avec rechargement complet
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
        
      } catch (error) {
        console.error("❌ Erreur lors du rafraîchissement:", error)
        setIsRefreshing(false)
        // Rediriger quand même avec rechargement complet
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    }

    refreshSession()
  }, [update, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {isRefreshing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-20 h-20 mb-6"
              >
                <Loader2 className="w-20 h-20 text-green-500" />
              </motion.div>
              
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                Activation immédiate en cours...
              </h1>
              
              <p className="text-gray-600 mb-6">
                Votre paiement est confirmé ! Nous basculons immédiatement vers votre nouveau plan...
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Synchronisation avec votre compte</span>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto w-20 h-20 mb-6"
              >
                <CheckCircle2 className="w-20 h-20 text-green-500" />
              </motion.div>
              
              <h1 className="text-3xl font-black text-gray-900 mb-3">
                🎉 Paiement réussi !
              </h1>
              
              {plan && (
                <div className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-bold mb-4">
                  Plan {plan} activé ✅
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Votre nouveau plan est maintenant actif ! Vous allez être redirigé vers votre dashboard.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Redirection automatique dans 3 secondes...</span>
              </div>
            </>
          )}
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Aller au dashboard maintenant →
          </button>
        </div>
      </motion.div>
    </div>
  )
}

