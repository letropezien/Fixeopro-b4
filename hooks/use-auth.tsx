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

  return {
    data: session,
    status,
    login,
    logout,
  }
}
