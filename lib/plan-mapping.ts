// Mapping entre les noms de plans dans le code et dans Prisma
// Prisma utilise: FREE, ATHLETE_PRO, COACH
// Le code utilise: FREE, PRO, ELITE

export type AppPlanType = "FREE" | "PRO" | "ELITE"
export type PrismaPlanType = "FREE" | "ATHLETE_PRO" | "COACH"

export function prismaToAppPlan(prismaPlan: PrismaPlanType): AppPlanType {
  switch (prismaPlan) {
    case "FREE":
      return "FREE"
    case "ATHLETE_PRO":
      return "ELITE" // ATHLETE_PRO est notre plan Elite
    case "COACH":
      return "PRO" // COACH est notre plan Pro
    default:
      return "FREE"
  }
}

export function appToPrismaPlan(appPlan: AppPlanType): PrismaPlanType {
  switch (appPlan) {
    case "FREE":
      return "FREE"
    case "PRO":
      return "COACH"
    case "ELITE":
      return "ATHLETE_PRO"
    default:
      return "FREE"
  }
}

