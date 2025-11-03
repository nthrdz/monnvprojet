import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import jsPDF from "jspdf"

// Force Node.js runtime (jsPDF requires Node.js APIs)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        links: { where: { isActive: true }, orderBy: { position: 'asc' } }
      }
    })

    if (!profile) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 })
    }

    // Récupérer les paramètres de la requête
    const { days = 7 } = await request.json()
    
    // Calculer la date de début
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Récupérer les analytics pour la période
    const analytics = await prisma.analytics.findMany({
      where: {
        profileId: profile.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    })

    // Récupérer les clics sur les liens
    const linkClicks = await prisma.link.aggregate({
      where: { profileId: profile.id },
      _sum: { clicks: true }
    })

    // Calculer les totaux
    const totalViews = analytics.reduce((sum, day) => sum + (day.views || 0), 0)
    const totalUniqueViews = analytics.reduce((sum, day) => sum + (day.uniqueViews || 0), 0)
    const totalClicks = linkClicks._sum.clicks || 0
    const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0
    
    // Calculer la moyenne par jour
    const avgViewsPerDay = days > 0 ? Math.round(totalViews / days) : 0
    const avgUniquePerDay = days > 0 ? Math.round(totalUniqueViews / days) : 0
    const avgClicksPerDay = days > 0 ? Math.round(totalClicks / days) : 0

    // Créer le PDF (format A4)
    const pdf = new jsPDF()
    
    // Couleurs simples (tuple pour TypeScript)
    const primary: [number, number, number] = [17, 24, 39]   // gray-900
    const secondary: [number, number, number] = [107, 114, 128] // gray-500  
    const accent: [number, number, number] = [59, 130, 246]  // blue-500

    // === EN-TÊTE SIMPLE ===
    pdf.setFontSize(24)
    pdf.setTextColor(...primary)
    pdf.text('ATHLINK', 20, 25)
    
    pdf.setFontSize(12)
    pdf.text('Rapport de Performance', 20, 35)
    
    pdf.setFontSize(10)
    pdf.setTextColor(...secondary)
    pdf.text(`${profile.displayName} (@${profile.username})`, 20, 43)
    pdf.text(`${days} derniers jours • ${new Date().toLocaleDateString('fr-FR')}`, 20, 49)

    // Ligne de séparation
    pdf.setDrawColor(...accent)
    pdf.setLineWidth(0.5)
    pdf.line(20, 54, 190, 54)

    // === STATISTIQUES PRINCIPALES EN GRAND ===
    let yPos = 65

    // 4 stats en ligne
    const stats = [
      { label: 'Vues', value: totalViews, sub: `${avgViewsPerDay}/j` },
      { label: 'Visiteurs', value: totalUniqueViews, sub: `${avgUniquePerDay}/j` },
      { label: 'Clics', value: totalClicks, sub: `${avgClicksPerDay}/j` },
      { label: 'Taux clic', value: `${clickRate.toFixed(1)}%`, sub: clickRate > 3 ? 'Bon' : 'Moyen' }
    ]

    stats.forEach((stat, i) => {
      const x = 20 + (i * 45)
      
      // Label
      pdf.setFontSize(9)
      pdf.setTextColor(...secondary)
      pdf.text(stat.label, x, yPos)
      
      // Valeur en grand
      pdf.setFontSize(20)
      pdf.setTextColor(...accent)
      pdf.text(String(stat.value), x, yPos + 10)
      
      // Sous-titre
      pdf.setFontSize(8)
      pdf.setTextColor(...secondary)
      pdf.text(stat.sub, x, yPos + 17)
    })

    yPos += 35

    // === GRAPHIQUE D'ÉVOLUTION SIMPLE ===
    pdf.setFontSize(11)
    pdf.setTextColor(...primary)
    pdf.text('Évolution des vues', 20, yPos)
    yPos += 8

    // Créer un graphique simple en ligne
    const graphX = 20
    const graphY = yPos
    const graphWidth = 170
    const graphHeight = 40

    // Cadre du graphique
    pdf.setDrawColor(...secondary)
    pdf.setLineWidth(0.3)
    pdf.rect(graphX, graphY, graphWidth, graphHeight)

    // Lignes horizontales de grille
    for (let i = 1; i <= 3; i++) {
      const y = graphY + (graphHeight / 4) * i
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.1)
      pdf.line(graphX, y, graphX + graphWidth, y)
    }

    // Tracer les points si on a des données
    if (analytics.length > 1) {
      const maxViews = Math.max(...analytics.map(a => a.views || 0), 1)
      const pointSpacing = graphWidth / Math.max(analytics.length - 1, 1)

      pdf.setDrawColor(...accent)
      pdf.setLineWidth(1.5)

      // Tracer les lignes entre les points
      analytics.forEach((point, index) => {
        if (index < analytics.length - 1) {
          const x1 = graphX + (index * pointSpacing)
          const y1 = graphY + graphHeight - ((point.views || 0) / maxViews) * graphHeight
          const x2 = graphX + ((index + 1) * pointSpacing)
          const y2 = graphY + graphHeight - ((analytics[index + 1].views || 0) / maxViews) * graphHeight

          pdf.line(x1, y1, x2, y2)
        }

        // Ajouter un point
        const x = graphX + (index * pointSpacing)
        const y = graphY + graphHeight - ((point.views || 0) / maxViews) * graphHeight
        pdf.setFillColor(...accent)
        pdf.circle(x, y, 1.5, 'F')
      })
    }

    // Labels des axes
    pdf.setFontSize(7)
    pdf.setTextColor(...secondary)
    pdf.text('0', graphX - 5, graphY + graphHeight + 2)
    if (analytics.length > 0) {
      const maxViews = Math.max(...analytics.map(a => a.views || 0))
      pdf.text(String(maxViews), graphX - 5, graphY + 3)
    }

    yPos += graphHeight + 15

    // === TOP 3 DES LIENS ===
    pdf.setFontSize(11)
    pdf.setTextColor(...primary)
    pdf.text('Top 3 des liens', 20, yPos)
    yPos += 10

    if (profile.links.length > 0) {
      const topLinks = profile.links
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 3)

      topLinks.forEach((link, index) => {
        const clicks = link.clicks || 0
        let linkName = link.title
        if (linkName.length > 40) {
          linkName = linkName.substring(0, 37) + '...'
        }

        pdf.setFontSize(9)
        pdf.setTextColor(...primary)
        pdf.text(`${index + 1}. ${linkName}`, 25, yPos)
        pdf.text(`${clicks} clics`, 170, yPos, { align: 'right' })

        yPos += 7
      })
    } else {
      pdf.setFontSize(9)
      pdf.setTextColor(...secondary)
      pdf.text('Aucun lien actif', 25, yPos)
      yPos += 7
    }

    yPos += 8

    // === CONSEILS SIMPLES ===
    pdf.setFontSize(11)
    pdf.setTextColor(...primary)
    pdf.text('Recommandations', 20, yPos)
    yPos += 8

    // 2 conseils simples et directs
    const tips = []
    
    if (clickRate < 3) {
      tips.push('Améliorez vos titres : utilisez des verbes d\'action et des émojis')
    } else {
      tips.push('Continuez à créer du contenu engageant pour votre audience')
    }
    
    if (totalClicks < 20) {
      tips.push('Partagez votre profil sur vos réseaux sociaux pour plus de visibilité')
    } else {
      tips.push('Analysez vos liens les plus cliqués pour optimiser votre stratégie')
    }

    tips.forEach((tip, index) => {
      pdf.setFontSize(9)
      pdf.setTextColor(...primary)
      pdf.text(`${index + 1}. ${tip}`, 25, yPos)
      yPos += 7
    })

    // === PIED DE PAGE ===
    const footerY = 280
    pdf.setFontSize(8)
    pdf.setTextColor(...secondary)
    pdf.text('athlink.fr', 20, footerY)
    pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 170, footerY, { align: 'right' })

    // Convertir en buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Retourner le PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rapport-${profile.username}-${days}j-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erreur génération PDF:', error)
    return NextResponse.json({ error: "Erreur lors de la génération du PDF" }, { status: 500 })
  }
}
