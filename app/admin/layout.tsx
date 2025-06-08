"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { StorageService } from "@/lib/storage"

// Code d'accès temporaire - À changer après utilisation
const TEMP_ACCESS_CODE = "fixeo_temp_2024"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  return (
    <Suspense fallback={<Loading />}>
      <AdminLayoutContent children={children} setIsLoading={setIsLoading} setIsAuthorized={setIsAuthorized} />
    </Suspense>
  )
}

function AdminLayoutContent({
  children,
  setIsLoading,
  setIsAuthorized,
}: {
  children: React.ReactNode
  setIsLoading: (isLoading: boolean) => void
  setIsAuthorized: (isAuthorized: boolean) => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setLoading] = useState(true)
  const [isAuthorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Vérifier l'accès temporaire via URL
    const tempCode = searchParams.get("temp")

    if (tempCode === TEMP_ACCESS_CODE) {
      // Créer une session admin temporaire
      const tempAdminUser = {
        id: "temp_admin",
        email: "admin@temp.local",
        password: "temp",
        firstName: "Admin",
        lastName: "Temporaire",
        userType: "admin" as const,
        city: "Paris",
        postalCode: "75001",
        phone: "0000000000",
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      }
      StorageService.setCurrentUser(tempAdminUser)
      setIsAuthorized(true)
      setIsLoading(false)

      // Nettoyer l'URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    // Vérifier si l'utilisateur est admin
    const user = StorageService.getCurrentUser()

    if (!user || user.userType !== "admin") {
      router.push("/connexion")
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, searchParams, setIsLoading, setIsAuthorized])

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-4">Vous n'avez pas les permissions pour accéder à cette page.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Vérification des permissions...</p>
      </div>
    </div>
  )
}
