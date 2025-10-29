import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Fonction pour normaliser l'URL
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.hostname}`
  } catch {
    return url
  }
}

// Fonction pour extraire le logo d'un événement
async function extractEventLogo(url: string) {
  const normalizedUrl = normalizeUrl(url)
  console.log(`🔍 Extraction du logo pour: ${normalizedUrl}`)

  try {
    // 0️⃣ PRIORITÉ 0: Clearbit API (rapide et fiable)
    try {
      const clearbitUrl = `https://logo.clearbit.com/${normalizedUrl.replace(/^https?:\/\//, '')}`
      const clearbitResponse = await fetch(clearbitUrl, { method: 'HEAD' })
      
      if (clearbitResponse.ok) {
        console.log(`✅ Logo trouvé via Clearbit: ${clearbitUrl}`)
        return { logoUrl: clearbitUrl, method: 'clearbit' }
      }
    } catch (error) {
      console.log(`⚠️ Clearbit failed: ${error}`)
    }

    // 1️⃣ PRIORITÉ 1: Scraping intelligent du site
    try {
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AthLink/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
        },
      })

      if (!response.ok) {
        console.log(`⚠️ Response status: ${response.status}`)
        throw new Error(`HTTP ${response.status}`)
      }

      const html = await response.text()
      console.log(`📊 Page chargée, taille: ${html.length} caractères`)

      // Recherche d'images dans les sections header/nav
      const headerImages = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || []
      console.log(`📸 ${headerImages.length} images trouvées dans header/nav`)

      for (const imgTag of headerImages) {
        const srcMatch = imgTag.match(/src=["']([^"']+)["']/)
        if (srcMatch) {
          let imgSrc = srcMatch[1]
          
          // Convertir les URLs relatives en absolues
          if (imgSrc.startsWith('/')) {
            imgSrc = `${normalizedUrl}${imgSrc}`
          } else if (!imgSrc.startsWith('http')) {
            imgSrc = `${normalizedUrl}/${imgSrc}`
          }

          // Vérifier si c'est un logo (nom de fichier ou alt text)
          if (imgSrc.match(/logo|brand|header|nav/i) || 
              imgTag.match(/alt=["'][^"']*(logo|brand|header)[^"']*["']/i)) {
            console.log(`🎯 Logo potentiel trouvé: ${imgSrc}`)
            return { logoUrl: imgSrc, method: 'scraping' }
          }
        }
      }

    } catch (error) {
      console.error(`❌ Erreur scraping:`, (error as Error).message)
    }

    // 2️⃣ PRIORITÉ 2: Open Graph meta tags
    try {
      const response = await fetch(normalizedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AthLink/1.0)',
        },
      })

      if (response.ok) {
        const html = await response.text()
        
        // Recherche des meta tags Open Graph
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
        if (ogImageMatch) {
          let imgSrc = ogImageMatch[1]
          
          // Convertir les URLs relatives en absolues
          if (imgSrc.startsWith('/')) {
            imgSrc = `${normalizedUrl}${imgSrc}`
          } else if (!imgSrc.startsWith('http')) {
            imgSrc = `${normalizedUrl}/${imgSrc}`
          }

          console.log(`📸 Logo trouvé via Open Graph: ${imgSrc}`)
          return { logoUrl: imgSrc, method: 'opengraph' }
        }
      }
    } catch (error) {
      console.error(`❌ Erreur Open Graph:`, (error as Error).message)
    }

    // 3️⃣ PRIORITÉ 3: Favicon (dernière option)
    try {
      const faviconUrl = `${normalizedUrl}/favicon.ico`
      const faviconResponse = await fetch(faviconUrl, { method: 'HEAD' })
      
      if (faviconResponse.ok) {
        console.log(`🎨 Favicon trouvé: ${faviconUrl}`)
        return { logoUrl: faviconUrl, method: 'favicon' }
      }
    } catch (error) {
      console.error(`❌ Erreur favicon:`, (error as Error).message)
    }

    // ❌ Aucun logo trouvé
    console.log(`❌ Aucun logo trouvé pour ${normalizedUrl}`)
    return { logoUrl: null, method: null }

  } catch (error) {
    console.error("❌ Erreur extraction:", (error as Error).message)
    return { logoUrl: null, method: null, error: (error as Error).message }
  }
}

// 🎯 CLEARBIT API
async function testClearbitLogo(url: string) {
  try {
    const clearbitUrl = `https://logo.clearbit.com/${url.replace(/^https?:\/\//, '')}`
    const response = await fetch(clearbitUrl, { method: 'HEAD' })
    return response.ok ? clearbitUrl : null
  } catch {
    return null
  }
}

