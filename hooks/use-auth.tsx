"use client"

import { useSession as useNextAuthSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

// Hook personnalisé qui combine next-auth et localStorage
export function useSession() {
  const nextAuthSession = useNextAuthSession()
  const [localSession, setLocalSession] = useState<any>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Si next-auth a une session, on l'utilise
    if (nextAuthSession.status !== "loading") {
      if (nextAuthSession.status === "authenticated") {
        setStatus("authenticated")
        return
      }

      // Sinon on vérifie localStorage
      try {
        const currentUser = localStorage.getItem("currentUser")
        if (currentUser) {
          const user = JSON.parse(currentUser)
          setLocalSession({ user })
          setStatus("authenticated")
        } else {
          setLocalSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error)
        setLocalSession(null)
        setStatus("unauthenticated")
      }
    }
  }, [nextAuthSession.status])

  // On combine les deux sources de session
  const session = nextAuthSession.data || localSession

  // Fonction de connexion personnalisée
  const login = async (email: string, password: string) => {
    // Essayer next-auth d'abord
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    // Si échec ou non disponible, utiliser localStorage
    if (!result || !result.ok) {
      try {
        // Simulation d'authentification
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u: any) => u.email === email)

        if (user) {
          localStorage.setItem("currentUser", JSON.stringify(user))
          setLocalSession({ user })
          setStatus("authenticated")
          return { success: true }
        }

        return { success: false, error: "Identifiants incorrects" }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error)
        return { success: false, error: "Erreur lors de la connexion" }
      }
    }

    return { success: true }
  }

  // Fonction de déconnexion personnalisée
  const logout = async () => {
    // Déconnexion next-auth
    await signOut({ redirect: false })

    // Déconnexion localStorage
    localStorage.removeItem("currentUser")
    setLocalSession(null)
    setStatus("unauthenticated")
  }

  // Fonction pour vérifier si l'utilisateur peut contacter (réparateur avec abonnement ou période d'essai)
  const canContact = () => {
    if (!session?.user) return false

    const user = session.user
    if (user.type !== "repairer") return false

    // Vérifier la période d'essai de 15 jours
    if (user.createdAt) {
      const createdDate = new Date(user.createdAt)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 15) return true // Période d'essai
    }

    // Vérifier l'abonnement actif
    return user.subscription?.status === "active"
  }

  // Fonction pour obtenir les jours restants de la période d'essai
  const getTrialDaysLeft = () => {
    if (!session?.user?.createdAt) return 0

    const createdDate = new Date(session.user.createdAt)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))

    return Math.max(0, 15 - daysDiff)
  }

  return {
    data: session,
    status,
    login,
    logout,
    canContact,
    getTrialDaysLeft,
  }
}

// Export useAuth comme alias de useSession pour la compatibilité
export const useAuth = useSession

// Export par défaut
export default useSession
