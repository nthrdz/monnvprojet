"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ExternalLink, TrendingUp } from "lucide-react"
import { useState } from "react"

interface InteractiveLinkCardProps {
  title: string
  description?: string
  url: string
  icon?: string
  clicks: number
  onTrackClick: () => void
}

export function InteractiveLinkCard({
  title,
  description,
  url,
  icon,
  clicks,
  onTrackClick
}: InteractiveLinkCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Parallax effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [5, -5])
  const rotateY = useTransform(x, [-100, 100], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onTrackClick}
      className="block w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-colors duration-300 cursor-pointer group">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.3 }}
        />

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%", skewX: -20 }}
          animate={{ x: isHovered ? "200%" : "-100%" }}
          transition={{ duration: 0.6 }}
        />

        <div className="relative p-5 flex items-center gap-4">
          {/* Icon with bounce animation */}
          <motion.div
            animate={{
              y: isHovered ? [0, -5, 0] : 0,
            }}
            transition={{
              duration: 0.5,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.5
            }}
            className="text-4xl flex-shrink-0"
          >
            {icon || ""}
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <motion.div
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: isHovered ? 0 : -5, opacity: isHovered ? 1 : 0 }}
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
              </motion.div>
            </div>
            
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}

            {/* Clicks counter */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 5 }}
              className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"
            >
              <TrendingUp className="w-3 h-3" />
              <span>{clicks} clics</span>
            </motion.div>
          </div>

          {/* Animated arrow */}
          <motion.div
            animate={{
              x: isHovered ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-muted-foreground group-hover:text-blue-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>

        {/* Progress bar at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />
      </Card>
    </motion.a>
  )
}
