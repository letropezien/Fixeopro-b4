// Simulation d'une base de données locale
interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  userType: "client" | "reparateur"
  isEmailVerified: boolean
  createdAt: string
  subscription?: {
    plan: string
    status: "active" | "inactive" | "trial"
    expiresAt: string
  }
  professional?: {
    companyName?: string
    siret?: string
    experience: string
    specialties: string[]
    description: string
    website?: string
  }
  avatar?: string
}

interface RepairRequest {
  id: string
  clientId: string
  category: string
  urgency: string
  urgencyLabel: string
  title: string
  description: string
  budget: string
  city: string
  postalCode: string
  address?: string
  createdAt: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  responses: number
  client: {
    firstName: string
    lastName: string
    initials: string
    email?: string
    phone?: string
  }
}

// Stockage local simulé
const STORAGE_KEYS = {
  USERS: "fixeopro_users",
  REPAIR_REQUESTS: "fixeopro_repair_requests",
  CURRENT_USER: "fixeopro_current_user",
}

export class StorageService {
  // Gestion des utilisateurs
  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(STORAGE_KEYS.USERS)
    return users ? JSON.parse(users) : []
  }

  static saveUser(user: User): void {
    if (typeof window === "undefined") return
    const users = this.getUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)

    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.email === email) || null
  }

  static getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.id === id) || null
  }

  // Gestion de l'utilisateur connecté
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return currentUser ? JSON.parse(currentUser) : null
  }

  static setCurrentUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  }

  static logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  // Gestion des demandes de réparation
  static getRepairRequests(): RepairRequest[] {
    if (typeof window === "undefined") return []
    const requests = localStorage.getItem(STORAGE_KEYS.REPAIR_REQUESTS)
    return requests ? JSON.parse(requests) : []
  }

  static saveRepairRequest(request: RepairRequest): void {
    if (typeof window === "undefined") return
    const requests = this.getRepairRequests()
    const existingIndex = requests.findIndex((r) => r.id === request.id)

    if (existingIndex >= 0) {
      requests[existingIndex] = request
    } else {
      requests.push(request)
    }

    localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(requests))
  }

  static getRepairRequestsByClient(clientId: string): RepairRequest[] {
    const requests = this.getRepairRequests()
    return requests.filter((r) => r.clientId === clientId)
  }

  // Simulation d'envoi d'email
  static async sendVerificationEmail(email: string, firstName: string): Promise<boolean> {
    console.log(`📧 Email de vérification envoyé à ${email} pour ${firstName}`)

    // Simulation d'un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulation d'un succès (dans un vrai projet, ici on appellerait une API)
    return true
  }

  // Génération d'ID unique
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Ajouter une fonction pour vérifier si un utilisateur est en période d'essai
  static isInTrialPeriod(user: User): boolean {
    if (!user.subscription || user.subscription.status !== "trial") return false
    const expiresAt = new Date(user.subscription.expiresAt)
    return expiresAt > new Date()
  }

  // Ajouter une fonction pour vérifier si un utilisateur peut contacter des clients
  static canContactClients(user: User): boolean {
    if (user.userType !== "reparateur") return false
    if (user.subscription?.status === "active") return true
    return this.isInTrialPeriod(user)
  }
}
