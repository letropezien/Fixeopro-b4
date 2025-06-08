"use client"

import Link from "next/link"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { StorageService } from "@/lib/storage"

export default function DemandeReparationPage() {
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [formData, setFormData] = useState({
    category: "",
    urgency: "",
    description: "",
    location: "",
    coordinates: null as { lat: number; lng: number } | null,
    contact: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || "",
      city: currentUser?.city || "",
      postalCode: currentUser?.postalCode || "",
    },
    budget: "",
    availability: [],
    photos: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [needsRegistration, setNeedsRegistration] = useState(!currentUser)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [isGeolocated, setIsGeolocated] = useState(false)

  const categories = [
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

  const urgencyLevels = [
    { value: "urgent", label: "Urgent (dans les 2h)", icon: "🚨" },
    { value: "same-day", label: "Aujourd'hui", icon: "⏰" },
    { value: "this-week", label: "Cette semaine", icon: "📅" },
    { value: "flexible", label: "Flexible", icon: "🗓️" },
  ]

  // Fonction pour géolocaliser l'adresse
  const geolocateAddress = async () => {
    setIsGeolocating(true)
    setGeoError(null)

    try {
      // Vérifier si les champs d'adresse sont remplis
      if (!formData.contact.city) {
        setGeoError("Veuillez indiquer votre ville pour la géolocalisation")
        setIsGeolocating(false)
        return
      }

      // Construire l'adresse complète pour la géolocalisation
      const address = [formData.contact.address, formData.contact.postalCode, formData.contact.city, "France"]
        .filter(Boolean)
        .join(", ")

      // Utiliser les coordonnées de la ville si l'adresse n'est pas complète
      const coordinates = StorageService.generateCoordinatesForCity(formData.contact.city)

      // Mettre à jour les coordonnées dans le formulaire
      setFormData((prev) => ({
        ...prev,
        coordinates: coordinates,
      }))

      setIsGeolocated(true)
    } catch (error) {
      console.error("Erreur de géolocalisation:", error)
      setGeoError("Impossible de géolocaliser votre adresse. Veuillez vérifier les informations.")
    } finally {
      setIsGeolocating(false)
    }
  }

  // Géolocaliser automatiquement lorsque l'adresse change
  useEffect(() => {
    if (formData.contact.city && formData.contact.postalCode) {
      geolocateAddress()
    }
  }, [formData.contact.city, formData.contact.postalCode])

  // Géolocaliser l'utilisateur au chargement de la page
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        setIsGeolocating(true)
        const location = await StorageService.getCurrentLocation()
        if (location) {
          const city = await StorageService.getCityFromCoordinates(location.lat, location.lng)
          setFormData((prev) => ({
            ...prev,
            contact: {
              ...prev.contact,
              city: city,
            },
            coordinates: location,
          }))
          setIsGeolocated(true)
        }
      } catch (error) {
        console.error("Erreur de géolocalisation:", error)
        setGeoError("Impossible de détecter votre position. Veuillez saisir votre adresse manuellement.")
      } finally {
        setIsGeolocating(false)
      }
    }

    if (!formData.contact.city) {
      getCurrentLocation()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation des champs requis
      if (!formData.category) {
        alert("Veuillez sélectionner une catégorie")
        setIsSubmitting(false)
        return
      }

      if (!formData.urgency) {
        alert("Veuillez sélectionner un niveau d'urgence")
        setIsSubmitting(false)
        return
      }

      if (!formData.description.trim()) {
        alert("Veuillez décrire votre problème")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.city.trim()) {
        alert("Veuillez indiquer votre ville")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.postalCode.trim()) {
        alert("Veuillez indiquer votre code postal")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.firstName.trim()) {
        alert("Veuillez indiquer votre prénom")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.lastName.trim()) {
        alert("Veuillez indiquer votre nom")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.email.trim()) {
        alert("Veuillez indiquer votre email")
        setIsSubmitting(false)
        return
      }

      if (!formData.contact.phone.trim()) {
        alert("Veuillez indiquer votre téléphone")
        setIsSubmitting(false)
        return
      }

      if (!termsAccepted) {
        alert("Veuillez accepter les conditions d'utilisation")
        setIsSubmitting(false)
        return
      }

      // Vérifier que la géolocalisation a été effectuée
      if (!formData.coordinates) {
        alert("La géolocalisation est nécessaire pour publier votre demande")
        setIsSubmitting(false)
        return
      }

      let userId = currentUser?.id

      // Si l'utilisateur n'est pas connecté, créer un compte automatiquement
      if (!currentUser) {
        const newUser = {
          id: StorageService.generateId(),
          email: formData.contact.email,
          password: "temp_password", // Mot de passe temporaire
          firstName: formData.contact.firstName,
          lastName: formData.contact.lastName,
          phone: formData.contact.phone,
          address: formData.contact.address,
          city: formData.contact.city,
          postalCode: formData.contact.postalCode,
          userType: "client" as const,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
        }

        StorageService.saveUser(newUser)
        StorageService.setCurrentUser(newUser)
        userId = newUser.id

        // Envoyer email de vérification
        await StorageService.sendVerificationEmail(newUser.email, newUser.firstName)

        setCurrentUser(newUser)
        setNeedsRegistration(false)
      }

      // Créer la demande de réparation
      const urgencyLevel = urgencyLevels.find((level) => level.value === formData.urgency)

      const repairRequest = {
        id: StorageService.generateId(),
        clientId: userId!,
        category: formData.category,
        urgency: formData.urgency,
        urgencyLabel: urgencyLevel?.label || formData.urgency,
        title: `Réparation ${formData.category.toLowerCase()}`,
        description: formData.description,
        budget: formData.budget,
        city: formData.contact.city,
        postalCode: formData.contact.postalCode,
        address: formData.contact.address,
        createdAt: new Date().toISOString(),
        status: "open" as const,
        responses: 0,
        client: {
          firstName: formData.contact.firstName,
          lastName: formData.contact.lastName,
          initials: `${formData.contact.firstName[0]}${formData.contact.lastName[0]}`,
          email: formData.contact.email,
          phone: formData.contact.phone,
        },
        coordinates: formData.coordinates,
      }

      StorageService.saveRepairRequest(repairRequest)

      console.log("Demande soumise avec succès:", repairRequest)

      // Rediriger vers la page de confirmation
      window.location.href = "/confirmation"
    } catch (error) {
      console.error("Erreur lors de la soumission:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demande de réparation</h1>
          <p className="text-lg text-gray-600">
            Décrivez votre problème et trouvez rapidement un expert près de chez vous
          </p>
          {needsRegistration && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 text-sm">
                💡 Un compte sera automatiquement créé pour vous permettre de suivre votre demande
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Catégorie et urgence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                Type de réparation
              </CardTitle>
              <CardDescription>Sélectionnez la catégorie qui correspond à votre problème</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Niveau d'urgence *</Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  {urgencyLevels.map((level) => (
                    <div
                      key={level.value}
                      className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                    >
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="flex items-center cursor-pointer">
                        <span className="mr-2">{level.icon}</span>
                        {level.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Description du problème */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                Description du problème
              </CardTitle>
              <CardDescription>Plus vous êtes précis, mieux nous pourrons vous aider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Décrivez votre problème en détail *</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Mon lave-linge ne démarre plus depuis ce matin. Le voyant rouge clignote et il fait un bruit étrange..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="budget">Budget approximatif</Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50">Moins de 50€</SelectItem>
                    <SelectItem value="50-100">50€ - 100€</SelectItem>
                    <SelectItem value="100-200">100€ - 200€</SelectItem>
                    <SelectItem value="200-500">200€ - 500€</SelectItem>
                    <SelectItem value="500+">Plus de 500€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                <MapPin className="h-5 w-5 mr-2" />
                Localisation
              </CardTitle>
              <CardDescription>
                Nous trouverons les réparateurs les plus proches de vous. La géolocalisation est nécessaire pour
                l'affichage sur la carte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Ex: Paris"
                    value={formData.contact.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    placeholder="Ex: 75001"
                    value={formData.contact.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, postalCode: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adresse complète</Label>
                <Input
                  id="address"
                  placeholder="Ex: 123 rue de la République"
                  value={formData.contact.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, address: e.target.value },
                    })
                  }
                />
              </div>

              {/* Statut de géolocalisation */}
              <div className="mt-4">
                {isGeolocating ? (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Géolocalisation en cours...
                  </div>
                ) : isGeolocated ? (
                  <div className="flex items-center text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                variant="outline"
                onClick={geolocateAddress}
                disabled={isGeolocating || !formData.contact.city}
                className="mt-2"
              >
                {isGeolocating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Géolocalisation...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Géolocaliser mon adresse
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                Vos coordonnées
              </CardTitle>
              <CardDescription>
                {needsRegistration
                  ? "Un compte sera créé automatiquement avec ces informations"
                  : "Ces informations restent confidentielles jusqu'à ce qu'un réparateur accepte votre demande"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.contact.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, firstName: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.contact.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, lastName: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditions et soumission */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link href="/conditions" className="text-blue-600 hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/confidentialite" className="text-blue-600 hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">🔒 Vos données sont protégées</h4>
                <p className="text-sm text-blue-800">
                  Vos coordonnées ne seront visibles que par les réparateurs abonnés qui acceptent votre demande. Votre
                  demande reste anonyme jusqu'à ce qu'un professionnel s'engage.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !isGeolocated}
              >
                {isSubmitting ? "Envoi en cours..." : "Publier ma demande gratuitement"}
              </Button>

              {!isGeolocated && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  La géolocalisation est nécessaire pour publier votre demande
                </p>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
