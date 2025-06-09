// Service de compteur de visites
export class VisitCounterService {
  private static readonly STORAGE_KEY = "fixeopro_visit_counter"
  private static readonly DAILY_VISITS_KEY = "fixeopro_daily_visits"
  private static readonly LAST_VISIT_KEY = "fixeopro_last_visit"

  // Obtenir le nombre total de visites
  static getTotalVisits(): number {
    if (typeof window === "undefined") return 0
    try {
      const visits = localStorage.getItem(this.STORAGE_KEY)
      return visits ? Number.parseInt(visits, 10) : 0
    } catch (error) {
      console.error("Erreur lors de la récupération des visites:", error)
      return 0
    }
  }

  // Obtenir les visites du jour
  static getDailyVisits(): number {
    if (typeof window === "undefined") return 0
    try {
      const today = new Date().toDateString()
      const dailyData = localStorage.getItem(this.DAILY_VISITS_KEY)

      if (!dailyData) return 0

      const data = JSON.parse(dailyData)
      return data.date === today ? data.count : 0
    } catch (error) {
      console.error("Erreur lors de la récupération des visites du jour:", error)
      return 0
    }
  }

  // Enregistrer une nouvelle visite
  static recordVisit(): void {
    if (typeof window === "undefined") return

    try {
      const now = new Date()
      const today = now.toDateString()
      const lastVisit = localStorage.getItem(this.LAST_VISIT_KEY)

      // Vérifier si c'est une nouvelle session (plus de 30 minutes depuis la dernière visite)
      const shouldCount = !lastVisit || now.getTime() - new Date(lastVisit).getTime() > 30 * 60 * 1000

      if (shouldCount) {
        // Incrémenter le compteur total
        const totalVisits = this.getTotalVisits() + 1
        localStorage.setItem(this.STORAGE_KEY, totalVisits.toString())

        // Gérer les visites quotidiennes
        const dailyData = localStorage.getItem(this.DAILY_VISITS_KEY)
        let dailyVisits = 1

        if (dailyData) {
          const data = JSON.parse(dailyData)
          if (data.date === today) {
            dailyVisits = data.count + 1
          }
        }

        localStorage.setItem(
          this.DAILY_VISITS_KEY,
          JSON.stringify({
            date: today,
            count: dailyVisits,
          }),
        )

        // Mettre à jour la dernière visite
        localStorage.setItem(this.LAST_VISIT_KEY, now.toISOString())
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la visite:", error)
    }
  }

  // Obtenir les statistiques complètes
  static getStats(): {
    totalVisits: number
    dailyVisits: number
    lastVisit: string | null
  } {
    return {
      totalVisits: this.getTotalVisits(),
      dailyVisits: this.getDailyVisits(),
      lastVisit: typeof window !== "undefined" ? localStorage.getItem(this.LAST_VISIT_KEY) : null,
    }
  }

  // Réinitialiser le compteur (pour les admins)
  static resetCounter(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.DAILY_VISITS_KEY)
      localStorage.removeItem(this.LAST_VISIT_KEY)
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error)
    }
  }

  // Formater le nombre avec des séparateurs
  static formatNumber(num: number): string {
    return num.toLocaleString("fr-FR")
  }
}
