"use client"

import { motion } from "framer-motion"

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-standard">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-12 h-12 bg-gray-200 rounded-xl"
        />
        <div className="flex-1 space-y-2">
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1
            }}
            className="h-4 bg-gray-200 rounded w-3/4"
          />
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
            className="h-3 bg-gray-200 rounded w-1/2"
          />
        </div>
      </div>
      
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
        className="h-32 bg-gray-200 rounded-xl"
      />
    </div>
  )
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-standard">
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="space-y-4"
      >
        <div className="h-12 w-12 bg-gray-200 rounded-xl" />
        <div className="h-10 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </motion.div>
    </div>
  )
}

export function SkeletonText({ width = "100%" }: { width?: string }) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="h-4 bg-gray-200 rounded"
      style={{ width }}
    />
  )
}
