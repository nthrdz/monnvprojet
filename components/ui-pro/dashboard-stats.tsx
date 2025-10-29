"use client"

import { SportStatCard } from "@/components/ui-pro/sport-stat-card"
import { Activity, Users, Link2, Target } from "lucide-react"

interface DashboardStatsProps {
  views: number
  uniqueViews: number
  linksCount: number
  racesCount: number
}

export function DashboardStats({
  views,
  uniqueViews,
  linksCount,
  racesCount
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
      <SportStatCard
        icon={Activity}
        value={views}
        label="Vues (7j)"
        trend={{ value: 12, label: "vs semaine dernière" }}
        color="primary"
        delay={0}
      />
      <SportStatCard
        icon={Users}
        value={uniqueViews}
        label="Visiteurs uniques"
        trend={{ value: 8, label: "vs semaine dernière" }}
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
