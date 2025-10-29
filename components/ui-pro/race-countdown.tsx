"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Award } from "lucide-react"
import { daysUntil } from "@/lib/utils"
import confetti from "canvas-confetti"

interface RaceCountdownProps {
  raceName: string
  date: Date
  location?: string
  distance?: string
  onRaceDay?: () => void
}

export function RaceCountdown({
  raceName,
  date,
  location,
  distance,
  onRaceDay
}: RaceCountdownProps) {
  const [days, setDays] = useState(daysUntil(date))
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [isRaceDay, setIsRaceDay] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = date.getTime() - now.getTime()
      
      if (diff <= 0) {
        setIsRaceDay(true)
        if (onRaceDay) onRaceDay()
        // Confetti pour race day!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
        clearInterval(interval)
        return
      }

      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
      setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
      setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)))
    }, 1000)

    return () => clearInterval(interval)
  }, [date, onRaceDay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-xl">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <CardContent className="relative p-6 text-gray-900">
          <AnimatePresence mode="wait">
            {isRaceDay ? (
              <motion.div
                key="raceday"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl mb-4"
                >
                  Compétition
                </motion.div>
                <h3 className="text-3xl font-bold mb-2">C&apos;EST AUJOURD&apos;HUI !</h3>
                <p className="text-xl opacity-90">{raceName}</p>
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-2"
                >
                  Bonne course ! 💪
                </motion.p>
              </motion.div>
            ) : (
              <motion.div key="countdown" className="space-y-6">
                {/* Race Info */}
                <div>
                  <motion.p 
                    className="text-sm opacity-80 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 0.2 }}
                  >
                    Prochaine course
                  </motion.p>
                  <motion.h3 
                    className="text-2xl font-bold mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {raceName}
                  </motion.h3>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    {location && (
                      <motion.div 
                        className="flex items-center gap-1 opacity-90"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ delay: 0.4 }}
                      >
                        <MapPin className="w-4 h-4" />
                        {location}
                      </motion.div>
                    )}
                    {distance && (
                      <motion.div 
                        className="flex items-center gap-1 opacity-90"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 0.9 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Award className="w-4 h-4" />
                        {distance}
                      </motion.div>
                    )}
                    <motion.div 
                      className="flex items-center gap-1 opacity-90"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 0.9 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Calendar className="w-4 h-4" />
                      {date.toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </motion.div>
                  </div>
                </div>

                {/* Countdown Display */}
                <div className="grid grid-cols-3 gap-4">
                  <CountdownUnit value={days} label="Jours" delay={0.7} />
                  <CountdownUnit value={hours} label="Heures" delay={0.8} />
                  <CountdownUnit value={minutes} label="Min" delay={0.9} />
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-2 bg-white/20 rounded-full overflow-hidden"
                  style={{ originX: 0 }}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CountdownUnit({ 
  value, 
  label, 
  delay 
}: { 
  value: number
  label: string
  delay: number 
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay 
      }}
      className="text-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 1
        }}
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-4xl font-bold block"
          >
            {value.toString().padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <p className="text-sm opacity-80 font-medium">{label}</p>
    </motion.div>
  )
}
