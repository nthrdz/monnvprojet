'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassSectionHeader } from '@/components/ui-pro/glass-section-header'
import { Sparkles, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AffiliateApply() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reason: '',
    expectations: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la candidature')
      }

      toast.success('Candidature envoyée avec succès !')
      router.push('/dashboard/affiliate')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur-sm">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Candidature Ambassadeur
            </h1>
            <p className="text-gray-600">
              Rejoignez notre programme et gagnez 40% de commission
            </p>
          </div>

          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">40%</div>
              <div className="text-sm text-gray-600">Commission</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">3,99€</div>
              <div className="text-sm text-gray-600">Par PRO (1,60€)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">7,99€</div>
              <div className="text-sm text-gray-600">Par ELITE (3,20€)</div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="reason" className="text-gray-900 font-semibold mb-2 block">
                Pourquoi voulez-vous devenir ambassadeur Athlink ? *
              </Label>
              <textarea
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Parlez-nous de votre motivation, votre audience, vos réseaux sociaux..."
              />
            </div>

            <div>
              <Label htmlFor="expectations" className="text-gray-900 font-semibold mb-2 block">
                Quelles sont vos attentes concernant ce partenariat ? *
              </Label>
              <textarea
                id="expectations"
                required
                value={formData.expectations}
                onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Comment comptez-vous promouvoir Athlink ? Quels sont vos objectifs ?"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Ce que vous recevrez
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Un code de parrainage unique</li>
                <li>✅ Des liens d'affiliation trackés</li>
                <li>✅ Dashboard en temps réel (clics, conversions, gains)</li>
                <li>✅ 40% de commission sur chaque vente</li>
                <li>✅ Paiements automatiques via Stripe Connect</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer ma candidature
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Votre candidature sera examinée par notre équipe. Vous recevrez une réponse par email sous 48h.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
