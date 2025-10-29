"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Boxes,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Share2,
  Users,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarNavigationProps {
  username: string
  displayName: string
  avatarUrl?: string | null
  plan?: string
  onSignOut: () => void
}

export function SidebarNavigation({ 
  username, 
  displayName, 
  avatarUrl,
  plan,
  onSignOut 
}: SidebarNavigationProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const allMenuItems = [
    { href: "/dashboard/profile", icon: User, label: "Profil" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/sources", icon: Boxes, label: "Sources" },
    { href: "/dashboard/coaching", icon: Users, label: "Services Coaching", planRequired: "COACH" },
    { href: "/dashboard/affiliate", icon: Target, label: "Ambassadeur" },
    { href: "/dashboard/share", icon: Share2, label: "Partager" },
    { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
  ]

  // Filtrer les éléments du menu selon le plan
  const menuItems = allMenuItems.filter(item => {
    if (!item.planRequired) return true
    if (item.planRequired === "COACH") return plan === "COACH" || plan === "ELITE"
    if (item.planRequired === "PRO") return plan === "PRO" || plan === "ELITE"
    return plan === item.planRequired
  })

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col"
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <motion.span 
              className="font-black text-xl bg-gradient-to-r from-yellow-500 via-black to-yellow-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              Athlink
            </motion.span>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-blue-50 to-primary-blue-100 text-primary-blue-700 border-l-4 border-primary-blue-500"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-blue-600"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-primary-blue-600" : "text-gray-500"
                )} />
                {!isCollapsed && (
                  <span className="font-semibold text-sm">{item.label}</span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-primary-blue-600"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className={cn(
          "flex items-center gap-3 mb-2",
          isCollapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-gray-900 font-bold">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              displayName[0]
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                @{username}
              </p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="space-y-1">
            <Link href={`/${username}`} target="_blank">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                Profil public
              </button>
            </Link>
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
