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

    // Vérifier que l'utilisateur a un profil affilié, sinon le créer
    let affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id }
    })

    // 🎁 CRÉATION AUTOMATIQUE du profil affilié si nécessaire
    if (!affiliate) {
      console.log('🎁 Création automatique du profil affilié pour:', session.user.id)
      
      // Récupérer le profil pour le username
      const userProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { username: true, plan: true }
      })

      // Vérifier que l'utilisateur est bien PRO ou ELITE
      if (!userProfile || (userProfile.plan !== 'PRO' && userProfile.plan !== 'ELITE')) {
        return NextResponse.json({ 
          error: 'Seuls les utilisateurs PRO et ELITE peuvent devenir affiliés' 
        }, { status: 403 })
      }

      // Générer un code affilié unique basé sur le username
      let affiliateCode = userProfile.username.toLowerCase()
      
      // Vérifier si le code existe déjà
      const existingAffiliate = await prisma.affiliate.findUnique({
        where: { affiliateCode }
      })

      if (existingAffiliate) {
        // Ajouter un suffixe aléatoire si le code existe déjà
        affiliateCode = `${userProfile.username}_${Math.random().toString(36).substring(2, 8)}`.toLowerCase()
      }

      // Créer le profil affilié automatiquement
      affiliate = await prisma.affiliate.create({
        data: {
          userId: session.user.id,
          affiliateCode: affiliateCode,
          status: 'APPROVED',
          commissionRate: 0.40,
          approvedAt: new Date(),
          rewardfulAffiliateLink: rewardfulLink // Sauvegarder le lien dès la création
        }
      })

      console.log('✅ Profil affilié créé automatiquement avec lien Rewardful:', affiliate.affiliateCode)

      return NextResponse.json({
        success: true,
        message: 'Profil affilié créé et lien Rewardful sauvegardé avec succès',
        rewardfulLink: affiliate.rewardfulAffiliateLink,
        affiliateCode: affiliate.affiliateCode
      })
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

