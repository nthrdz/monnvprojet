import { redirect } from "next/navigation"

export default function RacesPage() {
  // Rediriger vers Sources avec l'onglet Compétitions
  redirect("/dashboard/sources#competitions")
}
