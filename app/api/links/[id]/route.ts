import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { linkUpdateSchema } from "@/lib/validations"

// PATCH update link
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
    const validatedData = linkUpdateSchema.parse(body)

    // Verify link belongs to user
    const link = await prisma.link.findUnique({
      where: { id },
      include: { profile: true }
    })

    if (!link) {
      return NextResponse.json({ error: "Lien non trouvé" }, { status: 404 })
    }

    if (link.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: validatedData
    })

    return NextResponse.json({ link: updatedLink })

  } catch (error: any) {
    console.error("PATCH link error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE link
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

    // Verify link belongs to user
    const link = await prisma.link.findUnique({
      where: { id },
      include: { profile: true }
    })

    if (!link) {
      return NextResponse.json({ error: "Lien non trouvé" }, { status: 404 })
    }

    if (link.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    await prisma.link.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("DELETE link error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
