import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sponsorSchema } from "@/lib/validations"

// GET all sponsors
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        sponsors: {
          orderBy: { position: 'asc' }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ sponsors: profile.sponsors })

  } catch (error) {
    console.error("GET sponsors error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST new sponsor
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = sponsorSchema.parse(body)

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { sponsors: true }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    const maxPosition = await prisma.sponsor.aggregate({
      where: { profileId: profile.id },
      _max: { position: true }
    })

    const sponsor = await prisma.sponsor.create({
      data: {
        ...validatedData,
        profileId: profile.id,
        position: (maxPosition._max.position || 0) + 1
      }
    })

    return NextResponse.json({ sponsor }, { status: 201 })

  } catch (error: any) {
    console.error("POST sponsor error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
