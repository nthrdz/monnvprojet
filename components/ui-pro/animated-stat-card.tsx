"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface AnimatedStatCardProps {
  title: string
  value: number
  suffix?: string
  icon?: React.ReactNode
  trend?: number // Pourcentage de changement
  color?: "blue" | "green" | "yellow" | "purple"
  delay?: number
  className?: string
}

export function AnimatedStatCard({
  title,
  value,
  suffix = "",
  icon,
  trend,
  color = "blue",
  delay = 0,
  className
}: AnimatedStatCardProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      delay,
      ease: "easeOut"
    })

    return controls.stop
  }, [value, delay, count])

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-black",
    purple: "from-purple-500 to-purple-600"
  }

  const iconBgClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className={className}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg">
        {/* Gradient Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-5",
          colorClasses[color]
        )} />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            {/* Icon */}
            {icon && (
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  iconBgClasses[color]
                )}
              >
                {icon}
              </motion.div>
            )}

            {/* Trend Indicator */}
            {trend !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 }}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                  trend >= 0 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                )}
              >
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </motion.div>
            )}
          </div>

          {/* Value */}
          <div className="space-y-1">
            <motion.div className="flex items-baseline gap-1">
              <motion.span 
                className="text-4xl font-bold tracking-tight"
              >
                {rounded}
              </motion.span>
              {suffix && (
                <span className="text-xl font-medium text-muted-foreground">
                  {suffix}
                </span>
              )}
            </motion.div>

            {/* Title */}
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
          </div>

          {/* Animated underline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.6 }}
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r origin-left",
              colorClasses[color]
            )}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
