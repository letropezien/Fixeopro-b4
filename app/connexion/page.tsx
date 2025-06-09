"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StorageService } from "@/lib/storage"
import { GeocodingService } from "@/lib/geocoding"
import { DepartmentSelector } from "@/components/department-selector"
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Wrench,
  UserCheck,
} from "lucide-react"

export default function ConnexionPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("connexion")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // États pour la géolocalisation
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [isGeolocated, setIsGeolocated] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Formulaire de connexion
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Formulaire d'inscription client
  const [clientForm, setClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    department: "",
    coordinates: null as { lat: number; lng: number } | null,
    acceptTerms: false,
  })

  // Formulaire d'inscription réparateur
  const [repairerForm, setRepairerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    department: "",
    coordinates: null as { lat: number; lng: number } | null,
    companyName: "",
    siret: "",
    specialties: [] as string[],
    acceptTerms: false,
  })

  const specialties = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
    "Téléphonie",
    "Climatisation",
  ]

  // Géolocalisation
  const handleGeolocation = async (userType: "client" | "repairer") => {
    setIsGeolocating(true)
    setGeoError(null)

    try {
      const coordinates = await GeocodingService.getCurrentPosition()
      if (!coordinates) {
        throw new Error("Impossible d'obtenir votre position")
      }

      const address = await GeocodingService.geolocateAndGetAddress()

      if (userType === "client") {
        setClientForm((prev) => ({
          ...prev,
          address: address.street || prev.address,
          city: address.city || prev.city,
          postalCode: address.postalCode || prev.postalCode,
          department: address.department || prev.department,
          coordinates: coordinates,
        }))
      } else {
        setRepairerForm((prev) => ({
          ...prev,
          address: address.street || prev.address,
          city: address.city || prev.city,
          postalCode: address.postalCode || prev.postalCode,
          department: address.department || prev.department,
          coordinates: coordinates,
        }))
      }

      setIsGeolocated(true)
    } catch (error) {
      console.error("Erreur de géolocalisation:", error)
      setGeoError(error instanceof Error ? error.message : "Erreur de géolocalisation")
    } finally {
      setIsGeolocating(false)
    }
  }

  // Connexion
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = StorageService.authenticateUser(loginForm.email, loginForm.password)

      if (user) {
        setSuccess("Connexion réussie !")
        setTimeout(() => {
          if (user.userType === "admin") {
            router.push("/admin")
          } else if (user.userType === "reparateur") {
            router.push("/profil-pro")
          } else {
            router.push("/profil")
          }
        }, 1000)
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (error) {
      setError("Erreur lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  // Inscription client
  const handleClientRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validations
      if (!clientForm.firstName.trim()) {
        throw new Error("Le prénom est requis")
      }
      if (!clientForm.lastName.trim()) {
        throw new Error("Le nom est requis")
      }
      if (!clientForm.email.trim()) {
        throw new Error("L'email est requis")
      }
      if (clientForm.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères")
      }
      if (clientForm.password !== clientForm.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas")
      }
      if (!clientForm.phone.trim()) {
        throw new Error("Le téléphone est requis")
      }
      if (!clientForm.city.trim()) {
        throw new Error("La ville est requise")
      }
      if (!clientForm.postalCode.trim()) {
        throw new Error("Le code postal est requis")
      }
      if (!clientForm.coordinates) {
        throw new Error("La géolocalisation est requise")
      }
      if (!clientForm.acceptTerms) {
        throw new Error("Vous devez accepter les conditions d'utilisation")
      }

      // Vérifier si l'email existe déjà
      if (StorageService.getUserByEmail(clientForm.email)) {
        throw new Error("Un compte avec cet email existe déjà")
      }

      const newUser = {
        id: StorageService.generateId(),
        email: clientForm.email,
        password: clientForm.password,
        firstName: clientForm.firstName,
        lastName: clientForm.lastName,
        phone: clientForm.phone,
        address: clientForm.address,
        city: clientForm.city,
        postalCode: clientForm.postalCode,
        department: clientForm.department,
        userType: "client" as const,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        coordinates: clientForm.coordinates,
      }

      StorageService.saveUser(newUser)
      StorageService.setCurrentUser(newUser.id)

      setSuccess("Inscription réussie ! Redirection en cours...")
      setTimeout(() => {
        router.push("/profil")
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  // Inscription réparateur
  const handleRepairerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validations
      if (!repairerForm.firstName.trim()) {
        throw new Error("Le prénom est requis")
      }
      if (!repairerForm.lastName.trim()) {
        throw new Error("Le nom est requis")
      }
      if (!repairerForm.email.trim()) {
        throw new Error("L'email est requis")
      }
      if (repairerForm.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères")
      }
      if (repairerForm.password !== repairerForm.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas")
      }
      if (!repairerForm.phone.trim()) {
        throw new Error("Le téléphone est requis")
      }
      if (!repairerForm.city.trim()) {
        throw new Error("La ville est requise")
      }
      if (!repairerForm.postalCode.trim()) {
        throw new Error("Le code postal est requis")
      }
      if (!repairerForm.coordinates) {
        throw new Error("La géolocalisation est requise")
      }
      if (repairerForm.specialties.length === 0) {
        throw new Error("Veuillez sélectionner au moins une spécialité")
      }
      if (!repairerForm.acceptTerms) {
        throw new Error("Vous devez accepter les conditions d'utilisation")
      }

      // Vérifier si l'email existe déjà
      if (StorageService.getUserByEmail(repairerForm.email)) {
        throw new Error("Un compte avec cet email existe déjà")
      }

      const newUser = {
        id: StorageService.generateId(),
        email: repairerForm.email,
        password: repairerForm.password,
        firstName: repairerForm.firstName,
        lastName: repairerForm.lastName,
        phone: repairerForm.phone,
        address: repairerForm.address,
        city: repairerForm.city,
        postalCode: repairerForm.postalCode,
        department: repairerForm.department,
        userType: "reparateur" as const,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        coordinates: repairerForm.coordinates,
        professional: {
          companyName: repairerForm.companyName,
          siret: repairerForm.siret,
          experience: "Débutant",
          specialties: repairerForm.specialties,
          description: `Réparateur professionnel spécialisé en ${repairerForm.specialties.join(", ")}`,
        },
        subscription: {
          plan: "trial",
          status: "trial",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
      }

      StorageService.saveUser(newUser)
      StorageService.setCurrentUser(newUser.id)

      setSuccess("Inscription réussie ! Période d'essai de 15 jours activée. Redirection en cours...")
      setTimeout(() => {
        router.push("/profil-pro")
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setRepairerForm((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }))
    } else {
      setRepairerForm((prev) => ({
        ...prev,
        specialties: prev.specialties.filter((s) => s !== specialty),
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connexion / Inscription</h1>
          <p className="text-gray-600">Accédez à votre compte ou créez-en un nouveau</p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connexion" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="reparateur" className="flex items-center">
                  <Wrench className="h-4 w-4 mr-2" />
                  Réparateur
                </TabsTrigger>
              </TabsList>

              {/* Messages d'erreur et de succès */}
              {error && (
                <Alert className="m-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="m-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {/* Connexion */}
              <TabsContent value="connexion" className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Se connecter</CardTitle>
                </CardHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Se connecter
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Comptes de démonstration :</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Client :</strong> client@demo.com / demo123
                    </p>
                    <p>
                      <strong>Réparateur :</strong> reparateur@demo.com / demo123
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Inscription Client */}
              <TabsContent value="client" className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Inscription Client</CardTitle>
                  <p className="text-sm text-gray-600">Créez votre compte pour publier des demandes de dépannage</p>
                </CardHeader>

                <form onSubmit={handleClientRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-firstName">Prénom *</Label>
                      <Input
                        id="client-firstName"
                        value={clientForm.firstName}
                        onChange={(e) => setClientForm({ ...clientForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-lastName">Nom *</Label>
                      <Input
                        id="client-lastName"
                        value={clientForm.lastName}
                        onChange={(e) => setClientForm({ ...clientForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="client-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="client-email"
                        type="email"
                        value={clientForm.email}
                        onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-password">Mot de passe *</Label>
                      <Input
                        id="client-password"
                        type="password"
                        value={clientForm.password}
                        onChange={(e) => setClientForm({ ...clientForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-confirmPassword">Confirmer *</Label>
                      <Input
                        id="client-confirmPassword"
                        type="password"
                        value={clientForm.confirmPassword}
                        onChange={(e) => setClientForm({ ...clientForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="client-phone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="client-phone"
                        type="tel"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                        className="pl-10"
                        placeholder="06 12 34 56 78"
                        required
                      />
                    </div>
                  </div>

                  {/* Géolocalisation */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">📍 Géolocalisation requise</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Nous avons besoin de votre localisation pour vous connecter avec les réparateurs les plus proches.
                    </p>

                    <div className="mb-3">
                      {isGeolocating ? (
                        <div className="flex items-center text-blue-600">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Géolocalisation en cours...
                        </div>
                      ) : isGeolocated ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Adresse géolocalisée avec succès
                        </div>
                      ) : geoError ? (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {geoError}
                        </div>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleGeolocation("client")}
                      disabled={isGeolocating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isGeolocating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Localisation...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2" />
                          {isGeolocated ? "Actualiser ma position" : "Géolocaliser mon adresse"}
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="client-address">Adresse</Label>
                    <Input
                      id="client-address"
                      value={clientForm.address}
                      onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                      placeholder="Numéro et nom de rue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-city">Ville *</Label>
                      <Input
                        id="client-city"
                        value={clientForm.city}
                        onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-postalCode">Code postal *</Label>
                      <Input
                        id="client-postalCode"
                        value={clientForm.postalCode}
                        onChange={(e) => setClientForm({ ...clientForm, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <DepartmentSelector
                      value={clientForm.department}
                      onValueChange={(value) => setClientForm({ ...clientForm, department: value })}
                      label="Département"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="client-terms"
                      checked={clientForm.acceptTerms}
                      onCheckedChange={(checked) => setClientForm({ ...clientForm, acceptTerms: checked === true })}
                    />
                    <Label htmlFor="client-terms" className="text-sm">
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading || !isGeolocated}>
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Créer mon compte client
                  </Button>
                </form>
              </TabsContent>

              {/* Inscription Réparateur */}
              <TabsContent value="reparateur" className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Inscription Réparateur</CardTitle>
                  <p className="text-sm text-gray-600">
                    Rejoignez notre réseau de professionnels - 15 jours d'essai gratuit
                  </p>
                </CardHeader>

                <form onSubmit={handleRepairerRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="repairer-firstName">Prénom *</Label>
                      <Input
                        id="repairer-firstName"
                        value={repairerForm.firstName}
                        onChange={(e) => setRepairerForm({ ...repairerForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="repairer-lastName">Nom *</Label>
                      <Input
                        id="repairer-lastName"
                        value={repairerForm.lastName}
                        onChange={(e) => setRepairerForm({ ...repairerForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="repairer-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="repairer-email"
                        type="email"
                        value={repairerForm.email}
                        onChange={(e) => setRepairerForm({ ...repairerForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="repairer-password">Mot de passe *</Label>
                      <Input
                        id="repairer-password"
                        type="password"
                        value={repairerForm.password}
                        onChange={(e) => setRepairerForm({ ...repairerForm, password: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="repairer-confirmPassword">Confirmer *</Label>
                      <Input
                        id="repairer-confirmPassword"
                        type="password"
                        value={repairerForm.confirmPassword}
                        onChange={(e) => setRepairerForm({ ...repairerForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="repairer-phone">Téléphone *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="repairer-phone"
                        type="tel"
                        value={repairerForm.phone}
                        onChange={(e) => setRepairerForm({ ...repairerForm, phone: e.target.value })}
                        className="pl-10"
                        placeholder="06 12 34 56 78"
                        required
                      />
                    </div>
                  </div>

                  {/* Géolocalisation */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">📍 Géolocalisation requise</h4>
                    <p className="text-sm text-green-800 mb-3">
                      Votre position nous permet d'afficher votre zone d'intervention aux clients.
                    </p>

                    <div className="mb-3">
                      {isGeolocating ? (
                        <div className="flex items-center text-green-600">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Géolocalisation en cours...
                        </div>
                      ) : isGeolocated ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Adresse géolocalisée avec succès
                        </div>
                      ) : geoError ? (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          {geoError}
                        </div>
                      ) : null}
                    </div>

                    <Button
                      type="button"
                      onClick={() => handleGeolocation("repairer")}
                      disabled={isGeolocating}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isGeolocating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Localisation...
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2" />
                          {isGeolocated ? "Actualiser ma position" : "Géolocaliser mon adresse"}
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="repairer-address">Adresse</Label>
                    <Input
                      id="repairer-address"
                      value={repairerForm.address}
                      onChange={(e) => setRepairerForm({ ...repairerForm, address: e.target.value })}
                      placeholder="Numéro et nom de rue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="repairer-city">Ville *</Label>
                      <Input
                        id="repairer-city"
                        value={repairerForm.city}
                        onChange={(e) => setRepairerForm({ ...repairerForm, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="repairer-postalCode">Code postal *</Label>
                      <Input
                        id="repairer-postalCode"
                        value={repairerForm.postalCode}
                        onChange={(e) => setRepairerForm({ ...repairerForm, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <DepartmentSelector
                      value={repairerForm.department}
                      onValueChange={(value) => setRepairerForm({ ...repairerForm, department: value })}
                      label="Département"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="repairer-companyName">Nom de l'entreprise</Label>
                      <Input
                        id="repairer-companyName"
                        value={repairerForm.companyName}
                        onChange={(e) => setRepairerForm({ ...repairerForm, companyName: e.target.value })}
                        placeholder="Optionnel"
                      />
                    </div>
                    <div>
                      <Label htmlFor="repairer-siret">SIRET</Label>
                      <Input
                        id="repairer-siret"
                        value={repairerForm.siret}
                        onChange={(e) => setRepairerForm({ ...repairerForm, siret: e.target.value })}
                        placeholder="Optionnel"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Spécialités * (sélectionnez au moins une)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={`specialty-${specialty}`}
                            checked={repairerForm.specialties.includes(specialty)}
                            onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked === true)}
                          />
                          <Label htmlFor={`specialty-${specialty}`} className="text-sm cursor-pointer">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="repairer-terms"
                      checked={repairerForm.acceptTerms}
                      onCheckedChange={(checked) => setRepairerForm({ ...repairerForm, acceptTerms: checked === true })}
                    />
                    <Label htmlFor="repairer-terms" className="text-sm">
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </Label>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎉 <strong>15 jours d'essai gratuit</strong> avec toutes les fonctionnalités !
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading || !isGeolocated}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Créer mon compte réparateur
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
