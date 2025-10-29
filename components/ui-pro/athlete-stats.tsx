"use client"

import { motion } from "framer-motion"
import { TrendingUp, Award, Target, Zap } from "lucide-react"

interface AthleteStatsProps {
  stats?: {
    totalDistance?: number
    totalRaces?: number
    totalPodiums?: number
    bestTime?: string
    [key: string]: any
  }
}

export function AthleteStats({ stats }: AthleteStatsProps) {
  if (!stats) return null

  const statCards = [
    {
      label: "Distance Totale",
      value: stats.totalDistance ? `${stats.totalDistance} km` : null,
      icon: TrendingUp,
      gradient: "from-primary-500 to-primary-600",
      color: "text-primary-600"
    },
    {
      label: "Courses",
      value: stats.totalRaces ? stats.totalRaces : null,
      icon: Target,
      gradient: "from-success-500 to-success-600",
      color: "text-success-600"
    },
    {
      label: "Podiums",
      value: stats.totalPodiums ? stats.totalPodiums : null,
      icon: Award,
      gradient: "from-warning-500 to-warning-600",
      color: "text-warning-600"
    },
    {
      label: "Meilleur Temps",
      value: stats.bestTime || null,
      icon: Zap,
      gradient: "from-accent-500 to-accent-600",
      color: "text-accent-600"
    },
  ].filter(stat => stat.value !== null)

  if (statCards.length === 0) return null

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8 md:mb-12"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", damping: 15 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative group"
          >
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-standard hover:shadow-elevated p-5 md:p-6 transition-all duration-300 border-2 border-transparent group-hover:border-gray-100">
              {/* Icon */}
              <div className={`inline-flex p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3 md:mb-4 shadow-standard`}>
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              </div>

              {/* Value */}
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <p className={`text-2xl md:text-3xl lg:text-4xl font-black mb-1 md:mb-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>

              {/* Label */}
              <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {stat.label}
              </p>

              {/* Animated bottom border */}
              <motion.div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-b-2xl`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

