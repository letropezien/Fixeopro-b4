import { StorageService as BaseStorageService } from "../lib/storage"
import type { User, RepairRequest } from "../lib/storage"

// Extension du service de base avec des méthodes supplémentaires
export class StorageService extends BaseStorageService {
  // Méthodes pour sauvegarder les données (utilisées dans l'admin)
  static saveUsers(users: User[]): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fixeopro_users", JSON.stringify(users))
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des utilisateurs:", error)
      }
    }
  }

  static saveRepairRequests(requests: RepairRequest[]): void {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fixeopro_repair_requests", JSON.stringify(requests))
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des demandes:", error)
      }
    }
  }

  // Méthodes pour supprimer des éléments spécifiques
  static deleteUser(userId: string): boolean {
    try {
      const users = this.getUsers()
      const updatedUsers = users.filter((user) => user.id !== userId)
      this.saveUsers(updatedUsers)
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      return false
    }
  }

  static deleteRepairRequest(requestId: string): boolean {
    try {
      const requests = this.getRepairRequests()
      const updatedRequests = requests.filter((request) => request.id !== requestId)
      this.saveRepairRequests(updatedRequests)
      return true
    } catch (error) {
      console.error("Erreur lors de la suppression de la demande:", error)
      return false
    }
  }

  // Méthodes pour obtenir des statistiques
  static getStats() {
    try {
      const users = this.getUsers()
      const requests = this.getRepairRequests()

      const clients = users.filter((user) => user.userType === "client")
      const reparateurs = users.filter((user) => user.userType === "reparateur")

      return {
        totalUsers: users.length,
        totalClients: clients.length,
        totalReparateurs: reparateurs.length,
        totalRequests: requests.length,
        activeSubscriptions: reparateurs.filter((rep) => rep.subscription?.status === "active").length,
        trialUsers: reparateurs.filter((rep) => rep.subscription?.status === "trial").length,
      }
    } catch (error) {
      console.error("Erreur lors du calcul des statistiques:", error)
      return {
        totalUsers: 0,
        totalClients: 0,
        totalReparateurs: 0,
        totalRequests: 0,
        activeSubscriptions: 0,
        trialUsers: 0,
      }
    }
  }

  // Méthodes pour la gestion des catégories
  static updateUserCategories(userId: string, categories: string[]): boolean {
    try {
      const users = this.getUsers()
      const userIndex = users.findIndex((user) => user.id === userId)

      if (userIndex !== -1) {
        users[userIndex].categories = categories
        this.saveUsers(users)
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de la mise à jour des catégories:", error)
      return false
    }
  }

  // Méthodes pour la gestion des demandes
  static updateRequestStatus(requestId: string, status: string): boolean {
    try {
      const requests = this.getRepairRequests()
      const requestIndex = requests.findIndex((request) => request.id === requestId)

      if (requestIndex !== -1) {
        requests[requestIndex].status = status
        this.saveRepairRequests(requests)
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      return false
    }
  }

  // Méthodes pour la recherche
  static searchUsers(query: string): User[] {
    try {
      const users = this.getUsers()
      const lowercaseQuery = query.toLowerCase()

      return users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          (user.company && user.company.toLowerCase().includes(lowercaseQuery)),
      )
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error)
      return []
    }
  }

  static searchRequests(query: string): RepairRequest[] {
    try {
      const requests = this.getRepairRequests()
      const lowercaseQuery = query.toLowerCase()

      return requests.filter(
        (request) =>
          request.title.toLowerCase().includes(lowercaseQuery) ||
          request.description.toLowerCase().includes(lowercaseQuery) ||
          request.category.toLowerCase().includes(lowercaseQuery),
      )
    } catch (error) {
      console.error("Erreur lors de la recherche de demandes:", error)
      return []
    }
  }
}

// Réexportation des types
export type { User, RepairRequest } from "../lib/storage"

// Export par défaut pour compatibilité
export default StorageService
