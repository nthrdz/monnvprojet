"use client"

import { motion } from "framer-motion"
import { Link as LinkIcon, Award, ImageIcon, Calendar } from "lucide-react"

interface SectionHeaderProps {
  title: string
  count?: number
  iconName?: "link" | "award" | "image" | "calendar"
  gradient?: string
  badgeColor?: {
    bg: string
    text: string
  }
}

const iconMap = {
  link: LinkIcon,
  award: Award,
  image: ImageIcon,
  calendar: Calendar,
}

export function SectionHeader({ 
  title, 
  count, 
  iconName,
  gradient = "from-primary-600 to-quaternary-600",
  badgeColor = { bg: "bg-brand-blue-100", text: "text-brand-blue-700" }
}: SectionHeaderProps) {
  const Icon = iconName ? iconMap[iconName] : null

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-6 md:mb-8"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 15 }}
            className={`p-2.5 md:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-standard`}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
          </motion.div>
        )}
        <h2 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {title}
        </h2>
      </div>

      {count !== undefined && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 15, delay: 0.1 }}
          className={`${badgeColor.bg} ${badgeColor.text} px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-standard`}
        >
          {count}
        </motion.div>
      )}
    </motion.div>
  )
}

