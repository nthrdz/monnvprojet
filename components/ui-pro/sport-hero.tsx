"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SportHeroProps {
  title: string
  subtitle: string
  ctaPrimary?: {
    text: string
    href: string
  }
  ctaSecondary?: {
    text: string
    href: string
  }
  backgroundImage?: string
  stats?: Array<{
    value: string
    label: string
  }>
}

export function SportHero({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  stats
}: SportHeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background avec gradient overlay */}
      <div className="absolute inset-0 bg-gradient-sport-hero">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            priority
          />
        )}
      </div>

      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-sport-accent-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-sport-success-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-6 z-10">
        <div className="max-w-4xl">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-primary-600 via-quaternary-600 to-tertiary-600 bg-clip-text text-transparent mb-6 leading-tight">
              {title.split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="inline-block mr-4"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            {ctaPrimary && (
              <Button
                size="lg"
                className="bg-white text-sport-primary-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold shadow-sport-lg group"
                asChild
              >
                <a href={ctaPrimary.href}>
                  {ctaPrimary.text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            )}
            
            {ctaSecondary && (
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold backdrop-blur-sm"
                asChild
              >
                <a href={ctaSecondary.href}>
                  <Play className="mr-2 w-5 h-5" />
                  {ctaSecondary.text}
                </a>
              </Button>
            )}
          </motion.div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-16 flex flex-wrap gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-success-600 to-accent-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500"
      >
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gray-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
