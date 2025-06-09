// Vérifier si nous sommes dans un environnement navigateur
const isBrowser = typeof window !== "undefined"

// Ajouter l'import du service d'emails automatiques en haut du fichier
import { emailAutomationService } from "./email-automation"

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
  userType: "client" | "reparateur" | "admin"
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
    companyPhotos?: string[]
    socialMedia?: {
      facebook?: string
      instagram?: string
      linkedin?: string
    }
    notificationPreferences?: {
      maxDistance: number // Distance en kilomètres
      categories: string[] // Catégories pour lesquelles recevoir des notifications
      enableNotifications: boolean
      urgencyLevels: string[] // Niveaux d'urgence acceptés
    }
  }
  avatar?: string
  emailVerifiedAt?: string // Date de vérification de l'email
  emailVerifiedBy?: "user" | "admin" // Qui a vérifié l'email
  passwordChangedAt?: string // Date du dernier changement de mot de passe
  passwordChangedBy?: "user" | "admin" // Qui a changé le mot de passe
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface RepairResponse {
  id: string
  requestId: string
  reparateurId: string
  text: string
  price?: string
  estimatedTime?: string
  createdAt: string
  isSelected: boolean
  reparateur: {
    firstName: string
    lastName: string
    companyName?: string
    avatar?: string
  }
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
  department?: string // Ajout du département
  address?: string
  createdAt: string
  status: "open" | "in_progress" | "completed" | "cancelled"
  responses: RepairResponse[] // Changé pour stocker les réponses complètes
  selectedResponseId?: string // ID de la réponse sélectionnée
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
  photos?: string[]
  completedAt?: string // Date de fin des travaux
  cancelledAt?: string // Date d'annulation
  cancelReason?: string // Raison d'annulation
}

// Interface pour les tokens de réinitialisation de mot de passe
export interface PasswordResetToken {
  token: string
  userId: string
  email: string
  createdAt: string
  expiresAt: string
  used: boolean
}

