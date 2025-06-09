// Service de comptage des visites
const isBrowser = typeof window !== "undefined"

export interface VisitStats {
  totalVisits: number
  todayVisits: number
  lastVisitDate: string
  sessionId: string
  sessionStartTime: number
}

export class VisitCounterService {
  private static readonly STORAGE_KEY = "fixeopro_visit_stats"
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

  static getVisitStats(): VisitStats {
    if (!isBrowser) {
      return {
        totalVisits: 0,
        todayVisits: 0,
        lastVisitDate: new Date().toISOString(),
        sessionId: "",
        sessionStartTime: Date.now(),
      }
    }

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de visite:", error)
    }

    // Valeurs par défaut
    return {
      totalVisits: 0,
      todayVisits: 0,
      lastVisitDate: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      sessionStartTime: Date.now(),
    }
  }

  static saveVisitStats(stats: VisitStats): void {
    if (!isBrowser) return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des statistiques de visite:", error)
    }
  }

  static recordVisit(): VisitStats {
    const stats = this.getVisitStats()
    const now = new Date()
    const today = now.toDateString()
    const lastVisitDay = new Date(stats.lastVisitDate).toDateString()

    // Vérifier si c'est une nouvelle session
    const isNewSession = this.isNewSession(stats)

    if (isNewSession) {
      // Nouvelle session
      stats.totalVisits += 1
      stats.sessionId = this.generateSessionId()
      stats.sessionStartTime = Date.now()

      // Vérifier si c'est un nouveau jour
      if (today !== lastVisitDay) {
        stats.todayVisits = 1
      } else {
        stats.todayVisits += 1
      }

      stats.lastVisitDate = now.toISOString()
      this.saveVisitStats(stats)
    } else {
      // Même session, juste mettre à jour la date de dernière visite
      stats.lastVisitDate = now.toISOString()
      this.saveVisitStats(stats)
    }

    return stats
  }

  private static isNewSession(stats: VisitStats): boolean {
    const now = Date.now()
    const timeSinceLastSession = now - stats.sessionStartTime

    // Nouvelle session si plus de 30 minutes se sont écoulées
    return timeSinceLastSession > this.SESSION_TIMEOUT
  }

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static formatNumber(num: number): string {
    return new Intl.NumberFormat("fr-FR").format(num)
  }

  static getTrendMessage(todayVisits: number): string {
    if (todayVisits === 1) return "Première visite aujourd'hui"
    if (todayVisits < 5) return "Début de journée"
    if (todayVisits < 10) return "Activité modérée"
    if (todayVisits < 20) return "Bonne activité"
    return "Forte activité"
  }

  // Méthode pour réinitialiser les statistiques (utile pour les tests)
  static resetStats(): void {
    if (!isBrowser) return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  // Méthode pour obtenir des statistiques simulées plus réalistes
  static getEnhancedStats(): VisitStats & { communitySize: number; activeRepairers: number } {
    const baseStats = this.getVisitStats()

    // Ajouter des données simulées pour rendre le compteur plus attractif
    const baseVisits = 15420 // Nombre de base pour simuler un site établi
    const baseTodayVisits = Math.floor(Math.random() * 50) + 20 // Entre 20 et 70 visites par jour

    return {
      ...baseStats,
      totalVisits: baseStats.totalVisits + baseVisits,
      todayVisits: baseStats.todayVisits + baseTodayVisits,
      communitySize: 2547, // Nombre de réparateurs inscrits
      activeRepairers: 1834, // Réparateurs actifs
    }
  }
}
