import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Configuration pour permettre l'upload de fichiers jusqu'à 50MB
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    // Créer le dossier de stockage s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'coaching', profile.id)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `plan_${planId}_${timestamp}_${randomString}.pdf`
    const filePath = join(uploadDir, fileName)

    // Sauvegarder le fichier
    const bytes = await pdfFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Générer l'URL publique
    const publicUrl = `/uploads/coaching/${profile.id}/${fileName}`

    return NextResponse.json({ 
      success: true, 
      fileName: fileName, // Nom du fichier généré
      originalName: pdfFile.name, // Nom original du fichier
      fileUrl: publicUrl,
      fileSize: pdfFile.size
    })

  } catch (error) {
    console.error("Erreur lors de l'upload du PDF:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

