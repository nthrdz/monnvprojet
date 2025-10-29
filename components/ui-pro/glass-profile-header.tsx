"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Instagram, Youtube, Music } from "lucide-react"

interface GlassProfileHeaderProps {
  displayName: string
  bio: string | null
  location: string | null
  avatarUrl: string | null
  sport: string
  instagram: string | null
  strava: string | null
  youtube: string | null
  tiktok: string | null
}

export function GlassProfileHeader({
  displayName,
  bio,
  location,
  avatarUrl,
  sport,
  instagram,
  strava,
  youtube,
  tiktok
}: GlassProfileHeaderProps) {
  const socialLinks = [
    { icon: Instagram, url: instagram ? `https://instagram.com/${instagram}` : null, color: "from-pink-500 to-purple-500", name: "Instagram" },
    { icon: StravaIcon, url: strava, color: "from-yellow-500 to-red-500", name: "Strava" },
    { icon: Youtube, url: youtube, color: "from-red-500 to-red-600", name: "YouTube" },
    { icon: Music, url: tiktok ? `https://tiktok.com/@${tiktok}` : null, color: "from-gray-800 to-black", name: "TikTok" },
  ].filter(link => link.url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="backdrop-blur-2xl bg-black/40 border border-yellow-500/30 rounded-xl shadow-2xl p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative flex-shrink-0"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 via-yellow-600 to-gray-900 animate-spin-slow opacity-75" 
                 style={{ animationDuration: '8s' }} />
            
            {/* Avatar container */}
            <div className="absolute inset-2 rounded-full bg-gray-900/90 backdrop-blur-sm p-1">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={160}
                  height={160}
                  className="rounded-full object-cover w-full h-full"
                  priority
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-2xl md:text-3xl font-black">
                  {displayName[0]}
                </div>
              )}
            </div>
          </div>

          {/* Sport Badge */}
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
          >
            <div className="backdrop-blur-xl bg-black/60 border border-yellow-500/50 rounded-full px-2.5 py-0.5 shadow-lg">
              <span className="text-[10px] font-bold text-yellow-500 whitespace-nowrap">
                {sport}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent leading-tight"
          >
            {displayName}
          </motion.h1>

          {bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-base text-gray-300 mb-3 leading-relaxed max-w-2xl"
            >
              {bio}
            </motion.p>
          )}

          {location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-gray-400 mb-3"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium">{location}</span>
            </motion.div>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`backdrop-blur-xl bg-white/10 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/50 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all group`}
                >
                  <link.icon className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function StravaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  )
}

