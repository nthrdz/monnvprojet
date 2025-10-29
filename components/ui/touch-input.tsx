"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface TouchInputProps extends React.ComponentProps<typeof Input> {
  /**
   * Minimum touch target size (default: 44px for accessibility)
   */
  minTouchSize?: number
}

const TouchInput = forwardRef<HTMLInputElement, TouchInputProps>(
  ({ className, minTouchSize = 44, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          // Ensure minimum touch target size
          `min-h-[${minTouchSize}px]`,
          // Mobile-first responsive sizing
          "h-11 sm:h-12",
          // Better touch experience
          "text-base", // Prevents zoom on iOS
          // Better spacing for mobile
          "px-4 py-3",
          className
        )}
        {...props}
      />
    )
  }
)

TouchInput.displayName = "TouchInput"

export { TouchInput }
