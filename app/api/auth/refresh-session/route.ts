import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour forcer le rechargement de la session depuis la DB
 * Utilisé après un paiement pour s'assurer que le nouveau plan est visible
 */
export async function POST() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil directement depuis la DB (pas de cache)
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { 
        id: true, 
        plan: true,
        username: true,
        displayName: true 
      }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    console.log("🔄 Session refresh - Plan actuel dans DB:", profile.plan)

    return NextResponse.json({ 
      success: true,
      plan: profile.plan,
      username: profile.username
    })
  } catch (error) {
    console.error('Erreur refresh session:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

