"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Users, Link as LinkIcon, TrendingUp, DollarSign, Copy, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function AffiliatePage() {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const [affiliateLink, setAffiliateLink] = useState("")

  useEffect(() => {
    // Générer le lien d'affilié basé sur le username
    if (session?.user) {
      // @ts-ignore - username existe dans notre session personnalisée
      const username = session.user.username || session.user.email?.split('@')[0]
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://athlink.fr'
      setAffiliateLink(`${baseUrl}/?via=${username}`)
    }
  }, [session])

  const copyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
            Programme Ambassadeur
          </h1>
          <p className="text-gray-600">
            Gagne des commissions en parrainant de nouveaux athlètes sur Athlink
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🎉 Gagne 20% de commission récurrente !
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Pour chaque athlète qui s'inscrit via ton lien et passe Pro ou Elite, tu gagnes <strong>20% de commission chaque mois</strong> tant qu'il reste abonné.
              </p>
              <ul className="mt-3 space-y-1 text-gray-600">
                <li>• Plan Pro (9,90€/mois) = <strong>1,98€/mois</strong> de commission</li>
                <li>• Plan Elite (25,90€/mois) = <strong>5,18€/mois</strong> de commission</li>
                <li>• Paiements automatiques chaque mois</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Affiliate Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="w-6 h-6 text-gray-800" />
            <h2 className="text-2xl font-bold text-gray-900">Ton lien d'ambassadeur</h2>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-4">
            <code className="text-sm text-gray-700 flex-1 overflow-x-auto">
              {affiliateLink || "Chargement..."}
            </code>
            <button
              onClick={copyLink}
              disabled={!affiliateLink}
              className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Partage ce lien sur tes réseaux sociaux, dans tes stories, ou directement à tes amis athlètes !
          </p>
        </motion.div>

        {/* Stats Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-gray-600">Parrainages</span>
            </div>
            <p className="text-3xl font-black text-gray-900">
              --
            </p>
            <p className="text-xs text-gray-500 mt-1">En attente de synchronisation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-semibold text-gray-600">Conversions</span>
            </div>
            <p className="text-3xl font-black text-gray-900">
              --
            </p>
            <p className="text-xs text-gray-500 mt-1">En attente de synchronisation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-600">Commissions</span>
            </div>
            <p className="text-3xl font-black text-gray-900">
              --€
            </p>
            <p className="text-xs text-gray-500 mt-1">En attente de synchronisation</p>
          </motion.div>
        </div>

        {/* Access Full Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-800 to-black text-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ExternalLink className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">
                Dashboard complet Rewardful
              </h3>
              <p className="text-white/80 mb-4">
                Accède à ton dashboard Rewardful pour voir toutes tes statistiques en temps réel, gérer tes paiements et suivre tes conversions.
              </p>
              <a
                href="https://athlink.getrewardful.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                Accéder à Rewardful
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-white/60 text-sm mt-3">
                💡 Première visite ? Crée ton compte affilié avec l'email de ton compte Athlink
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💡 Conseils pour maximiser tes gains
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <strong>Partage sur les réseaux</strong> - Instagram, TikTok, YouTube
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">✍️</span>
              <div>
                <strong>Écris un article</strong> - Blog, Medium sur ton expérience Athlink
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎥</span>
              <div>
                <strong>Crée des vidéos</strong> - Tutoriels, reviews, avant/après
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <strong>Parle-en à ton club</strong> - Présente Athlink à tes coéquipiers
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
