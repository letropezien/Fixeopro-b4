// Vérifier si nous sommes dans un environnement navigateur
const isBrowser = typeof window !== "undefined"

export interface User {
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
    startDate: string
    endDate: string
    paymentMethod?: string
    transactionId?: string
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

export interface RepairRequest {
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
  coordinates?: {
    lat: number
    lng: number
  }
}

export class StorageService {
  // Gestion des utilisateurs
  static getUsers(): User[] {
    if (!isBrowser) return []
    try {
      const users = localStorage.getItem("fixeopro_users")
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      return []
    }
  }

  static saveUser(user: User): User {
    if (!isBrowser) return user
    try {
      const users = this.getUsers()

      // Générer un ID unique si nécessaire
      if (!user.id) {
        user.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Ajouter la date de création si elle n'existe pas
      if (!user.createdAt) {
        user.createdAt = new Date().toISOString()
      }

      // Pour les réparateurs, ajouter une période d'essai par défaut
      if (user.userType === "reparateur" && !user.subscription) {
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 15)

        user.subscription = {
          plan: "trial",
          status: "trial",
          startDate: new Date().toISOString(),
          endDate: trialEndDate.toISOString(),
        }
      }

      const existingIndex = users.findIndex((u) => u.id === user.id)
      if (existingIndex >= 0) {
        users[existingIndex] = user
      } else {
        users.push(user)
      }

      localStorage.setItem("fixeopro_users", JSON.stringify(users))
      return user
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error)
      return user
    }
  }

