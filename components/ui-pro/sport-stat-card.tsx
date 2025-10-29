"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface SportStatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  trend?: {
    value: number
    label: string
  }
  color?: "primary" | "accent" | "success"
  delay?: number
}

export function SportStatCard({
  icon: Icon,
  value,
  label,
  trend,
  color = "primary",
  delay = 0
}: SportStatCardProps) {
  const colorClasses = {
    primary: {
      bg: "from-sport-primary-500 to-sport-primary-600",
      icon: "bg-sport-primary-100 text-sport-primary-600",
      trend: "text-sport-primary-600"
    },
    accent: {
      bg: "from-sport-accent-500 to-sport-accent-600",
      icon: "bg-sport-accent-100 text-sport-accent-600",
      trend: "text-sport-accent-600"
    },
    success: {
      bg: "from-sport-success-500 to-sport-success-600",
      icon: "bg-sport-success-100 text-sport-success-600",
      trend: "text-sport-success-600"
    }
  }

  const classes = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
      }}
      className="relative group"
    >
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sport-md h-full flex flex-col">
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${classes.bg}`} />

        {/* Icon - Centré */}
        <div className="flex justify-center mb-4">
          <div className={`inline-flex p-3 rounded-xl ${classes.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Value - Centré */}
        <div className="flex justify-center mb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
            className="text-4xl font-black text-gray-900"
          >
            {value}
          </motion.div>
        </div>

        {/* Label - Centré */}
        <div className="text-center text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
          {label}
        </div>

        {/* Trend - Centré */}
        {trend && (
          <div className="flex justify-center">
            <div className={`flex items-center gap-2 text-sm font-bold ${classes.trend}`}>
              <span>{trend.value > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-500 font-medium">{trend.label}</span>
            </div>
          </div>
        )}

        {/* Hover effect overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${classes.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
      </div>
    </motion.div>
  )
}
