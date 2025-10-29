"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, MessageCircle } from "lucide-react"
import { useState } from "react"

interface ShareProfileButtonProps {
  username: string
  displayName: string
}

export function ShareProfileButton({ username, displayName }: ShareProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const profileUrl = typeof window !== 'undefined' ? window.location.href : `https://athlink.app/${username}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link', err)
    }
  }

  const shareLinks = [
    {
      name: 'Copier le lien',
      icon: copied ? Check : Copy,
      onClick: handleCopyLink,
      color: 'from-gray-600 to-gray-700',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Découvre le profil de ${displayName} sur Athlink : ${profileUrl}`)}`, '_blank'),
      color: 'from-green-600 to-green-700',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank'),
      color: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Découvre le profil de ${displayName} sur Athlink`)}&url=${encodeURIComponent(profileUrl)}`, '_blank'),
      color: 'from-sky-500 to-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank'),
      color: 'from-blue-700 to-blue-800',
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-floating p-3 mb-2 min-w-[200px]"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
              Partager ce profil
            </p>
            <div className="space-y-2">
              {shareLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    link.onClick()
                    if (link.name !== 'Copier le lien') {
                      setIsOpen(false)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${link.color} text-white shadow-standard`}>
                    <link.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {link.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-hero text-gray-900 shadow-floating hover:shadow-glow-blue flex items-center justify-center transition-all"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Share2 className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

