"use client"

import { useState } from "react"
import { themes, getAvailableThemes } from "@/lib/themes"

interface ThemePreviewProps {
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

export function ThemePreview({ currentTheme, onThemeChange }: ThemePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const availableThemes = getAvailableThemes("ELITE") // Afficher tous les thèmes pour le test

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
      >
        Thème: {themes[currentTheme as keyof typeof themes]?.name || "Inconnu"}
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 min-w-48">
          {availableThemes.map(([themeId, theme]) => (
            <button
              key={themeId}
              onClick={() => {
                onThemeChange(themeId)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                themeId === currentTheme 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {theme.name}
              {theme.isPremium && (
                <span className="ml-2 text-xs text-yellow-400">Premium</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
