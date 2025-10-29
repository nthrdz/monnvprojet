"use client"

import { motion } from "framer-motion"

interface AdvancedProgressBarProps {
  label: string
  current: number
  target: number
  unit?: string
  color?: "blue" | "orange" | "green" | "purple" | "red"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  icon?: string
  description?: string
}

export function AdvancedProgressBar({
  label,
  current,
  target,
  unit = "",
  color = "blue",
  size = "md",
  showIcon = false,
  icon = "📊",
  description
}: AdvancedProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)
  const isOverTarget = current > target
  
  const colorClasses = {
    blue: {
      bg: "from-yellow-400 to-yellow-600",
      badge: "bg-yellow-500",
      text: "text-yellow-600",
      glow: "shadow-yellow-500/25"
    },
    orange: {
      bg: "from-yellow-500 to-black",
      badge: "bg-yellow-600", 
      text: "text-black",
      glow: "shadow-yellow-600/25"
    },
    green: {
      bg: "from-yellow-600 to-gray-800",
      badge: "bg-gray-800",
      text: "text-gray-800", 
      glow: "shadow-gray-800/25"
    },
    purple: {
      bg: "from-yellow-500 to-black",
      badge: "bg-black",
      text: "text-black",
      glow: "shadow-black/25"
    },
    red: {
      bg: "from-yellow-400 to-black",
      badge: "bg-yellow-500",
      text: "text-black",
      glow: "shadow-yellow-500/25"
    }
  }

  const sizeClasses = {
    sm: {
      height: "h-0.5",
      text: "text-xs",
      padding: "py-2"
    },
    md: {
      height: "h-1",
      text: "text-sm", 
      padding: "py-3"
    },
    lg: {
      height: "h-1",
      text: "text-base",
      padding: "py-4"
    }
  }

  const currentColor = colorClasses[color]
  const currentSize = sizeClasses[size]

  return (
    <div className={`space-y-1 ${currentSize.padding}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showIcon && (
            <span className="text-lg">{icon}</span>
          )}
          <div>
            <h3 className={`font-semibold text-gray-700 ${currentSize.text}`}>
              {label}
            </h3>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`font-bold text-gray-900 ${currentSize.text}`}>
            {current.toLocaleString('fr-FR')}{unit}
          </div>
          <div className="text-xs text-gray-500">
            / {target.toLocaleString('fr-FR')}{unit}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Progress fill only - no background */}
        <motion.div
          className={`${currentSize.height} bg-gradient-to-r ${currentColor.bg} rounded-full shadow-sm ${currentColor.glow}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Over-target glow effect */}
        {isOverTarget && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${currentColor.bg} opacity-40 rounded-full`}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />

        {/* Percentage and status */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className={`text-xs font-bold px-2 py-1 rounded-full text-white ${currentColor.badge}`}
            >
              {percentage.toFixed(0)}%
            </motion.span>
            
            {isOverTarget && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"
              >
                Dépassé !
              </motion.span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            {current >= target ? "Objectif atteint" : `${target - current} restant`}
          </div>
        </div>
      </div>
    </div>
  )
}
