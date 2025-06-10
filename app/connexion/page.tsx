"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, UserPlus, RefreshCw } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function Connexion() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // États pour la connexion
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // États pour l'inscription
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerPhone, setRegisterPhone] = useState("")

  // État pour la réinitialisation
  const [resetEmail, setResetEmail] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Cas spécial pour vipsttropez@gmail.com
      if (loginEmail === "vipsttropez@gmail.com") {
        // Mettre à jour le mot de passe si nécessaire
        const user = StorageService.getUserByEmail("vipsttropez@gmail.com")
        if (user) {
          // Mettre à jour le mot de passe
          user.password = "Salimes057"
          StorageService.saveUser(user)
          console.log("Mot de passe mis à jour pour vipsttropez@gmail.com")
        }
      }

      // Utiliser le StorageService pour l'authentification
      const user = StorageService.authenticateUser(loginEmail, loginPassword)

      if (user) {
        setSuccess("Connexion réussie ! Redirection en cours...")

        // Déclencher l'événement de changement de connexion
        window.dispatchEvent(new CustomEvent("fixeopro-login-change"))

        setTimeout(() => {
          if (user.userType === "admin") {
            router.push("/admin")
          } else {
            router.push("/")
          }
        }, 1000)
      } else {
        setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.")
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setError("Erreur lors de la connexion. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation simple
      if (!registerName || !registerEmail || !registerPassword) {
        setError("Veuillez remplir tous les champs obligatoires")
        return
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = StorageService.getUserByEmail(registerEmail)
      if (existingUser) {
        setError("Un compte avec cet email existe déjà. Essayez de vous connecter ou réinitialiser votre mot de passe.")
        return
      }

      // Créer le nouvel utilisateur avec la structure complète
      const [firstName, ...lastNameParts] = registerName.split(" ")
      const lastName = lastNameParts.join(" ") || ""

      const newUser = {
        id: "", // Sera généré automatiquement par StorageService
        email: registerEmail,
        password: registerPassword,
        firstName: firstName,
        lastName: lastName,
        phone: registerPhone || "",
        address: "",
        city: "",
        postalCode: "",
        userType: "client" as const,
        isEmailVerified: false,
        createdAt: "", // Sera généré automatiquement par StorageService
      }

      // Sauvegarder l'utilisateur avec StorageService
      const savedUser = StorageService.saveUser(newUser)

      if (savedUser) {
        setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.")

        // Réinitialiser le formulaire
        setRegisterName("")
        setRegisterEmail("")
        setRegisterPassword("")
        setRegisterPhone("")
      } else {
        setError("Erreur lors de la création du compte")
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      setError("Erreur lors de l'inscription. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!resetEmail) {
        setError("Veuillez saisir votre email")
        return
      }

      // Vérifier si l'utilisateur existe
      const user = StorageService.getUserByEmail(resetEmail)
      if (!user) {
        setError("Aucun compte trouvé avec cet email")
        return
      }

      // Cas spécial pour vipsttropez@gmail.com
      if (resetEmail === "vipsttropez@gmail.com") {
        user.password = "Salimes057"
        StorageService.saveUser(user)
        setSuccess("Mot de passe réinitialisé avec succès pour vipsttropez@gmail.com (Salimes057)")
      } else {
        // Réinitialiser le mot de passe à une valeur temporaire
        const tempPassword = "FixeoPro" + Math.floor(1000 + Math.random() * 9000)
        user.password = tempPassword
        StorageService.saveUser(user)
        setSuccess(`Mot de passe temporaire : ${tempPassword}`)
      }

      setShowResetForm(false)
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error)
      setError("Erreur lors de la réinitialisation. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour réinitialiser les données de démo
  const resetDemoData = () => {
    try {
      // Supprimer toutes les données
      localStorage.removeItem("fixeopro_users")
      localStorage.removeItem("fixeopro_current_user_id")
      localStorage.removeItem("fixeopro_repair_requests")
      localStorage.removeItem("fixeopro_password_reset_tokens")

      // Réinitialiser les données de démo
      StorageService.initDemoData()

      setSuccess("Données de démonstration réinitialisées avec succès. Les comptes par défaut sont disponibles.")
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error)
      setError("Erreur lors de la réinitialisation des données.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">FixeoPro</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous à votre compte ou créez-en un nouveau
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Connexion
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Inscription
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="space-y-4">
              {showResetForm ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Réinitialiser
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowResetForm(false)}>
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <form id="login-form" onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Se connecter
                  </Button>
                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setShowResetForm(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </form>
              )}
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nom complet *</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Mot de passe *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Téléphone</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer un compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-xs"
              onClick={resetDemoData}
            >
              <RefreshCw className="h-3 w-3" />
              Réinitialiser les données de démo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
