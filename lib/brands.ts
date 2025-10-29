// Base de données des marques sportives populaires
export interface Brand {
  name: string
  website: string
  logo?: string
  category: string
}

export const sportBrands: Brand[] = [
  // Équipementiers majeurs
  { name: "Nike", website: "https://www.nike.com", category: "Équipementier" },
  { name: "Adidas", website: "https://www.adidas.com", category: "Équipementier" },
  { name: "Asics", website: "https://www.asics.com", category: "Équipementier" },
  { name: "New Balance", website: "https://www.newbalance.com", category: "Équipementier" },
  { name: "Puma", website: "https://www.puma.com", category: "Équipementier" },
  { name: "Under Armour", website: "https://www.underarmour.com", category: "Équipementier" },
  { name: "Reebok", website: "https://www.reebok.com", category: "Équipementier" },
  { name: "Salomon", website: "https://www.salomon.com", category: "Équipementier" },
  { name: "Brooks", website: "https://www.brooksrunning.com", category: "Running" },
  { name: "Hoka", website: "https://www.hoka.com", category: "Running" },
  { name: "On Running", website: "https://www.on-running.com", category: "Running" },
  { name: "Saucony", website: "https://www.saucony.com", category: "Running" },
  
  // Cyclisme
  { name: "Specialized", website: "https://www.specialized.com", category: "Cyclisme" },
  { name: "Trek", website: "https://www.trekbikes.com", category: "Cyclisme" },
  { name: "Giant", website: "https://www.giant-bicycles.com", category: "Cyclisme" },
  { name: "Cannondale", website: "https://www.cannondale.com", category: "Cyclisme" },
  { name: "Shimano", website: "https://www.shimano.com", category: "Cyclisme" },
  { name: "Canyon", website: "https://www.canyon.com", category: "Cyclisme" },
  { name: "Wahoo", website: "https://www.wahoofitness.com", category: "Tech cyclisme" },
  
  // Nutrition sportive
  { name: "GU Energy", website: "https://www.guenergy.com", category: "Nutrition" },
  { name: "Maurten", website: "https://www.maurten.com", category: "Nutrition" },
  { name: "SIS", website: "https://www.scienceinsport.com", category: "Nutrition" },
  { name: "Overstim.s", website: "https://www.overstims.com", category: "Nutrition" },
  { name: "Aptonia", website: "https://www.decathlon.fr/aptonia", category: "Nutrition" },
  { name: "Powerbar", website: "https://www.powerbar.com", category: "Nutrition" },
  
  // Montres & Tech
  { name: "Garmin", website: "https://www.garmin.com", category: "Technologie" },
  { name: "Polar", website: "https://www.polar.com", category: "Technologie" },
  { name: "Suunto", website: "https://www.suunto.com", category: "Technologie" },
  { name: "Coros", website: "https://www.coros.com", category: "Technologie" },
  { name: "Apple", website: "https://www.apple.com", category: "Technologie" },
  { name: "Strava", website: "https://www.strava.com", category: "App" },
  
  // Triathlon
  { name: "Zoot", website: "https://www.zootsports.com", category: "Triathlon" },
  { name: "2XU", website: "https://www.2xu.com", category: "Triathlon" },
  { name: "Zone3", website: "https://www.zone3.com", category: "Triathlon" },
  { name: "Orca", website: "https://www.orca.com", category: "Triathlon" },
  
  // Accessoires
  { name: "Compressport", website: "https://www.compressport.com", category: "Accessoires" },
  { name: "CEP", website: "https://www.cepsports.com", category: "Compression" },
  { name: "Buff", website: "https://www.buff.com", category: "Accessoires" },
  { name: "Oakley", website: "https://www.oakley.com", category: "Lunettes" },
  
  // Distributeurs
  { name: "Decathlon", website: "https://www.decathlon.fr", category: "Distributeur" },
  { name: "Go Sport", website: "https://www.go-sport.com", category: "Distributeur" },
  { name: "I-Run", website: "https://www.i-run.fr", category: "Distributeur" },
]

// Fonction pour rechercher une marque par nom
export function searchBrand(query: string): Brand[] {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []
  
  return sportBrands.filter(brand => 
    brand.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 5) // Limiter à 5 résultats
}

// Fonction pour obtenir le logo depuis Clearbit
export function getBrandLogoUrl(website: string): string {
  try {
    const url = new URL(website)
    return `https://logo.clearbit.com/${url.hostname}`
  } catch {
    return ""
  }
}
