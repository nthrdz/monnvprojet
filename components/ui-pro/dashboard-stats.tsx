"use client"

import { SportStatCard } from "@/components/ui-pro/sport-stat-card"
import { Activity, Users, Link2, Target } from "lucide-react"

interface DashboardStatsProps {
  views: number
  uniqueViews: number
  linksCount: number
  racesCount: number
  viewsTrend?: number
  uniqueViewsTrend?: number
}

export function DashboardStats({
  views,
  uniqueViews,
  linksCount,
  racesCount,
  viewsTrend,
  uniqueViewsTrend
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <SportStatCard
        icon={Activity}
        value={views}
        label="Vues (7j)"
        trend={viewsTrend !== undefined ? { value: viewsTrend, label: "vs semaine dernière" } : undefined}
        color="primary"
        delay={0}
      />
      <SportStatCard
        icon={Users}
        value={uniqueViews}
        label="Visiteurs uniques"
        trend={uniqueViewsTrend !== undefined ? { value: uniqueViewsTrend, label: "vs semaine dernière" } : undefined}
        color="accent"
        delay={0.1}
      />
      <SportStatCard
        icon={Link2}
        value={linksCount}
        label="Liens actifs"
        color="success"
        delay={0.2}
      />
      <SportStatCard
        icon={Target}
        value={racesCount}
        label="Courses à venir"
        color="primary"
        delay={0.3}
      />
    </div>
  )
}
