"use server"

import { revalidatePath } from "next/cache"

// Types pour les actions
export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  profilePicture?: string
  userType: "client" | "repairer"
  specialties?: string[]
  description?: string
  hourlyRate?: number
  availability?: boolean
  subscriptionType?: "free" | "essential" | "professional" | "premium"
  subscriptionEndDate?: string
  registrationDate: string
  isInTrial?: boolean
  trialEndDate?: string
}

export interface RepairRequest {
  id: string
  title: string
  description: string
  category: string
  urgency: "low" | "medium" | "high"
  budget: number
  location: string
  coordinates?: { lat: number; lng: number }
  clientId: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled"
  createdAt: string
  assignedTo?: string
  photos?: string[]
}

// Action pour mettre à jour le profil utilisateur
export async function updateUserProfile(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const description = formData.get("description") as string
    const hourlyRate = formData.get("hourlyRate") as string
    const specialties = formData.get("specialties") as string
    const availability = formData.get("availability") === "true"

    if (!userId || !name || !email) {
      return { success: false, error: "Données manquantes" }
    }

    // Simuler la mise à jour en localStorage (côté client)
    const updateData = {
      id: userId,
      name,
      email,
      phone: phone || undefined,
      address: address || undefined,
      description: description || undefined,
      hourlyRate: hourlyRate ? Number.parseFloat(hourlyRate) : undefined,
      specialties: specialties ? specialties.split(",").map((s) => s.trim()) : undefined,
      availability,
      updatedAt: new Date().toISOString(),
    }

    // En production, ici on ferait l'appel à la base de données
    // await updateUserInDatabase(userId, updateData)

    revalidatePath("/profil-pro")
    revalidatePath("/profil")

    return {
      success: true,
      message: "Profil mis à jour avec succès",
      data: updateData,
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    return {
      success: false,
      error: "Erreur lors de la mise à jour du profil",
    }
  }
}

// Action pour créer une demande de réparation
export async function createRepairRequest(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const urgency = formData.get("urgency") as "low" | "medium" | "high"
    const budget = formData.get("budget") as string
    const location = formData.get("location") as string
    const clientId = formData.get("clientId") as string

    if (!title || !description || !category || !urgency || !budget || !location || !clientId) {
      return { success: false, error: "Tous les champs sont requis" }
    }

    const newRequest: RepairRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      category,
      urgency,
      budget: Number.parseFloat(budget),
      location,
      coordinates: {
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
      },
      clientId,
      clientName: "Client Demo",
      clientPhone: "06 12 34 56 78",
      clientEmail: "client@example.com",
      status: "pending",
      createdAt: new Date().toISOString(),
      photos: [],
    }

    // En production, ici on sauvegarderait en base de données
    // await saveRepairRequestToDatabase(newRequest)

    revalidatePath("/mes-demandes")
    revalidatePath("/demandes-disponibles")
    revalidatePath("/carte")

    return {
      success: true,
      message: "Demande créée avec succès",
      data: newRequest,
    }
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error)
    return {
      success: false,
      error: "Erreur lors de la création de la demande",
    }
  }
}

// Action pour accepter une demande de réparation
export async function acceptRepairRequest(requestId: string, repairerId: string) {
  try {
    if (!requestId || !repairerId) {
      return { success: false, error: "ID manquant" }
    }

    // En production, ici on mettrait à jour la base de données
    // await updateRepairRequestStatus(requestId, 'accepted', repairerId)

    revalidatePath("/demandes-disponibles")
    revalidatePath("/mes-demandes")
    revalidatePath(`/demande/${requestId}`)

    return {
      success: true,
      message: "Demande acceptée avec succès",
    }
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la demande:", error)
    return {
      success: false,
      error: "Erreur lors de l'acceptation de la demande",
    }
  }
}

// Action pour mettre à jour le statut d'une demande
export async function updateRepairRequestStatus(
  requestId: string,
  status: RepairRequest["status"],
  repairerId?: string,
) {
  try {
    if (!requestId || !status) {
      return { success: false, error: "Paramètres manquants" }
    }

    // En production, ici on mettrait à jour la base de données
    // await updateRequestStatusInDatabase(requestId, status, repairerId)

    revalidatePath("/demandes-disponibles")
    revalidatePath("/mes-demandes")
    revalidatePath(`/demande/${requestId}`)

    return {
      success: true,
      message: "Statut mis à jour avec succès",
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return {
      success: false,
      error: "Erreur lors de la mise à jour du statut",
    }
  }
}

// Action pour supprimer une demande
export async function deleteRepairRequest(requestId: string) {
  try {
    if (!requestId) {
      return { success: false, error: "ID de demande manquant" }
    }

    // En production, ici on supprimerait de la base de données
    // await deleteRequestFromDatabase(requestId)

    revalidatePath("/mes-demandes")
    revalidatePath("/demandes-disponibles")
    revalidatePath("/carte")

    return {
      success: true,
      message: "Demande supprimée avec succès",
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error)
    return {
      success: false,
      error: "Erreur lors de la suppression de la demande",
    }
  }
}

// Action pour l'authentification
export async function authenticateUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userType = formData.get("userType") as "client" | "repairer"

    if (!email || !password) {
      return { success: false, error: "Email et mot de passe requis" }
    }

    // En production, ici on vérifierait les credentials en base
    // const user = await authenticateUserInDatabase(email, password)

    // Simulation d'authentification réussie
    const user: UserProfile = {
      id: `user_${Date.now()}`,
      name: "Utilisateur Demo",
      email,
      userType,
      registrationDate: new Date().toISOString(),
      subscriptionType: userType === "repairer" ? "free" : undefined,
      isInTrial: userType === "repairer",
      trialEndDate: userType === "repairer" ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    }

    revalidatePath("/")

    return {
      success: true,
      message: "Connexion réussie",
      data: user,
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error)
    return {
      success: false,
      error: "Erreur lors de la connexion",
    }
  }
}

// Action pour l'inscription
export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const userType = formData.get("userType") as "client" | "repairer"
    const phone = formData.get("phone") as string

    if (!name || !email || !password || !userType) {
      return { success: false, error: "Tous les champs sont requis" }
    }

    // En production, ici on créerait l'utilisateur en base
    // const user = await createUserInDatabase({ name, email, password, userType, phone })

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      phone: phone || undefined,
      userType,
      registrationDate: new Date().toISOString(),
      subscriptionType: userType === "repairer" ? "free" : undefined,
      isInTrial: userType === "repairer",
      trialEndDate: userType === "repairer" ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      availability: userType === "repairer" ? true : undefined,
    }

    revalidatePath("/")

    return {
      success: true,
      message: "Inscription réussie",
      data: newUser,
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return {
      success: false,
      error: "Erreur lors de l'inscription",
    }
  }
}
