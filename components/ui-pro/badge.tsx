"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "blue" | "orange" | "green" | "pink" | "purple" | "yellow" | "red" | "gray"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  className?: string
}

export function Badge({
  children,
  variant = "blue",
  size = "md",
  icon: Icon,
  className
}: BadgeProps) {
  const variantClasses = {
    blue: "bg-primary-blue-100 text-primary-blue-700 border-primary-blue-200",
    orange: "bg-primary-orange-100 text-primary-orange-700 border-primary-orange-200",
    green: "bg-primary-green-100 text-primary-green-700 border-primary-green-200",
    pink: "bg-primary-pink-100 text-primary-pink-700 border-primary-pink-200",
    purple: "bg-primary-purple-100 text-primary-purple-700 border-primary-purple-200",
    yellow: "bg-primary-yellow-100 text-primary-yellow-700 border-primary-yellow-200",
    red: "bg-primary-red-100 text-primary-red-700 border-primary-red-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200"
  }

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "inline-flex items-center gap-1.5 font-bold rounded-full border-2",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </motion.span>
  )
}
