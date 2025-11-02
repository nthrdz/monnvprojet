import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const { planId, clientEmail, clientName } = await request.json()

    if (!planId || !clientEmail || !clientName) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Récupérer le plan d'entraînement
    const profiles = await prisma.profile.findMany({
      where: { 
        OR: [
          { plan: "COACH" },
          { plan: "ELITE" }
        ]
      },
      select: { id: true, stats: true, username: true, displayName: true }
    })

    let targetPlan = null
    let coachProfile = null

    for (const profile of profiles) {
      const stats = profile.stats as any
      const trainingPlans = stats.trainingPlans || []
      const plan = trainingPlans.find((p: any) => p.id === planId)
      
      if (plan) {
        targetPlan = plan
        coachProfile = profile
        break
      }
    }

    if (!targetPlan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    if (!coachProfile) {
      return NextResponse.json({ error: "Coach non trouvé" }, { status: 404 })
    }

    if (!targetPlan.pdfFileUrl) {
      return NextResponse.json({ error: "Aucun PDF disponible pour ce plan" }, { status: 404 })
    }

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: targetPlan.title,
              description: `Plan d'entraînement par ${coachProfile.displayName}`,
              images: [], // Optionnel : ajouter une image du plan
            },
            unit_amount: Math.round(targetPlan.price * 100), // Convertir en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/${coachProfile.username}/coaching?purchase=success&plan_id=${planId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${coachProfile.username}/coaching?purchase=cancelled`,
      customer_email: clientEmail,
      metadata: {
        planId,
        coachProfileId: coachProfile.id,
        coachUsername: coachProfile.username,
        clientName,
        clientEmail,
        planTitle: targetPlan.title,
        planPrice: targetPlan.price.toString(),
        pdfFileUrl: targetPlan.pdfFileUrl,
        pdfFileName: targetPlan.pdfFileName || 'plan.pdf',
        type: 'coaching_plan_purchase'
      },
      client_reference_id: planId, // Pour retrouver le plan plus tard
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error)
    return NextResponse.json({ 
      error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    }, { status: 500 })
  }
}