  static getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.email === email) || null
  }

  static getUserById(id: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.id === id) || null
  }

  static authenticateUser(email: string, password: string): User | null {
    const user = this.getUserByEmail(email)
    if (user && user.password === password) {
      this.setCurrentUser(user)
      return user
    }
    return null
  }

  // Gestion de l'utilisateur connecté
  static getCurrentUser(): User | null {
    if (!isBrowser) return null
    try {
      const currentUserId = localStorage.getItem("fixeopro_current_user_id")
      if (!currentUserId) return null
      return this.getUserById(currentUserId)
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur actuel:", error)
      return null
    }
  }

  static setCurrentUser(user: User): void {
    if (!isBrowser) return
    try {
      localStorage.setItem("fixeopro_current_user_id", user.id)
    } catch (error) {
      console.error("Erreur lors de la définition de l'utilisateur actuel:", error)
    }
  }

  static logout(): void {
    if (!isBrowser) return
    try {
      localStorage.removeItem("fixeopro_current_user_id")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  // Gestion des demandes de réparation
  static getRepairRequests(): RepairRequest[] {
    if (!isBrowser) return []
    try {
      const requests = localStorage.getItem("fixeopro_repair_requests")
      return requests ? JSON.parse(requests) : []
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error)
      return []
    }
  }

  static saveRepairRequest(request: RepairRequest): RepairRequest {
    if (!isBrowser) return request
    try {
      const requests = this.getRepairRequests()

      // Générer un ID unique si nécessaire
      if (!request.id) {
        request.id = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }

      // Ajouter la date de création si elle n'existe pas
      if (!request.createdAt) {
        request.createdAt = new Date().toISOString()
      }

      // Ajouter des coordonnées simulées si elles n'existent pas
      if (!request.coordinates) {
        request.coordinates = this.generateCoordinatesForCity(request.city)
      }

      const existingIndex = requests.findIndex((r) => r.id === request.id)
      if (existingIndex >= 0) {
        requests[existingIndex] = request
      } else {
        requests.push(request)
      }

      localStorage.setItem("fixeopro_repair_requests", JSON.stringify(requests))
      return request
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la demande:", error)
      return request
    }
  }

  static getRepairRequestsByClient(clientId: string): RepairRequest[] {
    const requests = this.getRepairRequests()
    return requests.filter((r) => r.clientId === clientId)
  }

  static getRepairRequestById(id: string): RepairRequest | null {
    const requests = this.getRepairRequests()
    return requests.find((r) => r.id === id) || null
  }

  // Générer des coordonnées pour une ville
  static generateCoordinatesForCity(city: string): { lat: number; lng: number } {
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      paris: { lat: 48.8566, lng: 2.3522 },
      lyon: { lat: 45.764, lng: 4.8357 },
      marseille: { lat: 43.2965, lng: 5.3698 },
      toulouse: { lat: 43.6047, lng: 1.4442 },
      nice: { lat: 43.7102, lng: 7.262 },
      nantes: { lat: 47.2184, lng: -1.5536 },
      strasbourg: { lat: 48.5734, lng: 7.7521 },
      montpellier: { lat: 43.611, lng: 3.8767 },
      bordeaux: { lat: 44.8378, lng: -0.5792 },
      lille: { lat: 50.6292, lng: 3.0573 },
    }

    const cityKey = city.toLowerCase().replace(/\s+/g, "")
    const baseCoords = cityCoordinates[cityKey] || { lat: 46.2276, lng: 2.2137 }

    // Ajouter une variation aléatoire pour éviter la superposition
    return {
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.1,
    }
  }

  // Vérification des abonnements
  static isInTrialPeriod(user: User): boolean {
    if (!user.subscription || user.subscription.status !== "trial") return false
    const expiresAt = new Date(user.subscription.endDate)
    return expiresAt > new Date()
  }

  static canContactClients(user: User): boolean {
    if (user.userType !== "reparateur") return false
    if (user.subscription?.status === "active") return true
    return this.isInTrialPeriod(user)
  }

  // Mise à jour de l'abonnement après paiement
  static updateSubscription(userId: string, subscriptionData: any): boolean {
    try {
      const user = this.getUserById(userId)
      if (!user) return false

      user.subscription = {
        ...user.subscription,
        ...subscriptionData,
        status: "active",
      }

      this.saveUser(user)
      return true
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'abonnement:", error)
      return false
    }
  }

  // Initialisation des données de démonstration
  static initDemoData(): void {
    if (!isBrowser) return

    try {
      const users = this.getUsers()
      const requests = this.getRepairRequests()

      // Créer des utilisateurs de démonstration si aucun n'existe
      if (users.length === 0) {
        const demoUsers: User[] = [
          {
            id: "demo_client_1",
            email: "client@demo.com",
            password: "demo123",
            firstName: "Jean",
            lastName: "Dupont",
            userType: "client",
            city: "Paris",
            postalCode: "75001",
            phone: "0123456789",
            isEmailVerified: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: "demo_reparateur_1",
            email: "reparateur@demo.com",
            password: "demo123",
            firstName: "Thomas",
            lastName: "Martin",
            userType: "reparateur",
            city: "Lyon",
            postalCode: "69001",
            phone: "0123456788",
            isEmailVerified: true,
            createdAt: new Date().toISOString(),
            professional: {
              companyName: "Répar'Tout",
              siret: "12345678901234",
              experience: "10 ans",
              specialties: ["électroménager", "électricité"],
              description: "Spécialiste en réparation électroménager depuis 10 ans",
            },
            subscription: {
              plan: "trial",
              status: "trial",
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
        ]

        demoUsers.forEach((user) => this.saveUser(user))
      }

      // Créer des demandes de démonstration si aucune n'existe
      if (requests.length === 0) {
        const demoRequests: RepairRequest[] = [
          {
            id: "demo_request_1",
            clientId: "demo_client_1",
            title: "Réparation machine à laver",
            description: "Ma machine à laver ne démarre plus",
            category: "électroménager",
            urgency: "urgent",
            urgencyLabel: "Urgent",
            budget: "100-200€",
            city: "Paris",
            postalCode: "75001",
            status: "open",
            responses: 0,
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
          },
          {
            id: "demo_request_2",
            clientId: "demo_client_1",
            title: "Problème de plomberie",
            description: "Fuite sous l'évier",
            category: "plomberie",
            urgency: "same-day",
            urgencyLabel: "Aujourd'hui",
            budget: "50-100€",
            city: "Lyon",
            postalCode: "69001",
            status: "open",
            responses: 0,
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 45.764, lng: 4.8357 },
          },
        ]

        demoRequests.forEach((request) => this.saveRepairRequest(request))
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données de démonstration:", error)
    }
  }
}

// Initialiser les données de démonstration au chargement
if (isBrowser) {
  StorageService.initDemoData()
}
