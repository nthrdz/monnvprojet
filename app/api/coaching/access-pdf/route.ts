import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { readFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const { planId, clientEmail, clientName } = await request.json()

    if (!planId || !clientEmail || !clientName) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Récupérer le plan d'entraînement
    const profiles = await prisma.profile.findMany({
      where: { plan: "COACH" },
      select: { id: true, stats: true }
    })

    let targetPlan = null
    let coachProfileId = null

    for (const profile of profiles) {
      const stats = profile.stats as any
      const trainingPlans = stats.trainingPlans || []
      const plan = trainingPlans.find((p: any) => p.id === planId)
      
      if (plan) {
        targetPlan = plan
        coachProfileId = profile.id
        break
      }
    }

    if (!targetPlan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    if (!targetPlan.pdfFileName) {
      return NextResponse.json({ error: "Aucun PDF disponible pour ce plan" }, { status: 404 })
    }

    // Simuler un paiement (dans un vrai projet, intégrer Stripe)
    const paymentResult = await simulatePayment({
      amount: targetPlan.price,
      currency: 'EUR',
      clientEmail,
      clientName,
      planTitle: targetPlan.title
    })

    if (!paymentResult.success) {
      return NextResponse.json({ error: "Échec du paiement" }, { status: 400 })
    }

    // Créer un token d'accès temporaire (24h)
    const accessToken = generateAccessToken(planId, clientEmail)
    
    // Enregistrer l'achat dans les stats du coach
    await recordPurchase(coachProfileId, planId, clientEmail, clientName, targetPlan.price)

    return NextResponse.json({
      success: true,
      accessToken,
      pdfUrl: `/api/coaching/pdf/${planId}?token=${accessToken}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error("Erreur lors de l'accès au PDF:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// Simuler un paiement (remplacer par Stripe en production)
async function simulatePayment(paymentData: {
  amount: number
  currency: string
  clientEmail: string
  clientName: string
  planTitle: string
}) {
  // Dans un vrai projet, intégrer Stripe ici
  console.log("Paiement simulé:", paymentData)
  
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return { success: true, transactionId: `txn_${Date.now()}` }
}

// Générer un token d'accès sécurisé
function generateAccessToken(planId: string, clientEmail: string): string {
  const payload = {
    planId,
    clientEmail,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24h
  }
  
  // Simple encoding (dans un vrai projet, utiliser JWT)
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Enregistrer l'achat
async function recordPurchase(coachProfileId: string, planId: string, clientEmail: string, clientName: string, amount: number) {
  const profile = await prisma.profile.findUnique({
    where: { id: coachProfileId },
    select: { stats: true }
  })

  if (!profile) return

  const stats = profile.stats as any || {}
  const purchases = stats.purchases || []

  const purchase = {
    id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    planId,
    clientEmail,
    clientName,
    amount,
    purchasedAt: new Date().toISOString(),
    status: 'completed'
  }

  purchases.push(purchase)

  await prisma.profile.update({
    where: { id: coachProfileId },
    data: {
      stats: {
        ...stats,
        purchases
      }
    }
  })
}

