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
  console.log("============================================================")
  console.log("🚀 API /api/public/booking-request POST appelée")
  console.log("============================================================")
  
  try {
    const body = await request.json()
    console.log("📦 Body reçu:", body)
    const { coachUsername, clientName, clientEmail, clientPhone, service, message, date, startTime, duration } = body

    // Validation
    if (!coachUsername || !clientName || !clientEmail || !service || !date || !startTime) {
      console.error("❌ Données manquantes:", { coachUsername, clientName, clientEmail, service, date, startTime })
      return NextResponse.json({ error: "Données manquantes (nom, email, service, date et heure requis)" }, { status: 400 })
    }
    
    console.log("✅ Validation OK")

    // Vérifier que le coach existe et a le plan COACH ou ELITE
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

    if (!coach) {
      console.error("❌ Coach non trouvé:", coachUsername)
      return NextResponse.json({ error: "Coach non trouvé ou non disponible" }, { status: 404 })
    }
    
    // ✅ Accepter les plans COACH et ELITE (les utilisateurs ELITE peuvent aussi être coaches)
    if (coach.plan !== "COACH" && coach.plan !== "ELITE") {
      console.error("❌ Plan invalide:", coach.plan, "attendu: COACH ou ELITE")
      return NextResponse.json({ error: "Coach non trouvé ou non disponible" }, { status: 404 })
    }
    
    console.log("✅ Coach trouvé:", coach.displayName, "- Plan:", coach.plan)

    // Récupérer les réservations existantes
    const stats = coach.stats as any || {}
    const existingBookings = stats.bookings || []

    // Calculer l'heure de fin basée sur la durée
    const bookingDuration = duration || 60 // Durée par défaut 60 minutes
    const [hours, minutes] = startTime.split(':').map(Number)
    const endMinutes = hours * 60 + minutes + bookingDuration
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`

    // Créer une nouvelle demande de réservation avec statut PENDING
    const newBooking = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      date: date, // Date choisie par le client
      startTime: startTime, // Heure choisie par le client
      endTime: endTime, // Calculée automatiquement
      duration: bookingDuration,
      service: service,
      price: 0, // Prix à définir par le coach
      status: "PENDING",
      notes: message || "Demande depuis la page publique",
      createdAt: new Date().toISOString(),
      isPublicRequest: true // Marqueur pour identifier les demandes publiques
    }
    
    console.log("📅 Réservation créée:", {
      date: newBooking.date,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      duration: newBooking.duration
    })

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

    console.log("✅ Demande de réservation créée:", newBooking.id)
    console.log("============================================================")
    
    return NextResponse.json({ 
      success: true,
      message: "Demande envoyée avec succès",
      bookingId: newBooking.id
    }, { status: 201 })
  } catch (error: any) {
    console.error("❌❌❌ ERREUR lors de la création de la demande ❌❌❌")
    console.error("Type:", error?.constructor?.name)
    console.error("Message:", error?.message)
    console.error("Stack:", error?.stack)
    console.log("============================================================")
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }, { status: 500 })
  }
}

