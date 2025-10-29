"use client"

import { motion } from "framer-motion"

interface SportProgressProps {
  label: string
  value: number
  max: number
  unit?: string
  color?: "primary" | "accent" | "success"
  showPercentage?: boolean
}

export function SportProgress({
  label,
  value,
  max,
  unit = "",
  color = "primary",
  showPercentage = true
}: SportProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const isOverGoal = value > max

  const colorClasses = {
    primary: {
      bg: "from-yellow-400 to-yellow-600",
      badge: "from-yellow-400 to-yellow-600",
      text: "text-yellow-600"
    },
    accent: {
      bg: "from-yellow-500 to-black", 
      badge: "from-yellow-500 to-black",
      text: "text-black"
    },
    success: {
      bg: "from-yellow-600 to-gray-800",
      badge: "from-yellow-600 to-gray-800", 
      text: "text-gray-800"
    }
  }

  const currentColor = colorClasses[color]

  return (
    <div className="space-y-1">
      {/* Header with label and values */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-700">{label}</h3>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-900">
            {value.toLocaleString('fr-FR')}
          </span>
          <span className="text-xs text-gray-500">
            / {max.toLocaleString('fr-FR')}{unit}
          </span>
        </div>
      </div>

      {/* Progress bar container */}
      <div className="relative">
        {/* Progress fill only - no background */}
        <motion.div
          className={`h-1 bg-gradient-to-r ${currentColor.bg} rounded-full shadow-sm`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        
        {/* Glow effect for over-goal */}
        {isOverGoal && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${currentColor.bg} opacity-30 rounded-full`}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
          }}
        />

        {/* Percentage indicator */}
        {showPercentage && (
          <div className="flex justify-end mt-1">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r ${currentColor.badge} text-white shadow-md`}
            >
              <span className="text-xs font-bold">
                {percentage.toFixed(0)}%
              </span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Achievement indicator */}
      {isOverGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <span className="text-green-600 text-sm font-semibold">
            Objectif dépassé !
          </span>
        </motion.div>
      )}
    </div>
  )
}
