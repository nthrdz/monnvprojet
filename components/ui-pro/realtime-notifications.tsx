"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Eye, 
  MousePointer, 
  Users, 
  TrendingUp,
  X,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "view" | "click" | "follower" | "engagement"
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: any
}

interface RealtimeNotificationsProps {
  notifications: Notification[]
  userPlan: "FREE" | "PRO" | "ELITE"
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearNotification: (id: string) => void
  onToggleSound: () => void
  soundEnabled: boolean
  className?: string
}

export function RealtimeNotifications({
  notifications,
  userPlan,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearNotification,
  onToggleSound,
  soundEnabled,
  className
}: RealtimeNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const canAccessRealtimeNotifications = userPlan === "ELITE"

  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "view":
        return Eye
      case "click":
        return MousePointer
      case "follower":
        return Users
      case "engagement":
        return TrendingUp
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "view":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "click":
        return "bg-green-100 text-green-600 border-green-200"
      case "follower":
        return "bg-purple-100 text-purple-600 border-purple-200"
      case "engagement":
        return "bg-orange-100 text-orange-600 border-orange-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes}min`
    if (hours < 24) return `Il y a ${hours}h`
    return `Il y a ${days}j`
  }

  const playNotificationSound = () => {
    if (soundEnabled && canAccessRealtimeNotifications) {
      // Créer un son de notification simple
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  useEffect(() => {
    // Jouer un son pour les nouvelles notifications
    if (notifications.length > 0 && !notifications[0].read) {
      playNotificationSound()
    }
  }, [notifications])

  if (!canAccessRealtimeNotifications) {
    return (
      <Card className={cn("border-yellow-200 bg-yellow-50", className)}>
        <CardContent className="p-6 text-center">
          <Bell className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Notifications en temps réel
          </h3>
          <p className="text-yellow-700 mb-4">
            Les notifications en temps réel sont disponibles uniquement avec le plan Elite.
            Recevez des alertes instantanées pour chaque vue, clic et interaction sur votre profil.
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            Upgrade vers Elite
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Bouton de notification */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </Button>

      {/* Panel des notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-600">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={onToggleSound}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4" />
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </Button>
                
                {unreadCount > 0 && (
                  <Button
                    onClick={onMarkAllAsRead}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Tout marquer comme lu
                  </Button>
                )}
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={cn(
                          "p-4 hover:bg-gray-50 transition-colors relative",
                          !notification.read && "bg-blue-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg border",
                            getNotificationColor(notification.type)
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {formatTime(notification.timestamp)}
                                </span>
                                <Button
                                  onClick={() => onClearNotification(notification.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            {!notification.read && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Fermer
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Hook pour simuler les notifications en temps réel
export function useRealtimeNotifications(userPlan: "FREE" | "PRO" | "ELITE") {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    if (userPlan !== "ELITE") return

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Garder max 50 notifications
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const toggleSound = () => {
    setSoundEnabled(prev => !prev)
  }

  // Simulation d'événements en temps réel
  useEffect(() => {
    if (userPlan !== "ELITE") return

    const interval = setInterval(() => {
      const eventTypes = ["view", "click", "follower", "engagement"]
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      
      const notifications = {
        view: {
          title: "Nouvelle vue",
          message: "Quelqu'un a visité votre profil"
        },
        click: {
          title: "Nouveau clic",
          message: "Un lien a été cliqué sur votre profil"
        },
        follower: {
          title: "Nouveau follower",
          message: "Vous avez un nouveau follower"
        },
        engagement: {
          title: "Engagement élevé",
          message: "Votre profil génère beaucoup d'engagement aujourd'hui"
        }
      }

      addNotification({
        type: randomType as any,
        ...notifications[randomType as keyof typeof notifications],
        read: false
      })
    }, Math.random() * 30000 + 10000) // Entre 10 et 40 secondes

    return () => clearInterval(interval)
  }, [userPlan])

  return {
    notifications,
    soundEnabled,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    toggleSound
  }
}
