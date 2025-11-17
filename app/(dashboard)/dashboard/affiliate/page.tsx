"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { 
  Link as LinkIcon, 
  TrendingUp, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Lock, 
  Loader2,
  UserPlus,
  LogIn,
  BarChart3,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AffiliatePage() {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const [affiliateLink, setAffiliateLink] = useState("")
  const [userPlan, setUserPlan] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (session?.user) {
      // @ts-ignore
      const plan = session.user.plan
      setUserPlan(plan)
      setIsLoading(false)

      // 🎯 Redirection automatique vers le programme d'affiliation Athlink
      if (plan === 'PRO' || plan === 'ELITE') {
        // Afficher le message de redirection
        setIsRedirecting(true)
        // Rediriger automatiquement vers le programme d'affiliation (page de connexion)
        setTimeout(() => {
          window.location.href = 'https://athlink.firstpromoter.com/login'
        }, 500) // Petit délai pour afficher le message
        return
      }

      // Générer le lien d'affilié FirstPromoter basé sur le username (pour affichage si pas de redirection)
      // @ts-ignore
      const username = session.user.username || session.user.email?.split('@')[0]
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://athlink.fr'
      setAffiliateLink(`${baseUrl}/?fpr=${username}`)
    }
  }, [session])

  const copyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      toast.success("Lien copié !")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Si le plan n'est pas PRO ou ELITE, afficher un message de restriction
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {isRedirecting ? 'Redirection vers le programme d\'affiliation...' : 'Chargement...'}
          </p>
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
              <li>• Dashboard FirstPromoter complet</li>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
                Programme Ambassadeur
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Gagne des commissions en parrainant de nouveaux athlètes sur Athlink
              </p>
            </div>
          </div>
        </motion.div>

        {/* Commission Info Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-300 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">
                🎉 Gagne 40% de commission récurrente !
              </h3>
              <p className="text-gray-800 leading-relaxed text-base sm:text-lg mb-4">
                Pour chaque athlète qui s'inscrit via ton lien et passe <strong>Pro ou Elite</strong>, tu gagnes <span className="font-bold text-blue-700">40% de commission chaque mois</span> tant qu'il reste abonné.
              </p>
              <div className="space-y-2 text-gray-800">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Plan Pro (9,90€/mois) = <strong className="text-blue-700">3,96€/mois</strong> de commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Plan Elite (25,90€/mois) = <strong className="text-blue-700">10,36€/mois</strong> de commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>Paiements automatiques</strong> chaque mois via FirstPromoter</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Affiliate Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="w-6 h-6 text-gray-800" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ton lien d'ambassadeur</h2>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-gray-200">
            <code className="text-xs sm:text-sm text-gray-700 flex-1 overflow-x-auto break-all">
              {affiliateLink || "https://athlink.fr/?fpr=ton_code"}
            </code>
            <button
              onClick={copyLink}
              className="px-4 py-2 sm:py-2.5 bg-gray-800 hover:bg-black text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all flex-shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copier</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-3">
            📱 Partage ce lien sur tes réseaux sociaux, dans tes stories, ou directement à tes amis athlètes !
          </p>
        </motion.div>

        {/* FirstPromoter Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Devenir Ambassadeur Athlink
              </h3>
              <p className="text-white/80 text-sm sm:text-base mb-6">
                Pour commencer à gagner des commissions, crée ton compte affiliateur sur le programme d'affiliation Athlink et connecte-toi à ton dashboard.
              </p>
            </div>
          </div>

          {/* Étape 1: Créer un compte */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 p-4 sm:p-5 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 shadow-lg">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1">Créer mon compte affiliateur</h4>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Inscris-toi au programme d'affiliation Athlink pour commencer à gagner des commissions.
                  </p>
                </div>
              </div>
              <a
                href="https://athlink.firstpromoter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex-shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Créer mon compte</span>
                <span className="sm:hidden">Créer</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Étape 2: Se connecter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4 p-4 sm:p-5 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 shadow-lg">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1">Se connecter au programme</h4>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Une fois ton compte créé, connecte-toi au programme d'affiliation Athlink pour accéder à ton dashboard.
                  </p>
                </div>
              </div>
              <a
                href="https://athlink.firstpromoter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex-shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Se connecter au programme</span>
                <span className="sm:hidden">Connexion</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Étape 3: Accéder au dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="p-4 sm:p-5 bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0 shadow-lg">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg mb-1">Accéder à mon dashboard</h4>
                  <p className="text-white/70 text-xs sm:text-sm">
                    Suis tes statistiques en temps réel, vois tes commissions et gère tes paiements.
                  </p>
                </div>
              </div>
              <a
                href="https://athlink.firstpromoter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex-shrink-0"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Mon dashboard</span>
                <span className="sm:hidden">Dashboard</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/70 text-xs sm:text-sm flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Le tracking est automatique</strong> via le programme d'affiliation Athlink. Tes commissions sont calculées automatiquement pour chaque vente via ton lien d'affiliation. L'intégration Stripe gère tout en arrière-plan.
              </span>
            </p>
          </div>
        </motion.div>

        {/* Stats Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Statistiques complètes sur le programme d'affiliation
            </h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base mb-6">
            Parrainages, conversions, commissions, et paiements : tout est géré automatiquement via l'intégration Stripe dans ton dashboard du programme d'affiliation Athlink.
          </p>
          <a
            href="https://athlink.firstpromoter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            <BarChart3 className="w-5 h-5" />
            Voir mes statistiques
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Conseils pour maximiser tes gains
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📱</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Réseaux sociaux</h4>
                <p className="text-sm text-gray-600">Partage sur Instagram, TikTok, YouTube avec ton lien d'affiliation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✍️</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Contenu écrit</h4>
                <p className="text-sm text-gray-600">Écris un article sur ton blog ou Medium sur ton expérience Athlink</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎥</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Vidéos</h4>
                <p className="text-sm text-gray-600">Crée des tutoriels, reviews, ou vidéos avant/après avec ton lien</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Communauté</h4>
                <p className="text-sm text-gray-600">Présente Athlink à ton club, tes coéquipiers et ta communauté</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
