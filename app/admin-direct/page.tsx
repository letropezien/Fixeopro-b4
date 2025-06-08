"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Créer un admin temporaire directement
    const tempAdmin = {
      id: "temp_admin_" + Date.now(),
      email: "admin@temp.local",
      password: "temp123",
      firstName: "Admin",
      lastName: "Temporaire",
      userType: "admin" as const,
      city: "Paris",
      postalCode: "75001",
      phone: "0000000000",
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    }

    try {
      // Récupérer les utilisateurs existants
      const existingUsers = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")

      // Supprimer les anciens admins temporaires
      const cleanUsers = existingUsers.filter(
        (user: any) => user.userType !== "admin" || !user.email.includes("temp.local"),
      )

      // Ajouter le nouvel admin temporaire
      cleanUsers.push(tempAdmin)

      // Sauvegarder
      localStorage.setItem("fixeopro_users", JSON.stringify(cleanUsers))

      // Connecter l'admin
      localStorage.setItem("fixeopro_current_user_id", tempAdmin.id)

      console.log("Admin temporaire créé:", tempAdmin.email)

      // Rediriger vers l'admin
      router.push("/admin")
    } catch (error) {
      console.error("Erreur lors de la création de l'admin temporaire:", error)
      alert("Erreur lors de la création de l'accès temporaire")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Création de l'accès administrateur temporaire...</p>
        <p className="text-sm text-gray-500 mt-2">Redirection en cours...</p>
      </div>
    </div>
  )
}
