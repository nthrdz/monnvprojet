"use client"

import { Gift, Sparkles, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface PromoBadgeProps {
  promoCode: string
  trialEndsAt?: string | null
}

export function PromoBadge({ promoCode, trialEndsAt }: PromoBadgeProps) {
  const isElite = promoCode === "ELITE"
  const isTrial = !!trialEndsAt

  // Calculer les jours restants pour un trial
  const daysRemaining = isTrial && trialEndsAt 
    ? Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl p-6 ${
        isElite 
          ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500" 
          : "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500"
      }`}
    >
      {/* Pattern de fond */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4zIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          {isElite ? (
            <Sparkles className="w-6 h-6 text-white" />
          ) : (
            <Gift className="w-6 h-6 text-white" />
          )}
          <h3 className="text-xl font-bold text-white">
            Code Promo Activé
          </h3>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-white/80">Code:</span>
            <span className="text-lg font-black text-white font-mono">{promoCode}</span>
          </div>

          {isTrial && daysRemaining > 0 ? (
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
              </span>
            </div>
          ) : isElite ? (
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Accès permanent</span>
            </div>
          ) : null}
        </div>

        {isTrial && daysRemaining <= 7 && daysRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30"
          >
            <p className="text-sm text-white font-medium">
              ⚡ Ton essai se termine bientôt ! Passe en Pro pour continuer à profiter de tous les avantages.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

