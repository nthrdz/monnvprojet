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
      select: { id: true, plan: true, stats: true }
    })

    if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const stats = profile.stats as any || {}
    const bookings = stats.bookings || []
    const booking = bookings.find((b: any) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Erreur lors de la récupération de la réservation:", error)
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
      select: { id: true, plan: true, stats: true }
    })

    if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const { status, clientName, clientEmail, clientPhone, date, startTime, duration, service, price, notes } = body

    // Récupérer les réservations existantes
    const stats = profile.stats as any || {}
    const bookings = stats.bookings || []
    const bookingIndex = bookings.findIndex((b: any) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Validation du statut si fourni
    if (status) {
      const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
      }
    }

    // Recalculer l'heure de fin si nécessaire
    let endTime = bookings[bookingIndex].endTime
    if (startTime && duration) {
      const [hours, minutes] = startTime.split(':').map(Number)
      const endMinutes = hours * 60 + minutes + parseInt(duration)
      const endHours = Math.floor(endMinutes / 60)
      const endMins = endMinutes % 60
      endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
    }

    // Mettre à jour la réservation
    const updatedBooking = {
      ...bookings[bookingIndex],
      ...(status !== undefined && { status }),
      ...(clientName !== undefined && { clientName }),
      ...(clientEmail !== undefined && { clientEmail }),
      ...(clientPhone !== undefined && { clientPhone }),
      ...(date !== undefined && { date }),
      ...(startTime !== undefined && { startTime }),
      ...(duration !== undefined && { duration: parseInt(duration) }),
      ...(service !== undefined && { service }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(notes !== undefined && { notes }),
      endTime
    }

    bookings[bookingIndex] = updatedBooking

    // Sauvegarder
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          bookings
        }
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réservation:", error)
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
      select: { id: true, plan: true, stats: true }
    })

    if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Récupérer les réservations existantes
    const stats = profile.stats as any || {}
    const bookings = stats.bookings || []
    const bookingIndex = bookings.findIndex((b: any) => b.id === params.id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Réservation non trouvée" }, { status: 404 })
    }

    // Supprimer la réservation
    bookings.splice(bookingIndex, 1)

    // Sauvegarder
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          bookings
        }
      }
    })

    return NextResponse.json({ message: "Réservation supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

