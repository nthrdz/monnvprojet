import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { linkSchema } from "@/lib/validations"

// GET all links
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        links: {
          orderBy: { position: 'asc' }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ links: profile.links })

  } catch (error) {
    console.error("GET links error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST new link
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = linkSchema.parse(body)

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { links: true }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Check limits for FREE plan
    if (profile.plan === "FREE" && profile.links.length >= 10) {
      return NextResponse.json(
        { error: "Limite de 10 liens atteinte. Passe en Athlete Pro !" },
        { status: 403 }
      )
    }

    const maxPosition = await prisma.link.aggregate({
      where: { profileId: profile.id },
      _max: { position: true }
    })

    const link = await prisma.link.create({
      data: {
        ...validatedData,
        profileId: profile.id,
        position: (maxPosition._max.position || 0) + 1
      }
    })

    return NextResponse.json({ link }, { status: 201 })

  } catch (error: any) {
    console.error("POST link error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
