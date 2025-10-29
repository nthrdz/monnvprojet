"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface LinktreeLinkCardProps {
  id: string
  title: string
  url: string
  icon?: string
  index: number
}

export function LinktreeLinkCard({ id, title, url, icon, index }: LinktreeLinkCardProps) {
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
      data-link-card
      data-link-id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="block w-full group"
    >
      <div className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 pointer-events-none"
        />

        <div className="relative flex items-center justify-center gap-3">
          {/* Icon */}
          {icon && (
            <span className="text-2xl flex-shrink-0">{icon}</span>
          )}

          {/* Title - Centered */}
          <h3 className="font-bold text-base md:text-lg text-white group-hover:text-yellow-500 transition-colors">
            {title}
          </h3>

          {/* Arrow indicator */}
          <motion.div
            animate={{ x: isHovered ? 3 : 0 }}
            className="text-gray-500 group-hover:text-yellow-500 transition-colors flex-shrink-0 ml-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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

