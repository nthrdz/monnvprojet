import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/db"
import sharp from "sharp"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "avatar", "cover", "media", or "sponsor"

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
    }

    // Validate file type
    const isMedia = type === "media"
    const isSponsor = type === "sponsor"
    const validTypes = isMedia 
      ? ["image/", "video/"] 
      : ["image/"]
    
    const isValidType = validTypes.some(validType => file.type.startsWith(validType))
    
    if (!isValidType) {
      return NextResponse.json({ 
        error: isMedia 
          ? "Le fichier doit être une image ou une vidéo" 
          : "Le fichier doit être une image" 
      }, { status: 400 })
    }

    // Reject HEIC/HEIF files explicitly
    if (file.type === "image/heic" || file.type === "image/heif" || 
        file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
      return NextResponse.json({ 
        error: "Les fichiers HEIC/HEIF ne sont pas supportés. Veuillez convertir votre image en JPEG, PNG ou WebP." 
      }, { status: 400 })
    }

    // Validate file size (max 50MB for videos, 10MB for images, 30MB for others)
    const isVideo = file.type.startsWith("video/")
    const maxSize = isVideo 
      ? 50 * 1024 * 1024  // 50MB for videos
      : isMedia 
        ? 10 * 1024 * 1024  // 10MB for images
        : 30 * 1024 * 1024   // 30MB for others (avatar, cover, sponsor)
    
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: isVideo 
          ? "Fichier vidéo trop volumineux (max 50MB)" 
          : isMedia 
            ? "Fichier trop volumineux (max 10MB)" 
            : "Fichier trop volumineux (max 30MB)" 
      }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Convert File to ArrayBuffer then to Buffer
    const arrayBuffer = await file.arrayBuffer()
    let buffer = Buffer.from(arrayBuffer)

    // Optimize image quality for avatars and covers (not videos)
    // Resize to very high resolution (2000px) with maximum quality
    if (!isVideo && (type === "avatar" || type === "cover")) {
      try {
        const targetSize = type === "avatar" ? 2000 : 2400
        buffer = await sharp(buffer)
          .resize(targetSize, type === "avatar" ? 2000 : 800, {
            fit: 'cover',
            position: 'center',
            withoutEnlargement: false
          })
          .png({ quality: 100, compressionLevel: 0 }) // PNG sans compression pour qualité maximale
          .toBuffer()
      } catch (sharpError) {
        // If sharp fails, use original buffer
        console.warn("Sharp optimization failed, using original:", sharpError)
      }
    }

    // Generate unique filename
    const fileExt = type === "avatar" || type === "cover" ? "png" : file.name.split('.').pop()
    const fileName = `${profile.id}-${type}-${Date.now()}.${fileExt}`
    const filePath = `${type}s/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('athlink-images')
      .upload(filePath, buffer, {
        contentType: type === "avatar" || type === "cover" ? "image/png" : file.type,
        upsert: true,
        cacheControl: '31536000' // Cache 1 an
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('athlink-images')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    // Update profile with new image URL (only for avatar and cover)
    if (type === "avatar" || type === "cover") {
      const updateData = type === "avatar" 
        ? { avatarUrl: publicUrl }
        : { coverUrl: publicUrl }

      await prisma.profile.update({
        where: { id: profile.id },
        data: updateData
      })
    }

    return NextResponse.json({ url: publicUrl })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
