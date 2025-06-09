"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ListeDemandesRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page principale des listes de demandes
    router.replace("/listes-demandes")
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      </div>
    </div>
  )
}