// 🎯 SCRAPING INTELLIGENT DU SITE
async function scrapeWebsiteLogo(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AthLink/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
    })

    if (!response.ok) {
      console.log(`⚠️ Response status: ${response.status}`)
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    console.log(`📊 Page chargée, taille: ${html.length} caractères`)

    // Recherche d'images dans les sections header/nav
    const headerImages = html.match(/<header[^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || []
    console.log(`📸 ${headerImages.length} images trouvées dans header/nav`)

    // Recherche d'images avec des mots-clés de logo
    const logoImages = html.match(/<img[^>]*(?:logo|brand|header)[^>]*src=["']([^"']+)["'][^>]*>/gi) || []
    console.log(`🎯 ${logoImages.length} images de logo trouvées`)

    // Recherche d'images avec alt text contenant "logo"
    const altLogoImages = html.match(/<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["'][^>]*>/gi) || []
    console.log(`🏷️ ${altLogoImages.length} images avec alt="logo" trouvées`)

    // Combiner toutes les images potentielles
    const allImages = [...headerImages, ...logoImages, ...altLogoImages]
    
    for (const imgTag of allImages) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/)
      if (srcMatch) {
        let imgSrc = srcMatch[1]
        
        // Convertir les URLs relatives en absolues
        if (imgSrc.startsWith('/')) {
          imgSrc = `${url}${imgSrc}`
        } else if (!imgSrc.startsWith('http')) {
          imgSrc = `${url}/${imgSrc}`
        }

        // Vérifier si l'image est accessible
        try {
          const imgResponse = await fetch(imgSrc, { method: 'HEAD' })
          if (imgResponse.ok) {
            console.log(`✅ Logo accessible trouvé: ${imgSrc}`)
            return imgSrc
          }
        } catch {
          continue
        }
      }
    }

    console.log(`📸 ${headerImages.length} images trouvées dans header/nav`)
    return null
  } catch (error) {
      console.error(`❌ Erreur scraping:`, (error as Error).message)
    return null
  }
}

// 🏷️ OPEN GRAPH META TAGS
async function getOpenGraphImage(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AthLink/1.0)',
      },
    })

    if (response.ok) {
      const html = await response.text()
      
      // Recherche des meta tags Open Graph
      const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      if (ogImageMatch) {
        let imgSrc = ogImageMatch[1]
        
        // Convertir les URLs relatives en absolues
        if (imgSrc.startsWith('/')) {
          const urlObj = new URL(url)
          imgSrc = `${urlObj.protocol}//${urlObj.hostname}${imgSrc}`
        } else if (!imgSrc.startsWith('http')) {
          imgSrc = `${url}/${imgSrc}`
        }

        console.log(`📸 Logo trouvé via Open Graph: ${imgSrc}`)
        return imgSrc
      }

      // Recherche des meta tags Twitter
      const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      if (twitterImageMatch) {
        let imgSrc = twitterImageMatch[1]
        
        if (imgSrc.startsWith('/')) {
          const urlObj = new URL(url)
          imgSrc = `${urlObj.protocol}//${urlObj.hostname}${imgSrc}`
        } else if (!imgSrc.startsWith('http')) {
          imgSrc = `${url}/${imgSrc}`
        }

        console.log(`🐦 Logo trouvé via Twitter: ${imgSrc}`)
        return imgSrc
      }
    }

    return null
  } catch (error) {
      console.error(`❌ Erreur Open Graph:`, (error as Error).message)
    return null
  }
}

// 🎨 FAVICON
async function getFavicon(url: string) {
  try {
    const urlObj = new URL(url)
    const faviconUrl = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
    
    const response = await fetch(faviconUrl, { method: 'HEAD' })
    if (response.ok) {
      console.log(`🎨 Favicon trouvé: ${faviconUrl}`)
      return faviconUrl
    }

    // Essayer d'autres formats de favicon
    const faviconFormats = ['favicon.png', 'favicon.jpg', 'favicon.svg']
    for (const format of faviconFormats) {
      const testUrl = `${urlObj.protocol}//${urlObj.hostname}/${format}`
      try {
        const testResponse = await fetch(testUrl, { method: 'HEAD' })
        if (testResponse.ok) {
          console.log(`🎨 Favicon trouvé (${format}): ${testUrl}`)
          return testUrl
        }
      } catch {
        continue
      }
    }

    return null
  } catch (error) {
      console.error(`❌ Erreur favicon:`, (error as Error).message)
    return null
  }
}

// 🛠️ UTILITAIRES
function isValidImageUrl(url: string): boolean {
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|gif|svg|webp|ico)(\?.*)?$/i.test(url)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL requise" }, { status: 400 })
    }

    const result = await extractEventLogo(url)

    if (result.logoUrl) {
      const methodLabels = {
        clearbit: "Clearbit API",
        scraping: "scraping du site",
        opengraph: "Open Graph",
        favicon: "favicon"
      }
      
      return NextResponse.json({
        success: true,
        logoUrl: result.logoUrl,
        method: result.method,
        message: `Logo trouvé via ${methodLabels[result.method as keyof typeof methodLabels] || result.method}`
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Aucun logo trouvé pour cette URL",
        error: result.error
      })
    }

  } catch (error: any) {
    console.error("Erreur extraction logo événement:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'extraction du logo", details: (error as Error).message },
      { status: 500 }
    )
  }
}
