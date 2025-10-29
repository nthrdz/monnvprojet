"use client"

import { useState } from "react"
import { User, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProfileContent } from "./profile-content"
import { GalerieContent } from "./galerie-content"

export default function ProfilePage() {
  // Vérifier l'URL pour ouvrir l'onglet Galerie si on vient de /dashboard/media
  const [activeTab, setActiveTab] = useState<'profile' | 'galerie'>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('media') || window.location.hash === '#galerie' 
        ? 'galerie' 
        : 'profile'
    }
    return 'profile'
  })

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('profile')
              window.location.hash = ''
            }}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
              activeTab === 'profile'
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <User className="w-4 h-4" />
            Mon Profil
          </button>
          <button
            onClick={() => {
              setActiveTab('galerie')
              window.location.hash = 'galerie'
            }}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
              activeTab === 'galerie'
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            <ImageIcon className="w-4 h-4" />
            Galerie
          </button>
        </nav>
      </div>

      {/* Contenu de l'onglet Profil */}
      {activeTab === 'profile' && <ProfileContent />}

      {/* Contenu de l'onglet Galerie */}
      {activeTab === 'galerie' && <GalerieContent />}
    </div>
  )
}
