import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { supabase } from "@/lib/supabase"

// Configuration pour permettre l'upload de fichiers jusqu'à 50MB
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max

// 🔧 IMPORTANT : Configuration de la taille maximale du body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, plan: true }
    })

    if (!profile || (profile.plan !== "COACH" && profile.plan !== "ELITE")) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Vérifier que Supabase est configuré
    if (!supabase) {
      console.error("❌ Supabase non configuré")
      return NextResponse.json({ 
        error: "Service de stockage non configuré. Veuillez contacter l'administrateur." 
      }, { status: 500 })
    }

    const formData = await request.formData()
    const pdfFile = formData.get('pdfFile') as File | null
    const planId = formData.get('planId') as string

    if (!pdfFile) {
      return NextResponse.json({ error: "Aucun fichier PDF fourni" }, { status: 400 })
    }

    if (!planId) {
      return NextResponse.json({ error: "ID du plan manquant" }, { status: 400 })
    }

    // Vérifier que le fichier est un PDF
    if (pdfFile.type !== 'application/pdf') {
      return NextResponse.json({ error: "Le fichier doit être un PDF" }, { status: 400 })
    }

    // Vérifier la taille du fichier (max 50MB)
    if (pdfFile.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "Le fichier est trop volumineux (max 50MB)" }, { status: 400 })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `plan_${planId}_${timestamp}_${randomString}.pdf`
    const filePath = `coaching/${profile.id}/${fileName}`

    // Convertir le fichier en buffer
    const bytes = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('athlink-images')
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
        cacheControl: '31536000' // Cache 1 an
      })

    if (error) {
      console.error("Erreur Supabase upload:", error)
      return NextResponse.json({ 
        error: `Erreur lors de l'upload: ${error.message}` 
      }, { status: 500 })
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('athlink-images')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    return NextResponse.json({ 
      success: true, 
      fileName: fileName, // Nom du fichier généré
      originalName: pdfFile.name, // Nom original du fichier
      fileUrl: publicUrl, // URL Supabase
      fileSize: pdfFile.size
    })

  } catch (error) {
    console.error("Erreur lors de l'upload du PDF:", error)
    return NextResponse.json({ 
      error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    }, { status: 500 })
  }
}

