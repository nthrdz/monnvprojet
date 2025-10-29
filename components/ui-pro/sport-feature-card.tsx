"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface SportFeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: "primary" | "accent" | "success"
  index?: number
}

export function SportFeatureCard({
  icon: Icon,
  title,
  description,
  color = "primary",
  index = 0
}: SportFeatureCardProps) {
  const colorClasses = {
    primary: "from-sport-primary-500 to-sport-primary-600",
    accent: "from-sport-accent-500 to-sport-accent-600",
    success: "from-sport-success-500 to-sport-success-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative h-full p-8 bg-white rounded-2xl shadow-sport-md hover:shadow-sport-lg transition-all duration-300">
        {/* Icon with gradient */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} mb-6 shadow-sport-md`}>
          <Icon className="w-8 h-8 text-gray-900" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sport-primary-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Animated underline */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colorClasses[color]}`}
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
        />
      </div>
    </motion.div>
  )
}
