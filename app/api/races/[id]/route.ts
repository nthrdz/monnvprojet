import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { raceSchema } from "@/lib/validations"

// PATCH update race
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = raceSchema.partial().parse(body)

    // Verify race belongs to user
    const race = await prisma.race.findUnique({
      where: { id },
      include: { profile: true }
    })

    if (!race) {
      return NextResponse.json({ error: "Course non trouvée" }, { status: 404 })
    }

    if (race.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    // Convert date string to Date object if needed
    const updateData = { ...validatedData }
    if (updateData.date) {
      updateData.date = typeof updateData.date === 'string' 
        ? new Date(updateData.date) 
        : updateData.date
    }

    const updatedRace = await prisma.race.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ race: updatedRace })

  } catch (error: any) {
    console.error("PATCH race error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE race
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Verify race belongs to user
    const race = await prisma.race.findUnique({
      where: { id },
      include: { profile: true }
    })

    if (!race) {
      return NextResponse.json({ error: "Course non trouvée" }, { status: 404 })
    }

    if (race.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.race.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("DELETE race error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
