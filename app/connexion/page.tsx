"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, User, Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false)
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
    userType: "client",
    acceptTerms: false,
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      alert("Veuillez remplir tous les champs")
      return
    }

    // Simulation de connexion
    console.log("Connexion:", loginData)
    alert("Connexion réussie !")

    // Redirection selon le type d'utilisateur
    if (loginData.email.includes("reparateur")) {
      window.location.href = "/profil-pro"
    } else {
      window.location.href = "/profil"
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas")
      return
    }

    if (!registerData.acceptTerms) {
      alert("Veuillez accepter les conditions d'utilisation")
      return
    }

    // Simulation d'inscription
    console.log("Inscription:", registerData)
    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.")

    // Redirection vers la connexion
    // Ou connexion automatique
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FixeoPro</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

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

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>Rejoignez FixeoPro en quelques minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Jean"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Dupont"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="registerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="registerPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Type de compte</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          registerData.userType === "client" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => setRegisterData({ ...registerData, userType: "client" })}
                      >
                        <div className="text-center">
                          <User className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <p className="font-medium">Client</p>
                          <p className="text-xs text-gray-600">Je cherche un réparateur</p>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                          registerData.userType === "reparateur" ? "border-green-500 bg-green-50" : "border-gray-200"
                        }`}
                        onClick={() => setRegisterData({ ...registerData, userType: "reparateur" })}
                      >
                        <div className="text-center">
                          <Wrench className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="font-medium">Réparateur</p>
                          <p className="text-xs text-gray-600">Je propose mes services</p>
                        </div>
                      </div>
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

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Créer mon compte
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Vous êtes un professionnel ?{" "}
            <Link href="/devenir-reparateur" className="text-blue-600 hover:underline font-medium">
              Rejoignez notre réseau de réparateurs
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
