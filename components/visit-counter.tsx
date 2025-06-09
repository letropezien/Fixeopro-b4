"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, TrendingUp, Users, Calendar } from "lucide-react"
import { VisitCounterService } from "@/lib/visit-counter"

export function VisitCounter() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    dailyVisits: 0,
    lastVisit: null as string | null,
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Enregistrer la visite
    VisitCounterService.recordVisit()

    // Charger les statistiques
    const loadStats = () => {
      setStats(VisitCounterService.getStats())
    }

    loadStats()

    // Animation d'apparition
    const timer = setTimeout(() => setIsVisible(true), 500)

    // Mettre à jour les stats toutes les minutes
    const interval = setInterval(loadStats, 60000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const formatNumber = (num: number) => VisitCounterService.formatNumber(num)

  return (
    <div
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
    >
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-8">
            {/* Compteur principal */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="bg-blue-600 p-2 rounded-full">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Visites totales</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{formatNumber(stats.totalVisits)}</div>
              <Badge variant="outline" className="text-xs">
                Depuis le lancement
              </Badge>
            </div>

            {/* Séparateur */}
            <div className="hidden sm:block w-px h-16 bg-gray-300"></div>

            {/* Visites du jour */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="bg-green-600 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Aujourd'hui</h3>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-1">{formatNumber(stats.dailyVisits)}</div>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Visites du jour
              </Badge>
            </div>

            {/* Séparateur */}
            <div className="hidden md:block w-px h-16 bg-gray-300"></div>

            {/* Communauté */}
            <div className="hidden md:block text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="bg-purple-600 p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Communauté</h3>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-1">2500+</div>
              <Badge variant="outline" className="text-xs">
                Réparateurs actifs
              </Badge>
            </div>
          </div>

          {/* Message de confiance */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">FixeoPro</span> - La plateforme de confiance pour vos
              réparations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
