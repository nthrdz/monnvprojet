"use client"

import { motion } from "framer-motion"
import { MapPin, Instagram, Youtube } from "lucide-react"
import { ProfilePlanBadge } from "./plan-badge"

interface LinktreeHeaderProps {
  displayName: string
  bio: string | null
  location: string | null
  sport: string
  instagram: string | null
  strava: string | null
  youtube: string | null
  tiktok: string | null
  plan?: "FREE" | "PRO" | "ELITE"
}

export function LinktreeHeader({
  displayName,
  bio,
  location,
  sport,
  instagram,
  strava,
  youtube,
  tiktok,
  plan = "FREE"
}: LinktreeHeaderProps) {
  const socialLinks = [
    { icon: Instagram, url: instagram ? `https://instagram.com/${instagram}` : null },
    { icon: StravaIcon, url: strava },
    { icon: Youtube, url: youtube },
    { icon: TikTokIcon, url: tiktok ? `https://tiktok.com/@${tiktok}` : null },
  ].filter(link => link.url)

  return (
    <div className="text-center mb-8">
      {/* Sport Badge - Superposé sur la photo de couverture */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-block mb-6"
      >
        <div className="backdrop-blur-xl bg-black/60 border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <span className="text-sm font-bold text-white whitespace-nowrap">
            {sport}
          </span>
        </div>
      </motion.div>

      {/* Name - Style GetAllMyLinks */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-white mb-4"
      >
        {displayName}
      </motion.h1>

      {/* Status Badge - Style exact de l'image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-4"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-medium text-green-400">Active now</span>
      </motion.div>

      {/* Plan Badge */}
      <ProfilePlanBadge plan={plan} className="mb-6" />

      {/* Bio */}
      {bio && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base text-gray-200 mb-6 max-w-lg mx-auto leading-relaxed backdrop-blur-sm bg-black/20 rounded-lg p-4"
        >
          {bio}
        </motion.p>
      )}

      {/* Location */}
      {location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-2 text-base text-gray-300 mb-8"
        >
          <MapPin className="w-5 h-5" />
          <span>{location}</span>
        </motion.div>
      )}

      {/* Social Links - Style GetAllMyLinks */}
      {socialLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/40 w-14 h-14 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              <link.icon className="w-6 h-6 text-white" />
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

