"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

export function DebugPlan() {
  const { data: session, update } = useSession()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile")
      const data = await res.json()
      setProfile(data.profile)
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await update()
    await fetchProfile()
    setIsRefreshing(false)
  }

  const handleForcePlan = async (plan: string) => {
    if (!confirm(`Forcer le plan vers ${plan} ?`)) return
    
    try {
      const res = await fetch("/api/debug/force-plan-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert(`✅ Plan forcé vers ${plan}`)
        await handleRefresh()
      } else {
        alert(`❌ Erreur: ${data.error}`)
      }
    } catch (error) {
      alert("❌ Erreur lors de la mise à jour")
    }
  }

  if (process.env.NODE_ENV !== 'development') {
    return null // N'afficher qu'en dev
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">🐛 Debug Plan</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-400">Session Plan:</span>
          <span className="ml-2 font-mono text-yellow-400">
            {/* @ts-ignore */}
            {session?.user?.plan || 'N/A'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">DB Plan:</span>
          <span className="ml-2 font-mono text-green-400">
            {profile?.plan || 'Loading...'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">User ID:</span>
          <span className="ml-2 font-mono text-blue-400">
            {session?.user?.id?.slice(0, 8) || 'N/A'}...
          </span>
        </div>
        
        {profile?.stats?.stripeSubscriptionId && (
          <div>
            <span className="text-gray-400">Subscription:</span>
            <span className="ml-2 font-mono text-purple-400 text-xs">
              {profile.stats.stripeSubscriptionId.slice(0, 15)}...
            </span>
          </div>
        )}
        
        {/* Boutons de test */}
        <div className="pt-3 mt-3 border-t border-gray-700">
          <p className="text-gray-400 mb-2">Force Plan (test):</p>
          <div className="flex gap-1">
            <button
              onClick={() => handleForcePlan('FREE')}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
            >
              FREE
            </button>
            <button
              onClick={() => handleForcePlan('PRO')}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
            >
              PRO
            </button>
            <button
              onClick={() => handleForcePlan('ELITE')}
              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs transition-colors"
            >
              ELITE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

