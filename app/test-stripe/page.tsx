"use client"

import { useState } from "react"

export default function TestStripePage() {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (test: string, status: "success" | "error", message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toISOString() }])
  }

  const clearResults = () => setResults([])

  // TEST 1: Valider un code promo
  const testValidatePromo = async () => {
    setIsLoading(true)
    try {
      const testCode = "TEST123"
      addResult("Validation Promo", "success", `Test avec le code: ${testCode}`)
      
      const res = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: testCode })
      })
      
      const data = await res.json()
      
      if (data.valid) {
        addResult("Validation Promo", "success", `✅ Code valide: ${data.discount}`, data)
      } else {
        addResult("Validation Promo", "error", `❌ Code invalide: ${data.error}`, data)
      }
    } catch (error: any) {
      addResult("Validation Promo", "error", `❌ Erreur: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // TEST 2: Créer session Checkout PRO mensuel
  const testCheckoutProMonthly = async () => {
    setIsLoading(true)
    try {
      addResult("Checkout PRO Monthly", "success", "Création de la session...")
      
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "PRO",
          billingCycle: "monthly",
          promoCode: null
        })
      })
      
      const data = await res.json()
      
      if (res.ok && data.url) {
        addResult("Checkout PRO Monthly", "success", `✅ Session créée`, { sessionId: data.sessionId, url: data.url.substring(0, 50) + "..." })
      } else {
        addResult("Checkout PRO Monthly", "error", `❌ Erreur: ${data.error}`, data)
      }
    } catch (error: any) {
      addResult("Checkout PRO Monthly", "error", `❌ Erreur: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // TEST 3: Créer session Checkout ELITE annuel
  const testCheckoutEliteYearly = async () => {
    setIsLoading(true)
    try {
      addResult("Checkout ELITE Yearly", "success", "Création de la session...")
      
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "ELITE",
          billingCycle: "yearly",
          promoCode: null
        })
      })
      
      const data = await res.json()
      
      if (res.ok && data.url) {
        addResult("Checkout ELITE Yearly", "success", `✅ Session créée`, { sessionId: data.sessionId })
      } else {
        addResult("Checkout ELITE Yearly", "error", `❌ Erreur: ${data.error}`, data)
      }
    } catch (error: any) {
      addResult("Checkout ELITE Yearly", "error", `❌ Erreur: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // TEST 4: Créer session avec code promo
  const testCheckoutWithPromo = async () => {
    setIsLoading(true)
    try {
      const testCode = "TEST123"
      addResult("Checkout avec Promo", "success", `Test avec code: ${testCode}`)
      
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "PRO",
          billingCycle: "monthly",
          promoCode: testCode
        })
      })
      
      const data = await res.json()
      
      if (res.ok && data.url) {
        addResult("Checkout avec Promo", "success", `✅ Session créée avec promo`, data)
      } else {
        addResult("Checkout avec Promo", "error", `❌ Erreur: ${data.error}`, data)
      }
    } catch (error: any) {
      addResult("Checkout avec Promo", "error", `❌ Erreur: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // TEST ALL
  const runAllTests = async () => {
    clearResults()
    await testValidatePromo()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testCheckoutProMonthly()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testCheckoutEliteYearly()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await testCheckoutWithPromo()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">🧪 Test Intégration Stripe</h1>
          <p className="text-gray-600 mb-8">Testez tous les endpoints de l'intégration Stripe</p>

          {/* Boutons de test */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={testValidatePromo}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🎫 Test Validation Promo
            </button>
            
            <button
              onClick={testCheckoutProMonthly}
              disabled={isLoading}
              className="px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              💳 Checkout PRO Monthly
            </button>
            
            <button
              onClick={testCheckoutEliteYearly}
              disabled={isLoading}
              className="px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              👑 Checkout ELITE Yearly
            </button>
            
            <button
              onClick={testCheckoutWithPromo}
              disabled={isLoading}
              className="px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🎉 Checkout + Promo
            </button>
            
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ⚡ TOUT TESTER
            </button>
            
            <button
              onClick={clearResults}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              🗑️ Effacer
            </button>
          </div>

          {/* Résultats */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">📊 Résultats ({results.length})</h2>
            
            {results.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                Aucun test lancé. Cliquez sur un bouton pour commencer.
              </div>
            )}
            
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl ${result.status === "success" ? "" : ""}`}>
                        {result.status === "success" ? "✅" : "❌"}
                      </span>
                      <h3 className="font-bold text-lg">{result.test}</h3>
                    </div>
                    <p className={`${result.status === "success" ? "text-green-700" : "text-red-700"} mb-2`}>
                      {result.message}
                    </p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                          Voir les détails
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          {results.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="font-bold mb-2">📈 Statistiques</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(r => r.status === "success").length}
                  </div>
                  <div className="text-sm text-gray-600">Réussis</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {results.filter(r => r.status === "error").length}
                  </div>
                  <div className="text-sm text-gray-600">Échoués</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Astuce :</strong> Cette page teste tous les endpoints Stripe sans authentification.
            Les tests fonctionnent avec vos vraies clés Stripe LIVE configurées dans .env.local
          </p>
        </div>
      </div>
    </div>
  )
}

