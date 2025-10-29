"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full"
  /**
   * Horizontal padding
   */
  padding?: "none" | "sm" | "md" | "lg"
}

const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ className, maxWidth = "4xl", padding = "md", children, ...props }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "4xl": "max-w-4xl",
      "6xl": "max-w-6xl",
      full: "max-w-full"
    }

    const paddingClasses = {
      none: "",
      sm: "px-2 sm:px-4",
      md: "px-4 sm:px-6",
      lg: "px-6 sm:px-8 lg:px-10"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "container mx-auto",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveContainer.displayName = "ResponsiveContainer"

export { ResponsiveContainer }
