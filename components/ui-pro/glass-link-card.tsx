"use client"

import { motion } from "framer-motion"
import { ExternalLink, TrendingUp } from "lucide-react"
import { useState } from "react"

interface GlassLinkCardProps {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  clicks: number
  index: number
}

export function GlassLinkCard({ id, title, description, url, icon, clicks, index }: GlassLinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = async () => {
    try {
      await fetch(`/api/links/${id}/click`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to track click', err)
    }
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="block group"
    >
      <div className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-3 md:p-4 relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 pointer-events-none"
        />

        <div className="relative flex items-center gap-3">
          {/* Icon */}
          <motion.div
            animate={{ rotate: isHovered ? 5 : 0 }}
            className="text-2xl flex-shrink-0"
          >
            {icon || ""}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-sm md:text-base text-white truncate group-hover:text-yellow-500 transition-colors">
                {title}
              </h3>
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
              >
                <ExternalLink className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              </motion.div>
            </div>

            {description && (
              <p className="text-xs text-gray-400 truncate mb-1">
                {description}
              </p>
            )}

            {/* Clicks counter */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isHovered ? 1 : 0.7, y: 0 }}
              className="flex items-center gap-1.5 text-xs text-gray-500"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-medium">{clicks} clics</span>
            </motion.div>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{ x: isHovered ? 5 : 0 }}
            className="text-gray-600 group-hover:text-yellow-500 transition-colors flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* Bottom gradient bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 origin-left"
        />
      </div>
    </motion.a>
  )
}

