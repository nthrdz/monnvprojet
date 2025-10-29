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

    return NextResponse.json(plan)
  } catch (error) {
    console.error("Erreur lors de la récupération du plan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PUT(
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

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = formData.get('price') ? parseFloat(formData.get('price') as string) : undefined
    const duration = formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined
    const difficulty = formData.get('difficulty') as string
    const category = formData.get('category') as string
    const isActive = formData.get('isActive') === 'true'
    const pdfFile = formData.get('pdfFile') as File | null
    const pdfFileName = formData.get('pdfFileName') as string

    // Récupérer les plans existants
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

    // Validation
    if (price !== undefined && price < 0) {
      return NextResponse.json({ error: "Le prix ne peut pas être négatif" }, { status: 400 })
    }

    if (duration !== undefined && duration < 1) {
      return NextResponse.json({ error: "La durée doit être d'au moins 1 semaine" }, { status: 400 })
    }

    if (difficulty) {
      const validDifficulties = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json({ error: "Niveau de difficulté invalide" }, { status: 400 })
      }
    }

    // Gérer le fichier PDF
    let pdfFileName = plans[planIndex].pdfFileName // Garder l'existant par défaut
    if (pdfFile) {
      // Nouveau fichier uploadé
      pdfFileName = pdfFile.name
    } else if (pdfFileName !== undefined) {
      // Nom de fichier fourni (garde l'existant)
      pdfFileName = pdfFileName
    }

    // Mettre à jour le plan
    const updatedPlan = {
      ...plans[planIndex],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(duration !== undefined && { duration }),
      ...(difficulty !== undefined && { difficulty }),
      ...(category !== undefined && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(pdfFileName !== undefined && { pdfFileName })
    }

    plans[planIndex] = updatedPlan

    // Sauvegarder
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          trainingPlans: plans
        }
      }
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(
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

    // Récupérer les plans existants
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

    // Supprimer le plan
    plans.splice(planIndex, 1)

    // Sauvegarder
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          trainingPlans: plans
        }
      }
    })

    return NextResponse.json({ message: "Plan supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du plan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
