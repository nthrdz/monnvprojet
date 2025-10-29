import { redirect } from "next/navigation"

export default function LinksPage() {
  // Rediriger vers Sources avec l'onglet Liens
  redirect("/dashboard/sources#liens")
}
