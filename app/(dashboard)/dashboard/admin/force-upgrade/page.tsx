"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCog, CheckCircle2, AlertCircle, Search } from "lucide-react"

export default function ForceUpgradePage() {
  const [email, setEmail] = useState("")
  const [plan, setPlan] = useState("ELITE")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)

  const searchUser = async () => {
    if (!email) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/force-upgrade?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (response.ok) {
        setUserInfo(data.user)
      } else {
        setUserInfo(null)
        alert(data.error || "Utilisateur non trouvé")
      }
    } catch (error) {
      console.error(error)
      alert("Erreur lors de la recherche")
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    if (!email || !plan) {
      alert("Email et plan requis")
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/force-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan })
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, ...data })
        // Rafraîchir les infos utilisateur
        await searchUser()
      } else {
        setResult({ success: false, error: data.error })
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <UserCog className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Force Upgrade Utilisateur
              </h1>
              <p className="text-gray-600">
                Mettre à jour manuellement le plan d'un utilisateur
              </p>
            </div>
          </div>

          {/* Recherche utilisateur */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email de l'utilisateur
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={searchUser}
                disabled={loading || !email}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Rechercher
              </button>
            </div>
          </div>

          {/* Infos utilisateur */}
          {userInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8"
            >
              <h3 className="font-bold text-lg text-blue-900 mb-3">
                📋 Informations utilisateur
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-semibold">Email:</span>
                  <br />
                  <span className="text-blue-900">{userInfo.email}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Nom:</span>
                  <br />
                  <span className="text-blue-900">{userInfo.name || "N/A"}</span>
                </div>
                {userInfo.profile && (
                  <>
                    <div>
                      <span className="text-blue-700 font-semibold">Username:</span>
                      <br />
                      <span className="text-blue-900">{userInfo.profile.username}</span>
                    </div>
                    <div>
                      <span className="text-blue-700 font-semibold">Plan actuel:</span>
                      <br />
                      <span className={`font-black text-lg ${
                        userInfo.profile.plan === 'ELITE' ? 'text-purple-600' :
                        userInfo.profile.plan === 'PRO' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {userInfo.profile.plan}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Sélection du plan */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nouveau plan
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['FREE', 'PRO', 'ELITE'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`p-4 rounded-xl font-bold transition-all ${
                    plan === p
                      ? p === 'ELITE' ? 'bg-purple-600 text-white shadow-lg scale-105' :
                        p === 'PRO' ? 'bg-blue-600 text-white shadow-lg scale-105' :
                        'bg-gray-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={handleUpgrade}
            disabled={loading || !email || !plan}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-black text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mise à jour en cours...
              </span>
            ) : (
              `🚀 Forcer l'upgrade vers ${plan}`
            )}
          </button>

          {/* Résultat */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-6 rounded-xl ${
                result.success
                  ? 'bg-green-50 border-2 border-green-200'
                  : 'bg-red-50 border-2 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.success ? '✅ Upgrade réussi !' : '❌ Erreur'}
                  </h3>
                  <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                    {result.success ? result.message : result.error}
                  </p>
                  {result.user && (
                    <div className="mt-3 text-sm">
                      <span className="text-green-700">
                        {result.user.email}: {result.user.oldPlan} → {result.user.newPlan}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Warning */}
          <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-bold mb-1">⚠️ Attention</p>
                <p>
                  Cette action force immédiatement le changement de plan sans vérifier Stripe.
                  Utilisez-la uniquement pour déboguer ou corriger des upgrades qui n'ont pas fonctionné.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

