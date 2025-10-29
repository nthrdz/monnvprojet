"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SportButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  fullWidth?: boolean
  onClick?: () => void
  href?: string
  disabled?: boolean
  className?: string
}

export function SportButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  fullWidth = false,
  onClick,
  href,
  disabled = false,
  className
}: SportButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-300 group"
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-sport-primary-500 to-sport-primary-600 text-gray-900 hover:shadow-sport-glow hover:scale-105 active:scale-95",
    secondary: "bg-gradient-to-r from-sport-accent-500 to-sport-accent-600 text-gray-900 hover:shadow-sport-lg hover:scale-105 active:scale-95",
    ghost: "bg-transparent border-2 border-sport-primary-500 text-sport-primary-600 hover:bg-sport-primary-50 hover:scale-105 active:scale-95"
  }
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
    className
  )

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      )}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={classes}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {content}
    </motion.button>
  )
}
