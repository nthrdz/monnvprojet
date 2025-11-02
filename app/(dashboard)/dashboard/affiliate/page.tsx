"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Users, Link as LinkIcon, TrendingUp, DollarSign, Copy, CheckCircle, ExternalLink, Lock } from "lucide-react"
import Link from "next/link"

export default function AffiliatePage() {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const [affiliateLink, setAffiliateLink] = useState("")
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier le plan de l'utilisateur
    if (session?.user) {
      // @ts-ignore
      const plan = session.user.plan
      setUserPlan(plan)
      setIsLoading(false)

      // Générer le lien d'affilié basé sur le username
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

  // Si le plan n'est pas PRO ou ELITE, afficher un message de restriction
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (userPlan !== 'PRO' && userPlan !== 'ELITE') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-gray-600" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Programme Ambassadeur réservé aux plans PRO et ELITE
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Le programme ambassadeur avec <strong>40% de commission récurrente</strong> est exclusivement disponible pour les membres PRO et ELITE.
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-gray-800 font-semibold mb-4">
              🎉 Deviens ambassadeur et gagne jusqu'à <span className="text-blue-700 font-black">10,36€/mois</span> par parrainage ELITE !
            </p>
            <ul className="text-left text-gray-700 space-y-2 max-w-md mx-auto">
              <li>• <strong>40%</strong> de commission récurrente</li>
              <li>• Paiements automatiques chaque mois</li>
              <li>• Dashboard Rewardful complet</li>
              <li>• Support prioritaire</li>
            </ul>
          </div>

          <Link
            href="/dashboard/upgrade"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Passer PRO ou ELITE
            <TrendingUp className="w-5 h-5" />
          </Link>

          <div className="mt-6">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">
              ← Retour au dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
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

        {/* Info Box - Commission Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-8 mb-8 shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-black text-gray-900 mb-3 flex items-center gap-2">
                🎉 Gagne 40% de commission récurrente !
              </h3>
              <p className="text-gray-800 leading-relaxed text-lg mb-4">
                Pour chaque athlète qui s'inscrit via ton lien et passe Pro ou Elite, tu gagnes <span className="font-bold text-blue-700">40% de commission chaque mois</span> tant qu'il reste abonné.
              </p>
              <div className="space-y-2 text-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">•</span>
                  <span>Plan Pro (9,90€/mois) = <strong className="text-blue-700">3,96€/mois</strong> de commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">•</span>
                  <span>Plan Elite (25,90€/mois) = <strong className="text-blue-700">10,36€/mois</strong> de commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">•</span>
                  <span><strong>Paiements automatiques</strong> chaque mois</span>
                </div>
              </div>
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
                Inscris-toi sur Rewardful pour suivre tes statistiques en temps réel, gérer tes paiements et accéder à ton dashboard affilié complet.
              </p>
              <a
                href="https://nathan-rodriguez.getrewardful.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                S'inscrire comme affilié
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-white/60 text-sm mt-3">
                💡 Déjà inscrit ? <a href="https://app.getrewardful.com/login" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Connecte-toi ici</a>
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
