import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

/**
 * API pour mettre à jour le lien Rewardful d'un affilié
 */
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { rewardfulLink } = await req.json()

    if (!rewardfulLink || typeof rewardfulLink !== 'string') {
      return NextResponse.json({ error: 'Lien Rewardful invalide' }, { status: 400 })
    }

    // Vérifier que l'utilisateur a un profil affilié
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    if (!affiliate) {
      return NextResponse.json({ error: 'Profil affilié non trouvé' }, { status: 404 })
    }

    // Mettre à jour le lien Rewardful
    const updatedAffiliate = await prisma.affiliate.update({
      where: { userId: session.user.id },
      data: { rewardfulAffiliateLink: rewardfulLink }
    })

    return NextResponse.json({
      success: true,
      message: 'Lien Rewardful mis à jour avec succès',
      rewardfulLink: updatedAffiliate.rewardfulAffiliateLink
    })

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du lien Rewardful:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

