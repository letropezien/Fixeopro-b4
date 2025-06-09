"use client"

import { useEffect, useState } from "react"
import { Eye, Users, TrendingUp, Clock } from "lucide-react"
import { VisitCounterService } from "@/lib/visit-counter"

export function VisitCounter() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    communitySize: 0,
    activeRepairers: 0,
    isLoaded: false,
  })

  useEffect(() => {
    // Enregistrer la visite et obtenir les statistiques
    const visitStats = VisitCounterService.recordVisit()
    const enhancedStats = VisitCounterService.getEnhancedStats()

    // Simuler un petit délai pour l'animation
    setTimeout(() => {
      setStats({
        totalVisits: enhancedStats.totalVisits,
        todayVisits: enhancedStats.todayVisits,
        communitySize: enhancedStats.communitySize,
        activeRepairers: enhancedStats.activeRepairers,
        isLoaded: true,
      })
    }, 500)
  }, [])

  const trendMessage = VisitCounterService.getTrendMessage(stats.todayVisits)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Statistiques de la plateforme</h3>
        <p className="text-sm text-gray-600">Données en temps réel de notre communauté</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Visites totales */}
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <div
            className={`text-2xl font-bold text-blue-600 transition-all duration-1000 ${
              stats.isLoaded ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            {stats.isLoaded ? VisitCounterService.formatNumber(stats.totalVisits) : "---"}
          </div>
          <div className="text-xs text-gray-600">Visites totales</div>
        </div>

        {/* Visites du jour */}
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div
            className={`text-2xl font-bold text-green-600 transition-all duration-1000 delay-200 ${
              stats.isLoaded ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            {stats.isLoaded ? VisitCounterService.formatNumber(stats.todayVisits) : "---"}
          </div>
          <div className="text-xs text-gray-600">Aujourd'hui</div>
          {stats.isLoaded && <div className="text-xs text-green-600 font-medium mt-1">{trendMessage}</div>}
        </div>

        {/* Communauté */}
        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div
            className={`text-2xl font-bold text-purple-600 transition-all duration-1000 delay-400 ${
              stats.isLoaded ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            {stats.isLoaded ? VisitCounterService.formatNumber(stats.communitySize) : "---"}
          </div>
          <div className="text-xs text-gray-600">Membres</div>
        </div>

        {/* Réparateurs actifs */}
        <div className="text-center">
          <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div
            className={`text-2xl font-bold text-orange-600 transition-all duration-1000 delay-600 ${
              stats.isLoaded ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
            }`}
          >
            {stats.isLoaded ? VisitCounterService.formatNumber(stats.activeRepairers) : "---"}
          </div>
          <div className="text-xs text-gray-600">Réparateurs actifs</div>
        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-blue-200 my-4"></div>

      {/* Message de confiance */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">Fixeo.pro</span> - La plateforme de confiance pour vos réparations
        </p>
        <div className="flex justify-center items-center mt-2 space-x-4 text-xs text-gray-500">
          <span>✓ Réparateurs vérifiés</span>
          <span className="hidden sm:inline">✓ Devis gratuits</span>
          <span>✓ Service 24h/7j</span>
        </div>
      </div>
    </div>
  )
}
