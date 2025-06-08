"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    try {
      // Vérifier l'utilisateur actuel
      const currentUserId = localStorage.getItem("fixeopro_current_user_id")

      if (!currentUserId) {
        console.log("Aucun utilisateur connecté")
        router.push("/connexion")
        return
      }

      // Récupérer les données utilisateur
      const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      const currentUser = users.find((user: any) => user.id === currentUserId)

      if (!currentUser) {
        console.log("Utilisateur non trouvé")
        router.push("/connexion")
        return
      }

      if (currentUser.userType !== "admin") {
        console.log("Utilisateur non admin:", currentUser.userType)
        router.push("/connexion")
        return
      }

      console.log("Accès admin autorisé pour:", currentUser.email)
      setIsAuthorized(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors de la vérification admin:", error)
      router.push("/connexion")
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-6">Vous devez être administrateur pour accéder à cette page.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/setup-admin")}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Configurer un compte admin
            </button>
            <button
              onClick={() => router.push("/connexion")}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Se connecter
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
