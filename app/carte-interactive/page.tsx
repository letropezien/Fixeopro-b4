"use client"

import { useState, useEffect } from "react"
import InteractiveMap from "@/components/interactive-map"
import { StorageService } from "@/lib/storage"

export default function CarteInteractivePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = StorageService.getCurrentUser()
    setCurrentUser(user)
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Carte interactive des demandes</h1>
      <p className="text-gray-600 mb-8">
        Explorez la carte interactive des demandes de dépannage. Utilisez les contrôles de zoom et de déplacement pour
        naviguer.
      </p>

      <InteractiveMap currentUser={currentUser} standalone={true} height="700px" />
    </div>
  )
}
