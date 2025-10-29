"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  profileId: string
}

export function ViewTracker({ profileId }: ViewTrackerProps) {
  useEffect(() => {
    // Tracker la vue une seule fois au chargement
    const trackView = async () => {
      try {
        await fetch('/api/analytics/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId })
        })
      } catch (error) {
        console.error('Erreur tracking view:', error)
      }
    }

    trackView()
  }, [profileId])

  return null // Composant invisible
}

