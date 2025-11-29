import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

/**
 * Webhook PayPal pour gérer les événements de paiement
 * 
 * Événements gérés :
 * - PAYMENT.CAPTURE.COMPLETED : Paiement réussi, envoyer le PDF
 * - PAYMENT.CAPTURE.DENIED : Paiement refusé
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const eventType = body.event_type

    console.log("============================================================")
    console.log("🎣 WEBHOOK PAYPAL REÇU")
    console.log("Type d'événement:", eventType)
    console.log("============================================================")

    // Vérifier la signature du webhook (optionnel mais recommandé)
    // Pour l'instant, on accepte tous les webhooks (à sécuriser en production)

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource
      const orderId = resource.supplementary_data?.related_ids?.order_id
      const captureId = resource.id
      const amount = parseFloat(resource.amount.value)
      const currency = resource.amount.currency_code
      const customId = resource.custom_id

      console.log("✅ Paiement PayPal complété")
      console.log("Order ID:", orderId)
      console.log("Capture ID:", captureId)
      console.log("Montant:", amount, currency)
      console.log("Custom ID:", customId)

      if (!customId) {
        console.error("❌ Custom ID manquant")
        return NextResponse.json({ error: "Custom ID manquant" }, { status: 400 })
      }

      const customData = JSON.parse(customId)
      const { planId, coachId, clientName, clientEmail, coachUsername } = customData

      // Récupérer le coach et son plan
      const coach = await prisma.profile.findUnique({
        where: { id: coachId },
        select: { 
          id: true, 
          displayName: true, 
          stats: true,
          email: true
        }
      })

      if (!coach) {
        console.error("❌ Coach non trouvé:", coachId)
        return NextResponse.json({ error: "Coach non trouvé" }, { status: 404 })
      }

      const stats = coach.stats as any || {}
      const trainingPlans = stats.trainingPlans || []
      const plan = trainingPlans.find((p: any) => p.id === planId)

      if (!plan) {
        console.error("❌ Plan non trouvé:", planId)
        return NextResponse.json({ error: "Plan non trouvé" }, { status: 404 })
      }

      if (!plan.pdfFileName) {
        console.error("❌ Aucun PDF disponible pour ce plan")
        return NextResponse.json({ error: "Aucun PDF disponible" }, { status: 404 })
      }

      // Télécharger le PDF depuis Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.error("❌ Configuration Supabase manquante")
        return NextResponse.json({ error: "Configuration Supabase manquante" }, { status: 500 })
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      
      console.log("📥 Téléchargement du PDF depuis Supabase...")
      const { data: pdfData, error: downloadError } = await supabase.storage
        .from("training-plans")
        .download(plan.pdfFileName)

      if (downloadError || !pdfData) {
        console.error("❌ Erreur téléchargement PDF:", downloadError)
        return NextResponse.json({ error: "Erreur téléchargement PDF" }, { status: 500 })
      }

      // Convertir le Blob en Buffer puis en base64
      const arrayBuffer = await pdfData.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64Pdf = buffer.toString("base64")

      console.log("✅ PDF téléchargé, taille:", buffer.length, "bytes")

      // Envoyer l'email avec le PDF
      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

      if (!resend) {
        console.error("❌ RESEND_API_KEY non configurée")
        return NextResponse.json({ error: "Configuration email manquante" }, { status: 500 })
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Votre plan d'entraînement est prêt !</h1>
              </div>
              <div class="content">
                <p>Bonjour ${clientName},</p>
                <p>Merci pour votre achat ! Votre paiement de <strong>${amount}€</strong> a été confirmé.</p>
                <p>Votre plan d'entraînement <strong>"${plan.title}"</strong> par ${coach.displayName || coachUsername} est joint à cet email.</p>
                <p>Bon entraînement ! 💪</p>
                <p>L'équipe AthLink</p>
              </div>
            </div>
          </body>
        </html>
      `

      console.log("📧 Envoi de l'email avec le PDF...")
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "AthLink <noreply@athlink.com>",
        to: clientEmail,
        subject: `Votre plan d'entraînement: ${plan.title}`,
        html: emailHtml,
        attachments: [
          {
            filename: plan.pdfFileName,
            content: base64Pdf
          }
        ]
      })

      console.log("✅ Email envoyé avec succès:", emailResult.id)

      // Mettre à jour les stats du coach
      const purchases = stats.purchases || []
      purchases.push({
        id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        planId,
        clientEmail,
        clientName,
        amount,
        purchasedAt: new Date().toISOString(),
        status: "completed",
        paymentMethod: "paypal",
        orderId,
        captureId
      })

      // Retirer de pendingPurchases
      const pendingPurchases = (stats.pendingPurchases || []).filter(
        (p: any) => p.orderId !== orderId
      )

      await prisma.profile.update({
        where: { id: coachId },
        data: {
          stats: {
            ...stats,
            purchases,
            pendingPurchases
          }
        }
      })

      console.log("✅ Achat enregistré dans les stats du coach")
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("❌ Erreur webhook PayPal:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

