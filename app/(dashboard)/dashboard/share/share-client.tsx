"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, ExternalLink, Share2, QrCode, Download, Instagram, Facebook, Linkedin, Youtube, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import QRCode from "qrcode"

// Custom Twitter/X Icon
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// Custom TikTok Icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  )
}

interface SharePageClientProps {
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
}

export function SharePageClient({ username, displayName, avatarUrl, bio }: SharePageClientProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleGenerateQR = async () => {
    try {
      const url = await QRCode.toDataURL(profileUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(url)
      setShowQR(true)
    } catch (err) {
      console.error('Failed to generate QR code:', err)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeUrl) return
    
    const link = document.createElement('a')
    link.download = `athlink-${username}-qr.png`
    link.href = qrCodeUrl
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} - AthLink`,
          text: bio || `Découvre mon profil d'athlète`,
          url: profileUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
  }

  const socialPlatforms = [
    { 
      name: "Instagram", 
      placeholder: "Ajoute dans ta bio",
      IconComponent: Instagram,
      color: "text-pink-600",
      hoverColor: "hover:text-pink-700",
      bgColor: "hover:bg-pink-50",
      action: async () => {
        await handleCopy()
        setTimeout(() => {
          window.open('https://www.instagram.com/accounts/edit/', '_blank')
        }, 300)
      }
    },
    { 
      name: "TikTok", 
      placeholder: "Ajoute dans ta bio",
      IconComponent: TikTokIcon,
      color: "text-black",
      hoverColor: "hover:text-black",
      bgColor: "hover:bg-gray-100",
      action: async () => {
        await handleCopy()
        setTimeout(() => {
          window.open('https://www.tiktok.com/setting', '_blank')
        }, 300)
      }
    },
    { 
      name: "Twitter/X", 
      placeholder: "Épingle en haut de profil",
      IconComponent: TwitterIcon,
      color: "text-black",
      hoverColor: "hover:text-gray-800",
      bgColor: "hover:bg-gray-100",
      action: () => {
        const text = `Découvre mon profil d'athlète 💪`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`
        window.open(twitterUrl, '_blank')
      }
    },
    { 
      name: "Facebook", 
      placeholder: "Partage sur ton mur",
      IconComponent: Facebook,
      color: "text-blue-600",
      hoverColor: "hover:text-blue-700",
      bgColor: "hover:bg-blue-50",
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
        window.open(facebookUrl, '_blank')
      }
    },
    { 
      name: "LinkedIn", 
      placeholder: "Ajoute à ton profil",
      IconComponent: Linkedin,
      color: "text-blue-700",
      hoverColor: "hover:text-blue-800",
      bgColor: "hover:bg-blue-50",
      action: () => {
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
        window.open(linkedInUrl, '_blank')
      }
    },
    { 
      name: "YouTube", 
      placeholder: "Ajoute dans ta description",
      IconComponent: Youtube,
      color: "text-red-600",
      hoverColor: "hover:text-red-700",
      bgColor: "hover:bg-red-50",
      action: async () => {
        await handleCopy()
        setTimeout(() => {
          window.open('https://studio.youtube.com/', '_blank')
        }, 300)
      }
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Link Card */}
      <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-yellow-600" />
            Ton lien AthLink
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Preview */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
            {avatarUrl ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">{displayName}</h3>
              <p className="text-sm text-gray-600 truncate">@{username}</p>
            </div>
          </div>

          {/* URL Display */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 mb-1 font-medium">Ton lien public :</p>
              <a 
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-700 font-bold text-lg truncate block"
              >
                {profileUrl}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={handleCopy}
              variant="default"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </>
              )}
            </Button>

            <Button
              onClick={() => window.open(profileUrl, '_blank')}
              variant="outline"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir mon profil
            </Button>

            <Button
              onClick={handleGenerateQR}
              variant="outline"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Générer QR Code
            </Button>
          </div>

          {/* Native Share Button (Mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          )}
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {showQR && qrCodeUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Ton QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-lg border border-gray-200">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scanne ce code pour accéder directement à ton profil
              </p>
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger le QR Code
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Social Platforms Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Où partager ton lien ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.IconComponent
              return (
                <motion.button
                  key={platform.name}
                  onClick={platform.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 bg-white rounded-lg border-2 border-gray-200 ${platform.bgColor} transition-all cursor-pointer text-left w-full group relative overflow-hidden shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`${platform.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-gray-900 ${platform.hoverColor} transition-colors`}>{platform.name}</h4>
                      <p className="text-xs text-gray-600">{platform.placeholder}</p>
                    </div>
                    <ExternalLink className={`w-4 h-4 text-gray-400 ${platform.color} transition-colors`} />
                  </div>
                </motion.button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-400">
        <CardHeader>
          <CardTitle className="text-yellow-300">💡 Conseils pour maximiser ta visibilité</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold mt-0.5">•</span>
              <span><strong className="text-yellow-300">Bio Instagram/TikTok :</strong> Ajoute ton lien AthLink dans ta bio pour diriger tes followers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold mt-0.5">•</span>
              <span><strong className="text-yellow-300">Stories/Reels :</strong> Partage ton QR Code dans tes stories pour un accès rapide</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold mt-0.5">•</span>
              <span><strong className="text-yellow-300">Email Signature :</strong> Inclus ton lien dans ta signature d'email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold mt-0.5">•</span>
              <span><strong className="text-yellow-300">Dossards de course :</strong> Imprime ton QR Code sur tes équipements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-300 font-bold mt-0.5">•</span>
              <span><strong className="text-yellow-300">Cartes de visite :</strong> Parfait pour les événements sportifs</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

