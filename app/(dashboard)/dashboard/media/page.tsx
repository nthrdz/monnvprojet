import { redirect } from "next/navigation"

export default function MediaPage() {
  // Rediriger vers Profil où la Galerie est maintenant intégrée
  redirect("/dashboard/profile#galerie")
}
