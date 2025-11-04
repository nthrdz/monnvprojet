"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const [step, setStep] = useState(1)
  const [plan, setPlan] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        console.log("🎉 Paiement réussi - Début de la procédure d'activation...")
        
        // ÉTAPE 1 : Attendre que le webhook Stripe s'exécute (3 secondes)
        console.log("⏳ ÉTAPE 1/3 : Attente du webhook Stripe...")
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // ÉTAPE 2 : Vérifier le plan dans la DB (jusqu'à 10 tentatives)
        console.log("🔍 ÉTAPE 2/3 : Vérification du plan dans la base de données...")
        setStep(2)
        
        let planDetected = false
        let attempts = 0
        const maxAttempts = 10
        
        while (attempts < maxAttempts && !planDetected) {
          attempts++
          console.log(`🔄 Tentative ${attempts}/${maxAttempts}...`)
          
          try {
            // Appeler l'API de refresh qui lit directement depuis la DB
            const response = await fetch('/api/auth/refresh-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-store',
            })
            
            if (response.ok) {
              const data = await response.json()
              console.log(`📊 Réponse API:`, data)
              
              if (data.plan && data.plan !== 'FREE') {
                planDetected = true
                setPlan(data.plan)
                console.log(`✅ PLAN DÉTECTÉ: ${data.plan}`)
                break
              }
            } else {
              console.warn(`⚠️ API response not OK:`, response.status)
            }
          } catch (apiError) {
            console.error(`❌ Erreur API (tentative ${attempts}):`, apiError)
          }
          
          // Attendre 2 secondes entre chaque tentative
          if (attempts < maxAttempts && !planDetected) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
        
        if (!planDetected) {
          console.warn("⚠️ Plan non détecté après toutes les tentatives")
        }
        
        // ÉTAPE 3 : Redirection avec rechargement complet
        console.log("🚀 ÉTAPE 3/3 : Redirection vers le dashboard...")
        setStep(3)
        
        // Compte à rebours visuel
        for (let i = 3; i > 0; i--) {
          setCountdown(i)
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        // REDIRECTION ULTRA-FORCÉE
        console.log("🔄 REDIRECTION FORCÉE avec suppression du cache...")
        
        // Supprimer tous les caches possibles
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          await Promise.all(cacheNames.map(name => caches.delete(name)))
        }
        
        // Forcer un hard reload avec timestamp pour bypass le cache
        const timestamp = Date.now()
        window.location.href = `/dashboard?_t=${timestamp}`
        
        // Fallback : si la redirection ne marche pas, forcer après 2s
        setTimeout(() => {
          window.location.replace(`/dashboard?_t=${timestamp}`)
        }, 2000)
        
      } catch (error) {
        console.error("❌ ERREUR CRITIQUE:", error)
        setStep(4) // Étape d'erreur
        
        // Rediriger quand même après 5 secondes
        setTimeout(() => {
          window.location.replace('/dashboard')
        }, 5000)
      }
    }

    processPaymentSuccess()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          
          {/* ÉTAPE 1 : Paiement confirmé */}
          {step === 1 && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-20 h-20 mb-6"
              >
                <Loader2 className="w-20 h-20 text-green-500" />
              </motion.div>
              
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                ✅ Paiement confirmé !
              </h1>
              
              <p className="text-gray-600 mb-6">
                Votre paiement a été reçu. Activation de votre nouveau plan en cours...
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Synchronisation avec Stripe</span>
              </div>
            </>
          )}
          
          {/* ÉTAPE 2 : Vérification du plan */}
          {step === 2 && (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mx-auto w-20 h-20 mb-6"
              >
                <Loader2 className="w-20 h-20 text-blue-500" />
              </motion.div>
              
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                🔍 Vérification en cours...
              </h1>
              
              <p className="text-gray-600 mb-6">
                Nous vérifions l'activation de votre plan dans notre système.
                {plan && (
                  <span className="block mt-2 text-green-600 font-bold">
                    ✅ Plan {plan} détecté !
                  </span>
                )}
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Connexion à la base de données</span>
              </div>
            </>
          )}
          
          {/* ÉTAPE 3 : Redirection */}
          {step === 3 && (
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
                🎉 C'est parti !
              </h1>
              
              {plan && (
                <div className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4 shadow-lg">
                  Plan {plan} activé ✅
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                Votre nouveau plan est maintenant actif !
              </p>
              
              <div className="text-center">
                <div className="text-6xl font-black text-green-500 mb-2">
                  {countdown}
                </div>
                <p className="text-sm text-gray-500">
                  Redirection automatique vers votre dashboard...
                </p>
              </div>
            </>
          )}
          
          {/* ÉTAPE 4 : Erreur (fallback) */}
          {step === 4 && (
            <>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mx-auto w-20 h-20 mb-6"
              >
                <AlertCircle className="w-20 h-20 text-orange-500" />
              </motion.div>
              
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                ⚠️ Petit délai...
              </h1>
              
              <p className="text-gray-600 mb-6">
                Votre paiement est bien enregistré, mais l'activation prend un peu plus de temps que prévu.
              </p>
              
              <p className="text-sm text-gray-500 mb-4">
                Redirection automatique dans quelques secondes...
              </p>
              
              <button
                onClick={() => window.location.replace('/dashboard')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
              >
                Aller au dashboard maintenant →
              </button>
            </>
          )}
        </div>
        
        {/* Bouton manuel (toujours visible) */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              console.log("🖱️ Clic manuel sur redirection")
              window.location.replace('/dashboard')
            }}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors underline"
          >
            Accéder au dashboard manuellement
          </button>
        </div>
      </motion.div>
    </div>
  )
}
