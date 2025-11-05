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
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span></span>
            <span>Tes Objectifs</span>
          </h2>
          {isEditing && (
            <p className="text-sm text-gray-500 mt-1">
              ✏️ Mode édition : modifie tes objectifs cibles
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          {!isEditing && (
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
          )}
          
          {/* Edit button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
              isEditing 
                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Annuler</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Modifier</span>
              </>
            )}
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
            description: goal.id === 'views' ? 'Visiteurs uniques ce mois' :
                         goal.id === 'sponsors' ? 'Partenaires actifs' :
                         'Clics sur vos liens'
          }))}
          title=""
          columns={1}
        />
      ) : (
        <div className="space-y-3">
          {isEditing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                💡 Comment définir tes objectifs :
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Nom</strong> : Le titre de l'objectif</li>
                <li>• <strong>Cible</strong> : La valeur que tu veux atteindre</li>
                <li>• <strong>Couleur</strong> : La couleur de la barre de progression</li>
              </ul>
            </div>
          )}
          
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              {isEditing ? (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Nom de l'objectif
                      </label>
                      <input
                        type="text"
                        value={goal.label}
                        onChange={(e) => handleGoalChange(goal.id, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Nom de l'objectif"
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Valeur cible
                      </label>
                      <input
                        type="number"
                        value={goal.max}
                        onChange={(e) => handleGoalChange(goal.id, 'max', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Objectif"
                        min="1"
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">
                        Couleur
                      </label>
                      <select
                        value={goal.color}
                        onChange={(e) => handleGoalChange(goal.id, 'color', e.target.value as Goal['color'])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="primary">Bleu</option>
                        <option value="accent">Jaune</option>
                        <option value="success">Vert</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      <strong>Actuel :</strong> {goal.value}{goal.unit || ""}
                    </span>
                    <span className="text-gray-600">
                      <strong>Objectif :</strong> {goal.max}
                    </span>
                    <span className={`font-bold ${
                      goal.value >= goal.max ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {Math.round((goal.value / goal.max) * 100)}%
                    </span>
                  </div>
                </div>
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
        <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t-2 border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Save className="w-5 h-5" />
            Enregistrer mes objectifs
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all font-semibold"
          >
            <X className="w-5 h-5" />
            Annuler les modifications
          </button>
        </div>
      )}
    </div>
  )
}
