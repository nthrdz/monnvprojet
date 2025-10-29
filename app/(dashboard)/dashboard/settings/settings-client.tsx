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
import { canUserAccessFeature, PLAN_FEATURES } from "@/lib/features"
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
  const [customDomain, setCustomDomain] = useState(initialCustomDomain)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Vérifier l'URL après le montage du composant
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname.includes('analytics') || window.location.hash === '#analytics') {
        setActiveTab('analytics')
      }
    }
  }, [])

  // Hook pour les notifications temps réel
  const realtimeNotifications = useRealtimeNotifications(userPlan)

  const canAccessCustomDomain = canUserAccessFeature(userPlan, "customDomain")
  const canAccessRealtimeNotifications = canUserAccessFeature(userPlan, "realtimeNotifications")

  // Vérifier les changements
  useEffect(() => {
    const hasChanged = 
      customDomain !== initialCustomDomain
    
    setHasChanges(hasChanged)
  }, [customDomain, initialCustomDomain])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customDomain: customDomain || null
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde')
      }

      // Réinitialiser les changements
      setHasChanges(false)
      
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
    setCustomDomain(initialCustomDomain)
    setNotifications({
      email: true,
      push: false
    })
    setHasChanges(false)
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

        {/* Domaine personnalisé */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Domaine personnalisé
              {!canAccessCustomDomain && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Elite uniquement
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canAccessCustomDomain ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="custom-domain">Votre domaine</Label>
                  <Input
                    id="custom-domain"
                    placeholder="monprofil.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Configurez votre domaine personnalisé pour un profil plus professionnel.
                  </p>
                  {customDomain !== initialCustomDomain && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Domaine modifié - Sauvegardez pour appliquer les changements
                    </p>
                  )}
                </div>
                {/* Configuration DNS */}
                <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-yellow-400 rounded-lg">
                  <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Configuration DNS requise
                  </h4>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-200">
                      Pour connecter votre domaine personnalisé, ajoutez cet enregistrement DNS chez votre hébergeur :
                    </p>
                    
                    <div className="bg-black/50 rounded-md p-3 border border-white/10">
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400 mb-1">Type</p>
                          <p className="font-mono text-yellow-300 font-semibold">CNAME</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Nom</p>
                          <p className="font-mono text-yellow-300 font-semibold">@</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Valeur</p>
                          <p className="font-mono text-yellow-300 font-semibold">athlink.app</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-300 space-y-1">
                      <p>• La propagation DNS peut prendre jusqu'à 24-48h</p>
                      <p>• Vérifiez que votre domaine n'a pas d'enregistrement A existant</p>
                      <p>• Si vous utilisez un sous-domaine (ex: profil.votredomaine.com), remplacez @ par le sous-domaine</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Domaine personnalisé
                </h3>
                <p className="text-yellow-700 mb-4">
                  Les domaines personnalisés sont disponibles uniquement avec le plan Elite.
                </p>
                <Button className="bg-yellow-600 hover:bg-yellow-700">
                  Upgrade vers Elite
                </Button>
              </div>
            )}
          </CardContent>
        </Card>


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
        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleSaveSettings} 
              className="w-full"
              disabled={!hasChanges || isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            
            <Button 
              onClick={handleResetSettings} 
              variant="outline" 
              className="w-full"
              disabled={!hasChanges || isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </CardContent>
        </Card>

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
                      {PLAN_FEATURES[userPlan].maxLinks === -1 ? "Illimité" : PLAN_FEATURES[userPlan].maxLinks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compétitions</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[userPlan].maxRaces === -1 ? "Illimité" : PLAN_FEATURES[userPlan].maxRaces}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sponsors</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[userPlan].maxSponsors === -1 ? "Illimité" : PLAN_FEATURES[userPlan].maxSponsors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Médias</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[userPlan].maxMedia === -1 ? "Illimité" : PLAN_FEATURES[userPlan].maxMedia}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Analytics</span>
                    <span className="font-semibold text-gray-900">
                      {PLAN_FEATURES[userPlan].analyticsDays === null ? "Illimité" : `${PLAN_FEATURES[userPlan].analyticsDays} jours`}
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
