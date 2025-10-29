import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { profileUpdateSchema, mapSportToEnum, createStatsWithOriginalSport } from "@/lib/validations"

// GET profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error("GET profile error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH update profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileUpdateSchema.parse(body)

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Mapper le sport libre vers l'enum Prisma et stocker l'original dans les stats
    let statsToUpdate = profile.stats || {}
    
    // Gérer le sport original
    if (validatedData.sport) {
      statsToUpdate = createStatsWithOriginalSport(statsToUpdate, validatedData.sport)
    }
    
    // Gérer le CSS personnalisé
    if (validatedData.customCSS !== undefined) {
      statsToUpdate = {
        ...statsToUpdate,
        customCSS: validatedData.customCSS || null
      }
    }

    const dataForPrisma = {
      ...validatedData,
      ...(validatedData.sport && { 
        sport: mapSportToEnum(validatedData.sport)
      }),
      // Mettre à jour les stats si nécessaire
      ...(Object.keys(statsToUpdate).length > 0 && { stats: statsToUpdate }),
      // Retirer customCSS des données Prisma car il va dans stats
      customCSS: undefined
    }

    // Si le sport actuel n'est pas une valeur de l'enum Prisma, on le force à "OTHER"
    // et on stocke le sport original dans les stats
    const enumSports = ["RUNNING", "CYCLING", "TRIATHLON", "SWIMMING", "SKIING", "OTHER"]
    if (!enumSports.includes(profile.sport) && !validatedData.sport) {
      dataForPrisma.sport = "OTHER"
      dataForPrisma.stats = createStatsWithOriginalSport(statsToUpdate, profile.sport)
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: dataForPrisma as any
    })

    return NextResponse.json({ profile: updatedProfile })

  } catch (error: any) {
    console.error("PATCH profile error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
