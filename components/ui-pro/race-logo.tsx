"use client"

interface RaceLogoProps {
  src: string
  alt: string
  className?: string
  variant?: 'light' | 'dark'
}

export function RaceLogo({ src, alt, className, variant = 'dark' }: RaceLogoProps) {
  const baseClasses = variant === 'dark' 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-200"
  
  return (
    <img 
      src={src} 
      alt={alt}
      className={`${baseClasses} ${className || ''}`}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
