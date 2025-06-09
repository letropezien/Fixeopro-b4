"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, User, Mail, Lock, Eye, EyeOff, AlertCircle, Building } from "lucide-react"

export default function ConnexionPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client" as "client" | "reparateur",
    acceptTerms: false,
    phone: "",
    city: "",
    postalCode: "",
    companyName: "",
    siret: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulation d'authentification
      if (loginData.email && loginData.password) {
        // Créer un utilisateur de démonstration
        const demoUser = {
          id: `user_${Date.now()}`,
          email: loginData.email,
          firstName: loginData.email.includes("reparateur") ? "Jean" : "Marie",
          lastName: loginData.email.includes("reparateur") ? "Dupont" : "Martin",
          userType: loginData.email.includes("reparateur") ? "reparateur" : "client",
          phone: "06 12 34 56 78",
          city: "Paris",
          postalCode: "75001",
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        }

        // Sauvegarder l'utilisateur
        const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
        users.push(demoUser)
        localStorage.setItem("fixeopro_users", JSON.stringify(users))
        localStorage.setItem("fixeopro_current_user_id", demoUser.id)

        // Redirection selon le type
        if (demoUser.userType === "reparateur") {
          router.push("/profil-pro")
        } else {
          router.push("/profil")
        }
      } else {
        setError("Veuillez remplir tous les champs")
      }
    } catch (error) {
      setError("Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validation
      if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
        setError("Veuillez remplir tous les champs obligatoires")
        return
      }

      if (registerData.password !== registerData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas")
        return
      }

      if (!registerData.acceptTerms) {
        setError("Veuillez accepter les conditions d'utilisation")
        return
      }

      // Créer le nouvel utilisateur
      const newUser = {
        id: `user_${Date.now()}`,
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone,
        city: registerData.city,
        postalCode: registerData.postalCode,
        userType: registerData.userType,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        professional:
          registerData.userType === "reparateur"
            ? {
                companyName: registerData.companyName,
                siret: registerData.siret,
                specialties: [],
                description: "",
              }
            : undefined,
      }

      // Sauvegarder
      const users = JSON.parse(localStorage.getItem("fixeopro_users") || "[]")
      users.push(newUser)
      localStorage.setItem("fixeopro_users", JSON.stringify(users))
      localStorage.setItem("fixeopro_current_user_id", newUser.id)

      // Redirection
      if (registerData.userType === "reparateur") {
        router.push("/profil-pro")
      } else {
        router.push("/profil")
      }
    } catch (error) {
      setError("Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fixeo.pro</h1>
          <p className="text-gray-600">Connectez-vous à votre espace personnel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Se connecter</CardTitle>
                <CardDescription>Accédez à votre espace personnel</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Se souvenir de moi
                      </Label>
                    </div>
                    <Link href="/mot-de-passe-oublie" className="text-sm text-blue-600 hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Comptes de démonstration :</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      <strong>Client :</strong> client@demo.com
                    </p>
                    <p>
                      <strong>Réparateur :</strong> reparateur@demo.com
                    </p>
                    <p className="text-xs text-blue-600">Mot de passe : n'importe lequel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>Rejoignez Fixeo.pro en quelques minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Type de compte */}
                  <div>
                    <Label>Type de compte *</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          registerData.userType === "client" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setRegisterData({ ...registerData, userType: "client" })}
                      >
                        <div className="text-center">
                          <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">Particulier</p>
                          <p className="text-xs text-gray-600">Je cherche un réparateur</p>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          registerData.userType === "reparateur" ? "border-green-500 bg-green-50" : "border-gray-200"
                        }`}
                        onClick={() => setRegisterData({ ...registerData, userType: "reparateur" })}
                      >
                        <div className="text-center">
                          <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="font-medium">Professionnel</p>
                          <p className="text-xs text-gray-600">Je propose mes services</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        placeholder="Jean"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        placeholder="Dupont"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="registerEmail">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        placeholder="06 12 34 56 78"
                        value={registerData.phone}
                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        placeholder="Paris"
                        value={registerData.city}
                        onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Champs spécifiques aux réparateurs */}
                  {registerData.userType === "reparateur" && (
                    <>
                      <div>
                        <Label htmlFor="companyName">Nom de l'entreprise</Label>
                        <Input
                          id="companyName"
                          placeholder="Mon Entreprise SARL"
                          value={registerData.companyName}
                          onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="siret">SIRET (optionnel)</Label>
                        <Input
                          id="siret"
                          placeholder="12345678901234"
                          value={registerData.siret}
                          onChange={(e) => setRegisterData({ ...registerData, siret: e.target.value })}
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="registerPassword">Mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={registerData.acceptTerms}
                      onCheckedChange={(checked) =>
                        setRegisterData({ ...registerData, acceptTerms: checked as boolean })
                      }
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      J'accepte les{" "}
                      <Link href="/conditions" className="text-blue-600 hover:underline">
                        conditions d'utilisation
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? "Création..." : "Créer mon compte"}
                  </Button>
                </form>

                {registerData.userType === "reparateur" && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">🎉 Avantages réparateur :</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• 15 jours d'essai gratuit</li>
                      <li>• Accès à toutes les demandes</li>
                      <li>• Gestion simplifiée des interventions</li>
                      <li>• Support dédié</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {registerData.userType === "client" ? (
              <>
                Vous êtes un professionnel ?{" "}
                <button
                  onClick={() => setRegisterData({ ...registerData, userType: "reparateur" })}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Créer un compte réparateur
                </button>
              </>
            ) : (
              <>
                Vous êtes un particulier ?{" "}
                <button
                  onClick={() => setRegisterData({ ...registerData, userType: "client" })}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Créer un compte client
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
