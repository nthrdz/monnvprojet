"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar, 
  Target,
  ArrowRight,
  Zap,
  Check,
  Crown,
  Link as LinkIcon
} from "lucide-react"
import { AffiliateTracker } from "@/components/affiliate-tracker"
import { useI18n } from "@/components/providers/i18n-provider"

export default function Home() {
  const { t } = useI18n()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [currentImage, setCurrentImage] = useState(0)
  const images = ["/uploads/hero/noa.png", "/uploads/hero/nathan.png"]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <>
      <AffiliateTracker />
      <main className="min-h-screen">
      {/* Hero Section - Full viewport with Enhanced Decorations */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">

        {/* Content */}
        <div className="container relative mx-auto px-4 sm:px-6 z-10 flex flex-col justify-center min-h-[90vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left">
            {/* Remove big ATHLINK from hero */}

            {/* Title with stagger animation - Mobile Optimized */}
            <motion.h2 
              className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              key={t('home.heroTitle')}
            >
              {t('home.heroTitle')}
            </motion.h2>

            {/* Subtitle - Mobile Optimized */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 md:mb-16 max-w-3xl leading-relaxed px-4 sm:px-6"
              key={t('home.heroSubtitle')}
            >
              {t('home.heroSubtitle')}
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="px-4 sm:px-0 -mt-8 ml-8"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 active:scale-95 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg shadow-lg transition-all touch-manipulation"
                key={t('home.cta')}
              >
                <Zap className="w-5 h-5" />
                {t('home.cta')}
              </Link>
            </motion.div>
            </div>

            {/* Right showcase - Maintenant visible sur mobile aussi */}
            <div className="w-full mt-8 lg:mt-0">
              <div className="w-full max-w-[600px] lg:max-w-[1200px] h-[300px] sm:h-[400px] lg:h-[600px] mx-auto">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl lg:shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200"
                >
                  <div className="absolute inset-0 backdrop-blur-lg bg-white/30"></div>
                  <Image
                    src={images[currentImage]}
                    alt={currentImage === 0 ? "Noa" : "Nathan"}
                    fill
                    className="object-contain relative z-10 rounded-2xl lg:rounded-3xl p-2 lg:p-0"
                    priority
                    unoptimized
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual handled above */}

        {/* Scroll indicator removed */}
      </section>

      {/* Features Section - Apple Style with Enhanced Decorations */}
      <section id="features" className="py-12 sm:py-20 md:py-32 lg:py-40 bg-white relative overflow-hidden">
        {/* Background Elements - Enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main background blurs */}
        <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.05, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          />
            <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gray-900 rounded-full blur-3xl"
          />
          
          {/* Geometric shapes supprimées */}
          
          {/* Gradient orbs */}
          <motion.div
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/3 w-72 h-72 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl"
          />
          
          {/* Animations supprimées */}
          
          {/* Connecting lines effect */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <motion.line
              x1="10%"
              y1="20%"
              x2="90%"
              y2="80%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-900"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.line
              x1="90%"
              y1="20%"
              x2="10%"
              y2="80%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-gray-900"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />
          </svg>
          </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header with Apple-style typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 max-w-4xl mx-auto px-4"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight"
              >
                Tout ce dont un athlète a besoin
              </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed"
            >
              Conçu spécifiquement pour les sportifs, avec des fonctionnalités uniques
            </motion.p>
          </motion.div>

            {/* Features Grid with Apple-style cards - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-0">
            {[
              {
                icon: Activity,
                title: "Stats & Performance",
                description: "Synchronise Strava, affiche tes records, graphiques de progression en temps réel",
                delay: 0.1
              },
              {
                icon: Calendar,
                title: "Calendrier Courses",
                description: "Countdown jusqu'à ta prochaine course, résultats automatiques, historique complet",
                delay: 0.2
              },
              {
                icon: Users,
                title: "Sponsors & Partenaires",
                description: "Section dédiée avec tracking des clics, analytics pour tes sponsors",
                delay: 0.3
              },
              {
                icon: Award,
                title: "Galerie Média",
                description: "Photos, vidéos, highlights de tes meilleures performances en action",
                delay: 0.4
              },
              {
                icon: Target,
                title: "Services Coaching",
                description: "Vends tes plans d'entraînement, gère tes bookings, développe ton business",
                delay: 0.5
              },
              {
                icon: TrendingUp,
                title: "Analytics Pro",
                description: "Vois qui visite ton profil, quels liens performent, optimise ta stratégie",
                delay: 0.6
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group"
              >
                   <div className="relative h-full p-6 sm:p-8 lg:p-10 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-100/50 hover:border-gray-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-900/5">
                  {/* Subtle background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
                    }}
                  />
                  
                  {/* Icon with Apple-style animation */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.4 }
                    }}
                    className="relative z-10 inline-flex p-4 rounded-2xl bg-gray-900 mb-6 shadow-lg"
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                     {/* Title with Apple typography - Mobile Optimized */}
                     <h3 className="relative z-10 text-xl sm:text-2xl font-medium text-gray-900 mb-3 sm:mb-4 group-hover:text-gray-700 transition-colors duration-300 tracking-tight">
                    {feature.title}
                  </h3>

                     {/* Description with refined spacing - Mobile Optimized */}
                     <p className="relative z-10 text-gray-600 leading-relaxed text-base sm:text-lg font-light">
                    {feature.description}
                  </p>

                  {/* Subtle animated accent line */}
                  <motion.div
                    className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: feature.delay + 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA with Apple-style button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-20"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
            <Link
              href="/signup"
                className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap className="w-5 h-5" />
              Créer mon profil gratuitement
                <ArrowRight className="w-4 h-4" />
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Decorative Sport Divider - Simplifié */}
      <div className="relative h-8 bg-gradient-to-b from-white via-gray-50 to-gray-50">
      </div>

      {/* Analytics & Performance Section - Apple Style with Sport Animations */}
      <section className="py-20 sm:py-32 lg:py-40 bg-gray-50 relative overflow-hidden">
        {/* Background Elements with Sport Theme */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/3 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.01, 0.03, 0.01],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gray-900 rounded-full blur-3xl"
          />
          
          {/* Animations supprimées */}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Apple-style typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-24 max-w-4xl mx-auto"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight"
              >
                Programme Ambassadeur
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed"
              >
                Gagne des commissions récurrentes en parrainant de nouveaux athlètes sur Athlink
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Analytics Screenshot */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="order-2 lg:order-1"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/uploads/hero/ambassadeur 1.png"
                    alt="Programme Ambassadeur - Gagne 40% de commission récurrente"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    unoptimized
                  />
                </motion.div>
              </motion.div>

              {/* Analytics Description with Apple typography */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="order-1 lg:order-2"
              >
                <div className="lg:pl-8 px-4 sm:px-0">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight"
                  >
                    Gagne 40% de commission
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="text-xl text-gray-600 font-light leading-relaxed mb-8"
                  >
                    Deviens ambassadeur Athlink et gagne des <span className="font-medium text-gray-900">commissions récurrentes</span> chaque mois.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6"
                  >
                    {[
                      { title: "40% de commission", desc: "Pour chaque athlète qui s'inscrit via ton lien et passe Pro ou Elite" },
                      { title: "Revenus récurrents", desc: "Gagne des commissions chaque mois tant qu'ils restent abonnés" },
                      { title: "Plan Pro : 3,96€/mois", desc: "Pour un abonnement à 9,90€/mois" },
                      { title: "Plan Elite : 10,36€/mois", desc: "Pour un abonnement à 25,90€/mois" }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-gray-900 mb-1">{feature.title}</div>
                          <div className="text-gray-600 font-light">{feature.desc}</div>
                  </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Management Section - Apple Style with Sport Brands */}
      <section className="py-20 sm:py-32 lg:py-40 bg-white relative overflow-hidden">
        {/* Background Elements with Brand Theme */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.01, 0.03, 0.01],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gray-900 rounded-full blur-3xl"
          />
          
          {/* Animations supprimées */}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header with Apple-style typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-24 max-w-4xl mx-auto"
            >
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight"
              >
                Exemple de profil Athlink
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed"
              >
                Découvre à quoi ressemble un profil complet avec liens, événements et informations
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Sponsors Description with Apple typography */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="order-1 lg:order-1"
              >
                <div className="lg:pr-8 px-4 sm:px-0">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight"
                  >
                    Un profil professionnel
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-gray-600 font-light leading-relaxed mb-8"
                  >
                    Crée ton <span className="font-medium text-gray-900">link-in-bio personnalisé</span> pour partager tes liens, événements et sponsors en un seul endroit.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                  >
                    {[
                      { title: "Liens personnalisés", desc: "Partage tous tes liens importants en un seul endroit" },
                      { title: "Événements à venir", desc: "Affiche tes prochaines compétitions avec countdown" },
                      { title: "Sponsors et partenaires", desc: "Mets en avant tes sponsors avec logos et codes promo" },
                      { title: "Design personnalisable", desc: "Choisis ton thème et personnalise ton profil" }
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0"></div>
                        <div>
                          <div className="font-medium text-gray-900 mb-1">{feature.title}</div>
                          <div className="text-gray-600 font-light">{feature.desc}</div>
                  </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Sponsors Screenshot */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="order-2 lg:order-2"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <Image
                    src="/uploads/hero/exemple profil athlink.png"
                    alt="Exemple de profil Athlink - Liens, événements et sponsors"
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    unoptimized
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Apple Style with Enhanced Decorations */}
      <section id="pricing" className="py-20 sm:py-32 lg:py-40 bg-gray-50 relative overflow-hidden">
        {/* Background Elements - Enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main blur effects */}
            <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/3 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.01, 0.03, 0.01],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gray-900 rounded-full blur-3xl"
          />
          
          {/* Formes décoratives supprimées */}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header with Apple-style typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-24 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              Offre de lancement - Prix réduits !
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight"
            >
              Choisis ton plan
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed mb-12"
            >
              Débloque tout le potentiel de ton profil d&apos;athlète
            </motion.p>

            {/* Billing Toggle with Apple style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-lg"
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-full font-medium transition-all text-sm ${
                  billingCycle === "monthly"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-full font-medium transition-all relative text-sm ${
                  billingCycle === "yearly"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Annuel
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium">
                  2 mois offerts
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* Plans Grid with Apple Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-16 px-4">
            {[
              {
                name: "Free",
                price: 0,
                description: "Parfait pour commencer",
                icon: LinkIcon,
                features: [
                  "1 profil public",
                  "1 lien",
                  "1 compétition à venir",
                  "0 sponsors",
                  "Galerie 2 médias",
                  "Thème basique",
                  "Sous-domaine athlink.app",
                ],
                cta: "Commencer gratuitement",
                highlight: false,
              },
              {
                name: "Pro",
                price: 9.90,
                yearlyPrice: 99,
                description: "Pour les athlètes sérieux",
                icon: Zap,
                features: [
                  "Tout du plan Free",
                  "Liens illimités",
                  "Compétitions illimitées",
                  "Sponsors illimités",
                  "Galerie illimitée",
                  "Analytics avancées (7 jours)",
                  "Programme Ambassadeur (40% commission)",
                ],
                cta: "Passer Pro",
                highlight: true,
                popular: true,
              },
              {
                name: "Elite",
                price: 25.90,
                yearlyPrice: 259,
                description: "Pour les professionnels",
                icon: Crown,
                features: [
                  "Tout du plan Pro",
                  "Analytics illimitées",
                  "Heatmap des clics",
                  "Démographie visiteurs",
                  "Export données (PDF)",
                  "Service de coaching",
                  "Programme Ambassadeur (40% commission)",
                  "Support prioritaire",
                ],
                cta: "Passer Elite",
                highlight: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: 0.5 + index * 0.1, 
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={`relative group ${
                  plan.highlight
                    ? "scale-105"
                    : ""
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-10"
                  >
 Plus populaire
                  </motion.div>
                )}

                {/* Card */}
                <div className={`relative h-full p-8 lg:p-10 rounded-3xl border transition-all duration-500 ${
                  plan.highlight
                    ? "bg-gray-900 text-white border-gray-700 shadow-2xl shadow-gray-900/20"
                    : "bg-white/80 backdrop-blur-sm border-gray-100/50 hover:border-gray-200/50 hover:shadow-2xl hover:shadow-gray-900/5"
                }`}>
                  {/* Subtle background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      plan.highlight 
                        ? "bg-gradient-to-br from-white/5 to-white/10" 
                        : "bg-gradient-to-br from-gray-50/50 to-gray-100/30"
                    }`}
                  />

                  {/* Icon with Apple-style animation */}
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.4 }
                    }}
                    className={`relative z-10 inline-flex p-4 rounded-2xl mb-6 shadow-lg ${
                      plan.highlight ? "bg-white/20" : "bg-gray-900"
                    }`}
                  >
                    <plan.icon className={`w-6 h-6 ${plan.highlight ? "text-white" : "text-white"}`} />
                  </motion.div>

                  {/* Plan Name with Apple typography */}
                  <h3 className={`relative z-10 text-2xl font-medium mb-4 tracking-tight ${
                    plan.highlight ? "text-white" : "text-gray-900"
                  }`}>
                  {plan.name}
                </h3>

                  <p className={`relative z-10 text-lg font-light leading-relaxed mb-6 ${
                    plan.highlight ? "text-white/80" : "text-gray-600"
                  }`}>
                  {plan.description}
                </p>

                {/* Price */}
                  <div className="relative z-10 mb-8">
                  {plan.price === 0 ? (
                      <div className={`text-4xl font-light tracking-tight ${
                        plan.highlight ? "text-white" : "text-gray-900"
                      }`}>
                      Gratuit
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                          <span className={`text-4xl font-light tracking-tight ${
                            plan.highlight ? "text-white" : "text-gray-900"
                          }`}>
                          {billingCycle === "monthly" ? plan.price.toFixed(2) : ((plan.yearlyPrice || 0) / 12).toFixed(2)}€
                        </span>
                          <span className={`text-lg font-light ${
                            plan.highlight ? "text-white/70" : "text-gray-600"
                          }`}>
                          /mois
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                          <div className={`text-sm mt-1 font-light ${
                            plan.highlight ? "text-white/70" : "text-gray-600"
                          }`}>
                          {plan.yearlyPrice}€ facturé annuellement
                        </div>
                      )}
                    </>
                  )}
                </div>

                  {/* Features */}
                  <div className="relative z-10 space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + index * 0.1 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          plan.highlight ? "bg-white/60" : "bg-gray-900"
                        }`}></div>
                        <span className={`text-sm font-light ${
                          plan.highlight ? "text-white/80" : "text-gray-600"
                        }`}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button with Apple style */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                <Link
                  href="/signup"
                      className={`w-full block py-4 rounded-full font-medium text-lg transition-all duration-300 text-center ${
                    plan.highlight
                          ? "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                          : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {plan.cta}
                </Link>
                  </motion.div>

                  {/* Subtle animated accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-8 right-8 h-px ${
                      plan.highlight 
                        ? "bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        : "bg-gradient-to-r from-transparent via-gray-300 to-transparent"
                    }`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Proof with Apple Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="text-3xl sm:text-4xl font-light text-gray-900 mb-6 tracking-tight"
            >
              Utilisé par les meilleurs
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-xl text-gray-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Rejoins des milliers d&apos;athlètes qui utilisent Athlink pour partager leur passion
            </motion.p>
            
            {/* Emojis sportifs supprimés */}
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Apple Style with Victory Theme */}
      <section className="py-20 sm:py-32 lg:py-40 bg-white relative overflow-hidden">
        {/* Background Elements with Victory Theme */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gray-900 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.01, 0.03, 0.01],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gray-900 rounded-full blur-3xl"
          />
          
          {/* Animations supprimées */}
          
          {/* Confetti effect supprimé */}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 tracking-tight"
            >
              Prêt à booster ta présence en ligne
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Rejoins nos athlètes qui utilisent Athlink pour partager leur passion
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
            <Link
              href="/signup"
                className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <Zap className="w-5 h-5" />
              Commencer maintenant - C&apos;est gratuit
                <ArrowRight className="w-4 h-4" />
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Footer - Apple Style */}
      <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Logo */}
            <div>
              <div className="mb-6">
                <span className="font-black text-3xl tracking-tight">Athlink</span>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Le profil digital conçu pour les athlètes
              </p>
            </div>

            {/* Links columns */}
            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Produit</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors duration-300 font-light">Fonctionnalités</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors duration-300 font-light">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300 font-light">Exemples</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Entreprise</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors duration-300 font-light">À propos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300 font-light">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors duration-300 font-light">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-6 text-white">Légal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors duration-300 font-light">Mentions légales</Link></li>
                <li><Link href="/cgv" className="hover:text-white transition-colors duration-300 font-light">CGV</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition-colors duration-300 font-light">Confidentialité</Link></li>
                <li><Link href="/conditions" className="hover:text-white transition-colors duration-300 font-light">Conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p className="font-light">&copy; 2025 Athlink. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  )
}