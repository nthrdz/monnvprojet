// Système de gestion des fonctionnalités par plan
export enum PlanType {
  FREE = "FREE",
  PRO = "PRO",
  ELITE = "ELITE",
  ATHLETE_PRO = "ATHLETE_PRO", // Prisma plan = Elite
  COACH = "COACH" // Prisma plan = Pro
}

export interface FeatureLimits {
  maxLinks: number
  maxRaces: number
  maxSponsors: number
  maxMedia: number
  analyticsDays: number | null // null = illimité
  customDomain: boolean
  realtimeNotifications: boolean
  dataExport: boolean
  clickHeatmap: boolean
  visitorDemographics: boolean
  prioritySupport: boolean
  adFree: boolean
  premiumThemes: boolean
  priorityLinks: boolean
  profileBadge: string | null
}

export const PLAN_FEATURES: Record<PlanType, FeatureLimits> = {
  [PlanType.FREE]: {
    maxLinks: 10,
    maxRaces: 1,
    maxSponsors: 0,
    maxMedia: 2,
    analyticsDays: null, // Analytics basiques uniquement
    customDomain: false,
    customCSS: false,
    realtimeNotifications: false,
    dataExport: false,
    clickHeatmap: false,
    visitorDemographics: false,
    prioritySupport: false,
    adFree: false,
    premiumThemes: false,
    priorityLinks: false,
    profileBadge: null
  },
  [PlanType.PRO]: {
    maxLinks: -1, // Illimité
    maxRaces: -1, // Illimité
    maxSponsors: -1, // Illimité
    maxMedia: -1, // Illimité
    analyticsDays: 7, // 7 jours d'analytics avancées
    customDomain: false,
    customCSS: false,
    realtimeNotifications: false,
    dataExport: false,
    clickHeatmap: false,
    visitorDemographics: false,
    prioritySupport: false,
    adFree: true,
    premiumThemes: true,
    priorityLinks: true,
    profileBadge: "Pro"
  },
  [PlanType.ELITE]: {
    maxLinks: -1, // Illimité
    maxRaces: -1, // Illimité
    maxSponsors: -1, // Illimité
    maxMedia: -1, // Illimité
    analyticsDays: null, // Analytics illimitées
    customDomain: true,
    realtimeNotifications: true,
    dataExport: true,
    clickHeatmap: true,
    visitorDemographics: true,
    prioritySupport: true,
    adFree: true,
    premiumThemes: true,
    priorityLinks: true,
    profileBadge: "Elite"
  },
  [PlanType.ATHLETE_PRO]: {
    maxLinks: -1, // Illimité
    maxRaces: -1, // Illimité
    maxSponsors: -1, // Illimité
    maxMedia: -1, // Illimité
    analyticsDays: null, // Analytics illimitées
    customDomain: true,
    realtimeNotifications: true,
    dataExport: true,
    clickHeatmap: true,
    visitorDemographics: true,
    prioritySupport: true,
    adFree: true,
    premiumThemes: true,
    priorityLinks: true,
    profileBadge: "Elite"
  },
  [PlanType.COACH]: {
    maxLinks: -1, // Illimité
    maxRaces: -1, // Illimité
    maxSponsors: -1, // Illimité
    maxMedia: -1, // Illimité
    analyticsDays: 7, // 7 jours d'analytics
    customDomain: false,
    realtimeNotifications: false,
    dataExport: false,
    clickHeatmap: false,
    visitorDemographics: false,
    prioritySupport: false,
    adFree: true,
    premiumThemes: true,
    priorityLinks: true,
    profileBadge: "Pro"
  }
}

export function canUserAccessFeature(
  userPlan: PlanType,
  feature: keyof FeatureLimits
): boolean {
  const limits = PLAN_FEATURES[userPlan]
  return limits[feature] === true || limits[feature] !== null
}

export function getUserFeatureLimit(
  userPlan: PlanType,
  feature: keyof FeatureLimits
): number | boolean | string | null {
  return PLAN_FEATURES[userPlan][feature]
}

export function checkLimit(
  currentCount: number,
  userPlan: PlanType,
  feature: 'maxLinks' | 'maxRaces' | 'maxSponsors' | 'maxMedia'
): { canAdd: boolean; limit: number; remaining?: number } {
  const limit = getUserFeatureLimit(userPlan, feature) as number
  
  if (limit === -1) {
    return { canAdd: true, limit: -1 } // Illimité
  }
  
  const remaining = limit - currentCount
  return {
    canAdd: currentCount < limit,
    limit,
    remaining: Math.max(0, remaining)
  }
}

// Fonction utilitaire pour vérifier si un utilisateur peut ajouter un élément
export function canAddItem(
  currentCount: number,
  userPlan: PlanType,
  itemType: 'links' | 'races' | 'sponsors' | 'media'
): boolean {
  const featureMap = {
    links: 'maxLinks' as const,
    races: 'maxRaces' as const,
    sponsors: 'maxSponsors' as const,
    media: 'maxMedia' as const
  }
  
  const { canAdd } = checkLimit(currentCount, userPlan, featureMap[itemType])
  return canAdd
}

// Fonction pour obtenir le message d'erreur de limite
export function getLimitMessage(
  userPlan: PlanType,
  itemType: 'links' | 'races' | 'sponsors' | 'media'
): string {
  const planNames = {
    [PlanType.FREE]: "Free",
    [PlanType.PRO]: "Pro",
    [PlanType.ELITE]: "Elite"
  }
  
  const itemNames = {
    links: "liens",
    races: "compétitions", 
    sponsors: "sponsors",
    media: "médias"
  }
  
  const limit = getUserFeatureLimit(userPlan, `max${itemType.charAt(0).toUpperCase() + itemType.slice(1)}` as keyof FeatureLimits) as number
  
  if (limit === -1) return "" // Illimité
  
  return `Limite atteinte (${limit} ${itemNames[itemType]} pour le plan ${planNames[userPlan]}). Upgrade vers Pro ou Elite pour plus de ${itemNames[itemType]}.`
}
