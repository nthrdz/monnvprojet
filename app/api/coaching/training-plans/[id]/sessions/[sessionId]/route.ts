import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, plan: true }
    })

    if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Récupérer le plan
    const profileData = await prisma.profile.findUnique({
      where: { id: profile.id },
      select: { stats: true }
    })

    const stats = profileData?.stats as any || {}
    const plans = stats.trainingPlans || []
    const planIndex = plans.findIndex((p: any) => p.id === params.id)

    if (planIndex === -1) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    const plan = plans[planIndex]
    if (!plan.sessions) plan.sessions = []

    // Trouver la session
    const sessionIndex = plan.sessions.findIndex((s: any) => s.id === params.sessionId)
    
    if (sessionIndex === -1) {
      return NextResponse.json({ error: "Session non trouvée" }, { status: 404 })
    }

    // Supprimer la session
    plan.sessions.splice(sessionIndex, 1)
    plan._count.sessions = plan.sessions.length

    // Sauvegarder
    plans[planIndex] = plan
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          trainingPlans: plans
        }
      }
    })

    return NextResponse.json({ message: "Session supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la session:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
