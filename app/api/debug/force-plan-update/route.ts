import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API de DEBUG pour forcer la mise à jour du plan
 * À SUPPRIMER en production !
 */
export async function POST(req: NextRequest) {
  // Autoriser uniquement en développement
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { plan } = await req.json()
    
    if (!['FREE', 'PRO', 'ELITE'].includes(plan)) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    console.log("🔧 DEBUG: Mise à jour forcée du plan")
    console.log("   - User ID:", session.user.id)
    console.log("   - Nouveau plan:", plan)

    // Mettre à jour le plan directement
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        plan: plan as any,
        stats: {
          ...await prisma.profile.findUnique({
            where: { userId: session.user.id },
            select: { stats: true }
          }).then(p => p?.stats as any || {}),
          debugForcedAt: new Date().toISOString()
        }
      }
    })

    console.log("✅ Plan mis à jour:", updatedProfile.plan)

    return NextResponse.json({ 
      success: true, 
      plan: updatedProfile.plan,
      message: `Plan forcé vers ${plan}` 
    })

  } catch (error: any) {
    console.error("❌ Erreur:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

