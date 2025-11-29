"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface VibrantIconProps {
  icon: LucideIcon | ReactNode
  className?: string
  onClick?: () => void
  size?: number | string
}

export function VibrantIcon({ icon: Icon, className = "", onClick, size }: VibrantIconProps) {
  const IconComponent = Icon as LucideIcon

  return (
    <motion.span
      whileHover={{ 
        scale: 1.2,
        rotate: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: [0, -15, 15, -15, 15, 0],
        transition: { duration: 0.3 }
      }}
      className="inline-flex items-center justify-center"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {typeof IconComponent === 'function' ? (
        <IconComponent 
          className={className} 
          size={size}
        />
      ) : (
        Icon
      )}
    </motion.span>
  )
}

