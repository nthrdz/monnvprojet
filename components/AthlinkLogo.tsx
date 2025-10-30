import Image from "next/image"

interface AthlinkLogoProps {
  size?: number
  className?: string
}

export function AthlinkLogo({ size = 40, className = "" }: AthlinkLogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/logos/athlink-logo.png"
        alt="Athlink Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  )
}

