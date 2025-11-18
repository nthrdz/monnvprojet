"use client"

import { useI18n } from "@/components/providers/i18n-provider"
import Link from "next/link"
import { DashboardStats } from "@/components/ui-pro/dashboard-stats"
import { DashboardGoals } from "@/components/ui-pro/dashboard-goals"
import { RaceLogo } from "@/components/ui-pro/race-logo"
import { PlanBadge } from "@/components/ui-pro/plan-badge"
import { PlanType } from "@prisma/client"

interface DashboardClientProps {
  profile: {
    id: string
    displayName: string
    plan: string
    races: Array<{
      id: string
      name: string
      date: Date
      location: string | null
      distance: string | null
      result: string | null
      logoUrl?: string | null
    }>
    sponsors: Array<any>
    _count: {
      links: number
      races: number
      sponsors: number
      media: number
    }
  }
  analytics: {
    _sum: {
      views: number | null
      uniqueViews: number | null
      linkClicks: number | null
    }
  }
  viewsTrend: number
  uniqueViewsTrend: number
  totalLinkClicks: number
}

export function DashboardClient({
  profile,
  analytics,
  viewsTrend,
  uniqueViewsTrend,
  totalLinkClicks
}: DashboardClientProps) {
  const { t, locale } = useI18n()

  const upcomingRaces = profile.races.filter(race => new Date(race.date) >= new Date()).slice(0, 2)
  const pastRaces = profile.races.filter(race => new Date(race.date) < new Date()).slice(0, 2)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-4 sm:-mt-6 lg:-mt-10 px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 mb-8 sm:mb-10 lg:mb-12 bg-gradient-hero rounded-b-2xl sm:rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-primary-700 via-quaternary-700 to-tertiary-700 bg-clip-text text-transparent">
                {t('dashboard.welcome')}, {profile.displayName}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-600 font-semibold">
                {t('dashboard.performanceThisWeek')}
              </p>
            </div>
            <PlanBadge plan={profile.plan as "FREE" | "PRO" | "ELITE" | "ATHLETE_PRO" | "COACH"} size="lg" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="-mt-8 sm:-mt-12 lg:-mt-16">
        <DashboardStats
          views={analytics._sum.views || 0}
          uniqueViews={analytics._sum.uniqueViews || 0}
          linksCount={profile._count.links}
          racesCount={profile._count.races}
          viewsTrend={viewsTrend}
          uniqueViewsTrend={uniqueViewsTrend}
        />
      </div>

      {/* All Races - Compact */}
      {profile.races.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-standard p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>{t('dashboard.races.title')}</span>
            </h2>
            <Link 
              href="/dashboard/races"
              className="text-sm text-yellow-600 hover:text-black font-medium"
            >
              {t('dashboard.races.viewAll')}
            </Link>
          </div>
          
          <div className="space-y-4">
            {/* Compétitions à venir */}
            {upcomingRaces.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-yellow-600 mb-2 uppercase tracking-wide">
                  {t('dashboard.races.upcoming')} ({upcomingRaces.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {upcomingRaces.map((race) => {
                    const daysUntil = Math.ceil((new Date(race.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={race.id} className="flex items-center justify-between p-3 sm:p-2 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {race.logoUrl && (
                              <RaceLogo 
                                src={race.logoUrl} 
                                alt={`Logo ${race.name}`}
                                className="w-4 h-4 rounded-sm object-contain border shadow-sm p-0.5"
                                variant="dark"
                              />
                            )}
                            <h4 className="font-medium text-gray-900 text-xs truncate">{race.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{formatDate(race.date)}</span>
                            {race.location && <span>• {race.location}</span>}
                            {race.distance && <span>• {race.distance}</span>}
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 bg-yellow-500 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                          {daysUntil}{t('common.days')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {/* Compétitions passées */}
            {pastRaces.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  {t('dashboard.races.past')} ({pastRaces.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {pastRaces.map((race) => {
                    const daysAgo = Math.ceil((Date.now() - new Date(race.date).getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={race.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {race.logoUrl && (
                              <RaceLogo 
                                src={race.logoUrl} 
                                alt={`Logo ${race.name}`}
                                className="w-4 h-4 rounded-sm object-contain border shadow-sm p-0.5"
                                variant="dark"
                              />
                            )}
                            <h4 className="font-medium text-gray-900 text-xs truncate">{race.name}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{formatDate(race.date)}</span>
                            {race.location && <span>• {race.location}</span>}
                            {race.distance && <span>• {race.distance}</span>}
                          </div>
                        </div>
                        {race.result ? (
                          <span className="px-1.5 py-0.5 bg-green-500 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                            {race.result}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-gray-400 text-white rounded-full text-xs font-bold ml-2 whitespace-nowrap">
                            {daysAgo}{t('common.days')}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {profile.races.length > 4 && (
              <div className="text-center pt-2">
                <Link 
                  href="/dashboard/races"
                  className="text-sm text-gray-500 hover:text-yellow-600 font-medium"
                >
                  +{profile.races.length - 4} {locale === 'fr' ? 'autres compétitions' : 'more competitions'} →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Objectifs */}
      <DashboardGoals
        views={analytics._sum.views || 0}
        sponsorsCount={profile.sponsors.length}
        linkClicks={analytics._sum.linkClicks || 0}
      />

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/profile" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-ocean" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-blue-100 to-primary-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-primary-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary-blue-600 transition-colors">
              {locale === 'fr' ? 'Éditer Profil' : 'Edit Profile'}
            </h3>
            <p className="text-gray-600 text-sm">
              {locale === 'fr' ? 'Mets à jour tes informations personnelles' : 'Update your personal information'}
            </p>
          </div>
        </Link>
        
        <Link href="/dashboard/races" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-energy" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors">
              {t('dashboard.races.title')}
            </h3>
            <p className="text-gray-600 text-sm">
              {locale === 'fr' ? 'Gère ton calendrier de compétitions' : 'Manage your competition calendar'}
            </p>
          </div>
        </Link>
        
        <Link href="/dashboard/sources" className="group">
          <div className="relative h-full bg-white rounded-2xl shadow-standard hover:shadow-elevated p-8 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-hero" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-gray-700 transition-colors">
              {t('dashboard.menu.sources')}
            </h3>
            <p className="text-gray-600 text-sm">
              {locale === 'fr' ? 'Gère tes liens, compétitions et sponsors' : 'Manage your links, competitions and sponsors'}
            </p>
          </div>
        </Link>
      </div>

      {/* Upgrade Banner si FREE */}
      {profile.plan === "FREE" && (
        <div className="bg-gradient-to-br from-gray-800 to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3">
                  {t('dashboard.upgrade.title')}
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-4">
                  {t('dashboard.upgrade.subtitle')}
                </p>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    <span>{locale === 'fr' ? 'Liens illimités' : 'Unlimited links'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    <span>{locale === 'fr' ? 'Analytics avancées' : 'Advanced analytics'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-400">✓</span>
                    <span>{locale === 'fr' ? 'Support prioritaire' : 'Priority support'}</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard/upgrade"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-bold text-base sm:text-lg transition-all hover:scale-105 whitespace-nowrap"
              >
                {locale === 'fr' ? 'Voir les plans' : 'View plans'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

