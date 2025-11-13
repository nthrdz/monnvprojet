"use client"

import { useEffect } from "react"

/**
 * Composant de diagnostic FirstPromoter
 * Affiche des logs dans la console pour vérifier que FirstPromoter fonctionne
 */
export function FirstPromoterDebug() {
  useEffect(() => {
    // Attendre que le DOM soit chargé
    const checkFirstPromoter = () => {
      console.log("🔍 DIAGNOSTIC FIRSTPROMOTER")
      console.log("===========================")
      
      // Vérifier window.fpr
      if (typeof window !== 'undefined') {
        if (typeof (window as any).fpr === 'function') {
          console.log("✅ window.fpr est défini")
        } else {
          console.error("❌ window.fpr n'est pas défini")
        }
        
        // Vérifier window.FPROM
        if ((window as any).FPROM) {
          console.log("✅ window.FPROM existe")
          const fprom = (window as any).FPROM
          if (fprom.data) {
            console.log("   → FPROM.data:", fprom.data)
            if (fprom.data.tid) {
              console.log("   ✅ Tracking ID (tid):", fprom.data.tid)
            } else {
              console.log("   ⚠️ Tracking ID (tid) non trouvé")
            }
          }
        } else {
          console.error("❌ window.FPROM n'existe pas")
          console.log("   → Le SDK FirstPromoter n'est peut-être pas chargé")
        }
        
        // Vérifier les cookies
        const cookies = document.cookie.split(';')
        const fpromCookies = cookies.filter(c => c.trim().startsWith('_fprom'))
        if (fpromCookies.length > 0) {
          console.log("✅ Cookies FirstPromoter trouvés:")
          fpromCookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            console.log(`   → ${name}: ${value?.substring(0, 20)}...`)
          })
        } else {
          console.log("⚠️ Aucun cookie FirstPromoter trouvé")
          console.log("   → Normal si vous n'êtes pas arrivé via un lien d'affiliation")
        }
        
        // Vérifier le paramètre fpr dans l'URL
        const urlParams = new URLSearchParams(window.location.search)
        const fprParam = urlParams.get('fpr')
        if (fprParam) {
          console.log("✅ Paramètre fpr dans l'URL:", fprParam)
          console.log("   → FirstPromoter devrait créer un cookie dans quelques secondes")
        }
      }
      
      console.log("===========================")
    }
    
    // Vérifier immédiatement
    checkFirstPromoter()
    
    // Vérifier à nouveau après 2 secondes (pour laisser le temps au SDK de charger)
    const timeout = setTimeout(() => {
      console.log("\n🔍 Vérification après 2 secondes...")
      checkFirstPromoter()
    }, 2000)
    
    return () => clearTimeout(timeout)
  }, [])
  
  return null // Ce composant ne rend rien
}

