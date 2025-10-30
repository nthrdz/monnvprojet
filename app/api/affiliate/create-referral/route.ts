import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { referralCode, referrerUrl, utmSource, utmMedium, utmCampaign } = body

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Code de parrainage requis' },
        { status: 400 }
      )
    }

    // Trouver l'affilié par son code
    const affiliate = await prisma.affiliate.findUnique({
      where: { affiliateCode: referralCode }
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: 'Code de parrainage invalide' },
        { status: 404 }
      )
    }

    // Vérifier que l'affilié est approuvé
    if (affiliate.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Affilié non approuvé' },
        { status: 403 }
      )
    }

    // Récupérer les informations de la requête
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Vérifier si un referral pending existe déjà pour cette IP/UserAgent dans les dernières 24h
    const existingReferral = await prisma.referral.findFirst({
      where: {
        affiliateId: affiliate.id,
        status: 'PENDING',
        ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Dernières 24h
        }
      }
    })

    if (existingReferral) {
      // Mettre à jour le referral existant
      const updatedReferral = await prisma.referral.update({
        where: { id: existingReferral.id },
        data: {
          referrerUrl,
          utmSource,
          utmMedium,
          utmCampaign,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        referral: updatedReferral,
        message: 'Referral existant mis à jour'
      })
    }

    // Créer un nouveau referral en attente
    const referral = await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referralCode,
        status: 'PENDING',
        conversionType: 'SIGNUP',
        ipAddress,
        userAgent,
        referrerUrl,
        utmSource,
        utmMedium,
        utmCampaign,
      }
    })

    // Incrémenter le compteur de referrals de l'affilié
    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalReferrals: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      referral,
      message: 'Referral créé avec succès'
    })
  } catch (error) {
    console.error('Erreur création referral:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du referral' },
      { status: 500 }
    )
  }
}

