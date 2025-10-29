"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"

interface Sponsor {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  description: string | null
  promoCode: string | null
}

interface SponsorCardProps {
  sponsor: Sponsor
  index: number
}

export function SponsorCard({ sponsor, index }: SponsorCardProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopyPromoCode = async () => {
    if (!sponsor.promoCode) return
    
    try {
      await navigator.clipboard.writeText(sponsor.promoCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy promo code', err)
    }
  }

  const CardContent = () => (
    <div className="relative h-full flex flex-col">
      {/* Logo or Name */}
      {sponsor.logoUrl ? (
        <div className="relative h-20 md:h-24 w-full mb-4 flex items-center justify-center">
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="font-bold text-lg md:text-xl text-gray-900 text-center">
            {sponsor.name}
          </h3>
        </div>
      )}

      {/* Description */}
      {sponsor.description && (
        <p className="text-xs md:text-sm text-gray-600 mb-4 line-clamp-2 text-center flex-grow">
          {sponsor.description}
        </p>
      )}

      {/* Promo Code */}
      {sponsor.promoCode && (
        <div className="mt-auto pt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide text-center">
            Code Promo
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCopyPromoCode()
            }}
            className="w-full relative group"
          >
            <div className="bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-300 rounded-xl px-3 py-3 flex items-center justify-center gap-2 hover:border-success-400 transition-colors">
              <span className="font-mono font-black text-success-700 text-sm md:text-base">
                {sponsor.promoCode}
              </span>
              <motion.div
                animate={{ scale: copied ? 0 : 1, opacity: copied ? 0 : 1 }}
                className="absolute right-3"
              >
                <Copy className="w-4 h-4 text-success-600" />
              </motion.div>
              <motion.div
                animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
                className="absolute right-3"
              >
                <Check className="w-4 h-4 text-success-700" />
              </motion.div>
            </div>
          </motion.button>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-success-600 text-center mt-2 font-medium"
            >
              Code copié !
            </motion.p>
          )}
        </div>
      )}
    </div>
  )

  if (!sponsor.websiteUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-standard p-5 md:p-6 text-center h-full flex flex-col"
      >
        <CardContent />
      </motion.div>
    )
  }

  return (
    <motion.a
      href={sponsor.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="block h-full group"
    >
      <div className="relative bg-white rounded-2xl shadow-standard hover:shadow-elevated p-5 md:p-6 text-center h-full flex flex-col transition-all duration-300 border-2 border-transparent hover:border-brand-blue-200">
        <CardContent />
        
        {/* Visit link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-brand-blue-600 font-semibold">
            <ExternalLink className="w-4 h-4" />
            <span>Visiter le site</span>
          </div>
        </motion.div>

        {/* Animated gradient border */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-blue-500 via-brand-orange-500 to-brand-green-500 opacity-0 group-hover:opacity-20 transition-opacity -z-10"
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
          }}
          transition={{
            duration: 3,
            repeat: isHovered ? Infinity : 0,
            ease: "linear"
          }}
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>
    </motion.a>
  )
}

