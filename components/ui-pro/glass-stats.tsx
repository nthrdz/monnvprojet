"use client"

import { motion } from "framer-motion"
import { TrendingUp, Award, Target, Zap } from "lucide-react"

interface GlassStatsProps {
  stats?: {
    totalDistance?: number
    totalRaces?: number
    totalPodiums?: number
    bestTime?: string
    [key: string]: any
  }
}

export function GlassStats({ stats }: GlassStatsProps) {
  if (!stats) return null

  const statCards = [
    {
      label: "Distance Totale",
      value: stats.totalDistance ? `${stats.totalDistance} km` : null,
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      label: "Courses",
      value: stats.totalRaces ? stats.totalRaces : null,
      icon: Target,
      gradient: "from-violet-500 to-violet-600"
    },
    {
      label: "Podiums",
      value: stats.totalPodiums ? stats.totalPodiums : null,
      icon: Award,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      label: "Meilleur Temps",
      value: stats.bestTime || null,
      icon: Zap,
      gradient: "from-green-500 to-green-600"
    },
  ].filter(stat => stat.value !== null)

  if (statCards.length === 0) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative backdrop-blur-xl bg-white/5 border border-yellow-500/20 hover:bg-white/10 hover:border-yellow-500/40 rounded-lg shadow-lg hover:shadow-2xl p-3 md:p-4 transition-all duration-300 group overflow-hidden"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex p-2 md:p-2.5 rounded-lg bg-gradient-to-br ${stat.gradient} mb-2 shadow-lg group-hover:shadow-xl transition-shadow`}
          >
            <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </motion.div>

          {/* Value */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-black mb-1 text-yellow-500">
              {stat.value}
            </p>
          </motion.div>

          {/* Label */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {stat.label}
          </p>

          {/* Bottom gradient bar */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient} rounded-b-lg`}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
            style={{ originX: 0 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

