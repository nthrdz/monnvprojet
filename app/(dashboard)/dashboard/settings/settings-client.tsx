"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { RealtimeNotifications, useRealtimeNotifications } from "@/components/ui-pro/realtime-notifications"
import { PromoBadge } from "@/components/ui-pro/promo-badge"
import { AnalyticsWithFilter } from "@/components/ui-pro/analytics-with-filter"
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield, 
  Save,
  RotateCcw,
  Zap,
  Crown,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"
import { canUserAccessFeature, PLAN_FEATURES, PlanType } from "@/lib/features"
import Link from "next/link"

interface SettingsClientProps {
  profileId: string
  username: string
  userPlan: "FREE" | "PRO" | "ELITE"
  initialCustomDomain: string
  promoCodeUsed?: string | null
  trialEndsAt?: string | null
}

export function SettingsClient({
  profileId,
  username,
  userPlan,
  initialCustomDomain,
  promoCodeUsed,
  trialEndsAt
}: SettingsClientProps) {
  // Initialiser avec 'general' par défaut pour éviter les erreurs d'hydratation
  const [activeTab, setActiveTab] = useState<'general' | 'analytics'>('general')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  })
  const [isLoading, setIsLoading] = useState(false)

  // Vérifier l'URL après le montage du composant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('analytics') || window.location.hash === '#analytics') {
        setActiveTab('analytics')
      }
    }
  }, [])

  // Map string plan to enum for feature checks
  const planEnum = userPlan as unknown as PlanType

  // Hook pour les notifications temps réel
  const realtimeNotifications = useRealtimeNotifications(userPlan)

  const canAccessRealtimeNotifications = canUserAccessFeature(planEnum, "realtimeNotifications")

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Sauvegarde des paramètres (notifications, etc.)
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }
      
      // Afficher un message de succès
      alert("Paramètres sauvegardés avec succès!")
      
    } catch (error) {
      console.error('Erreur:', error)
      alert("Erreur lors de la sauvegarde des paramètres")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      push: false
    })
  }

  const handleUpgradePlan = async (newPlan: "FREE" | "PRO" | "ELITE") => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/upgrade-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan })
      })

      if (!response.ok) throw new Error('Erreur lors de la mise à jour')

      alert(`✅ Plan mis à jour vers ${newPlan} ! Rechargez la page pour voir les changements.`)
      window.location.reload()
    } catch (error) {
      alert('❌ Erreur lors de la mise à jour du plan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('general')
              window.location.hash = ''
            }}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
              activeTab === 'general'
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <Settings className="w-4 h-4" />
            Paramètres Généraux
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics')
              window.location.hash = 'analytics'
            }}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
              activeTab === 'analytics'
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </nav>
      </div>

      {/* Contenu de l'onglet Général */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Paramètres généraux */}
          <div className="lg:col-span-2 space-y-6">

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Notifications email</Label>
                <p className="text-sm text-gray-600">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Notifications push</Label>
                <p className="text-sm text-gray-600">
                  Recevoir des notifications push dans le navigateur
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>

            {!canAccessRealtimeNotifications && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Notifications temps réel :</strong> Disponibles uniquement avec le plan Elite
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="space-y-6">
        {/* Badge Code Promo */}
        {promoCodeUsed && (
          <PromoBadge 
            promoCode={promoCodeUsed}
            trialEndsAt={trialEndsAt}
          />
        )}

        {/* Plan actuel */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Plan actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                {userPlan === "PRO" && <Zap className="w-6 h-6 text-yellow-600" />}
                {userPlan === "ELITE" && <Crown className="w-6 h-6 text-gray-800" />}
                <div className="text-3xl font-bold text-gray-900">
                  {userPlan === "FREE" && "Gratuit"}
                  {userPlan === "PRO" && "Pro"}
                  {userPlan === "ELITE" && "Elite"}
                </div>
              </div>
              
              {/* Limites du plan */}
              <div className="mt-4 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                <div className="text-xs font-semibold text-gray-700 uppercase mb-2">Vos limites</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liens</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[planEnum].maxLinks === -1 ? "Illimité" : PLAN_FEATURES[planEnum].maxLinks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compétitions</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[planEnum].maxRaces === -1 ? "Illimité" : PLAN_FEATURES[planEnum].maxRaces}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sponsors</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[planEnum].maxSponsors === -1 ? "Illimité" : PLAN_FEATURES[planEnum].maxSponsors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Médias</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[planEnum].maxMedia === -1 ? "Illimité" : PLAN_FEATURES[planEnum].maxMedia}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analytics</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[planEnum].analyticsDays === null ? "Illimité" : `${PLAN_FEATURES[planEnum].analyticsDays} jours`}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Boutons d'upgrade */}
              {userPlan === "FREE" && (
                <div className="space-y-3 mt-4">
                  <p className="text-sm text-gray-600">
                    Débloquez plus de fonctionnalités
                  </p>
                  <Link href="/dashboard/upgrade">
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Voir les plans
                    </Button>
                  </Link>
                </div>
              )}

              {userPlan === "PRO" && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge className="bg-yellow-600 text-white">
                      <Zap className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Passez Elite pour encore plus
                  </p>
                  <Link href="/dashboard/upgrade">
                    <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade vers Elite
                    </Button>
                  </Link>
                </div>
              )}

              {userPlan === "ELITE" && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge className="bg-gray-800 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Elite
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Vous avez accès à toutes les fonctionnalités premium !
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    Merci pour votre soutien
                  </div>
                </div>
              )}

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
      )}

      {/* Contenu de l'onglet Analytics */}
      {activeTab === 'analytics' && (
        <div>
          <AnalyticsWithFilter
            userPlan={userPlan}
            username={username}
          />
        </div>
      )}
    </div>
  )
}
