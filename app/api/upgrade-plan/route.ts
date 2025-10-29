import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      console.error("Session non valide:", session)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { plan, promoCode } = await request.json()

    if (!["FREE", "ATHLETE_PRO", "COACH"].includes(plan)) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 })
    }

    console.log("Tentative de mise à jour du plan pour userId:", session.user.id, "vers:", plan)

    // Vérifier si le profil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, stats: true }
    })

    if (!existingProfile) {
      console.error("Profil non trouvé pour userId:", session.user.id)
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Préparer les données de mise à jour
    const updateData: any = { plan }
    
    // Si un code promo est fourni, l'ajouter aux stats
    if (promoCode) {
      const stats = existingProfile.stats as any || {}
      updateData.stats = {
        ...stats,
        promoCodeUsed: promoCode.toUpperCase(),
        promoAppliedAt: new Date().toISOString()
      }
    }

    // Mettre à jour le plan
    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData
    })

    console.log("Plan mis à jour avec succès:", profile.plan)

    return NextResponse.json({ 
      success: true, 
      plan: profile.plan,
      message: `Plan mis à jour vers ${plan}`,
      promoApplied: promoCode ? true : false
    })
  } catch (error) {
    console.error("Erreur détaillée lors de la mise à jour du plan:", error)
    return NextResponse.json(
      { 
        error: "Erreur lors de la mise à jour",
        details: error instanceof Error ? error.message : "Erreur inconnue"
      },
      { status: 500 }
    )
  }
}

