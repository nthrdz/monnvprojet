"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ResponsiveTextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Text size variants
   */
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"
  /**
   * Font weight
   */
  weight?: "normal" | "medium" | "semibold" | "bold" | "black"
  /**
   * HTML element to render as
   */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

const ResponsiveText = forwardRef<HTMLElement, ResponsiveTextProps>(
  ({ className, size = "base", weight = "normal", as: Component = "p", children, ...props }, ref) => {
    const sizeClasses = {
      xs: "text-xs sm:text-sm",
      sm: "text-sm sm:text-base", 
      base: "text-base sm:text-lg",
      lg: "text-lg sm:text-xl",
      xl: "text-xl sm:text-2xl",
      "2xl": "text-xl sm:text-2xl md:text-3xl",
      "3xl": "text-2xl sm:text-3xl md:text-4xl",
      "4xl": "text-3xl sm:text-4xl md:text-5xl",
      "5xl": "text-4xl sm:text-5xl md:text-6xl",
      "6xl": "text-5xl sm:text-6xl md:text-7xl"
    }

    const weightClasses = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold", 
      bold: "font-bold",
      black: "font-black"
    }

    return (
      <Component
        ref={ref as any}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

ResponsiveText.displayName = "ResponsiveText"

export { ResponsiveText }
