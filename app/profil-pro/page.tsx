"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StorageService } from "@/lib/storage"
import { PhotoUpload } from "@/components/photo-upload"
import { Facebook, Instagram, Linkedin, MapPin, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, Filter } from "lucide-react"
import { CategoriesService } from "@/lib/categories-service"

export default function ProfilProPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    professional: {
      companyName: "",
      siret: "",
      experience: "",
      specialties: [] as string[],
      description: "",
      website: "",
      companyPhotos: [] as string[],
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
      },
    },
  })
  const [newSpecialty, setNewSpecialty] = useState("")
  const [avatar, setAvatar] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [notificationPreferences, setNotificationPreferences] = useState({
    enableNotifications: true,
    maxDistance: 25,
    categories: [] as string[],
    urgencyLevels: ["urgent", "same-day", "this-week", "flexible"] as string[],
  })
  const [isLocating, setIsLocating] = useState(false)

  useEffect(() => {
    const currentUser = StorageService.getCurrentUser()
    if (!currentUser) {
      router.push("/connexion")
      return
    }

    if (currentUser.userType !== "reparateur") {
      router.push("/profil")
      return
    }

    setUser(currentUser)
    setFormData({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      city: currentUser.city || "",
      postalCode: currentUser.postalCode || "",
      professional: {
        companyName: currentUser.professional?.companyName || "",
        siret: currentUser.professional?.siret || "",
        experience: currentUser.professional?.experience || "",
        specialties: currentUser.professional?.specialties || [],
        description: currentUser.professional?.description || "",
        website: currentUser.professional?.website || "",
        companyPhotos: currentUser.professional?.companyPhotos || [],
        socialMedia: {
          facebook: currentUser.professional?.socialMedia?.facebook || "",
          instagram: currentUser.professional?.socialMedia?.instagram || "",
          linkedin: currentUser.professional?.socialMedia?.linkedin || "",
        },
      },
    })
    setAvatar(currentUser.avatar || "")
    setNotificationPreferences({
      enableNotifications: currentUser.professional?.notificationPreferences?.enableNotifications ?? true,
      maxDistance: currentUser.professional?.notificationPreferences?.maxDistance ?? 25,
      categories:
        currentUser.professional?.notificationPreferences?.categories ?? currentUser.professional?.specialties ?? [],
      urgencyLevels: currentUser.professional?.notificationPreferences?.urgencyLevels ?? [
        "urgent",
        "same-day",
        "this-week",
        "flexible",
      ],
    })
    setLoading(false)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("professional.")) {
      const professionalField = name.split(".")[1]
      setFormData({
        ...formData,
        professional: {
          ...formData.professional,
          [professionalField]: value,
        },
      })
    } else if (name.startsWith("socialMedia.")) {
      const socialField = name.split(".")[1]
      setFormData({
        ...formData,
        professional: {
          ...formData.professional.socialMedia,
          socialMedia: {
            ...formData.professional.socialMedia,
            [socialField]: value,
          },
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.professional.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        professional: {
          ...formData.professional,
          specialties: [...formData.professional.specialties, newSpecialty.trim()],
        },
      })
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        specialties: formData.professional.specialties.filter((s) => s !== specialty),
      },
    })
  }

  const handleAvatarChange = (imageUrl: string) => {
    setAvatar(imageUrl)
  }

  const handleCompanyPhotosChange = (photos: string[]) => {
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        companyPhotos: photos,
      },
    })
  }

  const handleNotificationPreferenceChange = (field: string, value: any) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleCategory = (category: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const toggleUrgencyLevel = (level: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      urgencyLevels: prev.urgencyLevels.includes(level)
        ? prev.urgencyLevels.filter((l) => l !== level)
        : [...prev.urgencyLevels, level],
    }))
  }

  const handleGeolocation = async () => {
    setIsLocating(true)
    try {
      if (!navigator.geolocation) {
        setMessage({ type: "error", text: "La géolocalisation n'est pas supportée par votre navigateur" })
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

            setFormData({
              ...formData,
              city: closestCity.name,
              postalCode: closestCity.postalCode,
            })

            setMessage({ type: "success", text: `Localisation réussie : ${closestCity.name}` })
          } catch (error) {
            console.error("Erreur lors du géocodage:", error)
            setMessage({ type: "error", text: "Impossible de récupérer l'adresse à partir de votre position" })
          } finally {
            setIsLocating(false)
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          setMessage({
            type: "error",
            text: "Impossible d'accéder à votre position. Vérifiez les autorisations de votre navigateur.",
          })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user) return

      // Valider les URLs des réseaux sociaux
      const validateUrl = (url: string) => {
        if (!url) return true // URL vide est valide
        try {
          new URL(url)
          return true
        } catch (e) {
          return false
        }
      }

      const { facebook, instagram, linkedin } = formData.professional.socialMedia
      if (!validateUrl(facebook) || !validateUrl(instagram) || !validateUrl(linkedin)) {
        setMessage({
          type: "error",
          text: "Les URLs des réseaux sociaux ne sont pas valides. Assurez-vous d'inclure http:// ou https://",
        })
        setSaving(false)
        return
      }

      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        avatar: avatar,
        professional: {
          ...formData.professional,
          notificationPreferences: notificationPreferences,
        },
        // Mettre à jour les coordonnées si la ville a changé
        coordinates:
          formData.city !== user.city ? StorageService.generateCoordinatesForCity(formData.city) : user.coordinates,
      }

      StorageService.saveUser(updatedUser)
      setMessage({ type: "success", text: "Profil mis à jour avec succès" })
      setUser(updatedUser)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du profil" })
    } finally {
      setSaving(false)
      // Faire défiler vers le haut pour voir le message
      window.scrollTo({ top: 0, behavior: "smooth" })
      // Effacer le message après 5 secondes
      setTimeout(() => setMessage({ type: "", text: "" }), 5000)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const trialDaysRemaining = StorageService.getTrialDaysRemaining(user)
  const trialEndDate = StorageService.getTrialEndDate(user)
  const isTrialActive = StorageService.isInTrialPeriod(user)
  const isSubscriptionActive = user.subscription?.status === "active"

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Profil Professionnel</h1>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {!isSubscriptionActive && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                {isTrialActive ? (
                  <>
                    <h2 className="text-lg font-semibold text-amber-600">Période d'essai en cours</h2>
                    <p className="text-gray-600">
                      Il vous reste <span className="font-bold">{trialDaysRemaining} jours</span> d'essai (jusqu'au{" "}
                      {trialEndDate}).
                    </p>
                    <p className="mt-2">
                      Pour continuer à utiliser tous les services après cette date, veuillez souscrire à un abonnement.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-red-600">Période d'essai expirée</h2>
                    <p className="text-gray-600">
                      Votre période d'essai est terminée. Pour continuer à utiliser tous les services, veuillez
                      souscrire à un abonnement.
                    </p>
                  </>
                )}
              </div>
              <Button
                onClick={() => router.push("/tarifs")}
                className={isTrialActive ? "bg-amber-600 hover:bg-amber-700" : "bg-red-600 hover:bg-red-700"}
              >
                Voir les abonnements
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Vos informations de base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={avatar || "/placeholder.svg"} alt={formData.firstName} />
                <AvatarFallback className="text-lg">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <PhotoUpload
                onPhotoChange={handleAvatarChange}
                currentPhoto={avatar}
                multiple={false}
                buttonText="Changer la photo"
                size="lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 rue de la Réparation"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Paris" />
              </div>
            </div>

            {/* Bouton de géolocalisation */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGeolocation}
                disabled={isLocating}
                className="flex items-center gap-2"
              >
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {isLocating ? "Localisation en cours..." : "Utiliser ma position actuelle"}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Utilisez cette option pour remplir automatiquement votre ville et code postal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
            <CardDescription>Détails sur votre entreprise et vos services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                name="professional.companyName"
                value={formData.professional.companyName}
                onChange={handleChange}
                placeholder="Mon Entreprise SARL"
                required
              />
            </div>

            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                name="professional.siret"
                value={formData.professional.siret}
                onChange={handleChange}
                placeholder="12345678901234"
              />
            </div>

            <div>
              <Label htmlFor="experience">Années d'expérience</Label>
              <Input
                id="experience"
                name="professional.experience"
                value={formData.professional.experience}
                onChange={handleChange}
                placeholder="5 ans"
              />
            </div>

            <div>
              <Label htmlFor="description">Description de votre activité</Label>
              <Textarea
                id="description"
                name="professional.description"
                value={formData.professional.description}
                onChange={handleChange}
                placeholder="Décrivez votre entreprise, vos services et votre expertise..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="professional.website"
                value={formData.professional.website}
                onChange={handleChange}
                placeholder="https://mon-site.com"
              />
            </div>

            <div>
              <Label>Spécialités</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Ajouter une spécialité"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty}>
                  Ajouter
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="cursor-pointer">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Photos de l'entreprise</CardTitle>
            <CardDescription>
              Ajoutez des photos de votre entreprise, de vos réalisations et de votre équipe (illimité)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUpload
              currentPhotos={formData.professional.companyPhotos}
              onPhotosChange={handleCompanyPhotosChange}
              maxPhotos={999} // Nombre illimité
              label="Photos de l'entreprise"
              description="Ajoutez autant de photos que vous le souhaitez pour présenter votre entreprise"
            />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Réseaux sociaux</CardTitle>
            <CardDescription>Vos profils sur les réseaux sociaux</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              <Input
                name="socialMedia.facebook"
                value={formData.professional.socialMedia.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/votre-page"
              />
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-600" />
              <Input
                name="socialMedia.instagram"
                value={formData.professional.socialMedia.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/votre-compte"
              />
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-700" />
              <Input
                name="socialMedia.linkedin"
                value={formData.professional.socialMedia.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/votre-profil"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Préférences de notifications
            </CardTitle>
            <CardDescription>
              Configurez comment vous souhaitez recevoir les notifications de nouvelles demandes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications" className="text-base font-medium">
                  Recevoir des notifications
                </Label>
                <p className="text-sm text-gray-600">Activez pour recevoir des notifications de nouvelles demandes</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={notificationPreferences.enableNotifications}
                onCheckedChange={(checked) => handleNotificationPreferenceChange("enableNotifications", checked)}
              />
            </div>

            {notificationPreferences.enableNotifications && (
              <>
                <div>
                  <Label className="text-base font-medium flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4" />
                    Distance maximale
                  </Label>
                  <Select
                    value={notificationPreferences.maxDistance.toString()}
                    onValueChange={(value) => handleNotificationPreferenceChange("maxDistance", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="25">25 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                      <SelectItem value="100">100 km</SelectItem>
                      <SelectItem value="999">Toute la France</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    Vous recevrez des notifications pour les demandes dans un rayon de{" "}
                    {notificationPreferences.maxDistance === 999
                      ? "toute la France"
                      : `${notificationPreferences.maxDistance} km`}
                  </p>
                </div>

                <div>
                  <Label className="text-base font-medium flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4" />
                    Catégories d'intérêt
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {CategoriesService.getCategories().map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={notificationPreferences.categories.includes(category.name)}
                          onCheckedChange={() => toggleCategory(category.name)}
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Sélectionnez les catégories pour lesquelles vous souhaitez recevoir des notifications
                  </p>
                </div>

                <div>
                  <Label className="text-base font-medium flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4" />
                    Niveaux d'urgence
                  </Label>
                  <div className="space-y-2">
                    {[
                      { id: "urgent", label: "Urgent (dans les 2h)", color: "text-red-600" },
                      { id: "same-day", label: "Même jour", color: "text-orange-600" },
                      { id: "this-week", label: "Cette semaine", color: "text-yellow-600" },
                      { id: "flexible", label: "Flexible", color: "text-green-600" },
                    ].map((urgency) => (
                      <div key={urgency.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`urgency-${urgency.id}`}
                          checked={notificationPreferences.urgencyLevels.includes(urgency.id)}
                          onCheckedChange={() => toggleUrgencyLevel(urgency.id)}
                        />
                        <Label htmlFor={`urgency-${urgency.id}`} className={`text-sm ${urgency.color}`}>
                          {urgency.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Choisissez les niveaux d'urgence pour lesquels vous souhaitez être notifié
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sauvegarder le profil
        </Button>
      </form>
    </div>
  )
}
