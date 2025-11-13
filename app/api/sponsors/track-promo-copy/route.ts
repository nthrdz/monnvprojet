import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * API pour tracker les copies de code promo
 * POST /api/sponsors/track-promo-copy
 */
export async function POST(req: NextRequest) {
  try {
    const { sponsorId } = await req.json()

    if (!sponsorId) {
      return NextResponse.json(
        { error: 'ID sponsor requis' },
        { status: 400 }
      )
    }

    // Incrémenter le compteur de copies de code promo
    const sponsor = await prisma.sponsor.update({
      where: { id: sponsorId },
      data: {
        promoCodeCopies: {
          increment: 1
        }
      },
      select: {
        id: true,
        name: true,
        promoCodeCopies: true
      }
    })

    return NextResponse.json({
      success: true,
      sponsor
    })

  } catch (error: any) {
    console.error('Erreur tracking copie code promo:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

