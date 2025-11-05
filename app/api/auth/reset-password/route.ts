import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

/**
 * API pour réinitialiser le mot de passe avec un token
 * Valide le token et met à jour le mot de passe
 */
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token et mot de passe requis' },
        { status: 400 }
      )
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    console.log("🔒 Tentative de réinitialisation avec token:", token.substring(0, 10) + "...")

    // Chercher l'utilisateur avec ce token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token }
    })

    if (!user) {
      console.log("❌ Token invalide ou inexistant")
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      )
    }

    // Vérifier que le token n'a pas expiré
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      console.log("❌ Token expiré")
      
      // Supprimer le token expiré
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null
        }
      })
      
      return NextResponse.json(
        { error: 'Token expiré. Veuillez demander un nouveau lien de réinitialisation.' },
        { status: 400 }
      )
    }

    console.log("✅ Token valide pour:", user.email)

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Mettre à jour le mot de passe et supprimer le token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    })

    console.log("✅✅✅ Mot de passe réinitialisé avec succès pour:", user.email)

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    })

  } catch (error: any) {
    console.error('❌ Erreur reset-password:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

/**
 * GET pour vérifier si un token est valide (avant d'afficher le formulaire)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 400 }
      )
    }

    // Chercher l'utilisateur avec ce token
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken: token },
      select: {
        id: true,
        email: true,
        resetPasswordExpires: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Token invalide' },
        { status: 400 }
      )
    }

    // Vérifier que le token n'a pas expiré
    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'Token expiré' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: user.email
    })

  } catch (error: any) {
    console.error('❌ Erreur validation token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

