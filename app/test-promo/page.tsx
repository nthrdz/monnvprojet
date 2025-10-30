"use client"

import { useState } from "react"
import { Check, X, Loader2 } from "lucide-react"

/**
 * PAGE DE TEST DES CODES PROMO STRIPE
 * 
 * Cette page permet de tester directement les codes promo
 * et voir EXACTEMENT ce qui ne fonctionne pas
 */
export default function TestPromoPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [testByIdResult, setTestByIdResult] = useState<any>(null)
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)

  // Test 1: Valider un code promo
  const handleTestCode = async () => {
    if (!code.trim()) return
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      console.log("🧪 Test validation code:", code)
      
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() })
      })
      
      console.log("📊 Status:", response.status)
      
      const data = await response.json()
      console.log("📦 Données:", data)
      
      setResult(data)
    } catch (err: any) {
      console.error("❌ Erreur:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Test 2: Tester par ID
  const handleTestById = async () => {
    setLoading(true)
    setTestByIdResult(null)
    
    try {
      const response = await fetch("/api/test-promo?id=promo_1SNyifH23JS5N2cDONe5Hzdp")
      const data = await response.json()
      setTestByIdResult(data)
    } catch (err: any) {
      setTestByIdResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  // Test 3: Diagnostic complet
  const handleDiagnostic = async () => {
    setLoading(true)
    setDiagnosticResult(null)
    
    try {
      const response = await fetch("/api/diagnostic")
      const data = await response.json()
      setDiagnosticResult(data)
    } catch (err: any) {
      setDiagnosticResult({ error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            🧪 TEST DES CODES PROMO STRIPE
          </h1>
          <p className="text-gray-300">
            Testez vos codes promo Stripe et voyez EXACTEMENT ce qui se passe
          </p>
        </div>

        {/* Test 1: Validation de code */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            1️⃣ Test de validation de code
          </h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Entrez votre code promo"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTestCode}
              disabled={!code.trim() || loading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tester"}
            </button>
          </div>

          {result && (
            <div className={`p-4 rounded-xl ${
              result.valid 
                ? "bg-green-500/20 border border-green-500/30" 
                : "bg-red-500/20 border border-red-500/30"
            }`}>
              <div className="flex items-start gap-3">
                {result.valid ? (
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    {result.valid ? "✅ Code valide !" : "❌ Code invalide"}
                  </h3>
                  <pre className="text-xs text-gray-300 overflow-x-auto bg-black/20 p-3 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-400">❌ Erreur: {error}</p>
            </div>
          )}
        </div>

        {/* Test 2: Test par ID */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            2️⃣ Test par ID du code promo
          </h2>
          
          <p className="text-gray-300 text-sm">
            ID de votre code: <code className="bg-black/30 px-2 py-1 rounded">promo_1SNyifH23JS5N2cDONe5Hzdp</code>
          </p>
          
          <button
            onClick={handleTestById}
            disabled={loading}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tester par ID"}
          </button>

          {testByIdResult && (
            <div className="p-4 bg-black/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">Résultat:</h3>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(testByIdResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Test 3: Diagnostic */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            3️⃣ Diagnostic complet
          </h2>
          
          <button
            onClick={handleDiagnostic}
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lancer le diagnostic"}
          </button>

          {diagnosticResult && (
            <div className="p-4 bg-black/20 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-2">
                {diagnosticResult.summary?.status || "Résultat:"}
              </h3>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(diagnosticResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">
            📋 Instructions
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✅ <strong>Test 1</strong>: Entrez le CODE TEXT de votre promo (ex: BIENVENUE)</li>
            <li>✅ <strong>Test 2</strong>: Teste directement l'ID de votre code promo</li>
            <li>✅ <strong>Test 3</strong>: Vérifie que Stripe est correctement configuré</li>
            <li className="mt-4 pt-4 border-t border-yellow-500/30">
              💡 <strong>Si ça ne marche pas</strong>:
              <ol className="ml-6 mt-2 space-y-1 list-decimal">
                <li>Vérifiez que les clés Stripe sont dans Vercel</li>
                <li>Vérifiez que ce sont des clés LIVE (sk_live_, pk_live_)</li>
                <li>Vérifiez que vous avez redéployé après ajout des clés</li>
                <li>Vérifiez que le code promo est ACTIF dans Stripe Dashboard</li>
              </ol>
            </li>
          </ul>
        </div>

        {/* Liens rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://dashboard.stripe.com/test/promotion_codes"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-center transition-all"
          >
            <p className="text-white font-medium">📊 Stripe Dashboard</p>
            <p className="text-gray-400 text-sm mt-1">Voir vos codes promo</p>
          </a>
          
          <a
            href="/dashboard/upgrade"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-center transition-all"
          >
            <p className="text-white font-medium">💎 Page d'upgrade</p>
            <p className="text-gray-400 text-sm mt-1">Tester en conditions réelles</p>
          </a>
          
          <a
            href="/api/diagnostic"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-center transition-all"
          >
            <p className="text-white font-medium">🔍 API Diagnostic</p>
            <p className="text-gray-400 text-sm mt-1">Voir le JSON brut</p>
          </a>
        </div>
      </div>
    </div>
  )
}

