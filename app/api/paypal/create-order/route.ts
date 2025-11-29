import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * Crée un ordre PayPal pour l'achat d'un plan d'entraînement
 * 
 * Nécessite les variables d'environnement :
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 * - PAYPAL_MODE (sandbox ou live)
 */
export async function POST(request: NextRequest) {
  try {
    const { planId, coachUsername, clientName, clientEmail, amount } = await request.json()

    if (!planId || !coachUsername || !clientName || !clientEmail || !amount) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Vérifier que les clés PayPal sont configurées
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      console.error("❌ Clés PayPal non configurées")
      return NextResponse.json({ 
        error: "Configuration PayPal manquante. Veuillez contacter l'administrateur." 
      }, { status: 500 })
    }

    // Récupérer le coach et son email PayPal
    const coach = await prisma.profile.findUnique({
      where: { username: coachUsername },
      select: { id: true, paypalEmail: true, stats: true }
    })

    if (!coach) {
      return NextResponse.json({ error: "Coach non trouvé" }, { status: 404 })
    }

    if (!coach.paypalEmail) {
      return NextResponse.json({ 
        error: "Le coach n'a pas configuré son email PayPal" 
      }, { status: 400 })
    }

    // Vérifier que le plan existe
    const stats = coach.stats as any || {}
    const trainingPlans = stats.trainingPlans || []
    const plan = trainingPlans.find((p: any) => p.id === planId)

    if (!plan) {
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    // Obtenir un access token PayPal
    const paypalMode = process.env.PAYPAL_MODE || "sandbox"
    const baseUrl = paypalMode === "live" 
      ? "https://api-m.paypal.com" 
      : "https://api-m.sandbox.paypal.com"

    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`
      },
      body: "grant_type=client_credentials"
    })

    if (!authResponse.ok) {
      console.error("❌ Erreur authentification PayPal:", await authResponse.text())
      return NextResponse.json({ error: "Erreur authentification PayPal" }, { status: 500 })
    }

    const { access_token } = await authResponse.json()

    // Créer l'ordre PayPal
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
        "PayPal-Request-Id": `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "EUR",
            value: amount.toFixed(2)
          },
          payee: {
            email_address: coach.paypalEmail
          },
          description: `Plan d'entraînement: ${plan.title}`,
          custom_id: JSON.stringify({
            planId,
            coachId: coach.id,
            clientName,
            clientEmail,
            coachUsername
          })
        }],
        application_context: {
          brand_name: "AthLink",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/payment/paypal/success`,
          cancel_url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/payment/paypal/cancel`
        }
      })
    })

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      console.error("❌ Erreur création ordre PayPal:", errorText)
      return NextResponse.json({ error: "Erreur création ordre PayPal" }, { status: 500 })
    }

    const order = await orderResponse.json()

    // Enregistrer l'ordre en attente dans la base de données
    const pendingPurchases = stats.pendingPurchases || []
    pendingPurchases.push({
      orderId: order.id,
      planId,
      clientName,
      clientEmail,
      amount,
      createdAt: new Date().toISOString(),
      status: "PENDING"
    })

    await prisma.profile.update({
      where: { id: coach.id },
      data: {
        stats: {
          ...stats,
          pendingPurchases
        }
      }
    })

    return NextResponse.json({ 
      orderId: order.id,
      approvalUrl: order.links.find((link: any) => link.rel === "approve")?.href
    })
  } catch (error: any) {
    console.error("❌ Erreur création ordre PayPal:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

