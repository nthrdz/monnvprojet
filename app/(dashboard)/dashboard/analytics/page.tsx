import { redirect } from "next/navigation"

export default function AnalyticsPage() {
  // Rediriger vers Paramètres avec l'onglet Analytics
  redirect("/dashboard/settings#analytics")
}
