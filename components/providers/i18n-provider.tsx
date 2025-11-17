'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLocale } from '@/lib/i18n'
import frMessages from '@/messages/fr.json'
import enMessages from '@/messages/en.json'

type Messages = typeof frMessages

const messages: Record<'fr' | 'en', Messages> = {
  fr: frMessages,
  en: enMessages
}

interface I18nContextType {
  t: (key: string) => string
  locale: 'fr' | 'en'
  changeLocale: (locale: 'fr' | 'en') => void
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, changeLocale, isLoading } = useLocale()
  const [currentMessages, setCurrentMessages] = useState<Messages>(messages[locale])

  useEffect(() => {
    setCurrentMessages(messages[locale])
  }, [locale])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = currentMessages
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ t, locale, changeLocale, isLoading }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

