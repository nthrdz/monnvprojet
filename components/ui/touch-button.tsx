"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface TouchButtonProps extends React.ComponentProps<typeof Button> {
  /**
   * Minimum touch target size (default: 44px for accessibility)
   */
  minTouchSize?: number
}

const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, minTouchSize = 44, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          // Ensure minimum touch target size
          `min-h-[${minTouchSize}px] min-w-[${minTouchSize}px]`,
          // Mobile-first responsive sizing
          "h-11 sm:h-12",
          // Better touch feedback
          "active:scale-95 transition-transform",
          // Ensure text is readable
          "text-sm sm:text-base",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

TouchButton.displayName = "TouchButton"

export { TouchButton }
