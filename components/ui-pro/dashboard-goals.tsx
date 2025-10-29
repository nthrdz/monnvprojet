"use client"

import { useState, useEffect } from "react"
import { SportProgress } from "@/components/ui-pro/sport-progress"
import { StatsProgressGrid } from "@/components/ui-pro/stats-progress-grid"
import { Edit3, Save, X, BarChart3 } from "lucide-react"

interface Goal {
  id: string
  label: string
  value: number
  max: number
  unit?: string
  color: "primary" | "accent" | "success"
}

interface DashboardGoalsProps {
  views: number
  sponsorsCount: number
  linkClicks: number
}

export function DashboardGoals({
  views,
  sponsorsCount,
  linkClicks
}: DashboardGoalsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState<'classic' | 'advanced'>('advanced')
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "views",
      label: "Objectif vues mensuelles",
      value: views,
      max: 1000,
      color: "primary"
    },
    {
      id: "sponsors",
      label: "Objectif sponsors",
      value: sponsorsCount,
      max: 5,
      color: "accent"
    },
    {
      id: "engagement",
      label: "Engagement",
      value: linkClicks,
      max: 500,
      unit: " clics",
      color: "success"
    }
  ])

  // Mettre à jour les valeurs quand les props changent
  useEffect(() => {
    setGoals(prev => prev.map(goal => {
      switch(goal.id) {
        case "views":
          return { ...goal, value: views }
        case "sponsors":
          return { ...goal, value: sponsorsCount }
        case "engagement":
          return { ...goal, value: linkClicks }
        default:
          return goal
      }
    }))
  }, [views, sponsorsCount, linkClicks])

  const handleGoalChange = (goalId: string, field: keyof Goal, value: string | number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, [field]: field === 'max' ? Number(value) : value }
        : goal
    ))
  }

  const handleSave = async () => {
    // Ici on pourrait sauvegarder les objectifs personnalisés
    // Pour l'instant, on sauvegarde juste en localStorage
    localStorage.setItem('customGoals', JSON.stringify(goals))
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Recharger les objectifs depuis localStorage ou reset
    const savedGoals = localStorage.getItem('customGoals')
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoals(parsed.map((goal: Goal) => {
        switch(goal.id) {
          case "views":
            return { ...goal, value: views }
          case "sponsors":
            return { ...goal, value: sponsorsCount }
          case "engagement":
            return { ...goal, value: linkClicks }
          default:
            return goal
        }
      }))
    }
    setIsEditing(false)
  }

  // Charger les objectifs sauvegardés au montage
  useEffect(() => {
    const savedGoals = localStorage.getItem('customGoals')
    if (savedGoals) {
      const parsed = JSON.parse(savedGoals)
      setGoals(parsed.map((goal: Goal) => {
        switch(goal.id) {
          case "views":
            return { ...goal, value: views }
          case "sponsors":
            return { ...goal, value: sponsorsCount }
          case "engagement":
            return { ...goal, value: linkClicks }
          default:
            return goal
        }
      }))
    }
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sport-md p-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span></span>
          <span>Tes Objectifs</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('classic')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                viewMode === 'classic' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Classique
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                viewMode === 'advanced' 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
          
          {/* Edit button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg transition-all ${
              isEditing 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {viewMode === 'advanced' && !isEditing ? (
        <StatsProgressGrid
          goals={goals.map(goal => ({
            id: goal.id,
            label: goal.label,
            current: goal.value,
            target: goal.max,
            unit: goal.unit,
            color: goal.color === 'primary' ? 'blue' : 
                   goal.color === 'accent' ? 'orange' : 'green',
            icon: goal.id === 'views' ? 'V' : 
                  goal.id === 'sponsors' ? 'S' : 'E',
            description: goal.id === 'views' ? 'Visiteurs uniques ce mois' :
                         goal.id === 'sponsors' ? 'Partenaires actifs' :
                         'Clics sur vos liens'
          }))}
          title=""
          columns={1}
        />
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              {isEditing ? (
                <>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={goal.label}
                      onChange={(e) => handleGoalChange(goal.id, 'label', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Nom de l'objectif"
                    />
                    <input
                      type="number"
                      value={goal.max}
                      onChange={(e) => handleGoalChange(goal.id, 'max', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Objectif"
                    />
                    <select
                      value={goal.color}
                      onChange={(e) => handleGoalChange(goal.id, 'color', e.target.value as Goal['color'])}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="primary">Bleu</option>
                      <option value="accent">Jaune</option>
                      <option value="success">Vert</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-500">
                    Actuel: {goal.value}{goal.unit || ""} / Objectif: {goal.max}
                  </div>
                </>
              ) : (
                <SportProgress
                  label={goal.label}
                  value={goal.value}
                  max={goal.max}
                  unit={goal.unit}
                  color={goal.color}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
