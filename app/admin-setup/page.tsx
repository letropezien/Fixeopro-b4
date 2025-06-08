"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function AdminSetupPage() {
  const [setupData, setSetupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [adminExists, setAdminExists] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Vérifier si un admin existe déjà
    const users = StorageService.getUsers()
    const adminUser = users.find((user) => user.userType === "admin")

    if (adminUser) {
      setAdminExists(true)
    }
  }, [])

  const handleSetup = async () => {
    setError("")

    if (!setupData.email || !setupData.password || !setupData.confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }

    if (setupData.password !== setupData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (setupData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    // Vérifier si l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(setupData.email)) {
      setError("Veuillez saisir une adresse email valide")
      return
    }

    setIsLoading(true)

    try {
      // Supprimer tous les anciens comptes admin
      const users = StorageService.getUsers()
      const nonAdminUsers = users.filter((user) => user.userType !== "admin")

      // Créer le nouveau compte administrateur
      const adminUser = {
        id: "admin_configured",
        email: setupData.email,
        password: setupData.password,
        firstName: "Administrateur",
        lastName: "Système",
        userType: "admin" as const,
        city: "Paris",
        postalCode: "75001",
        phone: "0000000000",
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      }

      // Sauvegarder les utilisateurs avec le nouveau admin
      nonAdminUsers.push(adminUser)
      localStorage.setItem("fixeopro_users", JSON.stringify(nonAdminUsers))

      // Connecter automatiquement l'admin
      StorageService.setCurrentUser(adminUser)

      alert("Compte administrateur créé avec succès ! Redirection vers le panneau d'administration...")

      // Rediriger vers l'admin
      router.push("/admin")

      // Recharger la page pour mettre à jour le header
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      setError("Erreur lors de la création du compte administrateur")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReconfigure = () => {
    if (confirm("Êtes-vous sûr de vouloir reconfigurer le compte administrateur ? L'ancien compte sera supprimé.")) {
      setAdminExists(false)
      setSetupData({ email: "", password: "", confirmPassword: "" })
      setError("")
    }
  }

  const handleLoginRedirect = () => {
    router.push("/connexion")
  }

  if (adminExists) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Compte Admin Configuré</CardTitle>
            <p className="text-gray-600 mt-2">Un compte administrateur existe déjà sur cette plateforme</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Configuration terminée</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Le compte administrateur a déjà été configuré. Utilisez la page de connexion pour accéder à
                    l'administration.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleLoginRedirect} className="w-full bg-blue-600 hover:bg-blue-700">
                <Shield className="h-4 w-4 mr-2" />
                Aller à la page de connexion
              </Button>

              <Button
                onClick={handleReconfigure}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Reconfigurer le compte admin
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Si vous avez oublié vos identifiants, utilisez l'option "Reconfigurer" ci-dessus.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Configuration Administrateur</CardTitle>
          <p className="text-gray-600 mt-2">Créez votre compte administrateur pour sécuriser l'accès à la plateforme</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Erreur</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <Lock className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Configuration unique</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Cette page ne sera accessible qu'une seule fois. Choisissez des identifiants sécurisés.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Adresse email administrateur
              </Label>
              <Input
                id="email"
                type="email"
                value={setupData.email}
                onChange={(e) => setSetupData({ ...setupData, email: e.target.value })}
                placeholder="admin@votre-domaine.com"
                className="mt-1"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Mot de passe (minimum 8 caractères)
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={setupData.password}
                  onChange={(e) => setSetupData({ ...setupData, password: e.target.value })}
                  placeholder="Mot de passe sécurisé"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={setupData.confirmPassword}
                  onChange={(e) => setSetupData({ ...setupData, confirmPassword: e.target.value })}
                  placeholder="Confirmer le mot de passe"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleSetup} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Configuration en cours...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Créer le compte administrateur
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Une fois configuré, vous pourrez accéder au panneau d'administration avec ces identifiants.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
