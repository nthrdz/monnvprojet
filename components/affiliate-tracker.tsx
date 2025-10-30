"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function AffiliateTrackerContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const referralCode = searchParams.get('ref')
    
    if (referralCode) {
      // Stocker le code de parrainage dans le localStorage
      localStorage.setItem('referralCode', referralCode)
      
      // Envoyer les données de tracking au serveur
      trackReferral(referralCode)
      
      // Créer un referral en attente
      createPendingReferral(referralCode)
    }
  }, [searchParams])

  const trackReferral = async (affiliateCode: string) => {
    try {
      const trackingData = {
        affiliateCode,
        referrerUrl: document.referrer,
        landingPage: window.location.href,
        utmSource: searchParams.get('utm_source'),
        utmMedium: searchParams.get('utm_medium'),
        utmCampaign: searchParams.get('utm_campaign')
      }

      await fetch('/api/affiliate/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      })
    } catch (error) {
      console.error('Erreur tracking parrainage:', error)
    }
  }

  const createPendingReferral = async (referralCode: string) => {
    try {
      await fetch('/api/affiliate/create-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode,
          referrerUrl: document.referrer,
          utmSource: searchParams.get('utm_source'),
          utmMedium: searchParams.get('utm_medium'),
          utmCampaign: searchParams.get('utm_campaign')
        })
      })
    } catch (error) {
      console.error('Erreur création referral:', error)
    }
  }

  return null // Ce composant ne rend rien, il fait juste du tracking
}

export function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerContent />
    </Suspense>
  )
}
