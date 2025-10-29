"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Instagram, Youtube, Calendar, Link as LinkIcon, Users, ExternalLink, Trophy, Medal, ImageIcon } from "lucide-react"

interface ModernProfileCardProps {
  displayName: string
  bio: string | null
  location: string | null
  avatarUrl: string | null
  sport: string
  instagram: string | null
  strava: string | null
  youtube: string | null
  tiktok: string | null
  plan?: "FREE" | "PRO" | "ELITE"
  links?: Array<{
    id: string
    title: string
    url: string
    icon?: string | null
  }>
  races?: Array<{
    id: string
    name: string
    date: string
    location?: string | null
    distance?: string | null
    result?: string | null
    url?: string | null
    logoUrl?: string | null
  }>
  sponsors?: Array<{
    id: string
    name: string
    logoUrl?: string | null
    websiteUrl?: string | null
    promoCode?: string | null
  }>
  media?: Array<{
    id: string
    type: string
    url: string
    thumbnail?: string | null
    title?: string | null
  }>
  username?: string
  hasCoachingServices?: boolean
}

export function ModernProfileCard({
  displayName,
  bio,
  location,
  avatarUrl,
  sport,
  instagram,
  strava,
  youtube,
  tiktok,
  plan = "FREE",
  links = [],
  races = [],
  sponsors = [],
  media = [],
  username,
  hasCoachingServices = false
}: ModernProfileCardProps) {

  const allSocialIcons = [
    { icon: Instagram, url: instagram ? `https://instagram.com/${instagram}` : null },
    { icon: TikTokIcon, url: tiktok ? `https://tiktok.com/@${tiktok}` : null },
    { icon: XIcon, url: null },
    { icon: StravaIcon, url: strava },
    { icon: TelegramIcon, url: null },
    { icon: Youtube, url: youtube },
  ].filter(social => social.url) // N'afficher que les réseaux sociaux remplis

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full max-w-[450px] mx-auto"
    >

      {/* Carte principale avec glassmorphism */}
      <div className="relative overflow-hidden rounded-[32px] shadow-2xl backdrop-blur-xl bg-gradient-to-b from-white/10 to-black/40 border border-white/20">
        
        {/* Photo de profil - 60% de la hauteur */}
        <div className="relative h-[400px] sm:h-[450px] overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              fill
              className="object-cover"
              priority
              quality={100}
              sizes="(max-width: 640px) 100vw, 450px"
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <span className="text-9xl font-black text-white">
                {displayName[0]}
              </span>
            </div>
          )}
          
          {/* Overlay gradient pour transition douce */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>

        {/* Section informations sur fond noir */}
        <div className="relative bg-gradient-to-b from-black/90 to-black p-6 sm:p-8">
          
          {/* Badge Plan */}
          {plan && plan !== "FREE" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-3"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${
                plan === "ELITE" 
                  ? "bg-gradient-to-r from-gray-700 to-gray-900 border border-gray-600" 
                  : "bg-gradient-to-r from-yellow-500 to-orange-500"
              } shadow-lg`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                <span className="text-sm font-bold text-white uppercase">{plan === "ELITE" ? "Elite" : "Pro"}</span>
              </div>
            </motion.div>
          )}
          
          {/* Nom de l'utilisateur */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-white text-center mb-3"
          >
            {displayName}
          </motion.h1>

          {/* Statut et localisation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-3 text-sm"
          >
            {/* Active now */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-gray-300">Active now</span>
            </div>

            {/* Location */}
            {location && (
              <>
                <span className="text-gray-600">•</span>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              </>
            )}
          </motion.div>

          {/* Bio / Description */}
          {bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-400 text-center mb-4"
            >
              {bio}
            </motion.p>
          )}

          {/* Badge sport */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5">
              <span className="text-sm font-semibold text-yellow-400">{sport}</span>
            </div>
          </motion.div>


          {/* Icônes réseaux sociaux */}
          {allSocialIcons.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6 pb-6 border-b border-white/10"
            >
              {allSocialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all text-white hover:text-yellow-400 cursor-pointer"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          )}

          {/* Contenu dynamique */}
          <div className="space-y-4">
            {/* Section Événements/Compétitions */}
            {races.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-white mb-3">Événements/Compétitions</h3>
                <div className="space-y-2">
                  {races.slice(0, 3).map((race, index) => (
                    <motion.a
                      key={race.id}
                      href={race.url || `/${username}/races/${race.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="block bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {/* Logo de l'événement */}
                        {race.logoUrl ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <Image
                              src={race.logoUrl}
                              alt={race.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20 flex-shrink-0">
                            <Trophy className="w-6 h-6 text-blue-400" />
                          </div>
                        )}
                        
                        {/* Informations de l'événement */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{race.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-gray-300 text-xs">
                              {new Date(race.date).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                            {race.location && (
                              <>
                                <span className="text-gray-600">•</span>
                                <p className="text-gray-300 text-xs truncate">{race.location}</p>
                              </>
                            )}
                          </div>
                          {race.distance && (
                            <p className="text-gray-400 text-xs mt-1">{race.distance}</p>
                          )}
                        </div>

                        {/* Résultat */}
                        {race.result && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Medal className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-medium">{race.result}</span>
                          </div>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section Liens */}
            {links.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-white mb-3">Liens</h3>
                <div className="space-y-2">
                  {links.slice(0, 3).map((link, index) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all group"
                    >
                      <ExternalLink className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{link.title}</p>
                        {link.icon && (
                          <p className="text-gray-300 text-xs">{link.icon}</p>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section Sponsors */}
            {sponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
              >
                <h3 className="font-semibold text-white mb-3">Sponsors</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sponsors.slice(0, 4).map((sponsor, index) => (
                    <motion.a
                      key={sponsor.id}
                      href={sponsor.websiteUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 hover:bg-white/10 rounded-lg p-3 border border-white/10 transition-all text-center group"
                    >
                      {sponsor.logoUrl ? (
                        <div className="w-8 h-8 mx-auto mb-2 rounded-full overflow-hidden">
                          <Image
                            src={sponsor.logoUrl}
                            alt={sponsor.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <p className="font-medium text-white text-xs group-hover:text-purple-300">{sponsor.name}</p>
                      {sponsor.promoCode && (
                        <p className="text-gray-400 text-xs">{sponsor.promoCode}</p>
                      )}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Section Galerie */}
            {media.length > 0 && (
              <motion.a
                href={username ? `/${username}/galerie` : "#"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Galerie</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{media.length} médias</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>
                
                {/* Aperçu des médias */}
                <div className="grid grid-cols-3 gap-2">
                  {media.slice(0, 3).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="relative aspect-square rounded-lg overflow-hidden bg-white/5"
                    >
                      <Image
                        src={item.thumbnail || item.url}
                        alt={item.title || "Media"}
                        fill
                        className="object-cover"
                      />
                      {item.type === "VIDEO" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="opacity-80">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.a>
            )}

            {/* Section Coaching */}
            {hasCoachingServices && (
              <motion.a
                href={username ? `/${username}/coaching` : "#"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="block bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">Services Coaching</h3>
                  <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Découvre mes services de coaching personnalisé
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Plans d'entraînement</p>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400">Réservations</p>
                  </div>
                </div>
              </motion.a>
            )}
          </div>

          {/* Footer - Généré par Athlink */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 pt-4 border-t border-white/10 text-center"
          >
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <span>Généré par</span>
              <span className="font-bold text-yellow-400">Athlink</span>
            </a>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}

// Icônes personnalisées
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.544 10.456L20.2 2h-1.581l-5.779 6.719L8.3 2H2l6.988 10.177L2 22h1.581l6.1-7.083L14.7 22h6.3l-7.456-11.544zM10.8 13.5l-.707-1.012L4.5 3.5h2.424l4.536 6.487.707 1.012 5.905 8.446h-2.424L10.8 13.5z"/>
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

