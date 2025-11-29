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
    const body = await request.json()
    console.log("📥 Données reçues dans l'API:", JSON.stringify(body, null, 2))
    
    const { planId, coachUsername, clientName, clientEmail, amount } = body

    // Vérification détaillée des données
    const missingFields = []
    if (!planId) missingFields.push("planId")
    if (!coachUsername) missingFields.push("coachUsername")
    if (!clientName) missingFields.push("clientName")
    if (!clientEmail) missingFields.push("clientEmail")
    if (!amount && amount !== 0) missingFields.push("amount")

    if (missingFields.length > 0) {
      console.error("❌ Données manquantes:", missingFields)
      console.error("📋 Données reçues:", {
        planId: planId || "MANQUANT",
        coachUsername: coachUsername || "MANQUANT",
        clientName: clientName || "MANQUANT",
        clientEmail: clientEmail || "MANQUANT",
        amount: amount !== undefined ? amount : "MANQUANT"
      })
      return NextResponse.json({ 
        error: "Données manquantes",
        missingFields 
      }, { status: 400 })
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
      console.error("❌ Plan non trouvé:", planId)
      console.error("📋 Plans disponibles:", trainingPlans.map((p: any) => ({ id: p.id, title: p.title, price: p.price })))
      return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
    }

    console.log("✅ Plan trouvé:", { 
      id: plan.id, 
      title: plan.title, 
      price: plan.price, 
      priceType: typeof plan.price,
      amountReceived: amount,
      amountType: typeof amount,
      planKeys: Object.keys(plan)
    })

    // Convertir le prix en nombre si c'est une string
    let planPrice = plan.price
    if (typeof planPrice === 'string') {
      planPrice = parseFloat(planPrice)
      console.log("🔄 Prix converti depuis string:", planPrice)
    }
    if (typeof planPrice !== 'number' || isNaN(planPrice)) {
      planPrice = 0
    }

    // Utiliser le prix du plan si le montant reçu est 0 ou invalide
    const finalAmount = amount && amount > 0 ? Number(amount) : planPrice
    
    console.log("💰 Calcul montant final:", { 
      amountReceived: amount, 
      planPrice: planPrice, 
      finalAmount: finalAmount 
    })
    
    if (finalAmount <= 0 || isNaN(finalAmount)) {
      console.error("❌ Montant invalide:", { 
        amount, 
        planPrice: plan.price, 
        planPriceConverted: planPrice,
        finalAmount 
      })
      console.error("📋 Plan complet:", JSON.stringify(plan, null, 2))
      return NextResponse.json({ 
        error: `Le prix du plan est invalide (${planPrice}€). Veuillez modifier le prix du plan dans votre dashboard ou contacter le coach.` 
      }, { status: 400 })
    }

    console.log("💰 Montant final utilisé:", finalAmount)
    console.log("💰 Configuration paiement PayPal:")
    console.log("   - Email PayPal du coach:", coach.paypalEmail)
    console.log("   - Montant:", finalAmount, "EUR")
    console.log("   - Le paiement sera envoyé DIRECTEMENT au coach")

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
      const authErrorText = await authResponse.text()
      console.error("❌ Erreur authentification PayPal:", authErrorText)
      console.error("🔑 Client ID utilisé:", process.env.PAYPAL_CLIENT_ID?.substring(0, 10) + "...")
      console.error("🌐 Base URL:", baseUrl)
      return NextResponse.json({ 
        error: "Erreur authentification PayPal. Vérifiez vos clés API." 
      }, { status: 500 })
    }

    const authData = await authResponse.json()
    const { access_token } = authData

    if (!access_token) {
      console.error("❌ Access token manquant dans la réponse PayPal")
      return NextResponse.json({ error: "Erreur authentification PayPal" }, { status: 500 })
    }

    console.log("✅ Authentification PayPal réussie")

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
            value: finalAmount.toFixed(2)
          },
          payee: {
            email_address: coach.paypalEmail
          },
          // ⚠️ IMPORTANT: Le paramètre payee envoie l'argent DIRECTEMENT au coach
          // L'argent n'arrive PAS sur votre compte PayPal, mais directement sur celui du coach
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
      console.error("📋 Status:", orderResponse.status)
      console.error("📋 Status Text:", orderResponse.statusText)
      try {
        const errorJson = JSON.parse(errorText)
        console.error("📋 Erreur détaillée:", JSON.stringify(errorJson, null, 2))
        return NextResponse.json({ 
          error: errorJson.message || errorJson.name || "Erreur création ordre PayPal" 
        }, { status: orderResponse.status })
      } catch {
        return NextResponse.json({ 
          error: "Erreur création ordre PayPal. Vérifiez les logs serveur." 
        }, { status: 500 })
      }
    }

    const order = await orderResponse.json()

    console.log("✅ Ordre PayPal créé:", order.id)
    console.log("💰 DESTINATAIRE DU PAIEMENT:", coach.paypalEmail)
    console.log("📋 Réponse complète PayPal:", JSON.stringify(order, null, 2))

    // Trouver l'URL d'approbation
    const approveLink = order.links?.find((link: any) => link.rel === "approve")
    const approvalUrl = approveLink?.href

    console.log("🔗 URL d'approbation:", approvalUrl)
    console.log("📎 Tous les liens:", order.links)

    if (!approvalUrl) {
      console.error("❌ URL d'approbation manquante dans la réponse PayPal")
      return NextResponse.json({ 
        error: "URL d'approbation PayPal manquante. Veuillez réessayer." 
      }, { status: 500 })
    }

    // Enregistrer l'ordre en attente dans la base de données
    const pendingPurchases = stats.pendingPurchases || []
    pendingPurchases.push({
      orderId: order.id,
      planId,
      clientName,
      clientEmail,
      amount: finalAmount,
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

    console.log("✅ Ordre enregistré dans la base de données")

    return NextResponse.json({ 
      orderId: order.id,
      approvalUrl: approvalUrl
    })
  } catch (error: any) {
    console.error("❌ Erreur création ordre PayPal:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

