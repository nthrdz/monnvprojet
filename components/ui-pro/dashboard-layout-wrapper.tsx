"use client"

import { SidebarNavigation } from "@/components/ui-pro/sidebar-navigation"
import { MobileNavigation } from "@/components/ui-pro/mobile-navigation"
import { PageTransition } from "@/components/ui-pro/page-transition"
import { useRouter } from "next/navigation"

interface DashboardLayoutWrapperProps {
  username: string
  displayName: string
  avatarUrl?: string | null
  plan?: string
  children: React.ReactNode
}

export function DashboardLayoutWrapper({ 
  username, 
  displayName, 
  avatarUrl,
  plan,
  children 
}: DashboardLayoutWrapperProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <SidebarNavigation
          username={username}
          displayName={displayName}
          avatarUrl={avatarUrl}
          plan={plan}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        username={username}
        displayName={displayName}
        avatarUrl={avatarUrl}
        plan={plan}
        onSignOut={handleSignOut}
      />
      
      {/* Main Content Area with transitions */}
      <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0 p-4 sm:p-6 lg:p-10">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
