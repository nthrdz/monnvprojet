import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendBookingNotification } from "@/lib/email"

// GET method for health check
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: "ok",
    message: "Booking request API is available"
  }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coachUsername, clientName, clientEmail, clientPhone, service, message } = body

    // Validation
    if (!coachUsername || !clientName || !clientEmail || !service) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Vérifier que le coach existe et a le plan COACH
    const coach = await prisma.profile.findUnique({
      where: { username: coachUsername },
      select: { 
        id: true, 
        plan: true, 
        stats: true,
        displayName: true,
        user: {
          select: { email: true }
        }
      }
    })

    if (!coach || coach.plan !== "COACH") {
      return NextResponse.json({ error: "Coach non trouvé ou non disponible" }, { status: 404 })
    }

    // Récupérer les réservations existantes
    const stats = coach.stats as any || {}
    const existingBookings = stats.bookings || []

    // Créer une nouvelle demande de réservation avec statut PENDING
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      date: new Date().toISOString().split('T')[0], // Date provisoire (sera modifiée par le coach)
      startTime: "09:00", // Heure provisoire
      endTime: "10:00",
      duration: 60,
      service: service,
      price: 0, // Prix à définir par le coach
      status: "PENDING",
      notes: message || "Demande depuis la page publique",
      createdAt: new Date().toISOString(),
      isPublicRequest: true // Marqueur pour identifier les demandes publiques
    }

    // Ajouter la nouvelle demande
    const updatedBookings = [newBooking, ...existingBookings]

    // Sauvegarder dans le profil
    await prisma.profile.update({
      where: { id: coach.id },
      data: {
        stats: {
          ...stats,
          bookings: updatedBookings
        }
      }
    })

    // 📧 Envoyer un email de notification au coach
    try {
      await sendBookingNotification(
        coach.user.email,
        clientName,
        clientEmail,
        service,
        message
      )
      console.log('✅ Email de notification envoyé au coach:', coach.user.email)
    } catch (emailError) {
      console.error('❌ Erreur envoi email notification:', emailError)
      // On ne bloque pas la réservation si l'email échoue
    }

    return NextResponse.json({ 
      success: true,
      message: "Demande envoyée avec succès",
      bookingId: newBooking.id
    }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

