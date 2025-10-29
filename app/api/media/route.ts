import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { mediaSchema } from '@/lib/validations'
import { z } from 'zod'

// GET - Récupérer tous les médias de l'utilisateur
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    const media = await prisma.media.findMany({
      where: { profileId: profile.id },
      orderBy: { position: 'asc' }
    })

    return NextResponse.json(media, { status: 200 })

  } catch (error) {
    console.error('GET media error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau média
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = mediaSchema.parse(body)

    // Générer la miniature pour YouTube
    let thumbnail = validatedData.thumbnail
    if (validatedData.type === 'YOUTUBE' && !thumbnail) {
      // Extraire l'ID YouTube de l'URL
      const videoId = extractYouTubeId(validatedData.url)
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }

    // Obtenir la position maximale actuelle
    const maxPosition = await prisma.media.findFirst({
      where: { profileId: profile.id },
      orderBy: { position: 'desc' },
      select: { position: true }
    })

    const newMedia = await prisma.media.create({
      data: {
        profileId: profile.id,
        type: validatedData.type,
        url: validatedData.url,
        thumbnail,
        title: validatedData.title,
        description: validatedData.description,
        position: maxPosition ? maxPosition.position + 1 : 0,
      }
    })

    return NextResponse.json(newMedia, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    }
    console.error('POST media error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Helper pour extraire l'ID d'une vidéo YouTube
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}
