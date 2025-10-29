"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export function AffiliateTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const referralCode = searchParams.get('ref')
    
    if (referralCode) {
      // Stocker le code de parrainage dans le localStorage
      localStorage.setItem('referralCode', referralCode)
      
      // Envoyer les données de tracking au serveur
      trackReferral(referralCode)
    }
  }, [searchParams])

  const trackReferral = async (affiliateCode: string) => {
    try {
      const trackingData = {
        affiliateCode,
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
        referrerUrl: document.referrer,
        utmSource: searchParams.get('utm_source'),
        utmMedium: searchParams.get('utm_medium'),
        utmCampaign: searchParams.get('utm_campaign')
      }

      await fetch('/api/affiliate/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingData)
      })
    } catch (error) {
      console.error('Erreur tracking parrainage:', error)
    }
  }

  const getClientIP = async (): Promise<string | undefined> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Erreur récupération IP:', error)
      return undefined
    }
  }

  return null // Ce composant ne rend rien, il fait juste du tracking
}
