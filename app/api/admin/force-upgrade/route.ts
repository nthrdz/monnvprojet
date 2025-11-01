import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour forcer manuellement l'upgrade d'un utilisateur
 * Utile pour déboguer ou corriger un upgrade qui n'a pas fonctionné
 */
export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    // Vérifier que l'utilisateur est admin
    const adminProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { plan: true }
    })

    // Pour le moment, on accepte tout le monde (à sécuriser en production)
    // if (adminProfile?.plan !== 'ADMIN') {
    //   return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    // }

    const body = await req.json()
    const { email, plan } = body

    if (!email || !plan) {
      return NextResponse.json({ 
        error: "Email et plan requis" 
      }, { status: 400 })
    }

    // Valider le plan
    const validPlans = ['FREE', 'PRO', 'ELITE']
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ 
        error: `Plan invalide. Valeurs acceptées: ${validPlans.join(', ')}` 
      }, { status: 400 })
    }

    console.log("🔧 FORCE UPGRADE MANUEL")
    console.log("   - Email:", email)
    console.log("   - Nouveau plan:", plan)

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json({ 
        error: "Utilisateur non trouvé" 
      }, { status: 404 })
    }

    if (!user.profile) {
      return NextResponse.json({ 
        error: "Profil non trouvé" 
      }, { status: 404 })
    }

    const oldPlan = user.profile.plan
    console.log("   - Plan actuel:", oldPlan)

    // Mettre à jour le plan
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: { 
        plan: plan as any,
        stats: {
          ...(user.profile.stats as any || {}),
          manualUpgradeAt: new Date().toISOString(),
          manualUpgradeBy: session.user.email,
          previousPlan: oldPlan
        }
      }
    })

    console.log("✅ Plan mis à jour avec succès")
    console.log("   - Ancien plan:", oldPlan)
    console.log("   - Nouveau plan:", plan)

    return NextResponse.json({ 
      success: true,
      message: `Plan mis à jour de ${oldPlan} vers ${plan}`,
      user: {
        email: user.email,
        oldPlan,
        newPlan: plan
      }
    })

  } catch (error: any) {
    console.error("❌ Erreur force upgrade:", error)
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error.message 
    }, { status: 500 })
  }
}

// GET : Voir les infos d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ 
        error: "Email requis" 
      }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    })

    if (!user) {
      return NextResponse.json({ 
        error: "Utilisateur non trouvé" 
      }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile ? {
          id: user.profile.id,
          username: user.profile.username,
          plan: user.profile.plan,
          stats: user.profile.stats
        } : null
      }
    })

  } catch (error: any) {
    console.error("❌ Erreur GET user:", error)
    return NextResponse.json({ 
      error: "Erreur serveur",
      details: error.message 
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

