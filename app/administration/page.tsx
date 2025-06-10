"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdministrationPage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page admin principale
    router.push("/admin")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers l'administration...</p>
      </div>
    </div>
  )
}
