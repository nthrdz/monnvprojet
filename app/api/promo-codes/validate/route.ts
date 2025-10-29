import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Codes promo prédéfinis
const PROMO_CODES = {
  "ELITE": {
    type: "plan_upgrade",
    plan: "ATHLETE_PRO",
    duration: null, // Accès permanent
    discount: 0,
    description: "Accès Pro complet"
  },
  "ATHLINK100": {
    type: "trial",
    plan: "ATHLETE_PRO", 
    duration: 30, // 30 jours
    discount: 0,
    description: "1 mois offert Pro"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Code promo requis" }, { status: 400 })
    }

    const promoCode = PROMO_CODES[code.toUpperCase() as keyof typeof PROMO_CODES]

    if (!promoCode) {
      return NextResponse.json({ 
        error: "Code promo invalide",
        valid: false 
      }, { status: 404 })
    }

    // Vérifier si le code a déjà été utilisé (optionnel - pour limiter l'usage)
    // Pour l'instant, on autorise l'usage multiple
    
    return NextResponse.json({
      valid: true,
      code: code.toUpperCase(),
      type: promoCode.type,
      plan: promoCode.plan,
      duration: promoCode.duration,
      discount: promoCode.discount,
      description: promoCode.description
    })

  } catch (error) {
    console.error("Erreur validation code promo:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
