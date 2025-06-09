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
import { Facebook, Instagram, Linkedin } from "lucide-react"

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
          ...formData.professional,
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

  const handleCompanyPhotoChange = (imageUrl: string) => {
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        companyPhotos: [...formData.professional.companyPhotos, imageUrl],
      },
    })
  }

  const removeCompanyPhoto = (photoUrl: string) => {
    setFormData({
      ...formData,
      professional: {
        ...formData.professional,
        companyPhotos: formData.professional.companyPhotos.filter((p) => p !== photoUrl),
      },
    })
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
        },
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
              <PhotoUpload onImageUploaded={handleAvatarChange} buttonText="Changer la photo" />
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
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informations professionnelles</CardTitle>
            <CardDescription>Détails de votre entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                name="professional.companyName"
                value={formData.professional.companyName}
                onChange={handleChange}
                placeholder="Ma Société de Réparation"
              />
            </div>

            <div>
              <Label htmlFor="siret">Numéro SIRET</Label>
              <Input
                id="siret"
                name="professional.siret"
                value={formData.professional.siret}
                onChange={handleChange}
                placeholder="12345678901234"
              />
            </div>

            <div>
              <Label htmlFor="experience">Expérience</Label>
              <Input
                id="experience"
                name="professional.experience"
                value={formData.professional.experience}
                onChange={handleChange}
                placeholder="10 ans dans la réparation électroménager"
              />
            </div>

            <div>
              <Label htmlFor="description">Description de votre activité</Label>
              <Textarea
                id="description"
                name="professional.description"
                value={formData.professional.description}
                onChange={handleChange}
                placeholder="Décrivez votre activité, vos services, votre expertise..."
                rows={5}
              />
            </div>

            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                name="professional.website"
                value={formData.professional.website}
                onChange={handleChange}
                placeholder="https://www.monsite.fr"
              />
            </div>

            <div className="space-y-4">
              <Label>Réseaux sociaux</Label>

              <div className="flex items-center space-x-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                <Input
                  id="facebook"
                  name="socialMedia.facebook"
                  value={formData.professional.socialMedia.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/votre-page"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Instagram className="h-5 w-5 text-pink-600" />
                <Input
                  id="instagram"
                  name="socialMedia.instagram"
                  value={formData.professional.socialMedia.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/votre-compte"
                  className="flex-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Linkedin className="h-5 w-5 text-blue-700" />
                <Input
                  id="linkedin"
                  name="socialMedia.linkedin"
                  value={formData.professional.socialMedia.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="flex-1"
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Ajoutez les URLs complètes de vos profils sociaux (avec https://)
              </p>
            </div>

            <div>
              <Label htmlFor="specialties">Spécialités</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.professional.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {specialty}
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => removeSpecialty(specialty)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newSpecialty"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Ajouter une spécialité"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={addSpecialty}>
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Photos de l'entreprise</CardTitle>
            <CardDescription>Ajoutez des photos de vos locaux, réalisations, etc.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {formData.professional.companyPhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeCompanyPhoto(photo)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <PhotoUpload onImageUploaded={handleCompanyPhotoChange} buttonText="Ajouter une photo" />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
          </Button>
        </div>
      </form>
    </div>
  )
}
