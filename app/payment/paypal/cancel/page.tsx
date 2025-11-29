"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import Link from "next/link"

export default function PayPalCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement annulé</h2>
        <p className="text-gray-600 mb-6">
          Vous avez annulé le paiement. Aucun montant n'a été débité.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary-blue-600 to-primary-blue-700 text-white rounded-xl font-bold hover:from-primary-blue-700 hover:to-primary-blue-800 transition-all"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  )
}

