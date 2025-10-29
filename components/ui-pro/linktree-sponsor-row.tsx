"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Copy, Check } from "lucide-react"

interface Sponsor {
  id: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  promoCode: string | null
}

interface LinktreeSponsorRowProps {
  sponsors: Sponsor[]
}

function PromoCodeBadge({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm text-yellow-400 text-[10px] font-bold rounded-lg text-center w-32 sm:w-36 md:w-40 transition-all duration-300 hover:bg-yellow-500/30 hover:text-yellow-300 hover:shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex-1 truncate text-left">
          <span className="text-gray-400 font-normal">Code : </span>{code}
        </div>
        <button
          onClick={handleCopy}
          className="ml-1 p-1 hover:bg-yellow-500/20 rounded transition-colors flex-shrink-0"
          title="Copier le code"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </motion.div>
  )
}

export function LinktreeSponsorRow({ sponsors }: LinktreeSponsorRowProps) {
  return (
    <div className="mb-8">
      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3 text-center">Partenaires</p>
      <div className="flex gap-1 justify-center flex-wrap">
        {sponsors.slice(0, 4).map((sponsor, index) => (
          <motion.div
            key={sponsor.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Logo Card */}
            <motion.a
              href={sponsor.websiteUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.10, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`backdrop-blur-xl bg-gradient-to-br from-yellow-500/25 via-yellow-600/20 to-yellow-500/15 border border-yellow-500/40 hover:border-yellow-400/60 rounded-xl p-2 sm:p-3 text-center transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-1 aspect-square flex flex-col justify-center w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40 m-0 group cursor-pointer ${!sponsor.websiteUrl && 'pointer-events-none'}`}
            >
              <p className="text-[10px] mb-1 uppercase tracking-wider font-semibold text-yellow-400 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-300">
                Partenaire
              </p>
              {sponsor.logoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300 group-hover:scale-105">
                    <Image
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      sizes="25vw"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-black text-white text-center transition-all duration-300 group-hover:text-white/90">{sponsor.name}</p>
              )}
              <p className="text-xs text-white/80 mt-1 font-medium truncate transition-all duration-300 group-hover:text-white/90">{sponsor.name}</p>
            </motion.a>
            
            {/* Promo code below */}
            {sponsor.promoCode && (
              <PromoCodeBadge code={sponsor.promoCode} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

