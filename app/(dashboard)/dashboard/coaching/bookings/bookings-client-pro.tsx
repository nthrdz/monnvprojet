"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar as CalendarIcon, Clock, User, Mail, Phone, Euro, Check, X, Edit3, Trash2, Settings, ChevronRight, AlertCircle, TrendingUp } from "lucide-react"

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  date: string
  startTime: string
  endTime: string
  duration: number
  service: string
  price: number
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  notes?: string
  createdAt: string
  isPublicRequest?: boolean
}

interface BookingsClientProps {
  initialBookings: Booking[]
  profileId: string
  coachName: string
}

export function BookingsClientPro({ initialBookings, profileId, coachName }: BookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [showCreateBooking, setShowCreateBooking] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [filterStatus, setFilterStatus] = useState<"all" | "PENDING" | "CONFIRMED" | "COMPLETED">("all")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    date: "",
    startTime: "",
    duration: 60,
    service: "",
    price: 0,
    notes: ""
  })

  const statusConfig = {
    PENDING: { 
      label: "En attente", 
      color: "text-yellow-700", 
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: AlertCircle
    },
    CONFIRMED: { 
      label: "Confirmée", 
      color: "text-primary-blue-700", 
      bg: "bg-primary-blue-50",
      border: "border-primary-blue-200",
      icon: CalendarIcon
    },
    COMPLETED: { 
      label: "Complétée", 
      color: "text-primary-green-700", 
      bg: "bg-primary-green-50",
      border: "border-primary-green-200",
      icon: Check
    },
    CANCELLED: { 
      label: "Annulée", 
      color: "text-red-700", 
      bg: "bg-red-50",
      border: "border-red-200",
      icon: X
    }
  }

  // Statistiques
  const stats = useMemo(() => {
    const now = new Date()
    const pending = bookings.filter(b => b.status === "PENDING")
    const confirmed = bookings.filter(b => b.status === "CONFIRMED" && new Date(b.date) >= now)
    const completed = bookings.filter(b => b.status === "COMPLETED")
    const newRequests = bookings.filter(b => b.isPublicRequest && b.status === "PENDING")
    const totalRevenue = completed.reduce((acc, b) => acc + b.price, 0)
    const thisMonthRevenue = completed.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).reduce((acc, b) => acc + b.price, 0)

    return {
      total: bookings.length,
      pending: pending.length,
      confirmed: confirmed.length,
      completed: completed.length,
      newRequests: newRequests.length,
      totalRevenue,
      thisMonthRevenue
    }
  }, [bookings])

  // Filtrer les réservations
  const filteredBookings = useMemo(() => {
    let filtered = bookings
    if (filterStatus !== "all") {
      filtered = filtered.filter(b => b.status === filterStatus)
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.startTime}`)
      const dateB = new Date(`${b.date} ${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })
  }, [bookings, filterStatus])

  // Réservations par date
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, Booking[]> = {}
    filteredBookings.forEach(booking => {
      if (!grouped[booking.date]) {
        grouped[booking.date] = []
      }
      grouped[booking.date].push(booking)
    })
    return grouped
  }, [filteredBookings])

  // Réservations pour le jour sélectionné
  const selectedDateBookings = useMemo(() => {
    return bookings
      .filter(b => b.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [bookings, selectedDate])

  const handleCreateBooking = async () => {
    try {
      const response = await fetch("/api/coaching/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingForm, profileId })
      })

      if (response.ok) {
        const newBooking = await response.json()
        setBookings([newBooking, ...bookings])
        setShowCreateBooking(false)
        resetBookingForm()
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error)
    }
  }

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/coaching/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b))
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return

    try {
      const response = await fetch(`/api/coaching/bookings/${bookingId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== bookingId))
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
    }
  }

  const resetBookingForm = () => {
    setBookingForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      date: "",
      startTime: "",
      duration: 60,
      service: "",
      price: 0,
      notes: ""
    })
  }

  // Générer le calendrier du mois
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const calendar = []
    let currentWeek = []

    // Jours vides avant le début du mois
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null)
    }

    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateStr = date.toISOString().split('T')[0]
      const dayBookings = bookings.filter(b => b.date === dateStr)
      
      currentWeek.push({
        day,
        date: dateStr,
        bookings: dayBookings,
        isToday: dateStr === new Date().toISOString().split('T')[0]
      })

      if (currentWeek.length === 7) {
        calendar.push(currentWeek)
        currentWeek = []
      }
    }

    // Compléter la dernière semaine
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null)
    }
    if (currentWeek.length > 0) {
      calendar.push(currentWeek)
    }

    return calendar
  }

  const calendar = generateCalendar()

  // Navigation du calendrier
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
    setSelectedDate(now.toISOString().split('T')[0])
  }

  // Mois en français
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ]

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-gray-400"
        >
          <div className="flex items-center justify-between mb-2">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-600">Total</p>
        </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-yellow-400 cursor-pointer hover:shadow-elevated transition-all"
          onClick={() => setFilterStatus("PENDING")}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            {stats.newRequests > 0 && (
              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-bold">
                {stats.newRequests}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          <p className="text-xs text-yellow-700">En attente</p>
        </motion.div>

        {/* Confirmed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-primary-blue-400 cursor-pointer hover:shadow-elevated transition-all"
          onClick={() => setFilterStatus("CONFIRMED")}
        >
          <div className="flex items-center justify-between mb-2">
            <CalendarIcon className="w-5 h-5 text-primary-blue-600" />
          </div>
          <p className="text-2xl font-bold text-primary-blue-900">{stats.confirmed}</p>
          <p className="text-xs text-primary-blue-700">Confirmées</p>
        </motion.div>

        {/* Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-primary-green-400 cursor-pointer hover:shadow-elevated transition-all"
          onClick={() => setFilterStatus("COMPLETED")}
        >
          <div className="flex items-center justify-between mb-2">
            <Check className="w-5 h-5 text-primary-green-600" />
          </div>
          <p className="text-2xl font-bold text-primary-green-900">{stats.completed}</p>
          <p className="text-xs text-primary-green-700">Complétées</p>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-green-400"
        >
          <div className="flex items-center justify-between mb-2">
            <Euro className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.thisMonthRevenue.toFixed(0)}€</p>
          <p className="text-xs text-green-700">Ce mois</p>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl shadow-standard p-4 border-l-4 border-primary-green-500"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-primary-green-600" />
          </div>
          <p className="text-2xl font-bold text-primary-green-900">{stats.totalRevenue.toFixed(0)}€</p>
          <p className="text-xs text-primary-green-700">Revenus total</p>
        </motion.div>

        {/* New Requests */}
        {stats.newRequests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-standard p-4 border-l-4 border-blue-400 cursor-pointer hover:shadow-elevated transition-all"
            onClick={() => setFilterStatus("PENDING")}
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-5 h-5 text-white" />
              <span className="px-2 py-0.5 bg-white/30 text-white text-xs rounded-full font-bold">
                Nouveau
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.newRequests}</p>
            <p className="text-xs text-blue-100">Demandes web</p>
          </motion.div>
        )}
      </div>

      {/* View Toggle & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === "calendar"
                ? "bg-gradient-ocean text-gray-900 shadow-elevated"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <CalendarIcon className="w-4 h-4 inline mr-2" />
            Calendrier
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              viewMode === "list"
                ? "bg-gradient-ocean text-gray-900 shadow-elevated"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Liste
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-primary-blue-400 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="PENDING">En attente ({stats.pending})</option>
            <option value="CONFIRMED">Confirmées ({stats.confirmed})</option>
            <option value="COMPLETED">Complétées ({stats.completed})</option>
          </select>

          <button
            onClick={() => setShowCreateBooking(true)}
            className="inline-flex items-center gap-2 bg-gradient-ocean text-gray-900 hover:shadow-glow-blue px-6 py-2 rounded-xl font-bold shadow-elevated transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nouvelle réservation
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl shadow-standard border border-gray-200 p-6">
          {/* Calendar Header with Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
              </div>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                Aujourd'hui
              </button>
              <p className="text-sm text-gray-600">Clique sur une date pour voir les réservations</p>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={dayIndex} className="h-12" />
                  }

                  const hasBookings = day.bookings.length > 0
                  const hasPending = day.bookings.some(b => b.status === "PENDING")
                  const isSelected = day.date === selectedDate

                  return (
                    <button
                      key={dayIndex}
                      onClick={() => setSelectedDate(day.date)}
                      className={`h-12 rounded-md p-1 transition-all relative border ${
                        isSelected
                          ? "bg-gray-900 text-white border-gray-900 shadow-md"
                          : day.isToday
                          ? "bg-blue-50 border-blue-400 text-gray-900 font-bold"
                          : hasBookings
                          ? "bg-gray-50 border-gray-300 text-gray-900 hover:bg-gray-100"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium">{day.day}</span>
                      {hasBookings && (
                        <div className="absolute bottom-0 right-0 text-[10px] font-bold text-gray-500 bg-white rounded px-1">
                          {day.bookings.length}
                        </div>
                      )}
                      {hasPending && !isSelected && (
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h4>

              {selectedDateBookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateBookings.map((booking) => {
                    const config = statusConfig[booking.status]
                    const StatusIcon = config.icon

                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          booking.isPublicRequest 
                            ? "bg-blue-50 border-blue-300" 
                            : `${config.bg} ${config.border}`
                        }`}
                      >
                        {booking.isPublicRequest && (
                          <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-bold shadow-lg">
                            Nouveau
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <StatusIcon className={`w-4 h-4 ${config.color}`} />
                              <span className={`text-xs font-bold uppercase ${config.color}`}>
                                {config.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-bold text-gray-900">{booking.clientName}</span>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{booking.startTime} - {booking.endTime}</span>
                                <span className="text-xs text-gray-500">({booking.duration}min)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span className="text-xs">{booking.clientEmail}</span>
                              </div>
                              {booking.clientPhone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3" />
                                  <span className="text-xs">{booking.clientPhone}</span>
                                </div>
                              )}
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-700">{booking.service}</span>
                              <span className="text-sm font-bold text-primary-green-600">{booking.price}€</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {booking.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                  className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                                  title="Confirmer"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                                  title="Annuler"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {booking.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "COMPLETED")}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                                title="Marquer comme complétée"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600 italic">{booking.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune réservation pour cette date</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {Object.entries(bookingsByDate).map(([date, dateBookings]) => {
            const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-standard border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 capitalize">{formattedDate}</h3>
                  <p className="text-sm text-gray-600">{dateBookings.length} réservation{dateBookings.length > 1 ? "s" : ""}</p>
                </div>

                <div className="divide-y divide-gray-100">
                  {dateBookings.map((booking) => {
                    const config = statusConfig[booking.status]
                    const StatusIcon = config.icon

                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`relative p-6 transition-all hover:bg-gray-50 ${
                          booking.isPublicRequest ? "bg-blue-50/30" : ""
                        }`}
                      >
                        {booking.isPublicRequest && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-bold">
                              Demande web
                            </span>
                          </div>
                        )}

                        <div className="flex items-start gap-6">
                          {/* Time Column */}
                          <div className="flex-shrink-0 w-24">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-bold text-gray-900">{booking.startTime}</span>
                            </div>
                            <div className="text-xs text-gray-500">{booking.duration} min</div>
                          </div>

                          {/* Main Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <StatusIcon className={`w-5 h-5 ${config.color}`} />
                              <h4 className="text-lg font-bold text-gray-900">{booking.clientName}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color}`}>
                                {config.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <a href={`mailto:${booking.clientEmail}`} className="hover:text-primary-blue-600 transition-colors">
                                  {booking.clientEmail}
                                </a>
                              </div>
                              {booking.clientPhone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  <a href={`tel:${booking.clientPhone}`} className="hover:text-primary-blue-600 transition-colors">
                                    {booking.clientPhone}
                                  </a>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                {booking.service}
                              </span>
                              <span className="text-lg font-bold text-primary-green-600">
                                {booking.price}€
                              </span>
                            </div>

                            {booking.notes && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 italic">{booking.notes}</p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            {booking.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                  title="Confirmer"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                  title="Annuler"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {booking.status === "CONFIRMED" && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking.id, "COMPLETED")}
                                className="p-2 bg-primary-blue-500 hover:bg-primary-blue-600 text-white rounded-lg transition-all shadow-sm hover:shadow-md"
                                title="Marquer comme complétée"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          {Object.keys(bookingsByDate).length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-standard border border-gray-200">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune réservation</h3>
              <p className="text-gray-600 mb-6">
                {filterStatus !== "all" 
                  ? `Aucune réservation avec le statut "${statusConfig[filterStatus as keyof typeof statusConfig]?.label}"`
                  : "Commence par créer ta première réservation"
                }
              </p>
              <button
                onClick={() => setShowCreateBooking(true)}
                className="inline-flex items-center gap-2 bg-gradient-ocean text-gray-900 hover:shadow-glow-blue px-6 py-3 rounded-full font-bold shadow-elevated transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Créer une réservation
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Booking Modal */}
      <AnimatePresence>
        {showCreateBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowCreateBooking(false)
              resetBookingForm()
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Nouvelle réservation</h3>
                <button
                  onClick={() => setShowCreateBooking(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du client *</label>
                    <input
                      type="text"
                      value={bookingForm.clientName}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={bookingForm.clientEmail}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={bookingForm.clientPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début *</label>
                    <input
                      type="time"
                      value={bookingForm.startTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes) *</label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm({ ...bookingForm, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    >
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">1 heure</option>
                      <option value="90">1h30</option>
                      <option value="120">2 heures</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix (€) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={bookingForm.price}
                      onChange={(e) => setBookingForm({ ...bookingForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                  <input
                    type="text"
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent"
                    placeholder="Coaching personnalisé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-blue-500 focus:border-transparent resize-none"
                    placeholder="Notes additionnelles..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowCreateBooking(false)
                      resetBookingForm()
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateBooking}
                    className="flex-1 px-6 py-3 bg-gradient-ocean text-gray-900 rounded-xl font-bold hover:shadow-glow-blue transition-all"
                  >
                    Créer la réservation
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

