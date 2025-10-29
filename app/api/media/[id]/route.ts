import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { mediaSchema } from '@/lib/validations'
import { z } from 'zod'

// PATCH - Mettre à jour un média
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    // Vérifier que le média appartient à l'utilisateur
    const media = await prisma.media.findFirst({
      where: { id, profileId: profile.id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Média non trouvé' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = mediaSchema.partial().parse(body)

    // Mettre à jour la miniature YouTube si nécessaire
    let thumbnail = validatedData.thumbnail
    if (validatedData.type === 'YOUTUBE' && validatedData.url && !thumbnail) {
      const videoId = extractYouTubeId(validatedData.url)
      if (videoId) {
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        ...validatedData,
        thumbnail: thumbnail || validatedData.thumbnail,
      }
    })

    return NextResponse.json(updatedMedia, { status: 200 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 })
    }
    console.error('PATCH media error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un média
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    // Vérifier que le média appartient à l'utilisateur
    const media = await prisma.media.findFirst({
      where: { id, profileId: profile.id }
    })

    if (!media) {
      return NextResponse.json({ error: 'Média non trouvé' }, { status: 404 })
    }

    await prisma.media.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Média supprimé' }, { status: 200 })

  } catch (error) {
    console.error('DELETE media error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Helper pour extraire l'ID d'une vidéo YouTube
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}
