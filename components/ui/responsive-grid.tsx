"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns on different screen sizes
   */
  cols?: {
    default?: 1 | 2 | 3 | 4 | 5 | 6
    sm?: 1 | 2 | 3 | 4 | 5 | 6
    md?: 1 | 2 | 3 | 4 | 5 | 6
    lg?: 1 | 2 | 3 | 4 | 5 | 6
    xl?: 1 | 2 | 3 | 4 | 5 | 6
  }
  /**
   * Gap between grid items
   */
  gap?: "none" | "sm" | "md" | "lg" | "xl"
}

const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ className, cols = { default: 1, sm: 2, lg: 3 }, gap = "md", children, ...props }, ref) => {
    const colClasses = []
    
    // Default columns
    if (cols.default) {
      colClasses.push(`grid-cols-${cols.default}`)
    }
    
    // Responsive columns
    if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`)
    if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`)
    if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`)
    if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`)

    const gapClasses = {
      none: "gap-0",
      sm: "gap-2 sm:gap-3",
      md: "gap-4 sm:gap-6",
      lg: "gap-6 sm:gap-8",
      xl: "gap-8 sm:gap-10"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          ...colClasses,
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ResponsiveGrid.displayName = "ResponsiveGrid"

export { ResponsiveGrid }
