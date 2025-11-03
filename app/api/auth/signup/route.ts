import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"
import { signupSchema, mapSportToEnum, createStatsWithOriginalSport } from "@/lib/validations"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = signupSchema.parse(body)
    
    // 🎯 Récupérer le code de parrainage si présent
    const referralCode = body.referralCode || null

    // Check if email exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    // Check if username exists
    const existingUsername = await prisma.profile.findUnique({
      where: { username: validatedData.username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)

    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        profile: {
          create: {
            username: validatedData.username,
            displayName: validatedData.name,
            sport: mapSportToEnum(validatedData.sport),
            stats: createStatsWithOriginalSport(null, validatedData.sport),
            plan: "FREE"
          }
        }
      },
      include: {
        profile: true
      }
    })

    // 🎯 Si un code de parrainage existe, créer la conversion
    if (referralCode) {
      try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        await fetch(`${baseUrl}/api/affiliate/convert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: referralCode,
            userId: user.id,
            planType: 'FREE', // On peut upgrade plus tard
          })
        })
        console.log(`✅ Conversion du parrainage ${referralCode} pour l'utilisateur ${user.id}`)
      } catch (conversionError) {
        console.error('❌ Erreur conversion parrainage:', conversionError)
        // On continue même si la conversion échoue
      }
    }

    // 📧 Envoyer l'email de bienvenue
    try {
      await sendWelcomeEmail(user.email, user.name || 'Athlète')
      console.log('✅ Email de bienvenue envoyé à:', user.email)
    } catch (emailError) {
      console.error('❌ Erreur envoi email de bienvenue:', emailError)
      // On ne bloque pas l'inscription si l'email échoue
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.profile?.username
      },
      referralApplied: !!referralCode
    }, { status: 201 })

  } catch (error: any) {
    console.error("Signup error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    )
  }
}
