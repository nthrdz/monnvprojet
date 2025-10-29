"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Instagram, Youtube, Music } from "lucide-react"

interface ProfileHeaderProps {
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

export function ProfileHeader({
  displayName,
  bio,
  location,
  avatarUrl,
  sport,
  instagram,
  strava,
  youtube,
  tiktok
}: ProfileHeaderProps) {
  const socialLinks = [
    { icon: Instagram, url: instagram ? `https://instagram.com/${instagram}` : null, gradient: "from-tertiary-500 to-accent-500", name: "Instagram" },
    { icon: StravaIcon, url: strava, gradient: "from-accent-500 to-accent-600", name: "Strava" },
    { icon: Youtube, url: youtube, gradient: "from-danger-500 to-danger-600", name: "YouTube" },
    { icon: Music, url: tiktok ? `https://tiktok.com/@${tiktok}` : null, gradient: "from-gray-900 to-gray-800", name: "TikTok", isDark: true },
  ].filter(link => link.url)

  return (
    <div className="bg-white rounded-3xl shadow-floating p-8 md:p-12 lg:p-16">
      {/* Avatar & Badge Section */}
      <div className="flex flex-col items-center text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative mb-6"
        >
          {/* Avatar with animated ring */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-hero rounded-full blur-xl opacity-40"
          />
          
          <div className="relative w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full bg-gradient-hero p-1 shadow-glow-blue">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={208}
                height={208}
                className="rounded-full object-cover w-full h-full"
                priority
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-quaternary-500 flex items-center justify-center text-gray-900 text-4xl md:text-5xl lg:text-6xl font-black">
                {displayName[0]}
              </div>
            )}
          </div>

          {/* Sport Badge with animation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2"
          >
            <div className="bg-white rounded-full px-5 py-2.5 shadow-elevated border-2 border-gray-100 backdrop-blur-sm">
              <span className="text-sm md:text-base font-bold bg-gradient-to-r from-accent-600 to-success-600 bg-clip-text text-transparent">
                {sport}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Name with gradient animation */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 mt-2"
        >
          <span className="bg-gradient-to-r from-primary-600 via-quaternary-600 to-tertiary-600 bg-clip-text text-transparent">
            {displayName}
          </span>
        </motion.h1>

        {/* Bio */}
        {bio && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mb-6 leading-relaxed"
          >
            {bio}
          </motion.p>
        )}

        {/* Location */}
        {location && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-gray-500 mb-6"
          >
            <MapPin className="w-5 h-5" />
            <span className="font-medium">{location}</span>
          </motion.div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, type: "spring", damping: 15 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${link.gradient} flex items-center justify-center shadow-standard hover:shadow-glow-blue transition-all ${link.isDark ? 'text-white' : 'text-gray-900'}`}
              >
                <link.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
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

