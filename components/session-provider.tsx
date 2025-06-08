"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  type: "client" | "repairer"
  profilePicture?: string
  subscriptionType?: "free" | "essential" | "professional" | "premium"
  subscriptionEndDate?: string
  registrationDate: string
}

interface Session {
  user: User | null
}

interface SessionContextType {
  data: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
  update: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    // Simuler le chargement de la session depuis localStorage
    const loadSession = () => {
      try {
        const currentUser = localStorage.getItem("currentUser")
        if (currentUser) {
          const user = JSON.parse(currentUser)
          setSession({ user })
          setStatus("authenticated")
        } else {
          setSession(null)
          setStatus("unauthenticated")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error)
        setSession(null)
        setStatus("unauthenticated")
      }
    }

    loadSession()

    // Écouter les changements de localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        loadSession()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const update = async () => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setSession({ user })
      setStatus("authenticated")
    } else {
      setSession(null)
      setStatus("unauthenticated")
    }
  }

  return <SessionContext.Provider value={{ data: session, status, update }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