// Mock DepartmentService
const DepartmentService = {
  getDepartmentFromPostalCode: (postalCode: string) => {
    const departments: { [key: string]: { code: string } } = {
      "75": { code: "75" },
      "75001": { code: "75" },
      "75002": { code: "75" },
      "75003": { code: "75" },
      "75004": { code: "75" },
      "75005": { code: "75" },
      "75006": { code: "75" },
      "75007": { code: "75" },
      "75008": { code: "75" },
      "75009": { code: "75" },
      "75010": { code: "75" },
      "75011": { code: "75" },
      "75012": { code: "75" },
      "75013": { code: "75" },
      "75014": { code: "75" },
      "75015": { code: "75" },
      "75016": { code: "75" },
      "75017": { code: "75" },
      "75018": { code: "75" },
      "75019": { code: "75" },
      "75020": { code: "75" },
      "69001": { code: "69" },
      "13001": { code: "13" },
      "31000": { code: "31" },
      "06000": { code: "06" },
    }
    const postalCodePrefix = postalCode.substring(0, 2)
    return departments[postalCode] || departments[postalCodePrefix] || null
  },
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

  static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static saveUser(user: User): User {
    if (!isBrowser) return user
    try {
      const users = this.getUsers()

      // Générer un ID unique si nécessaire
      if (!user.id) {
        user.id = `user_${StorageService.generateId()}`
      }

      // Ajouter la date de création si elle n'existe pas
      if (!user.createdAt) {
        user.createdAt = new Date().toISOString()
      }

      // Pour les réparateurs, ajouter automatiquement une période d'essai de 15 jours
      if (user.userType === "reparateur" && !user.subscription) {
        const trialStartDate = new Date()
        const trialEndDate = new Date(trialStartDate)
        trialEndDate.setDate(trialEndDate.getDate() + 15)

        user.subscription = {
          plan: "trial",
          status: "trial",
          startDate: trialStartDate.toISOString(),
          endDate: trialEndDate.toISOString(),
        }
      }

      // Ajouter des préférences de notification par défaut pour les réparateurs
      if (user.userType === "reparateur" && user.professional && !user.professional.notificationPreferences) {
        user.professional.notificationPreferences = {
          maxDistance: 25, // 25km par défaut
          categories: user.professional.specialties || [],
          enableNotifications: true,
          urgencyLevels: ["urgent", "same-day", "this-week", "flexible"],
        }
      }

      const existingIndex = users.findIndex((u) => u.id === user.id)
      if (existingIndex >= 0) {
        users[existingIndex] = user
      } else {
        users.push(user)
      }

      localStorage.setItem("fixeopro_users", JSON.stringify(users))

      // Dans la méthode saveUser, après la sauvegarde, ajouter :
      // Déclencher l'email automatique d'inscription
      if (!user.createdAt || user.createdAt === new Date().toISOString()) {
        // Nouvel utilisateur
        const eventId = user.userType === "client" ? "user_registration_client" : "user_registration_repairer"

        setTimeout(async () => {
          try {
            await emailAutomationService.triggerEvent(eventId, {
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              phone: user.phone,
              city: user.city,
              registrationDate: new Date(user.createdAt).toLocaleString("fr-FR"),
              companyName: user.professional?.companyName,
              specialties: user.professional?.specialties?.join(", "),
              trialEndDate: user.subscription?.endDate
                ? new Date(user.subscription.endDate).toLocaleDateString("fr-FR")
                : "",
            })

            // Email admin pour nouvelle inscription
            await emailAutomationService.triggerEvent("admin_new_user", {
              userType: user.userType === "client" ? "Client" : "Réparateur",
              userName: `${user.firstName} ${user.lastName}`,
              userEmail: user.email,
              userPhone: user.phone,
              userCity: user.city,
              registrationDate: new Date(user.createdAt).toLocaleString("fr-FR"),
            })
          } catch (error) {
            console.error("Erreur lors de l'envoi des emails automatiques:", error)
          }
        }, 1000)
      }

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

  static setCurrentUser(user: User | string): void {
    if (!isBrowser) return
    try {
      const userId = typeof user === "string" ? user : user.id
      localStorage.setItem("fixeopro_current_user_id", userId)
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

  // Gestion de la vérification d'email
  static verifyUserEmail(userId: string, verifiedBy: "user" | "admin" = "user"): boolean {
    try {
      const user = this.getUserById(userId)
      if (!user) return false

      user.isEmailVerified = true
      user.emailVerifiedAt = new Date().toISOString()
      user.emailVerifiedBy = verifiedBy

      this.saveUser(user)
      return true
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error)
      return false
    }
  }

  // Obtenir les utilisateurs non vérifiés
  static getUnverifiedUsers(): User[] {
    const users = this.getUsers()
    return users.filter((user) => !user.isEmailVerified)
  }

  // Changement de mot de passe
  static changePassword(userId: string, currentPassword: string, newPassword: string): boolean {
    try {
      const user = this.getUserById(userId)
      if (!user) return false

      // Vérifier le mot de passe actuel
      if (user.password !== currentPassword) return false

      // Mettre à jour le mot de passe
      user.password = newPassword
      user.passwordChangedAt = new Date().toISOString()
      user.passwordChangedBy = "user"

      this.saveUser(user)
      return true
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error)
      return false
    }
  }

  // Changement de mot de passe par l'admin (sans vérification de l'ancien)
  static adminChangePassword(userId: string, newPassword: string): boolean {
    try {
      const user = this.getUserById(userId)
      if (!user) return false

      // Mettre à jour le mot de passe
      user.password = newPassword
      user.passwordChangedAt = new Date().toISOString()
      user.passwordChangedBy = "admin"

      this.saveUser(user)
      return true
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe par l'admin:", error)
      return false
    }
  }

  // Gestion des tokens de réinitialisation de mot de passe
  static createPasswordResetToken(email: string): string | null {
    try {
      const user = this.getUserByEmail(email)
      if (!user) return null

      const token = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const resetToken: PasswordResetToken = {
        token,
        userId: user.id,
        email: user.email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 heures
        used: false,
      }

      // Sauvegarder le token
      const tokens = this.getPasswordResetTokens()
      // Supprimer les anciens tokens pour cet utilisateur
      const filteredTokens = tokens.filter((t) => t.userId !== user.id)
      filteredTokens.push(resetToken)
      localStorage.setItem("fixeopro_password_reset_tokens", JSON.stringify(filteredTokens))

      return token
    } catch (error) {
      console.error("Erreur lors de la création du token:", error)
      return null
    }
  }

  static getPasswordResetTokens(): PasswordResetToken[] {
    if (!isBrowser) return []
    try {
      const saved = localStorage.getItem("fixeopro_password_reset_tokens")
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Erreur lors du chargement des tokens:", error)
      return []
    }
  }

  static validatePasswordResetToken(token: string): { valid: boolean; userId?: string; error?: string } {
    try {
      const tokens = this.getPasswordResetTokens()
      const tokenData = tokens.find((t) => t.token === token && !t.used)

      if (!tokenData) {
        return { valid: false, error: "Token invalide ou déjà utilisé" }
      }

      if (new Date() > new Date(tokenData.expiresAt)) {
        return { valid: false, error: "Token expiré" }
      }

      return { valid: true, userId: tokenData.userId }
    } catch (error) {
      return { valid: false, error: "Erreur lors de la validation" }
    }
  }

  static resetPassword(token: string, newPassword: string): boolean {
    try {
      const validation = this.validatePasswordResetToken(token)
      if (!validation.valid || !validation.userId) return false

      const user = this.getUserById(validation.userId)
      if (!user) return false

      // Mettre à jour le mot de passe
      user.password = newPassword
      user.passwordChangedAt = new Date().toISOString()
      user.passwordChangedBy = "user"

      this.saveUser(user)

      // Marquer le token comme utilisé
      const tokens = this.getPasswordResetTokens()
      const tokenData = tokens.find((t) => t.token === token)
      if (tokenData) {
        tokenData.used = true
        localStorage.setItem("fixeopro_password_reset_tokens", JSON.stringify(tokens))
      }

      return true
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error)
      return false
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
        request.id = `request_${StorageService.generateId()}`
      }

      // S'assurer que les photos sont bien conservées
      if (request.photos && Array.isArray(request.photos)) {
        // Filtrer les photos vides ou invalides
        request.photos = request.photos.filter((photo) => photo && typeof photo === "string" && photo.trim() !== "")
      }

      // Ajouter la date de création si elle n'existe pas
      if (!request.createdAt) {
        request.createdAt = new Date().toISOString()
      }

      // Ajouter des coordonnées simulées si elles n'existent pas
      if (!request.coordinates) {
        request.coordinates = this.generateCoordinatesForCity(request.city)
      }

      // Ajouter la détection automatique du département si pas fourni
      if (!request.department && request.postalCode) {
        request.department = DepartmentService.getDepartmentFromPostalCode(request.postalCode)?.code
      }

      // S'assurer que les réponses sont un tableau
      if (!request.responses) {
        request.responses = []
      }

      // Vérifier le statut en fonction des réponses
      if (request.selectedResponseId && request.status === "open") {
        request.status = "in_progress"
      }

      const existingIndex = requests.findIndex((r) => r.id === request.id)
      if (existingIndex >= 0) {
        requests[existingIndex] = request
      } else {
        requests.push(request)
      }

      localStorage.setItem("fixeopro_repair_requests", JSON.stringify(requests))

      // Dans la méthode saveRepairRequest, après la sauvegarde d'une nouvelle demande, ajouter :
      // Déclencher l'email automatique pour nouvelle demande
      if (!request.createdAt || request.createdAt === new Date().toISOString()) {
        // Nouvelle demande
        setTimeout(async () => {
          try {
            await emailAutomationService.triggerEvent("request_created", {
              email: request.client.email,
              clientName: `${request.client.firstName} ${request.client.lastName}`,
              requestTitle: request.title,
              requestCategory: request.category,
              requestUrgency: request.urgencyLabel,
              requestBudget: request.budget,
              requestLocation: `${request.city} (${request.postalCode})`,
              requestDate: new Date(request.createdAt).toLocaleString("fr-FR"),
              requestId: request.id,
            })

            // Email admin pour nouvelle demande
            await emailAutomationService.triggerEvent("admin_new_request", {
              requestTitle: request.title,
              requestCategory: request.category,
              clientName: `${request.client.firstName} ${request.client.lastName}`,
              requestUrgency: request.urgencyLabel,
              requestBudget: request.budget,
              requestLocation: `${request.city} (${request.postalCode})`,
              requestDate: new Date(request.createdAt).toLocaleString("fr-FR"),
            })
          } catch (error) {
            console.error("Erreur lors de l'envoi des emails automatiques:", error)
          }
        }, 1000)
      }

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

  // Nouvelle méthode pour obtenir les demandes filtrées pour un réparateur
  static getFilteredRequestsForRepairer(reparateur: User): RepairRequest[] {
    if (reparateur.userType !== "reparateur" || !reparateur.professional?.notificationPreferences) {
      return []
    }

    const requests = this.getRepairRequests()
    const preferences = reparateur.professional.notificationPreferences

    if (!preferences.enableNotifications) {
      return []
    }

    return requests.filter((request) => {
      // Filtrer par statut (seulement les demandes ouvertes)
      if (request.status !== "open") return false

      // Filtrer par catégorie
      const categoryMatch = preferences.categories.some((category) =>
        request.category.toLowerCase().includes(category.toLowerCase()),
      )
      if (!categoryMatch) return false

      // Filtrer par niveau d'urgence
      if (!preferences.urgencyLevels.includes(request.urgency)) return false

      // Filtrer par distance
      if (reparateur.coordinates && request.coordinates) {
        const distance = this.calculateDistance(
          reparateur.coordinates.lat,
          reparateur.coordinates.lng,
          request.coordinates.lat,
          request.coordinates.lng,
        )
        if (distance > preferences.maxDistance) return false
      }

      return true
    })
  }

  // Nouvelle méthode pour ajouter une réponse à une demande
  static addResponseToRequest(requestId: string, response: Partial<RepairResponse>): boolean {
    try {
      const request = this.getRepairRequestById(requestId)
      if (!request) return false

      // Créer une nouvelle réponse
      const newResponse: RepairResponse = {
        id: `response_${this.generateId()}`,
        requestId,
        reparateurId: response.reparateurId || "",
        text: response.text || "",
        price: response.price,
        estimatedTime: response.estimatedTime,
        createdAt: new Date().toISOString(),
        isSelected: false,
        reparateur: response.reparateur || {
          firstName: "Réparateur",
          lastName: "",
        },
      }

      // Ajouter la réponse à la demande
      if (!request.responses) {
        request.responses = []
      }
      request.responses.push(newResponse)

      // Sauvegarder la demande mise à jour
      this.saveRepairRequest(request)
      return true
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse:", error)
      return false
    }
  }

  // Nouvelle méthode pour sélectionner une réponse
  static selectResponse(requestId: string, responseId: string): boolean {
    try {
      const request = this.getRepairRequestById(requestId)
      if (!request) return false

      // Mettre à jour le statut de la demande
      request.status = "in_progress"
      request.selectedResponseId = responseId

      // Marquer la réponse comme sélectionnée
      request.responses = request.responses.map((r) => ({
        ...r,
        isSelected: r.id === responseId,
      }))

      // Sauvegarder la demande mise à jour
      this.saveRepairRequest(request)
      return true
    } catch (error) {
      console.error("Erreur lors de la sélection de la réponse:", error)
      return false
    }
  }

  // Nouvelle méthode pour marquer une demande comme terminée
  static completeRequest(requestId: string): boolean {
    try {
      const request = this.getRepairRequestById(requestId)
      if (!request) return false

      // Mettre à jour le statut de la demande
      request.status = "completed"
      request.completedAt = new Date().toISOString()

      // Sauvegarder la demande mise à jour
      this.saveRepairRequest(request)
      return true
    } catch (error) {
      console.error("Erreur lors de la complétion de la demande:", error)
      return false
    }
  }

  // Nouvelle méthode pour annuler une demande
  static cancelRequest(requestId: string, reason?: string): boolean {
    try {
      const request = this.getRepairRequestById(requestId)
      if (!request) return false

      // Mettre à jour le statut de la demande
      request.status = "cancelled"
      request.cancelledAt = new Date().toISOString()
      if (reason) {
        request.cancelReason = reason
      }

      // Sauvegarder la demande mise à jour
      this.saveRepairRequest(request)
      return true
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande:", error)
      return false
    }
  }

  // Géolocalisation automatique
  static async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    if (!isBrowser) return null

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  // Obtenir la ville à partir des coordonnées (géocodage inverse simplifié)
  static async getCityFromCoordinates(lat: number, lng: number): Promise<string> {
    // Simulation d'un service de géocodage inverse
    // En production, utiliser une vraie API comme Nominatim ou Google Geocoding

    const cities = [
      { name: "Paris", lat: 48.8566, lng: 2.3522 },
      { name: "Marseille", lat: 43.2965, lng: 5.3698 },
      { name: "Lyon", lat: 45.764, lng: 4.8357 },
      { name: "Toulouse", lat: 43.6047, lng: 1.4442 },
      { name: "Nice", lat: 43.7102, lng: 7.262 },
      { name: "Nantes", lat: 47.2184, lng: -1.5536 },
      { name: "Strasbourg", lat: 48.5734, lng: 7.7521 },
      { name: "Montpellier", lat: 43.611, lng: 3.8767 },
      { name: "Bordeaux", lat: 44.8378, lng: -0.5792 },
      { name: "Lille", lat: 50.6292, lng: 3.0573 },
    ]

    // Trouver la ville la plus proche
    let closestCity = cities[0]
    let minDistance = this.calculateDistance(lat, lng, closestCity.lat, closestCity.lng)

    for (const city of cities) {
      const distance = this.calculateDistance(lat, lng, city.lat, city.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    }

    return closestCity.name
  }

  // Calculer la distance entre deux points GPS
  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Générer des coordonnées pour une ville
  static generateCoordinatesForCity(cityName: string): { lat: number; lng: number } {
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      paris: { lat: 48.8566, lng: 2.3522 },
      marseille: { lat: 43.2965, lng: 5.3698 },
      lyon: { lat: 45.764, lng: 4.8357 },
      toulouse: { lat: 43.6047, lng: 1.4442 },
      nice: { lat: 43.7102, lng: 7.262 },
      nantes: { lat: 47.2184, lng: -1.5536 },
      strasbourg: { lat: 48.5734, lng: 7.7521 },
      montpellier: { lat: 43.611, lng: 3.8767 },
      bordeaux: { lat: 44.8378, lng: -0.5792 },
      lille: { lat: 50.6292, lng: 3.0573 },
      rennes: { lat: 48.1173, lng: -1.6778 },
      reims: { lat: 49.2583, lng: 4.0317 },
      toulon: { lat: 43.1242, lng: 5.928 },
      grenoble: { lat: 45.1885, lng: 5.7245 },
      dijon: { lat: 47.3215, lng: 5.0415 },
      angers: { lat: 47.4784, lng: -0.5632 },
      nancy: { lat: 48.6921, lng: 6.1844 },
      nimes: { lat: 43.8367, lng: 4.3601 },
      limoges: { lat: 45.8336, lng: 1.2611 },
      tours: { lat: 47.3941, lng: 0.6848 },
      amiens: { lat: 49.8941, lng: 2.2958 },
      metz: { lat: 49.1193, lng: 6.1757 },
      besancon: { lat: 47.2378, lng: 6.0241 },
      brest: { lat: 48.3905, lng: -4.4861 },
      orleans: { lat: 47.9029, lng: 1.9093 },
      rouen: { lat: 49.4431, lng: 1.0993 },
      caen: { lat: 49.1829, lng: -0.3707 },
    }

    const cityKey = cityName.toLowerCase().replace(/[^a-z]/g, "")
    const coords = cityCoordinates[cityKey]

    if (coords) {
      // Ajouter une petite variation aléatoire pour éviter la superposition
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.02,
        lng: coords.lng + (Math.random() - 0.5) * 0.02,
      }
    }

    // Coordonnées par défaut (centre de la France) si la ville n'est pas trouvée
    return {
      lat: 46.603354 + (Math.random() - 0.5) * 2,
      lng: 1.888334 + (Math.random() - 0.5) * 2,
    }
  }

  // Vérification des abonnements avec période d'essai de 15 jours
  static isInTrialPeriod(user: User): boolean {
    if (!user.subscription || user.subscription.status !== "trial") return false

    // Calculer la date de fin d'essai basée sur la date d'inscription + 15 jours
    const subscriptionStart = new Date(user.subscription.startDate || user.createdAt)
    const trialEndDate = new Date(subscriptionStart)
    trialEndDate.setDate(trialEndDate.getDate() + 15)

    return trialEndDate > new Date()
  }

  // Ajouter une nouvelle méthode pour obtenir les jours restants
  static getTrialDaysRemaining(user: User): number {
    if (!user.subscription || user.subscription.status !== "trial") return 0

    const subscriptionStart = new Date(user.subscription.startDate || user.createdAt)
    const trialEndDate = new Date(subscriptionStart)
    trialEndDate.setDate(trialEndDate.getDate() + 15)

    const now = new Date()
    const diffTime = trialEndDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  // Ajouter une méthode pour obtenir la date de fin d'essai formatée
  static getTrialEndDate(user: User): string {
    if (!user.subscription || user.subscription.status !== "trial") return ""

    const subscriptionStart = new Date(user.subscription.startDate || user.createdAt)
    const trialEndDate = new Date(subscriptionStart)
    trialEndDate.setDate(trialEndDate.getDate() + 15)

    return trialEndDate.toLocaleDateString("fr-FR")
  }

  static canContactClients(user: User): boolean {
    if (user.userType !== "reparateur") return false

    // Vérifier si l'abonnement est actif
    if (user.subscription?.status === "active") return true

    // Vérifier si la période d'essai de 15 jours est encore valide
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

  static async sendVerificationEmail(email: string, firstName: string): Promise<void> {
    // Simulation d'envoi d'email
    console.log(`Email de vérification envoyé à ${email} pour ${firstName}`)
    return Promise.resolve()
  }

  static isAdmin(user: User | null): boolean {
    return user?.userType === "admin"
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
            emailVerifiedAt: new Date().toISOString(),
            emailVerifiedBy: "user",
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
            emailVerifiedAt: new Date().toISOString(),
            emailVerifiedBy: "user",
            createdAt: new Date().toISOString(),
            coordinates: { lat: 45.764, lng: 4.8357 },
            professional: {
              companyName: "Répar'Tout",
              siret: "12345678901234",
              experience: "10 ans",
              specialties: ["électroménager", "électricité"],
              description: "Spécialiste en réparation électroménager depuis 10 ans",
              companyPhotos: [],
              socialMedia: {},
              notificationPreferences: {
                maxDistance: 25,
                categories: ["électroménager", "électricité"],
                enableNotifications: true,
                urgencyLevels: ["urgent", "same-day", "this-week"],
              },
            },
            // Période d'essai automatique de 15 jours
            subscription: {
              plan: "trial",
              status: "trial",
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          {
            id: "demo_reparateur_2",
            email: "reparateur2@demo.com",
            password: "demo123",
            firstName: "Marie",
            lastName: "Dubois",
            userType: "reparateur",
            city: "Paris",
            postalCode: "75002",
            phone: "0123456787",
            isEmailVerified: false, // Compte non vérifié pour tester la validation admin
            createdAt: new Date().toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
            professional: {
              companyName: "ElectroFix",
              siret: "98765432101234",
              experience: "5 ans",
              specialties: ["électroménager", "informatique"],
              description: "Spécialiste en réparation d'appareils électroniques",
              companyPhotos: [],
              socialMedia: {},
              notificationPreferences: {
                maxDistance: 15,
                categories: ["électroménager", "informatique"],
                enableNotifications: true,
                urgencyLevels: ["urgent", "same-day"],
              },
            },
            subscription: {
              plan: "trial",
              status: "trial",
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            },
          },
          // Ajouter un compte client non vérifié
          {
            id: "demo_client_2",
            email: "client2@demo.com",
            password: "demo123",
            firstName: "Sophie",
            lastName: "Laurent",
            userType: "client",
            city: "Marseille",
            postalCode: "13001",
            phone: "0123456786",
            isEmailVerified: false, // Compte non vérifié
            createdAt: new Date().toISOString(),
          },
          // Plus de compte admin par défaut - doit être configuré via /admin/setup
        ]

        demoUsers.forEach((user) => this.saveUser(user))
      }
      // Supprimer la section de vérification/création automatique du compte admin

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
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
            photos: [],
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
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 45.764, lng: 4.8357 },
            photos: [],
          },
          {
            id: "demo_request_3",
            clientId: "demo_client_1",
            title: "Écran d'ordinateur cassé",
            description: "L'écran de mon ordinateur portable est fissuré",
            category: "informatique",
            urgency: "this-week",
            urgencyLabel: "Cette semaine",
            budget: "150-300€",
            city: "Marseille",
            postalCode: "13001",
            status: "open",
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 43.2965, lng: 5.3698 },
            photos: [],
          },
          {
            id: "demo_request_4",
            clientId: "demo_client_1",
            title: "Réparation iPhone",
            description: "Écran cassé sur iPhone 13",
            category: "téléphonie",
            urgency: "flexible",
            urgencyLabel: "Flexible",
            budget: "80-150€",
            city: "Toulouse",
            postalCode: "31000",
            status: "open",
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 43.6047, lng: 1.4442 },
            photos: [],
          },
          {
            id: "demo_request_5",
            clientId: "demo_client_1",
            title: "Panne de chauffage",
            description: "Radiateur qui ne chauffe plus",
            category: "chauffage",
            urgency: "urgent",
            urgencyLabel: "Urgent",
            budget: "200-400€",
            city: "Nice",
            postalCode: "06000",
            status: "open",
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date().toISOString(),
            coordinates: { lat: 43.7102, lng: 7.262 },
            photos: [],
          },
          // Ajouter une demande avec des réponses
          {
            id: "demo_request_6",
            clientId: "demo_client_1",
            title: "Installation climatisation",
            description: "J'ai besoin d'installer une climatisation dans mon salon",
            category: "climatisation",
            urgency: "this-week",
            urgencyLabel: "Cette semaine",
            budget: "300-500€",
            city: "Paris",
            postalCode: "75001",
            status: "open",
            responses: [
              {
                id: "response_1",
                requestId: "demo_request_6",
                reparateurId: "demo_reparateur_1",
                text: "Je peux vous proposer l'installation d'une climatisation réversible pour 400€ tout compris. Je suis disponible dès jeudi.",
                price: "400€",
                estimatedTime: "3 heures",
                createdAt: new Date().toISOString(),
                isSelected: false,
                reparateur: {
                  firstName: "Thomas",
                  lastName: "Martin",
                  companyName: "Répar'Tout",
                },
              },
              {
                id: "response_2",
                requestId: "demo_request_6",
                reparateurId: "demo_reparateur_2",
                text: "Bonjour, je peux vous installer une climatisation de qualité pour 450€ avec garantie 2 ans. Disponible lundi prochain.",
                price: "450€",
                estimatedTime: "4 heures",
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                isSelected: false,
                reparateur: {
                  firstName: "Marie",
                  lastName: "Dubois",
                  companyName: "ElectroFix",
                },
              },
            ],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
            photos: [],
          },
          // Ajouter une demande en cours
          {
            id: "demo_request_7",
            clientId: "demo_client_1",
            title: "Réparation lave-vaisselle",
            description: "Mon lave-vaisselle fait un bruit étrange et ne lave plus correctement",
            category: "électroménager",
            urgency: "same-day",
            urgencyLabel: "Aujourd'hui",
            budget: "100-200€",
            city: "Paris",
            postalCode: "75001",
            status: "in_progress",
            selectedResponseId: "response_3",
            responses: [
              {
                id: "response_3",
                requestId: "demo_request_7",
                reparateurId: "demo_reparateur_1",
                text: "Je peux intervenir aujourd'hui pour diagnostiquer et réparer votre lave-vaisselle. Tarif : 120€ incluant le déplacement.",
                price: "120€",
                estimatedTime: "1 heure",
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                isSelected: true,
                reparateur: {
                  firstName: "Thomas",
                  lastName: "Martin",
                  companyName: "Répar'Tout",
                },
              },
            ],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
            photos: [],
          },
          // Ajouter une demande terminée
          {
            id: "demo_request_8",
            clientId: "demo_client_1",
            title: "Réparation télévision",
            description: "Ma télévision s'allume mais n'affiche pas d'image",
            category: "électronique",
            urgency: "this-week",
            urgencyLabel: "Cette semaine",
            budget: "100-150€",
            city: "Paris",
            postalCode: "75001",
            status: "completed",
            selectedResponseId: "response_4",
            responses: [
              {
                id: "response_4",
                requestId: "demo_request_8",
                reparateurId: "demo_reparateur_2",
                text: "Je peux réparer votre télévision. Il s'agit probablement d'un problème de carte T-CON. Prix estimé : 130€.",
                price: "130€",
                estimatedTime: "2 heures",
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                isSelected: true,
                reparateur: {
                  firstName: "Marie",
                  lastName: "Dubois",
                  companyName: "ElectroFix",
                },
              },
            ],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            coordinates: { lat: 48.8566, lng: 2.3522 },
            photos: [],
          },
          // Ajouter une demande annulée
          {
            id: "demo_request_9",
            clientId: "demo_client_1",
            title: "Réparation vélo électrique",
            description: "Mon vélo électrique ne s'allume plus",
            category: "autres",
            urgency: "flexible",
            urgencyLabel: "Flexible",
            budget: "50-100€",
            city: "Paris",
            postalCode: "75001",
            status: "cancelled",
            responses: [],
            client: {
              firstName: "Jean",
              lastName: "Dupont",
              initials: "JD",
            },
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            cancelledAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            cancelReason: "J'ai trouvé une autre solution",
            coordinates: { lat: 48.8566, lng: 2.3522 },
            photos: [],
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

// Export nommé pour la compatibilité avec les imports
export const storage = StorageService
