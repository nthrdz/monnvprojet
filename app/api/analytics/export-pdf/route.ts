import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import jsPDF from "jspdf"

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

    // Calculer les totaux avec précision
    const totalViews = analytics.reduce((sum, day) => sum + (day.views || 0), 0)
    const totalUniqueViews = analytics.reduce((sum, day) => sum + (day.uniqueViews || 0), 0)
    const totalClicks = linkClicks._sum.clicks || 0
    const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0
    
    // Calculer la moyenne par jour
    const avgViewsPerDay = days > 0 ? Math.round(totalViews / days) : 0
    const avgUniquePerDay = days > 0 ? Math.round(totalUniqueViews / days) : 0

    // Créer le PDF (format A4)
    const pdf = new jsPDF()
    
    // Configuration des couleurs (RGB)
    const colors = {
      primary: [31, 41, 55],      // gray-800
      secondary: [107, 114, 128], // gray-500
      accent: [239, 68, 68],      // red-500
      success: [16, 185, 129],    // emerald-500
      blue: [59, 130, 246],       // blue-500
      orange: [245, 158, 11]      // amber-500
    }

    // Fonction helper pour définir les couleurs
    const setColor = (color: number[]) => pdf.setTextColor(color[0], color[1], color[2])
    const setDrawColor = (color: number[]) => pdf.setDrawColor(color[0], color[1], color[2])
    const setFillColor = (color: number[]) => pdf.setFillColor(color[0], color[1], color[2])

    // === EN-TÊTE ===
    // Logo/Titre principal
    pdf.setFontSize(22)
    setColor(colors.accent)
    pdf.text('ATHLINK', 20, 25)
    
    pdf.setFontSize(14)
    setColor(colors.primary)
    pdf.text('Rapport de Performance', 20, 35)
    
    // Informations du profil
    pdf.setFontSize(10)
    setColor(colors.secondary)
    pdf.text(`${profile.displayName} (@${profile.username})`, 20, 43)
    pdf.text(`${days} derniers jours • ${new Date().toLocaleDateString('fr-FR')}`, 20, 50)

    // Ligne de séparation
    setDrawColor(colors.accent)
    pdf.setLineWidth(1)
    pdf.line(20, 55, 190, 55)

    // === STATISTIQUES PRINCIPALES ===
    let yPos = 70

    // Titre section
    pdf.setFontSize(12)
    setColor(colors.primary)
    pdf.text('PERFORMANCE GLOBALE', 20, yPos)
    yPos += 12

    // Grille des statistiques principales (2x2)
    const stats = [
      { 
        label: 'VUES TOTALES', 
        value: totalViews.toLocaleString('fr-FR'), 
        color: colors.accent,
        subtitle: `${avgViewsPerDay}/jour`
      },
      { 
        label: 'VISITEURS UNIQUES', 
        value: totalUniqueViews.toLocaleString('fr-FR'), 
        color: colors.success,
        subtitle: `${avgUniquePerDay}/jour`
      },
      { 
        label: 'CLICS TOTAL', 
        value: totalClicks.toLocaleString('fr-FR'), 
        color: colors.blue,
        subtitle: `${Math.round(totalClicks / Math.max(days, 1))}/jour`
      },
      { 
        label: 'TAUX DE CLIC', 
        value: `${clickRate.toFixed(1)}%`, 
        color: colors.orange,
        subtitle: `${Math.round(totalClicks / Math.max(totalViews, 1) * 100)}% efficace`
      }
    ]

    // Affichage en grille 2x2 avec espacement optimisé
    stats.forEach((stat, index) => {
      const x = 20 + (index % 2) * 90
      const y = yPos + Math.floor(index / 2) * 32

      // Cadre de la stat avec ombre légère
      pdf.setLineWidth(0.5)
      setDrawColor(stat.color)
      pdf.rect(x, y, 85, 28)

      // Label
      pdf.setFontSize(8)
      setColor(colors.secondary)
      pdf.text(stat.label, x + 5, y + 8)

      // Valeur principale
      pdf.setFontSize(16)
      setColor(stat.color)
      pdf.text(stat.value, x + 5, y + 18)

      // Sous-titre
      pdf.setFontSize(7)
      setColor(colors.secondary)
      pdf.text(stat.subtitle, x + 5, y + 24)
    })

    yPos += 70

    // === TOP 5 DES LIENS ===
    if (profile.links.length > 0) {
      pdf.setFontSize(12)
      setColor(colors.primary)
      pdf.text('TOP 5 DES LIENS', 20, yPos)
      yPos += 12

      // Top 5 des liens triés
      const topLinks = profile.links
        .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5)

      topLinks.forEach((link, index) => {
        const clicks = link.clicks || 0
        const percentage = totalClicks > 0 ? ((clicks / totalClicks) * 100) : 0
        
        // Nom du lien (tronqué intelligemment)
        let linkName = link.title
        if (linkName.length > 30) {
          linkName = linkName.substring(0, 27) + '...'
        }
        
        // Rang et nom
        pdf.setFontSize(9)
        setColor(colors.primary)
        pdf.text(`${index + 1}. ${linkName}`, 20, yPos)
        
        // Valeurs alignées à droite
        pdf.text(clicks.toString(), 140, yPos)
        pdf.text(`${percentage.toFixed(1)}%`, 165, yPos)
        
        // Barre de progression visuelle
        const barWidth = Math.max(1, (percentage / 100) * 35)
        setFillColor(colors.accent)
        pdf.rect(20, yPos + 1, barWidth, 2, 'F')
        
        yPos += 6
      })
    }

    // === ANALYSE DE PERFORMANCE ===
    yPos += 6
    pdf.setFontSize(10)
    setColor(colors.primary)
    pdf.text('ANALYSE DE PERFORMANCE', 20, yPos)
    yPos += 8

    // Calculer des métriques avancées
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0
    const engagementScore = Math.min(100, Math.round((totalClicks * 2 + totalUniqueViews) / Math.max(totalViews, 1) * 10))
    const growthRate = analytics.length > 1 ? 
      Math.round(((analytics[analytics.length - 1]?.views || 0) - (analytics[0]?.views || 0)) / Math.max(analytics[0]?.views || 1, 1) * 100) : 0
    
    // Métriques de performance en grille 2x2
    const performanceMetrics = [
      { 
        label: 'TAUX DE CONVERSION', 
        value: `${conversionRate.toFixed(1)}%`, 
        color: conversionRate > 5 ? colors.success : conversionRate > 2 ? colors.orange : colors.accent,
        description: conversionRate > 5 ? 'Excellent' : conversionRate > 2 ? 'Correct' : 'À améliorer'
      },
      { 
        label: 'SCORE ENGAGEMENT', 
        value: `${engagementScore}/100`, 
        color: engagementScore > 70 ? colors.success : engagementScore > 40 ? colors.orange : colors.accent,
        description: engagementScore > 70 ? 'Fort' : engagementScore > 40 ? 'Modéré' : 'Faible'
      },
      { 
        label: 'CROISSANCE', 
        value: `${growthRate > 0 ? '+' : ''}${growthRate}%`, 
        color: growthRate > 10 ? colors.success : growthRate > 0 ? colors.orange : colors.accent,
        description: growthRate > 10 ? 'En hausse' : growthRate > 0 ? 'Stable' : 'En baisse'
      },
      { 
        label: 'RÉTENTION', 
        value: `${totalUniqueViews > 0 ? ((totalUniqueViews / totalViews) * 100).toFixed(0) : 0}%`, 
        color: (totalUniqueViews / Math.max(totalViews, 1)) > 0.6 ? colors.success : colors.orange,
        description: (totalUniqueViews / Math.max(totalViews, 1)) > 0.6 ? 'Bonne' : 'Moyenne'
      }
    ]

    // Affichage en grille 2x2 compacte
    performanceMetrics.forEach((metric, index) => {
      const x = 20 + (index % 2) * 90
      const y = yPos + Math.floor(index / 2) * 20

      // Cadre de la métrique
      pdf.setLineWidth(0.3)
      setDrawColor(metric.color)
      pdf.rect(x, y, 85, 16)

      // Label
      pdf.setFontSize(7)
      setColor(colors.secondary)
      pdf.text(metric.label, x + 3, y + 5)

      // Valeur
      pdf.setFontSize(12)
      setColor(metric.color)
      pdf.text(metric.value, x + 3, y + 12)

      // Description
      pdf.setFontSize(6)
      setColor(colors.secondary)
      pdf.text(metric.description, x + 3, y + 15)
    })

    // === CONSEILS D'OPTIMISATION ===
    yPos += 45
    
    // Titre principal de la section
    pdf.setFontSize(12)
    setColor(colors.accent)
    pdf.text('💡 CONSEILS D\'OPTIMISATION', 20, yPos)
    yPos += 12

    // Ligne de séparation
    setDrawColor(colors.accent)
    pdf.setLineWidth(0.5)
    pdf.line(20, yPos - 2, 190, yPos - 2)
    yPos += 8

    // Générer des conseils basés sur l'analyse (toujours afficher au moins 2 conseils)
    const advice = []
    
    // Toujours afficher des conseils basés sur les performances réelles
    const retentionRate = (totalUniqueViews / Math.max(totalViews, 1)) * 100
    
    // Conseil 1: Basé sur le taux de conversion
    advice.push({
      priority: 1,
      icon: '🎯',
      title: 'OPTIMISER VOS TITRES',
      problem: `Taux de clic: ${conversionRate.toFixed(1)}% (objectif: >3%)`,
      description: 'Améliorez l\'attractivité de vos titres pour générer plus de clics:',
      tips: [
        'Utilisez des verbes d\'action: "Découvrir", "Télécharger", "Voir"',
        'Ajoutez des émojis pertinents: 🏃‍♂️ 📱 🏆',
        'Créez de l\'urgence: "Nouveau", "Limité", "Exclusif"'
      ]
    })
    
    // Conseil 2: Basé sur l'engagement
    advice.push({
      priority: 2,
      icon: '💬',
      title: 'AUGMENTER L\'ENGAGEMENT',
      problem: `Score engagement: ${engagementScore}/100 (objectif: >50)`,
      description: 'Créez plus d\'interaction avec votre audience:',
      tips: [
        'Posez des questions directes: "Quel est votre objectif?"',
        'Créez du contenu interactif: sondages, quiz, défis',
        'Répondez rapidement aux commentaires'
      ]
    })
    
    // Conseil 3: Basé sur la croissance (si applicable)
    if (analytics.length > 1) {
      advice.push({
        priority: 3,
        icon: '📈',
        title: 'BOOSTER LA VISIBILITÉ',
        problem: `Croissance: ${growthRate > 0 ? '+' : ''}${growthRate}%`,
        description: 'Attirez plus de nouveaux visiteurs:',
        tips: [
          'Publiez 3-5 fois par semaine minimum',
          'Utilisez les hashtags pertinents: #running #fitness',
          'Collaborez avec d\'autres athlètes'
        ]
      })
    }
    
    // Conseil 4: Basé sur la rétention
    advice.push({
      priority: 4,
      icon: '🔄',
      title: 'FIDÉLISER VOS VISITEURS',
      problem: `Rétention: ${retentionRate.toFixed(0)}% (objectif: >70%)`,
      description: 'Faites revenir vos visiteurs:',
      tips: [
        'Créez du contenu en série: "Jour 1", "Jour 2"...',
        'Établissez une routine: "Mardi Performance"',
        'Offrez du contenu exclusif'
      ]
    })
    
    // Afficher les 2 premiers conseils avec un design simplifié
    advice.slice(0, 2).forEach((item, index) => {
      if (yPos > 230) return // Éviter les débordements
      
      // Titre du conseil
      pdf.setFontSize(9)
      setColor(colors.accent)
      pdf.text(`${item.icon} ${item.title}`, 20, yPos)
      
      // Problème identifié
      pdf.setFontSize(7)
      setColor(colors.secondary)
      pdf.text(item.problem, 20, yPos + 6)
      
      // Description
      pdf.setFontSize(7)
      setColor(colors.primary)
      pdf.text(item.description, 20, yPos + 12)
      
      // Tips
      pdf.setFontSize(6)
      setColor(colors.secondary)
      item.tips.forEach((tip, tipIndex) => {
        pdf.text(`• ${tip}`, 22, yPos + 18 + (tipIndex * 4))
      })
      
      yPos += 18 + (item.tips.length * 4) + 12
    })

    // === INFORMATIONS COMPLÉMENTAIRES ===
    yPos += 15
    
    // Informations sur la période et la performance
    pdf.setFontSize(8)
    setColor(colors.secondary)
    
    const periodInfo = []
    if (days === 1) periodInfo.push('Période: Dernière 24h')
    else if (days === 7) periodInfo.push('Période: 7 derniers jours')
    else if (days === 30) periodInfo.push('Période: 30 derniers jours')
    else periodInfo.push(`Période: ${days} derniers jours`)
    
    periodInfo.push(`Performance: ${clickRate > 5 ? 'Excellente' : clickRate > 2 ? 'Bonne' : 'À améliorer'}`)
    periodInfo.push(`Engagement: ${totalClicks > 100 ? 'Fort' : totalClicks > 20 ? 'Modéré' : 'Faible'}`)
    
    periodInfo.forEach((info, index) => {
      pdf.text(`• ${info}`, 20, yPos + (index * 4))
    })

    // === PIED DE PAGE ===
    const footerY = 275
    pdf.setFontSize(7)
    setColor(colors.secondary)
    pdf.text('Généré par Athlink • athlink.com', 20, footerY)
    pdf.text(`Rapport créé le ${new Date().toLocaleString('fr-FR')}`, 120, footerY)

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
