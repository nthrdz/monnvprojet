"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function DebugPlanPage() {
  const { data: session } = useSession()
  const [dbPlan, setDbPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch('/api/profile', {
          cache: 'no-store',
        })
        
        if (response.ok) {
          const data = await response.json()
          setDbPlan(data.profile?.plan)
        } else {
          setError(`Erreur API: ${response.status}`)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug - État du Plan</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Session NextAuth</h2>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-auto">
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
          <div className="mt-4">
            <p className="font-bold">Plan dans NextAuth: <span className="text-blue-600">{(session?.user as any)?.plan || "Non défini"}</span></p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">💾 Base de Données</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p className="text-red-600">Erreur: {error}</p>
          ) : (
            <>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <p>Plan dans la DB: <span className="text-green-600 font-bold">{dbPlan || "Non défini"}</span></p>
              </div>
            </>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">🔄 Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-600"
            >
              🔄 Recharger la page
            </button>
            
            <button
              onClick={() => {
                fetch('/api/profile', { cache: 'no-store' })
                  .then(res => res.json())
                  .then(data => {
                    setDbPlan(data.profile?.plan)
                    alert(`Plan actuel dans DB: ${data.profile?.plan}`)
                  })
              }}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-600"
            >
              🔍 Vérifier le plan dans la DB
            </button>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <button
              onClick={async () => {
                if (!confirm('Forcer la mise à jour vers PRO ?')) return
                try {
                  const res = await fetch('/api/admin/force-plan-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: 'PRO' })
                  })
                  const data = await res.json()
                  if (res.ok) {
                    alert(`✅ ${data.message}`)
                    window.location.reload()
                  } else {
                    alert(`❌ Erreur: ${data.error}`)
                  }
                } catch (err: any) {
                  alert(`❌ Erreur: ${err.message}`)
                }
              }}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-orange-600"
            >
              ⚠️ Forcer le plan PRO (manuel)
            </button>
            
            <button
              onClick={async () => {
                if (!confirm('Forcer la mise à jour vers ELITE ?')) return
                try {
                  const res = await fetch('/api/admin/force-plan-update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: 'ELITE' })
                  })
                  const data = await res.json()
                  if (res.ok) {
                    alert(`✅ ${data.message}`)
                    window.location.reload()
                  } else {
                    alert(`❌ Erreur: ${data.error}`)
                  }
                } catch (err: any) {
                  alert(`❌ Erreur: ${err.message}`)
                }
              }}
              className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-purple-600"
            >
              ⚠️ Forcer le plan ELITE (manuel)
            </button>
            
            <div className="border-t border-gray-200 my-4"></div>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-gray-600"
            >
              ← Retour au Dashboard
            </button>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ Si les deux plans sont différents :</h3>
          <ul className="list-disc list-inside text-yellow-800 space-y-1">
            <li>Le webhook Stripe a bien mis à jour la DB</li>
            <li>Mais NextAuth a gardé l'ancienne session en cache</li>
            <li>Solution : Déconnexion/reconnexion ou attendre l'expiration du token</li>
          </ul>
        </div>
        
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="font-bold text-red-800 mb-2">❌ Si le plan DB est toujours FREE :</h3>
          <ul className="list-disc list-inside text-red-800 space-y-1">
            <li>Le webhook Stripe ne s'est PAS exécuté</li>
            <li>Vérifier les logs Vercel</li>
            <li>Vérifier la configuration du webhook sur Stripe Dashboard</li>
            <li>Vérifier que STRIPE_WEBHOOK_SECRET est configuré</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

