import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * API pour récupérer les disponibilités et réservations d'un coach
 * Utilisé pour afficher le calendrier avec les créneaux disponibles
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coachUsername = searchParams.get('coachUsername')

    if (!coachUsername) {
      return NextResponse.json({ error: "Username du coach requis" }, { status: 400 })
    }

    // Récupérer le profil du coach
    const coach = await prisma.profile.findUnique({
      where: { username: coachUsername },
      select: {
        id: true,
        plan: true,
        stats: true
      }
    })

    if (!coach || (coach.plan !== "COACH" && coach.plan !== "ELITE")) {
      return NextResponse.json({ error: "Coach non trouvé" }, { status: 404 })
    }

    const stats = coach.stats as any || {}
    const availabilities = stats.availabilities || []
    const bookings = stats.bookings || []

    // Filtrer uniquement les réservations confirmées ou en attente (qui bloquent un créneau)
    const activeBookings = bookings.filter((b: any) => 
      b.status === "CONFIRMED" || b.status === "PENDING"
    )

    return NextResponse.json({
      availabilities,
      bookings: activeBookings
    })

  } catch (error) {
    console.error("Erreur lors de la récupération des disponibilités:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

