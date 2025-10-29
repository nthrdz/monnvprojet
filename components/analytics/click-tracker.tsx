"use client"

import { useEffect, useRef } from "react"

interface ClickTrackerProps {
  profileId: string
  children: React.ReactNode
}

export function ClickTracker({ profileId, children }: ClickTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleClick = async (e: MouseEvent) => {
      // Calculer la position relative en pourcentage
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      // Déterminer l'élément cliqué
      const target = e.target as HTMLElement
      let element = 'unknown'
      
      if (target.closest('[data-link-card]')) {
        element = 'link'
      } else if (target.closest('[data-sponsor]')) {
        element = 'sponsor'
      } else if (target.closest('[data-media]')) {
        element = 'media'
      } else if (target.closest('[data-race]')) {
        element = 'race'
      } else if (target.closest('header')) {
        element = 'header'
      }

      // Récupérer le linkId si c'est un lien
      const linkCard = target.closest('[data-link-id]')
      const linkId = linkCard?.getAttribute('data-link-id') || undefined

      try {
        await fetch('/api/analytics/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId,
            linkId,
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10,
            element,
            userAgent: navigator.userAgent
          })
        })
      } catch (error) {
        console.error('Erreur tracking click:', error)
      }
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [profileId])

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  )
}

