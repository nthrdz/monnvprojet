"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export function LinktreeFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-center pt-8 border-t border-yellow-500/10"
    >
      <p className="text-xs text-gray-500">
        Créé avec{' '}
        <Link 
          href="/" 
          className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors inline-flex items-center gap-1"
        >
          Athlink
          <span className="inline-block group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </p>
    </motion.footer>
  )
}

