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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, User, UserPlus, RefreshCw, Users, Wrench, MapPin, Check, Info } from "lucide-react"
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
  const [registerUserType, setRegisterUserType] = useState<"client" | "reparateur">("client")
  const [registerCompanyName, setRegisterCompanyName] = useState("")
  const [registerSpecialties, setRegisterSpecialties] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<string>("standard")
  const [isLocating, setIsLocating] = useState(false)
  const [registerCity, setRegisterCity] = useState("")
  const [registerPostalCode, setRegisterPostalCode] = useState("")

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

  const handleGeolocation = async () => {
    setIsLocating(true)
    try {
      if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas supportée par votre navigateur")
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords

            // Simuler un géocodage inverse
            // En production, utilisez un service comme Google Geocoding API
            const cities = [
              { name: "Paris", postalCode: "75001", lat: 48.8566, lng: 2.3522 },
              { name: "Lyon", postalCode: "69001", lat: 45.764, lng: 4.8357 },
              { name: "Marseille", postalCode: "13001", lat: 43.2965, lng: 5.3698 },
              { name: "Toulouse", postalCode: "31000", lat: 43.6047, lng: 1.4442 },
              { name: "Nice", postalCode: "06000", lat: 43.7102, lng: 7.262 },
            ]

            // Trouver la ville la plus proche
            let closestCity = cities[0]
            let minDistance = calculateDistance(latitude, longitude, closestCity.lat, closestCity.lng)

            for (const city of cities) {
              const distance = calculateDistance(latitude, longitude, city.lat, city.lng)
              if (distance < minDistance) {
                minDistance = distance
                closestCity = city
              }
            }

            setRegisterCity(closestCity.name)
            setRegisterPostalCode(closestCity.postalCode)
          } catch (error) {
            console.error("Erreur lors du géocodage:", error)
            alert("Impossible de récupérer l'adresse à partir de votre position")
          } finally {
            setIsLocating(false)
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          alert("Impossible d'accéder à votre position. Vérifiez les autorisations de votre navigateur.")
          setIsLocating(false)
        },
      )
    } catch (error) {
      console.error("Erreur:", error)
      setIsLocating(false)
    }
  }

  // Fonction pour calculer la distance entre deux points GPS
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
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

      // Validation spécifique pour les réparateurs
      if (registerUserType === "reparateur") {
        if (!registerCompanyName || !registerSpecialties) {
          setError("Veuillez remplir le nom de l'entreprise et les spécialités pour un compte réparateur")
          return
        }
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
        city: registerCity || "",
        postalCode: registerPostalCode || "",
        userType: registerUserType,
        isEmailVerified: false,
        createdAt: "", // Sera généré automatiquement par StorageService
        // Ajouter les données professionnelles pour les réparateurs
        ...(registerUserType === "reparateur" && {
          professional: {
            companyName: registerCompanyName,
            siret: "",
            experience: "",
            specialties: registerSpecialties.split(",").map((s) => s.trim()),
            description: "",
            website: "",
            companyPhotos: [],
            socialMedia: {},
            notificationPreferences: {
              maxDistance: 25,
              categories: registerSpecialties.split(",").map((s) => s.trim()),
              enableNotifications: true,
              urgencyLevels: ["urgent", "same-day", "this-week", "flexible"],
            },
          },
          subscription: {
            plan: selectedPlan,
            status: "trial",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }),
      }

      // Sauvegarder l'utilisateur avec StorageService
      const savedUser = StorageService.saveUser(newUser)

      if (savedUser) {
        setSuccess(
          `Inscription réussie en tant que ${registerUserType === "client" ? "client" : "réparateur"} ! Vous pouvez maintenant vous connecter.`,
        )

        // Réinitialiser le formulaire
        setRegisterName("")
        setRegisterEmail("")
        setRegisterPassword("")
        setRegisterPhone("")
        setRegisterCompanyName("")
        setRegisterSpecialties("")
        setRegisterUserType("client")
        setRegisterCity("")
        setRegisterPostalCode("")
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

  // Plans disponibles
  const plans = [
    {
      id: "standard",
      name: "Standard",
      price: "19.99€/mois",
      features: ["Accès aux demandes", "Profil professionnel", "Support par email"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "39.99€/mois",
      features: [
        "Accès prioritaire aux demandes",
        "Profil mis en avant",
        "Support prioritaire",
        "Statistiques avancées",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "59.99€/mois",
      features: [
        "Accès illimité aux demandes",
        "Profil premium",
        "Support dédié",
        "Outils marketing",
        "Formations exclusives",
      ],
    },
  ]

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
                {/* Sélecteur de type d'utilisateur */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Type de compte *</Label>
                  <RadioGroup
                    value={registerUserType}
                    onValueChange={(value: "client" | "reparateur") => setRegisterUserType(value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="client" id="client" />
                      <Label htmlFor="client" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Client</div>
                          <div className="text-sm text-gray-500">Je cherche des réparateurs</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="reparateur" id="reparateur" />
                      <Label htmlFor="reparateur" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Wrench className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium">Réparateur</div>
                          <div className="text-sm text-gray-500">Je propose mes services</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Champs communs */}
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

                {/* Géolocalisation */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Localisation</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeolocation}
                      disabled={isLocating}
                      className="flex items-center gap-1"
                    >
                      {isLocating ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                      {isLocating ? "Localisation..." : "Me localiser"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Ville" value={registerCity} onChange={(e) => setRegisterCity(e.target.value)} />
                    <Input
                      placeholder="Code postal"
                      value={registerPostalCode}
                      onChange={(e) => setRegisterPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                {/* Champs spécifiques aux réparateurs */}
                {registerUserType === "reparateur" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="register-company">Nom de l'entreprise *</Label>
                      <Input
                        id="register-company"
                        type="text"
                        placeholder="Mon Entreprise SARL"
                        value={registerCompanyName}
                        onChange={(e) => setRegisterCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-specialties">Spécialités *</Label>
                      <Input
                        id="register-specialties"
                        type="text"
                        placeholder="électroménager, plomberie, électricité"
                        value={registerSpecialties}
                        onChange={(e) => setRegisterSpecialties(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">Séparez les spécialités par des virgules</p>
                    </div>

                    {/* Notification de période d'essai */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Période d'essai de 15 jours</p>
                        <p>
                          Profitez de 15 jours d'essai gratuit sans engagement. Vous pourrez choisir votre forfait à
                          tout moment.
                        </p>
                      </div>
                    </div>

                    {/* Sélection de forfait */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Choisissez votre forfait</Label>
                      <div className="grid gap-3">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedPlan === plan.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">{plan.name}</h3>
                              <div className="flex items-center">
                                <span className="font-bold text-blue-600 mr-2">{plan.price}</span>
                                {selectedPlan === plan.id && (
                                  <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        Vous pourrez modifier votre forfait à tout moment depuis votre profil.
                      </p>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer un compte {registerUserType === "client" ? "client" : "réparateur"}
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
