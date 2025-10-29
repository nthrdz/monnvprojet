import { redirect } from "next/navigation"

export default function SponsorsPage() {
  // Rediriger vers Sources avec l'onglet Sponsors
  redirect("/dashboard/sources#sponsors")
}
