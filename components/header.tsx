"use client"

import Link from "next/link"
import { StorageService } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<"client" | "reparateur" | null>(null)
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const router = useRouter()

  useEffect(() => {
    // Vérifier l'état de connexion à chaque rendu
    const user = StorageService.getCurrentUser()
    setCurrentUser(user)
    setIsLoggedIn(!!user)
    if (user) {
      setUserType(user.userType)
    } else {
      setUserType(null)
    }
  }, [])

  const getNotificationCount = () => {
    if (!currentUser) return 0

    if (currentUser.userType === "reparateur") {
      // Compter les nouvelles demandes dans les spécialités du réparateur
      const requests = StorageService.getRepairRequests()
      const specialties = currentUser.professional?.specialties || []

      return requests.filter(
        (request) =>
          request.status === "open" &&
          specialties.some((specialty) => request.category.toLowerCase().includes(specialty.toLowerCase())),
      ).length
    } else {
      // Compter les nouvelles réponses aux demandes du client
      const clientRequests = StorageService.getRepairRequestsByClient(currentUser.id)
      return clientRequests.reduce((total, request) => {
        return total + (request.responses?.length || 0)
      }, 0)
    }
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          My App
        </Link>
        <nav className="flex items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors mr-4">
            Accueil
          </Link>
          <Link href="/a-propos" className="text-gray-600 hover:text-blue-600 transition-colors mr-4">
            À Propos
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors mr-4">
            Contact
          </Link>
          <Link href="/carte-interactive" className="text-gray-600 hover:text-blue-600 transition-colors mr-4">
            Carte Interactive
          </Link>
          <Link
            href="/listes-demandes"
            className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center h-10 mr-4"
          >
            Listes des Demandes
          </Link>
          {isLoggedIn && (
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => {
                if (userType === "reparateur") {
                  window.location.href = "/notifications"
                } else {
                  window.location.href = "/mes-demandes"
                }
              }}
            >
              <Bell className="h-4 w-4" />
              {getNotificationCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getNotificationCount()}
                </span>
              )}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
