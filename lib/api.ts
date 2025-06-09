// API utilities for FixeoPro platform
import { storage } from "./storage"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

interface RequestData {
  id: string
  title: string
  description: string
  category: string
  location: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled"
  createdAt: string
  budget?: number
  photos?: string[]
  urgency: "low" | "medium" | "high"
}

interface UserData {
  id: string
  email: string
  name: string
  type: "client" | "repairer" | "admin"
  subscription?: {
    status: "active" | "trial" | "expired"
    expiresAt: string
    trialStarted?: string
  }
  profile?: {
    phone?: string
    address?: string
    company?: string
    specialties?: string[]
  }
}

class ApiService {
  // Requests API
  async getRequests(): Promise<ApiResponse<RequestData[]>> {
    try {
      const requests = storage.getItem("requests") || []
      return { success: true, data: requests }
    } catch (error) {
      return { success: false, error: "Failed to fetch requests" }
    }
  }

  async getRequestById(id: string): Promise<ApiResponse<RequestData>> {
    try {
      const requests = storage.getItem("requests") || []
      const request = requests.find((r: RequestData) => r.id === id)
      if (!request) {
        return { success: false, error: "Request not found" }
      }
      return { success: true, data: request }
    } catch (error) {
      return { success: false, error: "Failed to fetch request" }
    }
  }

  async createRequest(requestData: Omit<RequestData, "id" | "createdAt">): Promise<ApiResponse<RequestData>> {
    try {
      const requests = storage.getItem("requests") || []
      const newRequest: RequestData = {
        ...requestData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "pending",
      }
      requests.push(newRequest)
      storage.setItem("requests", requests)
      return { success: true, data: newRequest }
    } catch (error) {
      return { success: false, error: "Failed to create request" }
    }
  }

  async updateRequest(id: string, updates: Partial<RequestData>): Promise<ApiResponse<RequestData>> {
    try {
      const requests = storage.getItem("requests") || []
      const index = requests.findIndex((r: RequestData) => r.id === id)
      if (index === -1) {
        return { success: false, error: "Request not found" }
      }
      requests[index] = { ...requests[index], ...updates }
      storage.setItem("requests", requests)
      return { success: true, data: requests[index] }
    } catch (error) {
      return { success: false, error: "Failed to update request" }
    }
  }

  async deleteRequest(id: string): Promise<ApiResponse> {
    try {
      const requests = storage.getItem("requests") || []
      const filteredRequests = requests.filter((r: RequestData) => r.id !== id)
      storage.setItem("requests", filteredRequests)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to delete request" }
    }
  }

  // Users API
  async getUsers(): Promise<ApiResponse<UserData[]>> {
    try {
      const users = storage.getItem("users") || []
      return { success: true, data: users }
    } catch (error) {
      return { success: false, error: "Failed to fetch users" }
    }
  }

  async getUserById(id: string): Promise<ApiResponse<UserData>> {
    try {
      const users = storage.getItem("users") || []
      const user = users.find((u: UserData) => u.id === id)
      if (!user) {
        return { success: false, error: "User not found" }
      }
      return { success: true, data: user }
    } catch (error) {
      return { success: false, error: "Failed to fetch user" }
    }
  }

  async createUser(userData: Omit<UserData, "id">): Promise<ApiResponse<UserData>> {
    try {
      const users = storage.getItem("users") || []
      const newUser: UserData = {
        ...userData,
        id: Date.now().toString(),
      }
      users.push(newUser)
      storage.setItem("users", users)
      return { success: true, data: newUser }
    } catch (error) {
      return { success: false, error: "Failed to create user" }
    }
  }

  async updateUser(id: string, updates: Partial<UserData>): Promise<ApiResponse<UserData>> {
    try {
      const users = storage.getItem("users") || []
      const index = users.findIndex((u: UserData) => u.id === id)
      if (index === -1) {
        return { success: false, error: "User not found" }
      }
      users[index] = { ...users[index], ...updates }
      storage.setItem("users", users)
      return { success: true, data: users[index] }
    } catch (error) {
      return { success: false, error: "Failed to update user" }
    }
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const categories = storage.getItem("categories") || [
        "Plomberie",
        "Électricité",
        "Chauffage",
        "Climatisation",
        "Serrurerie",
        "Vitrerie",
        "Menuiserie",
        "Peinture",
        "Carrelage",
        "Jardinage",
        "Informatique",
        "Électroménager",
      ]
      return { success: true, data: categories }
    } catch (error) {
      return { success: false, error: "Failed to fetch categories" }
    }
  }

  // Statistics API
  async getStats(): Promise<ApiResponse<any>> {
    try {
      const requests = storage.getItem("requests") || []
      const users = storage.getItem("users") || []

      const stats = {
        totalRequests: requests.length,
        pendingRequests: requests.filter((r: RequestData) => r.status === "pending").length,
        completedRequests: requests.filter((r: RequestData) => r.status === "completed").length,
        totalUsers: users.length,
        totalRepairers: users.filter((u: UserData) => u.type === "repairer").length,
        totalClients: users.filter((u: UserData) => u.type === "client").length,
      }

      return { success: true, data: stats }
    } catch (error) {
      return { success: false, error: "Failed to fetch statistics" }
    }
  }

  // Subscription API
  async checkSubscription(userId: string): Promise<ApiResponse<{ canViewContacts: boolean; reason?: string }>> {
    try {
      const users = storage.getItem("users") || []
      const user = users.find((u: UserData) => u.id === userId)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      if (user.type === "admin") {
        return { success: true, data: { canViewContacts: true } }
      }

      if (user.type !== "repairer") {
        return {
          success: true,
          data: { canViewContacts: false, reason: "Only repairers can view contact information" },
        }
      }

      const subscription = user.subscription
      if (!subscription) {
        return { success: true, data: { canViewContacts: false, reason: "No subscription found" } }
      }

      const now = new Date()
      const expiresAt = new Date(subscription.expiresAt)

      if (subscription.status === "active" && expiresAt > now) {
        return { success: true, data: { canViewContacts: true } }
      }

      if (subscription.status === "trial" && subscription.trialStarted) {
        const trialStart = new Date(subscription.trialStarted)
        const trialEnd = new Date(trialStart.getTime() + 15 * 24 * 60 * 60 * 1000) // 15 days

        if (now <= trialEnd) {
          return { success: true, data: { canViewContacts: true } }
        }
      }

      return { success: true, data: { canViewContacts: false, reason: "Subscription expired or trial period ended" } }
    } catch (error) {
      return { success: false, error: "Failed to check subscription" }
    }
  }
}

// Export the API instance
export const api = new ApiService()

// Export types
export type { ApiResponse, RequestData, UserData }
