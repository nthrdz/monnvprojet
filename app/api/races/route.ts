import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { raceSchema } from "@/lib/validations"

// GET all races
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        races: {
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ races: profile.races })

  } catch (error) {
    console.error("GET races error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST new race
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = raceSchema.parse(body)

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Convert date string to Date object if needed
    const raceDate = typeof validatedData.date === 'string' 
      ? new Date(validatedData.date) 
      : validatedData.date

    const race = await prisma.race.create({
      data: {
        ...validatedData,
        date: raceDate,
        profileId: profile.id,
      }
    })

    return NextResponse.json({ race }, { status: 201 })

  } catch (error: any) {
    console.error("POST race error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
