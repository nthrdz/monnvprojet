import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { canUserAccessFeature } from "@/lib/features"

export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 365 // Dernière année
        },
        links: {
          select: { id: true, title: true, url: true }
        }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Vérifier l'accès Elite
    const canExport = canUserAccessFeature(profile.plan as any, "dataExport")
    if (!canExport) {
      return NextResponse.json({ error: "Fonctionnalité réservée au plan Elite" }, { status: 403 })
    }

    // Préparer les données CSV
    const csvRows = []
    
    // En-têtes
    csvRows.push([
      'Date',
      'Vues',
      'Vues Uniques',
      'Clics sur Liens',
      'Appareil',
      'Pays',
      'Referrer'
    ].join(','))

    // Données analytics
    for (const analytic of profile.analytics) {
      csvRows.push([
        analytic.date.toISOString().split('T')[0],
        analytic.views,
        analytic.uniqueViews,
        analytic.linkClicks,
        analytic.device || 'N/A',
        analytic.country || 'N/A',
        analytic.referrer || 'N/A'
      ].join(','))
    }

    // Ajouter une section pour les liens
    csvRows.push('') // Ligne vide
    csvRows.push('LIENS')
    csvRows.push(['ID', 'Titre', 'URL'].join(','))
    
    for (const link of profile.links) {
      csvRows.push([
        link.id,
        `"${link.title.replace(/"/g, '""')}"`, // Échapper les guillemets
        link.url
      ].join(','))
    }

    // Ajouter les données démographiques si disponibles
    const stats = profile.stats as any
    if (stats?.demographics) {
      csvRows.push('') // Ligne vide
      csvRows.push('DÉMOGRAPHIE')
      
      // Appareils
      csvRows.push('Appareils')
      csvRows.push(['Type', 'Nombre'].join(','))
      for (const [device, count] of Object.entries(stats.demographics.devices || {})) {
        csvRows.push([device, count].join(','))
      }
      
      csvRows.push('') // Ligne vide
      
      // Navigateurs
      csvRows.push('Navigateurs')
      csvRows.push(['Navigateur', 'Nombre'].join(','))
      for (const [browser, count] of Object.entries(stats.demographics.browsers || {})) {
        csvRows.push([browser, count].join(','))
      }
    }

    // Créer le CSV
    const csv = csvRows.join('\n')
    
    // Retourner le fichier CSV
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="athlink-analytics-${profile.username}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Erreur export CSV:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'export" },
      { status: 500 }
    )
  }
}

