import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { DashboardLayoutWrapper } from "@/components/ui-pro/dashboard-layout-wrapper"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Get user profile for sidebar
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
      plan: true,
    }
  })

  if (!profile) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayoutWrapper
      username={profile.username}
      displayName={profile.displayName}
      avatarUrl={profile.avatarUrl}
      plan={profile.plan}
    >
      {children}
    </DashboardLayoutWrapper>
  )
}