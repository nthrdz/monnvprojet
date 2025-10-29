"use client"

import { motion } from "framer-motion"
import { Link as LinkIcon, Award, ImageIcon, Calendar, Zap } from "lucide-react"

interface GlassSectionHeaderProps {
  title: string
  count?: number
  iconName?: "link" | "award" | "image" | "calendar" | "zap"
}

const iconMap = {
  link: LinkIcon,
  award: Award,
  image: ImageIcon,
  calendar: Calendar,
  zap: Zap,
}

export function GlassSectionHeader({ title, count, iconName }: GlassSectionHeaderProps) {
  const Icon = iconName ? iconMap[iconName] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="backdrop-blur-xl bg-gradient-to-br from-yellow-500 to-yellow-600 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-lg"
          >
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </motion.div>
        )}
        <h2 className="text-xl md:text-2xl font-black text-yellow-500">
          {title}
        </h2>
      </div>

      {count !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="backdrop-blur-xl bg-black/40 border border-yellow-500/30 px-4 py-2 rounded-xl shadow-lg"
        >
          <span className="text-base md:text-lg font-bold text-yellow-500">
            {count}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

