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

interface RaceCountdownCardProps {
  race: Race
}

export function RaceCountdownCard({ race }: RaceCountdownCardProps) {
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl shadow-elevated"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-ocean"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Race Info */}
          <div className="flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs md:text-sm opacity-80 mb-2 uppercase tracking-wider font-semibold text-gray-900">
                Prochaine Course
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 text-gray-900">
                {race.name}
              </h2>
              <div className="flex flex-wrap gap-3 md:gap-4 text-sm md:text-base text-gray-900/90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-semibold">
                    {new Date(race.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                {race.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="font-semibold">{race.location}</span>
                  </div>
                )}
                {race.distance && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 md:w-5 md:h-5" />
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
            transition={{ delay: 0.4, type: "spring", damping: 15 }}
            className="w-full lg:w-auto"
          >
            {daysUntil > 7 ? (
              // Show days for races more than a week away
              <div className="text-center bg-white/25 backdrop-blur-md rounded-2xl px-8 py-6 md:px-10 md:py-8 min-w-[160px] border-2 border-white/30 shadow-elevated">
                <motion.p 
                  key={daysUntil}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl md:text-6xl font-black mb-2 text-gray-900"
                >
                  {daysUntil}
                </motion.p>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wide text-gray-900/80">
                  {daysUntil === 1 ? 'jour' : 'jours'}
                </p>
              </div>
            ) : (
              // Show detailed countdown for races within a week
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {[
                  { label: 'Jours', value: timeLeft.days },
                  { label: 'Heures', value: timeLeft.hours },
                  { label: 'Min', value: timeLeft.minutes },
                  { label: 'Sec', value: timeLeft.seconds },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center bg-white/25 backdrop-blur-md rounded-xl px-3 py-3 md:px-4 md:py-4 border-2 border-white/30"
                  >
                    <motion.p 
                      key={item.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl md:text-3xl font-black mb-1 text-gray-900"
                    >
                      {String(item.value).padStart(2, '0')}
                    </motion.p>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-gray-900/70">
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
            className="mt-6 md:mt-8"
          >
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, 100 - (daysUntil / 30) * 100)}%` }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="h-full bg-white/80 rounded-full shadow-glow-blue"
              />
            </div>
            <p className="text-xs text-gray-900/70 mt-2 font-semibold text-center">
              {Math.max(0, Math.round(100 - (daysUntil / 30) * 100))}% avant le jour J
            </p>
          </motion.div>
        )}
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
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

