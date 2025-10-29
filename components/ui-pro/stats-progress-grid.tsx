"use client"

import { motion } from "framer-motion"
import { AdvancedProgressBar } from "./advanced-progress-bar"

interface StatGoal {
  id: string
  label: string
  current: number
  target: number
  unit?: string
  color?: "blue" | "orange" | "green" | "purple" | "red"
  icon?: string
  description?: string
}

interface StatsProgressGridProps {
  goals: StatGoal[]
  title?: string
  columns?: 1 | 2 | 3
}

export function StatsProgressGrid({
  goals,
  title = "Progression des objectifs",
  columns = 2
}: StatsProgressGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2", 
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
          {title}
        </h2>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          En temps réel
        </div>
      </div>

      {/* Progress bars grid */}
      <div className={`grid ${gridCols[columns]} gap-3`}>
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-gray-50 rounded-xl p-2 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <AdvancedProgressBar
              label={goal.label}
              current={goal.current}
              target={goal.target}
              unit={goal.unit}
              color={goal.color}
              size="md"
              showIcon={!!goal.icon}
              icon={goal.icon}
              description={goal.description}
            />
          </motion.div>
        ))}
      </div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 pt-4 border-t border-gray-200"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {goals.filter(g => g.current >= g.target).length}
            </div>
            <div className="text-xs text-gray-500">Objectifs atteints</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length)}%
            </div>
            <div className="text-xs text-gray-500">Progression moyenne</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {goals.reduce((acc, g) => acc + g.current, 0).toLocaleString('fr-FR')}
            </div>
            <div className="text-xs text-gray-500">Total atteint</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {goals.reduce((acc, g) => acc + g.target, 0).toLocaleString('fr-FR')}
            </div>
            <div className="text-xs text-gray-500">Total cible</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
