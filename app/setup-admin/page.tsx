"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, AlertCircle, CheckCircle } from "lucide-react"

export default function SetupAdminPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      // Validation
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Veuillez remplir tous les champs")
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas")
      }

      if (formData.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères")
      }

      // Créer le compte admin
      const adminUser = {
        id: "admin_" + Date.now(),
        email: formData.email,
        password: formData.password,
        firstName: "Admin",
        lastName: "Système",
        userType: "admin" as const,
        city: "Paris",
        postalCode: "75001",
        phone: "0000000000",
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      }

      // Récupérer les utilisateurs existants
      const existingUsers = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")

      // Supprimer les anciens admins
      const nonAdminUsers = existingUsers.filter((user: any) => user.userType !== "admin")

      // Ajouter le nouveau admin
      nonAdminUsers.push(adminUser)

      // Sauvegarder
      localStorage.setItem("fixeopro_users", JSON.stringify(nonAdminUsers))

      // Connecter l'admin
      localStorage.setItem("fixeopro_current_user_id", adminUser.id)

      setMessage("Compte administrateur créé avec succès !")
      setMessageType("success")

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error: any) {
      setMessage(error.message)
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Configuration Admin</CardTitle>
          <p className="text-gray-600">Créez votre compte administrateur</p>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-start ${
                messageType === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              )}
              <p className={`text-sm ${messageType === "success" ? "text-green-800" : "text-red-800"}`}>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email administrateur</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@exemple.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 6 caractères"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirmer le mot de passe"
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Créer le compte admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Une fois créé, vous pourrez accéder au panneau d'administration.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
