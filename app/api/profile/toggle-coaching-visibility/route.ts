import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { profileId, showCoachingOnProfile } = await req.json()

    // Vérifier que le profil appartient à l'utilisateur
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { userId: true }
    })

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Mettre à jour la visibilité
    await prisma.profile.update({
      where: { id: profileId },
      data: { showCoachingOnProfile }
    })

    return NextResponse.json({ 
      success: true,
      showCoachingOnProfile 
    })

  } catch (error: any) {
    console.error("Erreur toggle coaching visibility:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
}

