import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    const plan = plans.find((p: any) => p.id === params.id)

    if (!plan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    const sessions = plan.sessions || []
    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json()
    const { title, description, weekNumber, dayNumber, duration, exercises } = body

    // Validation
    if (!title || !description || weekNumber === undefined || dayNumber === undefined) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    if (weekNumber < 1 || weekNumber > plan.duration) {
      return NextResponse.json({ error: "Numéro de semaine invalide" }, { status: 400 })
    }

    if (dayNumber < 1 || dayNumber > 7) {
      return NextResponse.json({ error: "Numéro de jour invalide (1-7)" }, { status: 400 })
    }

    // Vérifier qu'il n'y a pas déjà une session pour ce jour/semaine
    const existingSession = (plan.sessions || []).find((s: any) => 
      s.weekNumber === parseInt(weekNumber) && s.dayNumber === parseInt(dayNumber)
    )

    if (existingSession) {
      return NextResponse.json({ error: "Une session existe déjà pour ce jour/semaine" }, { status: 400 })
    }

    // Créer la nouvelle session
    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      weekNumber: parseInt(weekNumber),
      dayNumber: parseInt(dayNumber),
      duration: duration ? parseInt(duration) : 60,
      exercises: exercises || [],
      createdAt: new Date().toISOString()
    }

    // Ajouter la session au plan
    if (!plan.sessions) plan.sessions = []
    plan.sessions.push(newSession)
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

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
