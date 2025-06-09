// Types pour les annonces
export interface RepairRequest {
  id: string
  title: string
  description: string
  category: string
  urgency: string
  urgencyLevel: "high" | "medium" | "low"
  city: string
  postalCode: string
  department: string
  departmentName: string
  budget: string
  client: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  createdAt: string
  responses: number
  status: "open" | "in_progress" | "completed" | "cancelled"
  completedAt?: string
  photos?: string[]
}

export class RequestLifecycleService {
  // Vérifier si une annonce est nouvelle (moins d'une semaine)
  static isNew(request: RepairRequest): boolean {
    const created = new Date(request.createdAt)
    const now = new Date()
    const diffTime = now.getTime() - created.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  // Vérifier si une annonce terminée doit être supprimée (plus de 15 jours)
  static shouldBeDeleted(request: RepairRequest): boolean {
    if (request.status !== "completed" || !request.completedAt) return false

    const completed = new Date(request.completedAt)
    const now = new Date()
    const diffTime = now.getTime() - completed.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays > 15
  }

  // Nettoyer les annonces selon les règles de cycle de vie
  static cleanupRequests(requests: RepairRequest[]): RepairRequest[] {
    return requests.filter((request) => !this.shouldBeDeleted(request))
  }

  // Marquer une annonce comme terminée
  static markAsCompleted(request: RepairRequest): RepairRequest {
    return {
      ...request,
      status: "completed",
      completedAt: new Date().toISOString(),
    }
  }

  // Obtenir le statut d'affichage d'une annonce
  static getDisplayStatus(request: RepairRequest): "new" | "in_progress" | "completed" | "open" {
    if (this.isNew(request)) return "new"
    if (request.status === "in_progress") return "in_progress"
    if (request.status === "completed") return "completed"
    return "open"
  }

  // Obtenir la couleur de bordure selon le statut
  static getBorderColor(request: RepairRequest): string {
    const status = this.getDisplayStatus(request)

    switch (status) {
      case "new":
        return "border-l-blue-500"
      case "in_progress":
        return "border-l-amber-500"
      case "completed":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  // Obtenir le badge de statut
  static getStatusBadge(status: "new" | "in_progress" | "completed" | "open"): {
    color: string
    label: string
    icon?: string
  } {
    switch (status) {
      case "new":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Nouvelle",
        }
      case "in_progress":
        return {
          color: "bg-amber-100 text-amber-800 border-amber-200",
          label: "En cours",
          icon: "Clock",
        }
      case "completed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Terminée",
          icon: "CheckCircle",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Ouverte",
        }
    }
  }

  // Obtenir le badge pour le nombre de réponses
  static getResponsesBadge(count: number): {
    color: string
    icon: string
  } {
    if (count === 0) {
      return {
        color: "bg-red-50 text-red-700",
        icon: "MessageSquare",
      }
    } else if (count >= 5) {
      return {
        color: "bg-green-50 text-green-700",
        icon: "MessageSquare",
      }
    } else {
      return {
        color: "bg-blue-50 text-blue-700",
        icon: "MessageSquare",
      }
    }
  }
}
