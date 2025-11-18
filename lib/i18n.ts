'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type Locale = 'fr' | 'en'

const LOCALE_COOKIE_NAME = 'locale'
const DEFAULT_LOCALE: Locale = 'fr'

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Récupérer la langue depuis les cookies
    const cookieLocale = getCookie(LOCALE_COOKIE_NAME) as Locale
    if (cookieLocale && (cookieLocale === 'fr' || cookieLocale === 'en')) {
      setLocale(cookieLocale)
    }
    setIsLoading(false)
  }, [])

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    setCookie(LOCALE_COOKIE_NAME, newLocale, 365) // Cookie valide 1 an
    // Déclencher un événement personnalisé pour forcer le re-render
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('localechange', { detail: newLocale }))
    }
    router.refresh() // Rafraîchir la page pour appliquer la nouvelle langue
  }

  return { locale, changeLocale, isLoading }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

