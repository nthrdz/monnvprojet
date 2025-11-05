import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour forcer manuellement la mise à jour du plan
 * Utilisé en cas d'échec du webhook Stripe
 * 
 * Usage: POST /api/admin/force-plan-update
 * Body: { plan: "PRO" | "ELITE", userId?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { plan, userId } = await req.json()
    
    // Valider le plan
    if (!plan || !['PRO', 'ELITE'].includes(plan)) {
      return NextResponse.json({ 
        error: 'Plan invalide. Doit être PRO ou ELITE' 
      }, { status: 400 })
    }

    // Utiliser l'userId fourni ou celui de la session
    const targetUserId = userId || session.user.id

    console.log("🔧 FORCE UPDATE PLAN")
    console.log("   - User ID:", targetUserId)
    console.log("   - Nouveau plan:", plan)
    console.log("   - Demandé par:", session.user.email)

    // Récupérer le profil actuel
    const currentProfile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      select: { plan: true, username: true }
    })

    if (!currentProfile) {
      return NextResponse.json({ 
        error: 'Profil non trouvé' 
      }, { status: 404 })
    }

    console.log("   - Plan actuel:", currentProfile.plan)
    console.log("   - Username:", currentProfile.username)

    // Mettre à jour le plan
    const updatedProfile = await prisma.profile.update({
      where: { userId: targetUserId },
      data: {
        plan: plan as any,
        stats: {
          ...(currentProfile as any).stats,
          manualPlanUpdate: true,
          manualPlanUpdateAt: new Date().toISOString(),
          manualPlanUpdateBy: session.user.email,
        }
      }
    })

    console.log("✅ Plan mis à jour avec succès!")
    console.log("   - Nouveau plan:", updatedProfile.plan)

    return NextResponse.json({ 
      success: true,
      message: `Plan mis à jour de ${currentProfile.plan} vers ${plan}`,
      profile: {
        username: updatedProfile.username,
        oldPlan: currentProfile.plan,
        newPlan: updatedProfile.plan,
      }
    })

  } catch (error: any) {
    console.error('❌ Erreur force update plan:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error.message 
    }, { status: 500 })
  }
}

/**
 * GET pour vérifier le plan actuel
 */
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { 
        plan: true, 
        username: true,
        stats: true 
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ 
      plan: profile.plan,
      username: profile.username,
      stats: profile.stats
    })

  } catch (error: any) {
    console.error('❌ Erreur get plan:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error.message 
    }, { status: 500 })
  }
}

