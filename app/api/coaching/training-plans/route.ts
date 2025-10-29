import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
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

    const profileData = await prisma.profile.findUnique({
      where: { id: profile.id },
      select: { stats: true }
    })

    const stats = profileData?.stats as any || {}
    const plans = stats.trainingPlans || []

    return NextResponse.json(plans)
  } catch (error) {
    console.error("Erreur lors de la récupération des plans:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const difficulty = formData.get('difficulty') as string
    const category = formData.get('category') as string
    const isActive = formData.get('isActive') === 'true'
    const pdfFileName = formData.get('pdfFileName') as string | null
    const pdfFileUrl = formData.get('pdfFileUrl') as string | null

    // Validation
    if (!title || !description || price === undefined || !duration || !difficulty || !category) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    if (price < 0) {
      return NextResponse.json({ error: "Le prix ne peut pas être négatif" }, { status: 400 })
    }

    if (duration < 1) {
      return NextResponse.json({ error: "La durée doit être d'au moins 1 semaine" }, { status: 400 })
    }

    const validDifficulties = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json({ error: "Niveau de difficulté invalide" }, { status: 400 })
    }

    // Récupérer les plans existants
    const profileData = await prisma.profile.findUnique({
      where: { id: profile.id },
      select: { stats: true }
    })

    const stats = profileData?.stats as any || {}
    const existingPlans = stats.trainingPlans || []

    // Créer le nouveau plan
    const newPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      difficulty,
      category,
      isActive: isActive ?? true,
      pdfFileName: pdfFileName || null,
      pdfFileUrl: pdfFileUrl || null,
      createdAt: new Date().toISOString(),
      sessions: [],
      subscribers: [],
      _count: {
        sessions: 0,
        subscribers: 0
      }
    }

    // Ajouter le nouveau plan
    const updatedPlans = [newPlan, ...existingPlans]

    // Sauvegarder dans le profil
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          trainingPlans: updatedPlans
        }
      }
    })

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du plan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
