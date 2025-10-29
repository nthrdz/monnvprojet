"use client"

import { motion } from "framer-motion"
import { Crown, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanBadgeProps {
  plan: "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH"
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export function PlanBadge({ plan, size = "md", showIcon = true, className }: PlanBadgeProps) {
  if (plan === "FREE" || plan === "COACH") return null // Pas de badge pour les plans gratuit et coach

  const planConfig = {
    PRO: {
      label: "Pro",
      icon: Zap,
      gradient: "from-yellow-500 to-black",
      bgColor: "bg-gradient-to-r from-yellow-500 to-black",
      textColor: "text-white",
      shadowColor: "shadow-yellow-500/20"
    },
    COACH: {
      label: "",
      icon: Zap,
      gradient: "",
      bgColor: "",
      textColor: "",
      shadowColor: ""
    },
    ELITE: {
      label: "Elite", 
      icon: Crown,
      gradient: "from-gray-800 to-black",
      bgColor: "bg-gradient-to-r from-gray-800 to-black",
      textColor: "text-white",
      shadowColor: "shadow-gray-800/20"
    },
    ATHLETE_PRO: {
      label: "Elite", 
      icon: Crown,
      gradient: "from-gray-800 to-black",
      bgColor: "bg-gradient-to-r from-gray-800 to-black",
      textColor: "text-white",
      shadowColor: "shadow-gray-800/20"
    }
  }

  const config = planConfig[plan as keyof typeof planConfig]
  if (!config) return null // Si le plan n'est pas reconnu, ne rien afficher
  
  const Icon = config.icon

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm", 
    lg: "px-4 py-1.5 text-base"
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={cn(
        "inline-flex items-center gap-1.5 font-bold rounded-full border-2 border-white/20 backdrop-blur-sm",
        config.bgColor,
        config.textColor,
        config.shadowColor,
        sizeClasses[size],
        "shadow-lg hover:shadow-xl transition-all duration-200",
        className
      )}
    >
      {showIcon && (
        <Icon className={iconSizes[size]} />
      )}
      <span>{config.label}</span>
      <motion.div
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-1.5 h-1.5 bg-white/80 rounded-full"
      />
    </motion.div>
  )
}

// Composant pour afficher le badge dans le header du profil
export function ProfilePlanBadge({ plan, className }: { plan: "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH", className?: string }) {
  if (plan === "FREE" || plan === "COACH") return null

  return (
    <div className={cn("flex justify-center", className)}>
      <PlanBadge plan={plan} size="sm" />
    </div>
  )
}
