"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin, Ruler } from "lucide-react"
import { useEffect, useState } from "react"

interface Race {
  id: string
  name: string
  date: Date
  location: string | null
  distance: string | null
}

interface GlassRaceCountdownProps {
  race: Race
}

export function GlassRaceCountdown({ race }: GlassRaceCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(race.date))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(race.date))
    }, 1000)

    return () => clearInterval(timer)
  }, [race.date])

  const daysUntil = Math.ceil((new Date(race.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Glass container */}
      <div className="backdrop-blur-2xl bg-gradient-to-br from-yellow-500/30 to-gray-900/40 border border-yellow-500/30 shadow-2xl p-5 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6">
          {/* Race Info */}
          <div className="flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs md:text-sm opacity-90 mb-2 uppercase tracking-wider font-bold text-white/80">
                Prochaine Course
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 text-white drop-shadow-lg">
                {race.name}
              </h2>
              <div className="flex flex-wrap gap-2 text-sm md:text-base text-white/90">
                <div className="flex items-center gap-1.5 backdrop-blur-xl bg-white/20 border border-white/40 px-3 py-1.5 rounded-lg text-xs md:text-sm">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="font-semibold">
                    {new Date(race.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                {race.location && (
                  <div className="flex items-center gap-1.5 backdrop-blur-xl bg-white/20 border border-white/40 px-3 py-1.5 rounded-lg text-xs md:text-sm">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="font-semibold">{race.location}</span>
                  </div>
                )}
                {race.distance && (
                  <div className="flex items-center gap-1.5 backdrop-blur-xl bg-white/20 border border-white/40 px-3 py-1.5 rounded-lg text-xs md:text-sm">
                    <Ruler className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="font-semibold">{race.distance}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Countdown Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
            className="w-full lg:w-auto"
          >
            {daysUntil > 7 ? (
              // Show days for races more than a week away
              <div className="text-center backdrop-blur-2xl bg-white/30 border-2 border-white/60 rounded-xl px-5 py-4 md:px-6 md:py-5 min-w-[120px] shadow-xl">
                <motion.p 
                  key={daysUntil}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl md:text-6xl font-black mb-2 text-white drop-shadow-lg"
                >
                  {daysUntil}
                </motion.p>
                <p className="text-xs font-bold uppercase tracking-wide text-white/90">
                  {daysUntil === 1 ? 'jour' : 'jours'}
                </p>
              </div>
            ) : (
              // Show detailed countdown for races within a week
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'J', value: timeLeft.days },
                  { label: 'H', value: timeLeft.hours },
                  { label: 'M', value: timeLeft.minutes },
                  { label: 'S', value: timeLeft.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center backdrop-blur-2xl bg-white/30 border-2 border-white/60 rounded-xl px-2 py-2 md:px-3 md:py-3 shadow-lg"
                  >
                    <motion.p 
                      key={item.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl md:text-3xl font-black mb-0.5 text-white"
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.p>
                    <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wide text-white/70">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Progress bar */}
        {daysUntil <= 30 && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 md:mt-6"
          >
            <div className="h-2 backdrop-blur-xl bg-white/20 border border-white/40 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, 100 - (daysUntil / 30) * 100)}%` }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-white via-green-200 to-green-400 rounded-full shadow-lg"
              />
            </div>
            <p className="text-[10px] text-white/90 mt-1.5 font-semibold text-center">
              {Math.max(0, Math.round(100 - (daysUntil / 30) * 100))}% avant le jour J
            </p>
          </motion.div>
        )}
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function calculateTimeLeft(targetDate: Date) {
  const difference = new Date(targetDate).getTime() - Date.now()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  }
}

