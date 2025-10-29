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

interface GlassSponsorCardProps {
  sponsor: Sponsor
  index: number
}

export function GlassSponsorCard({ sponsor, index }: GlassSponsorCardProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopyPromoCode = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
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
        <div className="relative h-12 md:h-16 w-full mb-2 flex items-center justify-center">
          <Image
            src={sponsor.logoUrl}
            alt={sponsor.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="mb-2">
          <h3 className="font-bold text-sm md:text-base text-white text-center">
            {sponsor.name}
          </h3>
        </div>
      )}

      {/* Description */}
      {sponsor.description && (
        <p className="text-[10px] text-gray-400 mb-2 line-clamp-2 text-center flex-grow">
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
            onClick={handleCopyPromoCode}
            className="w-full relative group"
          >
            <div className="backdrop-blur-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 hover:border-green-400 rounded-xl px-3 py-3 flex items-center justify-center gap-2 transition-colors">
              <span className="font-mono font-black text-green-700 text-sm md:text-base">
                {sponsor.promoCode}
              </span>
              <motion.div
                animate={{ scale: copied ? 0 : 1, opacity: copied ? 0 : 1 }}
                className="absolute right-3"
              >
                <Copy className="w-4 h-4 text-green-600" />
              </motion.div>
              <motion.div
                animate={{ scale: copied ? 1 : 0, opacity: copied ? 1 : 0 }}
                className="absolute right-3"
              >
                <Check className="w-4 h-4 text-green-700" />
              </motion.div>
            </div>
          </motion.button>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-green-600 text-center mt-2 font-medium"
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="backdrop-blur-xl bg-white/5 border border-yellow-500/20 rounded-lg shadow-lg p-3 md:p-4 h-full flex flex-col"
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="block h-full group"
    >
      <div className="backdrop-blur-xl bg-white/5 hover:bg-white/10 border border-yellow-500/20 hover:border-yellow-500/40 rounded-lg shadow-lg hover:shadow-2xl p-3 md:p-4 h-full flex flex-col transition-all duration-300 relative overflow-hidden">
        {/* Gradient overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 pointer-events-none"
        />
        
        <div className="relative z-10 flex flex-col h-full">
          <CardContent />
          
          {/* Visit link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="mt-4 pt-4 border-t border-white/40"
          >
            <div className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs text-yellow-500 font-semibold">
              <ExternalLink className="w-4 h-4" />
              <span>Visiter le site</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 origin-left"
        />
      </div>
    </motion.a>
  )
}

