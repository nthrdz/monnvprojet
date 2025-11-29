"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Download, Mail, X } from "lucide-react"
import Link from "next/link"

function PayPalSuccessContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      // Le paiement a été approuvé, le webhook va gérer l'envoi du PDF
      setStatus("success")
    } else {
      setStatus("error")
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        {status === "loading" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Traitement du paiement...</h2>
            <p className="text-gray-600">Veuillez patienter</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600 mb-6">
              Votre paiement a été confirmé. Le PDF de votre plan d'entraînement vous sera envoyé par email dans quelques instants.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">Vérifiez votre boîte email</span>
              </div>
              <p className="text-sm text-blue-600">
                Le PDF sera envoyé à l'adresse email que vous avez fournie lors de l'achat.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white rounded-xl font-bold hover:from-primary-blue-700 hover:to-primary-blue-800 transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">
              Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white rounded-xl font-bold hover:from-primary-blue-700 hover:to-primary-blue-800 transition-all"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function PayPalSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-primary-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chargement...</h2>
        </div>
      </div>
    }>
      <PayPalSuccessContent />
    </Suspense>
  )
}
