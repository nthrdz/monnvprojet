"use client"

import { useState } from "react"
import { Check, Zap, Crown, Sparkles, TrendingUp, Globe, BarChart3, Palette, Link as LinkIcon, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { PromoCodeField } from "@/components/ui-pro/promo-code-field"

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [promoCode, setPromoCode] = useState("")
  const [promoData, setPromoData] = useState<any>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)
  
  const handlePromoValidation = (isValid: boolean, data?: any) => {
    if (isValid && data) {
      setPromoData(data)
    } else {
      setPromoData(null)
    }
  }

  // Vérifier si le code promo s'applique à un plan donné
  const isPromoValidForPlan = (planName: string) => {
    if (!promoData?.valid) return false
    
    // Mapper les noms de plans interface vers Prisma
    const planMapping: Record<string, string> = {
      "Pro": "ATHLETE_PRO",
      "Elite": "COACH"
    }
    
    const prismaName = planMapping[planName]
    return promoData.plan === prismaName
  }

  const handleUpgrade = async (planName: string) => {
    if (planName === "Free") return // Ne rien faire pour le plan Free
    
    setIsUpgrading(true)
    
    try {
      // Mapper les noms de plans vers les valeurs Prisma
      // Note: ATHLETE_PRO = Elite dans l'interface, COACH = Pro dans l'interface
      const planMapping: Record<string, string> = {
        "Pro": "ATHLETE_PRO",  // Le plan Pro correspond à ATHLETE_PRO dans Prisma
        "Elite": "COACH"        // Le plan Elite correspond à COACH dans Prisma
      }
      
      const planValue = planMapping[planName]
      
      const response = await fetch("/api/upgrade-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: planValue,
          promoCode: promoData?.valid ? promoCode : null 
        })
      })

      if (response.ok) {
        alert(`✅ Plan ${planName} activé avec succès !${promoData?.valid ? ' 🎉 Code promo appliqué !' : ''}`)
        window.location.href = "/dashboard"
      } else {
        const error = await response.json()
        alert(`❌ Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error("Erreur lors de l'upgrade:", error)
      alert("❌ Une erreur est survenue")
    } finally {
      setIsUpgrading(false)
    }
  }

  const plans = [
    {
      name: "Free",
      price: 0,
      yearlyPrice: 0,
      description: "Parfait pour commencer",
      icon: LinkIcon,
      color: "gray",
      features: [
        "1 profil public",
        "1 lien",
        "1 compétition à venir",
        "0 sponsors",
        "Galerie 2 médias",
        "Thème basique",
        "Sous-domaine athlink.app",
      ],
      limitations: [
        "Analytics basiques uniquement",
        "Pas de domaine personnalisé",
        "Branding Athlink visible",
      ],
      cta: "Plan actuel",
      current: true,
    },
    {
      name: "Pro",
      price: 9.90,
      yearlyPrice: 99,
      popular: true,
      description: "Pour les athlètes sérieux",
      icon: Zap,
      color: "gray",
      features: [
        "Tout du plan Free",
        "Liens illimités",
        "Compétitions illimitées",
        "Sponsors illimités",
        "Galerie illimitée",
        "Analytics avancées (7 jours)",
        "Badge \"Pro\" sur le profil",
      ],
      cta: "Passer Pro",
      highlight: true,
    },
    {
      name: "Elite",
      price: 25.90,
      yearlyPrice: 259,
      description: "Pour les professionnels",
      icon: Crown,
      color: "gray",
      features: [
        "Tout du plan Pro",
        "Analytics illimitées",
        "Heatmap des clics",
        "Démographie visiteurs",
        "Export données (PDF)",
        "Service de coaching",
        "Personnalisation CSS",
        "Badge \"Elite\" sur le profil",
        "Support prioritaire",
      ],
      cta: "Passer Elite",
    },
  ]

  const savings = billingCycle === "yearly" ? "2 mois offerts" : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Offre de lancement - Prix réduits !
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent"
          >
            Choisis ton Plan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Débloque tout le potentiel de ton profil d&apos;athlète
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-4 bg-white border-2 border-gray-200 rounded-full p-2 shadow-lg"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gray-800 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full font-bold transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-gray-800 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Annuel
              {savings && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap font-bold">
                  {savings}
                </span>
              )}
            </button>
          </motion.div>
        </div>

        {/* Code Promo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">💎 Tu as un code promo ?</h3>
              <p className="text-sm text-gray-600">Saisis-le pour bénéficier d'avantages exclusifs</p>
            </div>
            <PromoCodeField 
              value={promoCode}
              onChange={setPromoCode}
              onValidation={handlePromoValidation}
            />
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className={`relative rounded-3xl p-8 ${
                plan.highlight
                  ? "bg-gradient-to-br from-gray-800 to-black text-white shadow-2xl scale-105 border-4 border-gray-600"
                  : "bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-800 to-black text-white px-4 py-1 rounded-full text-sm font-black shadow-lg">
                  ⭐ PLUS POPULAIRE
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${
                plan.highlight ? "bg-white/20" : "bg-gradient-to-br from-gray-100 to-gray-200"
              } flex items-center justify-center mb-6`}>
                <plan.icon className={`w-8 h-8 ${plan.highlight ? "text-white" : "text-gray-800"}`} />
              </div>

              {/* Plan Name */}
              <h3 className={`text-2xl font-black mb-2 ${
                plan.name === "Elite" 
                  ? "text-gray-900"
                  : plan.highlight ? "text-white" : "text-gray-900"
              }`}>
                {plan.name}
              </h3>

              <p className={`text-sm mb-6 ${
                plan.name === "Elite"
                  ? "text-gray-900"
                  : plan.highlight ? "text-white/90" : "text-gray-600"
              }`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                    Gratuit
                  </div>
                ) : (
                  <>
                    {/* Afficher réduction si code promo valide pour ce plan */}
                    {isPromoValidForPlan(plan.name) && promoData?.type === "plan_upgrade" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-bold text-green-600">Code promo appliqué !</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-3xl font-bold line-through opacity-50 ${
                            plan.name === "Elite"
                              ? "text-gray-600"
                              : plan.highlight ? "text-white/60" : "text-gray-600"
                          }`}>
                            {billingCycle === "monthly" ? plan.price.toFixed(2) : (plan.yearlyPrice / 12).toFixed(2)}€
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-5xl font-black ${
                            plan.name === "Elite"
                              ? "text-green-600"
                              : plan.highlight ? "text-white" : "text-green-600"
                          }`}>
                            GRATUIT
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-5xl font-black ${
                            plan.name === "Elite"
                              ? "text-gray-900"
                              : plan.highlight ? "text-white" : "text-gray-900"
                          }`}>
                            {billingCycle === "monthly" ? plan.price.toFixed(2) : (plan.yearlyPrice / 12).toFixed(2)}€
                          </span>
                          <span className={`text-lg ${
                            plan.name === "Elite"
                              ? "text-gray-900"
                              : plan.highlight ? "text-white/80" : "text-gray-600"
                          }`}>
                            /mois
                          </span>
                        </div>
                        {billingCycle === "yearly" && (
                          <div className={`text-sm mt-1 ${
                            plan.name === "Elite"
                              ? "text-gray-900"
                              : plan.highlight ? "text-white/80" : "text-gray-600"
                          }`}>
                            {plan.yearlyPrice}€ facturé annuellement
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(plan.name)}
                disabled={plan.current || isUpgrading}
                className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all ${
                  plan.current
                    ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                    : isPromoValidForPlan(plan.name) && promoData?.type === "plan_upgrade"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : plan.highlight
                    ? "bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gradient-to-r from-gray-800 to-black text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {isUpgrading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Activation...
                  </span>
                ) : isPromoValidForPlan(plan.name) && promoData?.type === "plan_upgrade" ? (
                  `🎉 Activer ${plan.name} GRATUIT`
                ) : (
                  plan.cta
                )}
              </button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.highlight ? "text-white" : "text-green-600"
                    }`} />
                    <span className={`text-sm ${
                      plan.name === "Elite"
                        ? "text-gray-900"
                        : plan.highlight ? "text-white/90" : "text-gray-700"
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, i) => (
                  <div key={i} className="flex items-start gap-3 opacity-60">
                    <span className="text-sm line-through">{limitation}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-3xl font-black text-center mb-8">Comparaison détaillée</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Fonctionnalité</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-600">Free</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-800">Pro</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900">Elite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { feature: "Profils publics", free: "1", pro: "1", elite: "1" },
                  { feature: "Liens", free: "1", pro: "Illimité", elite: "Illimité" },
                  { feature: "Compétitions", free: "1", pro: "Illimité", elite: "Illimité" },
                  { feature: "Sponsors", free: "0", pro: "Illimité", elite: "Illimité" },
                  { feature: "Galerie médias", free: "2", pro: "Illimité", elite: "Illimité" },
                  { feature: "Analytics", free: "Basiques", pro: "7 jours", elite: "Illimité" },
                  { feature: "Thèmes", free: "1", pro: "1", elite: "1" },
                  { feature: "Personnalisation CSS", free: "Non", pro: "Non", elite: "Oui" },
                  { feature: "Export données", free: "Non", pro: "Non", elite: "Oui" },
                  { feature: "Support", free: "Email", pro: "Email", elite: "Prioritaire" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                    <td className="py-4 px-4 text-center text-gray-800 font-semibold">{row.pro}</td>
                    <td className="py-4 px-4 text-center text-gray-900 font-semibold">{row.elite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-black text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Puis-je changer de plan à tout moment ?",
                a: "Oui ! Tu peux upgrader ou downgrader ton plan à tout moment. Les changements sont effectifs immédiatement.",
              },
              {
                q: "Que se passe-t-il si j'annule mon abonnement ?",
                a: "Tu conserves l'accès aux fonctionnalités premium jusqu'à la fin de ta période de facturation. Ensuite, ton compte repasse en plan Free.",
              },
              {
                q: "Les prix sont-ils TTC ?",
                a: "Oui, tous les prix affichés incluent la TVA française (20%).",
              },
              {
                q: "Puis-je obtenir un remboursement ?",
                a: "Oui, nous offrons une garantie satisfait ou remboursé de 14 jours sur tous les plans payants.",
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow group">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray-800 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

