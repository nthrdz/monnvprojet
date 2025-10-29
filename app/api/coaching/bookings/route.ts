import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
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

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
    const { clientName, clientEmail, clientPhone, date, startTime, duration, service, price, notes } = body

    // Validation
    if (!clientName || !clientEmail || !date || !startTime || !duration || !service || price === undefined) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    if (price < 0) {
      return NextResponse.json({ error: "Le prix ne peut pas être négatif" }, { status: 400 })
    }

    // Calculer l'heure de fin
    const [hours, minutes] = startTime.split(':').map(Number)
    const endMinutes = hours * 60 + minutes + parseInt(duration)
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

    // Récupérer les réservations existantes
    const stats = profile.stats as any || {}
    const existingBookings = stats.bookings || []

    // Créer la nouvelle réservation
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      date,
      startTime,
      endTime,
      duration: parseInt(duration),
      service,
      price: parseFloat(price),
      status: "PENDING",
      notes: notes || null,
      createdAt: new Date().toISOString()
    }

    // Ajouter la nouvelle réservation
    const updatedBookings = [newBooking, ...existingBookings]

    // Sauvegarder dans le profil
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        stats: {
          ...stats,
          bookings: updatedBookings
        }
      }
    })

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

