// Vérifier si nous sommes dans un environnement navigateur
const isBrowser = typeof window !== "undefined"

export class StorageService {
  // Utilisateurs
  static getUsers() {
    if (!isBrowser) return []
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  }

  static saveUser(user: any) {
    if (!isBrowser) return
    const users = this.getUsers()

    // Générer un ID unique si l'utilisateur n'en a pas
    if (!user.id) {
      user.id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Si l'utilisateur est un réparateur et qu'il vient de s'inscrire, ajouter la période d'essai
    if (user.userType === "reparateur" && !user.subscription) {
      user.subscription = {
        plan: "trial",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours
        isActive: true,
      }
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUserIndex = users.findIndex((u: any) => u.id === user.id)

    if (existingUserIndex >= 0) {
      // Mettre à jour l'utilisateur existant
      users[existingUserIndex] = { ...users[existingUserIndex], ...user }
    } else {
      // Ajouter le nouvel utilisateur
      users.push(user)
    }

    localStorage.setItem("users", JSON.stringify(users))
    return user
  }

  static getUserByEmail(email: string) {
    if (!isBrowser) return null
    const users = this.getUsers()
    return users.find((user: any) => user.email === email) || null
  }

  static getUserById(id: string) {
    if (!isBrowser) return null
    const users = this.getUsers()
    return users.find((user: any) => user.id === id) || null
  }

  static getCurrentUser() {
    if (!isBrowser) return null
    const currentUserId = localStorage.getItem("currentUserId")
    if (!currentUserId) return null
    return this.getUserById(currentUserId)
  }

  static setCurrentUser(userId: string) {
    if (!isBrowser) return
    localStorage.setItem("currentUserId", userId)
  }

  static logout() {
    if (!isBrowser) return
    localStorage.removeItem("currentUserId")
  }

  static updateUserSubscription(userId: string, subscription: any) {
    if (!isBrowser) return
    const user = this.getUserById(userId)
    if (user) {
      user.subscription = subscription
      this.saveUser(user)
    }
  }

  static isSubscriptionActive(user: any) {
    if (!user || !user.subscription) return false

    // Si c'est un abonnement payant actif
    if (user.subscription.isActive && user.subscription.plan !== "trial") {
      return true
    }

    // Si c'est une période d'essai, vérifier qu'elle n'est pas expirée
    if (user.subscription.plan === "trial") {
      const endDate = new Date(user.subscription.endDate)
      return endDate > new Date()
    }

    return false
  }

  // Demandes de réparation
  static getRepairRequests() {
    if (!isBrowser) return []
    const requests = localStorage.getItem("repairRequests")
    return requests ? JSON.parse(requests) : []
  }

  static saveRepairRequest(request: any) {
    if (!isBrowser) return
    const requests = this.getRepairRequests()

    // Générer un ID unique si la demande n'en a pas
    if (!request.id) {
      request.id = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Ajouter la date de création si elle n'existe pas
    if (!request.createdAt) {
      request.createdAt = new Date().toISOString()
    }

    // Initialiser les réponses si elles n'existent pas
    if (!request.responses) {
      request.responses = []
    }

    // Vérifier si la demande existe déjà
    const existingRequestIndex = requests.findIndex((r: any) => r.id === request.id)

    if (existingRequestIndex >= 0) {
      // Mettre à jour la demande existante
      requests[existingRequestIndex] = { ...requests[existingRequestIndex], ...request }
    } else {
      // Ajouter la nouvelle demande
      requests.push(request)
    }

    localStorage.setItem("repairRequests", JSON.stringify(requests))
    return request
  }

  static getRepairRequestById(id: string) {
    if (!isBrowser) return null
    const requests = this.getRepairRequests()
    return requests.find((request: any) => request.id === id) || null
  }

  static getRepairRequestsByUserId(userId: string) {
    if (!isBrowser) return []
    const requests = this.getRepairRequests()
    return requests.filter((request: any) => request.userId === userId)
  }

  static addResponseToRequest(requestId: string, response: any) {
    if (!isBrowser) return
    const request = this.getRepairRequestById(requestId)
    if (request) {
      if (!response.id) {
        response.id = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
      if (!response.createdAt) {
        response.createdAt = new Date().toISOString()
      }

      if (!request.responses) {
        request.responses = []
      }

      request.responses.push(response)
      this.saveRepairRequest(request)
      return response
    }
    return null
  }

  // Données de démonstration
  static initDemoData() {
    if (!isBrowser) return

    // Vérifier si des données existent déjà
    const users = this.getUsers()
    const requests = this.getRepairRequests()

    if (users.length === 0) {
      // Créer des utilisateurs de démonstration
      const demoUsers = [
        {
          id: "user_client_1",
          firstName: "Jean",
          lastName: "Dupont",
          email: "client@example.com",
          password: "password123",
          userType: "client",
          city: "Paris",
          postalCode: "75001",
          phone: "0123456789",
        },
        {
          id: "user_reparateur_1",
          firstName: "Thomas",
          lastName: "Bernard",
          email: "pro@example.com",
          password: "password123",
          userType: "reparateur",
          city: "Paris",
          postalCode: "75002",
          phone: "0123456788",
          professional: {
            companyName: "Répar'Tout",
            siret: "12345678901234",
            description: "Spécialiste en réparation électroménager depuis 10 ans",
            experience: "10 ans",
            specialties: ["électroménager", "électricité"],
          },
          subscription: {
            plan: "trial",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
          },
        },
      ]

      demoUsers.forEach((user) => this.saveUser(user))
    }

    if (requests.length === 0) {
      // Créer des demandes de réparation de démonstration
      const demoRequests = [
        {
          id: "request_1",
          title: "Réparation machine à laver",
          description: "Ma machine à laver ne démarre plus et fait un bruit étrange",
          category: "électroménager",
          city: "Paris",
          postalCode: "75001",
          urgency: "urgent",
          urgencyLabel: "Urgent",
          userId: "user_client_1",
          client: { firstName: "Jean", lastName: "Dupont", id: "user_client_1" },
          createdAt: new Date().toISOString(),
          responses: [],
        },
        {
          id: "request_2",
          title: "Problème de plomberie",
          description: "Fuite sous l'évier de la cuisine",
          category: "plomberie",
          city: "Lyon",
          postalCode: "69001",
          urgency: "same-day",
          urgencyLabel: "Aujourd'hui",
          userId: "user_client_1",
          client: { firstName: "Jean", lastName: "Dupont", id: "user_client_1" },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          responses: [],
        },
        {
          id: "request_3",
          title: "Écran d'ordinateur cassé",
          description: "L'écran de mon ordinateur portable est fissuré",
          category: "informatique",
          city: "Marseille",
          postalCode: "13001",
          urgency: "this-week",
          urgencyLabel: "Cette semaine",
          userId: "user_client_1",
          client: { firstName: "Jean", lastName: "Dupont", id: "user_client_1" },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          responses: [],
        },
        {
          id: "request_4",
          title: "Réparation iPhone",
          description: "Écran cassé sur iPhone 13",
          category: "téléphonie",
          city: "Toulouse",
          postalCode: "31000",
          urgency: "flexible",
          urgencyLabel: "Flexible",
          userId: "user_client_1",
          client: { firstName: "Jean", lastName: "Dupont", id: "user_client_1" },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          responses: [],
        },
      ]

      demoRequests.forEach((request) => this.saveRepairRequest(request))
    }
  }
}

// Initialiser les données de démonstration si nous sommes dans un environnement navigateur
if (isBrowser) {
  StorageService.initDemoData()
}
