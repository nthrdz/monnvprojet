"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link2, Trophy, Award, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiensContent } from "./liens-content"
import { CompetitionsContent } from "./competitions-content"
import { SponsorsContent } from "./sponsors-content"
import { useI18n } from "@/components/providers/i18n-provider"

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const tabContentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2
    }
  }
}

export default function SourcesPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'liens' | 'competitions' | 'sponsors'>('liens')
  const [isLoading, setIsLoading] = useState(true)

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  // Détection du hash URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash === '#liens' || window.location.pathname.includes('links')) {
        setActiveTab('liens')
      } else if (hash === '#competitions' || window.location.pathname.includes('races')) {
        setActiveTab('competitions')
      } else if (hash === '#sponsors' || window.location.pathname.includes('sponsors')) {
        setActiveTab('sponsors')
      }
    }
  }, [])

  const tabs = [
    {
      id: 'liens' as const,
      label: t('dashboard.sources.links'),
      icon: Link2,
      description: t('dashboard.sources.links') + ' - ' + (t('dashboard.sources.links') === 'Links' ? 'Manage your custom links' : 'Gérez vos liens personnalisés'),
      color: 'from-gray-800 to-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'competitions' as const,
      label: t('dashboard.sources.competitions'),
      icon: Trophy,
      description: t('dashboard.sources.competitions') + ' - ' + (t('dashboard.sources.competitions') === 'Competitions' ? 'Your race calendar' : 'Calendrier de vos courses'),
      color: 'from-gray-800 to-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 'sponsors' as const,
      label: t('dashboard.sources.sponsors'),
      icon: Award,
      description: t('dashboard.sources.sponsors') + ' - ' + (t('dashboard.sources.sponsors') === 'Sponsors' ? 'Partners and collaborations' : 'Partenaires et collaborations'),
      color: 'from-gray-800 to-gray-900',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full"
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header avec titre et stats - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-gradient-to-r from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Sources</h1>
          <p className="text-sm sm:text-base text-gray-600">Gérez vos liens, compétitions et partenaires</p>
        </div>
      </motion.div>

      {/* Onglets améliorés - Mobile optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="border-b border-gray-200 bg-gray-50/50">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    window.location.hash = tab.id
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={cn(
                    "relative flex-1 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all duration-300 group whitespace-nowrap",
                    isActive
                      ? "text-gray-900 bg-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  style={{ zIndex: isActive ? 10 : 1 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                    </motion.div>
                    <span>{tab.label}</span>
                  </div>
                  
                  {/* Indicateur actif */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-800 to-gray-900"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  
                  {/* Tooltip au hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none whitespace-nowrap"
                  >
                    {tab.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                  </motion.div>
                </motion.button>
              )
            })}
          </nav>
        </div>

        {/* Contenu des onglets avec animation */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              {activeTab === 'liens' && <LiensContent />}
              {activeTab === 'competitions' && <CompetitionsContent />}
              {activeTab === 'sponsors' && <SponsorsContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

