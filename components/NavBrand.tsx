"use client"

import { motion } from "framer-motion"

export function NavBrand() {
  return (
    <motion.span
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="font-extrabold tracking-tight text-xl sm:text-2xl bg-gradient-to-r from-yellow-400 via-black to-yellow-500 bg-[length:200%_100%] bg-clip-text text-transparent"
    >
      ATHLINK
    </motion.span>
  )
}


