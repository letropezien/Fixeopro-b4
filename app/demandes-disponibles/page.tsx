"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Lock, User } from "lucide-react"

import { api } from "@/lib/api"
import { RequestCard } from "@/components/request-card"
import { Skeleton } from "@/components/ui/skeleton"

const canViewPersonalData = () => {
  if (!currentUser) return false

  // Les admins peuvent toujours voir
  if (currentUser.userType === "admin") return true

  // Seuls les réparateurs peuvent voir les données personnelles
  if (currentUser.userType !== "reparateur") return false

  // Vérifier si le réparateur a un abonnement actif
  if (currentUser.subscription?.status === "active") return true

  // Vérifier si le réparateur est en période d'essai
  if (currentUser.subscription?.status === "trial") {
    const expiresAt = new Date(currentUser.subscription.endDate)
    return expiresAt > new Date()
  }

  return false
}

const maskPersonalData = (text: string) => {
  if (canViewPersonalData()) return text
  return "***"
}

interface Request {
  id: string
  title: string
  description: string
  status: string
  createdAt: string
  client: {
    firstName: string
    lastName: string
  }
}

interface UserType {
  userType: string
  subscription?: {
    status: string
    endDate: string
  }
}

let currentUser: UserType | null = null

export default function DemandesDisponibles() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "unauthenticated") {
      router.push("/auth/login")
    }

    const fetchRequests = async () => {
      try {
        const response = await api.get("/requests")
        setRequests(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching requests:", error)
        toast.error("Failed to fetch requests.")
        setLoading(false)
      }
    }

    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me")
        currentUser = response.data
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to fetch user.")
      }
    }

    fetchRequests()
    fetchUser()
  }, [status, router])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Demandes Disponibles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-md p-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Demandes Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request}>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <User className="h-4 w-4 mr-1" />
              <span className="font-medium">Client: </span>
              {canViewPersonalData() ? (
                <span className="ml-1">
                  {request.client?.firstName || "Client"} {request.client?.lastName || ""}
                </span>
              ) : (
                <span className="flex items-center ml-1">
                  <Lock className="h-3 w-3 mr-1" />
                  <span className="text-gray-400">Informations masquées</span>
                </span>
              )}
            </div>
          </RequestCard>
        ))}
      </div>
    </div>
  )
}
