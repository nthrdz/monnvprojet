"use client"

import { InteractiveLinkCard } from "./interactive-link-card"

interface LinkCardWrapperProps {
  id: string
  title: string
  description?: string
  url: string
  icon?: string
  clicks: number
}

export function LinkCardWrapper({ id, title, description, url, icon, clicks }: LinkCardWrapperProps) {
  const handleTrackClick = async () => {
    try {
      await fetch(`/api/links/${id}/click`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to track click', err)
    }
  }

  return (
    <InteractiveLinkCard
      title={title}
      description={description}
      url={url}
      icon={icon}
      clicks={clicks}
      onTrackClick={handleTrackClick}
    />
  )
}

