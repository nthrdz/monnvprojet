"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Target, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Gift,
  TrendingUp,
  Shield,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassSectionHeader } from "@/components/ui-pro/glass-section-header"

export default function ApplyAffiliatePage() {
  const [formData, setFormData] = useState({
    bankAccount: '',
    paypalEmail: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        const error = await response.json()
        alert(error.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la soumission')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Demande soumise avec succès !
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Votre demande d'affiliation a été soumise et sera examinée par notre équipe. 
              Vous recevrez un email de confirmation dans les 24-48h.
            </p>
            <Button 
              onClick={() => window.location.href = '/dashboard/affiliate'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Voir mon dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <GlassSectionHeader
            title="Devenir Ambassadeur"
            iconName="zap"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-6">Avantages</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Commissions attractives</p>
                    <p className="text-sm text-gray-400">Jusqu'à 10% sur chaque conversion</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Parrainage illimité</p>
                    <p className="text-sm text-gray-400">Pas de limite sur le nombre de parrainages</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Gift className="w-5 h-5 text-purple-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Bonus de bienvenue</p>
                    <p className="text-sm text-gray-400">50€ offerts pour vos 5 premières conversions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Suivi en temps réel</p>
                    <p className="text-sm text-gray-400">Dashboard complet avec analytics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Paiements sécurisés</p>
                    <p className="text-sm text-gray-400">Virements bancaires ou PayPal</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Comment ça marche ?</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <p className="text-gray-300">Soumettez votre candidature</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <p className="text-gray-300">Recevez votre code de parrainage</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <p className="text-gray-300">Partagez vos liens de parrainage</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <p className="text-gray-300">Gagnez des commissions</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Formulaire de candidature</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="bankAccount" className="text-white mb-2 block">
                    Compte bancaire (optionnel)
                  </Label>
                  <Input
                    id="bankAccount"
                    name="bankAccount"
                    type="text"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    placeholder="IBAN ou numéro de compte"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Pour recevoir vos paiements par virement bancaire
                  </p>
                </div>

                <div>
                  <Label htmlFor="paypalEmail" className="text-white mb-2 block">
                    Email PayPal (optionnel)
                  </Label>
                  <Input
                    id="paypalEmail"
                    name="paypalEmail"
                    type="email"
                    value={formData.paypalEmail}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Alternative au virement bancaire
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white mb-2 block">
                    Informations supplémentaires (optionnel)
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Parlez-nous de votre audience, de votre expérience..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Aidez-nous à mieux vous connaître
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-blue-300 font-medium mb-1">Important</p>
                      <p className="text-sm text-blue-200">
                        Votre candidature sera examinée par notre équipe. 
                        Vous recevrez une réponse dans les 24-48h par email.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {loading ? 'Soumission...' : 'Soumettre ma candidature'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
