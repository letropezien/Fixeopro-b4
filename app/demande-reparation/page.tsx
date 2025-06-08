"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import PhotoUpload from "@/components/PhotoUpload"
import { StorageService } from "@/lib/storage"
import { DepartmentSelector } from "@/components/department-selector"
import { GeocodingService } from "@/lib/geocoding"
import {
  MapPin,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Home,
  Zap,
  Droplets,
  Thermometer,
  Smartphone,
  Monitor,
  Lock,
  Wifi,
  Car,
  Hammer,
  Settings,
  Loader2,
} from "lucide-react"

interface FormData {
  // Informations de base
  title: string
  category: string
  subCategory: string
  description: string

  // Localisation
  address: string
  city: string
  postalCode: string
  department: string
  coordinates?: { lat: number; lng: number }

  // Urgence et planning
  urgency: string
  preferredDate: string
  preferredTime: string

  // Budget
  budgetType: "fixed" | "range" | "estimate"
  budgetMin: string
  budgetMax: string
  budgetFixed: string

  // Détails techniques
  brand: string
  model: string
  yearOfPurchase: string
  warrantyStatus: string
  previousRepairs: string

  // Photos et documents
  photos: string[]

  // Contact et disponibilité
  contactMethod: string
  availability: string[]
  additionalInfo: string

  // Options
  emergencyService: boolean
  homeService: boolean
  quoteOnly: boolean
}

const categories = [
  {
    id: "electromenager",
    name: "Électroménager",
    icon: Home,
    subCategories: [
      "Lave-linge",
      "Lave-vaisselle",
      "Réfrigérateur",
      "Four",
      "Micro-ondes",
      "Aspirateur",
      "Cafetière",
      "Autre",
    ],
  },
  {
    id: "informatique",
    name: "Informatique",
    icon: Monitor,
    subCategories: [
      "Ordinateur portable",
      "Ordinateur fixe",
      "Écran",
      "Imprimante",
      "Tablette",
      "Accessoires",
      "Autre",
    ],
  },
  {
    id: "telephonie",
    name: "Téléphonie",
    icon: Smartphone,
    subCategories: [
      "iPhone",
      "Samsung",
      "Huawei",
      "Xiaomi",
      "OnePlus",
      "Google Pixel",
      "Autre smartphone",
      "Téléphone fixe",
    ],
  },
  {
    id: "electricite",
    name: "Électricité",
    icon: Zap,
    subCategories: [
      "Installation électrique",
      "Prise électrique",
      "Interrupteur",
      "Tableau électrique",
      "Éclairage",
      "Autre",
    ],
  },
  {
    id: "plomberie",
    name: "Plomberie",
    icon: Droplets,
    subCategories: ["Fuite d'eau", "Canalisation bouchée", "Robinetterie", "Chauffe-eau", "Radiateur", "Autre"],
  },
  {
    id: "chauffage",
    name: "Chauffage",
    icon: Thermometer,
    subCategories: ["Chaudière", "Radiateur", "Pompe à chaleur", "Climatisation", "Poêle", "Autre"],
  },
  {
    id: "serrurerie",
    name: "Serrurerie",
    icon: Lock,
    subCategories: ["Serrure bloquée", "Clé cassée", "Changement de serrure", "Blindage", "Autre"],
  },
  {
    id: "multimedia",
    name: "Multimédia",
    icon: Wifi,
    subCategories: ["Télévision", "Chaîne Hi-Fi", "Console de jeux", "Box internet", "Antenne", "Autre"],
  },
  {
    id: "automobile",
    name: "Automobile",
    icon: Car,
    subCategories: ["Mécanique", "Électronique", "Carrosserie", "Pneus", "Autre"],
  },
  {
    id: "bricolage",
    name: "Bricolage",
    icon: Hammer,
    subCategories: ["Menuiserie", "Peinture", "Carrelage", "Parquet", "Isolation", "Autre"],
  },
  { id: "autres", name: "Autres", icon: Settings, subCategories: ["Jardinage", "Nettoyage", "Déménagement", "Autre"] },
]

const urgencyOptions = [
  {
    id: "urgent",
    label: "Urgent (dans les 2h)",
    description: "Panne critique nécessitant une intervention immédiate",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "same-day",
    label: "Aujourd'hui",
    description: "Intervention souhaitée dans la journée",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "this-week",
    label: "Cette semaine",
    description: "Intervention dans les 7 jours",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "flexible",
    label: "Flexible",
    description: "Pas d'urgence particulière",
    color: "bg-green-100 text-green-800",
  },
]

export default function DemandeReparationPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser())
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    subCategory: "",
    description: "",
    address: "",
    city: "",
    postalCode: "",
    department: "",
    urgency: "",
    preferredDate: "",
    preferredTime: "",
    budgetType: "range",
    budgetMin: "",
    budgetMax: "",
    budgetFixed: "",
    brand: "",
    model: "",
    yearOfPurchase: "",
    warrantyStatus: "",
    previousRepairs: "",
    photos: [],
    contactMethod: "phone",
    availability: [],
    additionalInfo: "",
    emergencyService: false,
    homeService: true,
    quoteOnly: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isGeolocated, setIsGeolocated] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  useEffect(() => {
    // Charger les données sauvegardées
    const savedData = localStorage.getItem("reparationFormData")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData((prev) => ({ ...prev, ...parsed }))
        if (parsed.coordinates) {
          setIsGeolocated(true)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données sauvegardées:", error)
      }
    }

    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      router.push("/connexion?redirect=/demande-reparation")
    }
  }, [currentUser, router])

  // Sauvegarder automatiquement les données
  useEffect(() => {
    localStorage.setItem("reparationFormData", JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Effacer l'erreur si elle existe
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.category) newErrors.category = "Veuillez sélectionner une catégorie"
        if (!formData.title.trim()) newErrors.title = "Veuillez saisir un titre"
        if (!formData.description.trim()) newErrors.description = "Veuillez décrire le problème"
        break
      case 2:
        if (!formData.city.trim()) newErrors.city = "Veuillez saisir votre ville"
        if (!formData.postalCode.trim()) newErrors.postalCode = "Veuillez saisir votre code postal"
        if (!formData.urgency) newErrors.urgency = "Veuillez sélectionner l'urgence"
        if (!isGeolocated) newErrors.coordinates = "La géolocalisation est nécessaire pour continuer"
        break
      case 3:
        if (formData.budgetType === "range") {
          if (!formData.budgetMin) newErrors.budgetMin = "Budget minimum requis"
          if (!formData.budgetMax) newErrors.budgetMax = "Budget maximum requis"
        } else if (formData.budgetType === "fixed" && !formData.budgetFixed) {
          newErrors.budgetFixed = "Budget fixe requis"
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setGeoError(null)

    try {
      // Obtenir la position actuelle
      const position = await GeocodingService.getCurrentPosition()
      if (!position) {
        throw new Error("Impossible d'obtenir votre position")
      }

      // Obtenir l'adresse complète à partir des coordonnées
      const address = await GeocodingService.geolocateAndGetAddress()

      // Mettre à jour le formulaire avec les informations obtenues
      setFormData((prev) => ({
        ...prev,
        address: address.street || prev.address,
        city: address.city || prev.city,
        postalCode: address.postalCode || prev.postalCode,
        department: address.department || prev.department,
        coordinates: position,
      }))

      setIsGeolocated(true)
    } catch (error) {
      console.error("Erreur de géolocalisation:", error)
      setGeoError(error instanceof Error ? error.message : "Erreur lors de la géolocalisation")
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    try {
      // Créer la demande de réparation
      const request = {
        clientId: currentUser?.id || "",
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        urgencyLabel: urgencyOptions.find((u) => u.id === formData.urgency)?.label || "",
        budget:
          formData.budgetType === "fixed" ? `${formData.budgetFixed}€` : `${formData.budgetMin}-${formData.budgetMax}€`,
        city: formData.city,
        postalCode: formData.postalCode,
        department: formData.department,
        address: formData.address,
        status: "open" as const,
        responses: [],
        client: {
          firstName: currentUser?.firstName || "",
          lastName: currentUser?.lastName || "",
          initials: `${currentUser?.firstName?.[0] || ""}${currentUser?.lastName?.[0] || ""}`,
          email: currentUser?.email,
          phone: currentUser?.phone,
        },
        photos: formData.photos,
        coordinates: formData.coordinates,
        // Informations supplémentaires
        details: {
          subCategory: formData.subCategory,
          brand: formData.brand,
          model: formData.model,
          yearOfPurchase: formData.yearOfPurchase,
          warrantyStatus: formData.warrantyStatus,
          previousRepairs: formData.previousRepairs,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          contactMethod: formData.contactMethod,
          availability: formData.availability,
          additionalInfo: formData.additionalInfo,
          emergencyService: formData.emergencyService,
          homeService: formData.homeService,
          quoteOnly: formData.quoteOnly,
        },
      }

      // Sauvegarder la demande
      const savedRequest = StorageService.saveRepairRequest(request)

      // Effacer les données du formulaire
      localStorage.removeItem("reparationFormData")

      // Rediriger vers la page de confirmation
      router.push(`/demande/${savedRequest.id}?created=true`)
    } catch (error) {
      console.error("Erreur lors de la création de la demande:", error)
      setErrors({ submit: "Une erreur est survenue lors de la création de votre demande" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = categories.find((c) => c.id === formData.category)

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Que souhaitez-vous faire réparer ?</h3>

        {/* Sélection de catégorie */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.category === category.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleInputChange("category", category.id)}
              >
                <CardContent className="p-4 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">{category.name}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

        {/* Sous-catégorie */}
        {selectedCategory && (
          <div className="mb-6">
            <Label htmlFor="subCategory">Type d'appareil ou service</Label>
            <Select value={formData.subCategory} onValueChange={(value) => handleInputChange("subCategory", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type..." />
              </SelectTrigger>
              <SelectContent>
                {selectedCategory.subCategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Titre */}
        <div className="mb-6">
          <Label htmlFor="title">Titre de votre demande *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Ex: Réparation lave-linge qui ne démarre plus"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description détaillée du problème *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Décrivez précisément le problème, les symptômes observés, les circonstances..."
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Localisation et urgence</h3>

      {/* Géolocalisation */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-900 mb-2">📍 Géolocalisation requise</h4>
        <p className="text-sm text-blue-800 mb-2">
          La géolocalisation est nécessaire pour permettre aux réparateurs de trouver votre adresse et calculer leur
          distance.
        </p>

        {/* Statut de géolocalisation */}
        <div className="mt-2">
          {isLoadingLocation ? (
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
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
        >
          {isLoadingLocation ? (
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

      {/* Adresse */}
      <div>
        <Label htmlFor="address">Adresse complète</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Numéro et nom de rue"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Ville */}
        <div>
          <Label htmlFor="city">Ville *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            placeholder="Votre ville"
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* Code postal */}
        <div>
          <Label htmlFor="postalCode">Code postal *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            placeholder="75001"
            className={errors.postalCode ? "border-red-500" : ""}
          />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
        </div>
      </div>

      {/* Département */}
      <div>
        <Label>Département</Label>
        <DepartmentSelector
          value={formData.department}
          onValueChange={(value) => handleInputChange("department", value)}
          placeholder="Sélectionnez votre département"
        />
      </div>

      {/* Urgence */}
      <div>
        <Label>Niveau d'urgence *</Label>
        <RadioGroup
          value={formData.urgency}
          onValueChange={(value) => handleInputChange("urgency", value)}
          className="mt-2"
        >
          {urgencyOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option.id} id={option.id} />
              <div className="flex-1">
                <Label htmlFor={option.id} className="font-medium cursor-pointer">
                  {option.label}
                </Label>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <Badge className={option.color}>{option.label}</Badge>
            </div>
          ))}
        </RadioGroup>
        {errors.urgency && <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>}
      </div>

      {/* Date et heure préférées */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preferredDate">Date souhaitée</Label>
          <Input
            id="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange("preferredDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <Label htmlFor="preferredTime">Heure souhaitée</Label>
          <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Matin (8h-12h)</SelectItem>
              <SelectItem value="afternoon">Après-midi (12h-17h)</SelectItem>
              <SelectItem value="evening">Soirée (17h-20h)</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {errors.coordinates && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-md">
          <p className="text-red-600 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {errors.coordinates}
          </p>
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Budget et détails techniques</h3>

      {/* Type de budget */}
      <div>
        <Label>Type de budget</Label>
        <RadioGroup
          value={formData.budgetType}
          onValueChange={(value: "fixed" | "range" | "estimate") => handleInputChange("budgetType", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="range" id="range" />
            <Label htmlFor="range">Fourchette de prix</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Budget fixe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="estimate" id="estimate" />
            <Label htmlFor="estimate">Demande de devis uniquement</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Budget */}
      {formData.budgetType === "range" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budgetMin">Budget minimum (€) *</Label>
            <Input
              id="budgetMin"
              type="number"
              value={formData.budgetMin}
              onChange={(e) => handleInputChange("budgetMin", e.target.value)}
              placeholder="50"
              className={errors.budgetMin ? "border-red-500" : ""}
            />
            {errors.budgetMin && <p className="text-red-500 text-sm mt-1">{errors.budgetMin}</p>}
          </div>
          <div>
            <Label htmlFor="budgetMax">Budget maximum (€) *</Label>
            <Input
              id="budgetMax"
              type="number"
              value={formData.budgetMax}
              onChange={(e) => handleInputChange("budgetMax", e.target.value)}
              placeholder="200"
              className={errors.budgetMax ? "border-red-500" : ""}
            />
            {errors.budgetMax && <p className="text-red-500 text-sm mt-1">{errors.budgetMax}</p>}
          </div>
        </div>
      )}

      {formData.budgetType === "fixed" && (
        <div>
          <Label htmlFor="budgetFixed">Budget fixe (€) *</Label>
          <Input
            id="budgetFixed"
            type="number"
            value={formData.budgetFixed}
            onChange={(e) => handleInputChange("budgetFixed", e.target.value)}
            placeholder="150"
            className={errors.budgetFixed ? "border-red-500" : ""}
          />
          {errors.budgetFixed && <p className="text-red-500 text-sm mt-1">{errors.budgetFixed}</p>}
        </div>
      )}

      {/* Détails techniques */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Marque</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleInputChange("brand", e.target.value)}
            placeholder="Ex: Samsung, Bosch..."
          />
        </div>
        <div>
          <Label htmlFor="model">Modèle</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
            placeholder="Référence du modèle"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="yearOfPurchase">Année d'achat</Label>
          <Select value={formData.yearOfPurchase} onValueChange={(value) => handleInputChange("yearOfPurchase", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
              <SelectItem value="unknown">Ne sais pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="warrantyStatus">Statut de garantie</Label>
          <Select value={formData.warrantyStatus} onValueChange={(value) => handleInputChange("warrantyStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-warranty">Sous garantie</SelectItem>
              <SelectItem value="expired">Garantie expirée</SelectItem>
              <SelectItem value="unknown">Ne sais pas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Réparations précédentes */}
      <div>
        <Label htmlFor="previousRepairs">Réparations précédentes</Label>
        <Textarea
          id="previousRepairs"
          value={formData.previousRepairs}
          onChange={(e) => handleInputChange("previousRepairs", e.target.value)}
          placeholder="Décrivez les réparations déjà effectuées sur cet appareil..."
          rows={3}
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Photos et finalisation</h3>

      {/* Upload de photos */}
      <div>
        <PhotoUpload
          currentPhotos={formData.photos}
          onPhotosChange={(photos) => handleInputChange("photos", photos)}
          multiple={true}
          maxPhotos={5}
          label="Photos du problème"
          description="Ajoutez jusqu'à 5 photos pour illustrer votre problème (optionnel)"
        />
      </div>

      {/* Méthode de contact préférée */}
      <div>
        <Label>Méthode de contact préférée</Label>
        <RadioGroup
          value={formData.contactMethod}
          onValueChange={(value) => handleInputChange("contactMethod", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Téléphone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both">Les deux</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Disponibilités */}
      <div>
        <Label>Vos disponibilités</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={formData.availability.includes(day)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleInputChange("availability", [...formData.availability, day])
                  } else {
                    handleInputChange(
                      "availability",
                      formData.availability.filter((d) => d !== day),
                    )
                  }
                }}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Options de service */}
      <div className="space-y-3">
        <Label>Options de service</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="homeService"
            checked={formData.homeService}
            onCheckedChange={(checked) => handleInputChange("homeService", checked)}
          />
          <Label htmlFor="homeService">Intervention à domicile</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="emergencyService"
            checked={formData.emergencyService}
            onCheckedChange={(checked) => handleInputChange("emergencyService", checked)}
          />
          <Label htmlFor="emergencyService">Service d'urgence (supplément possible)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="quoteOnly"
            checked={formData.quoteOnly}
            onCheckedChange={(checked) => handleInputChange("quoteOnly", checked)}
          />
          <Label htmlFor="quoteOnly">Devis uniquement (pas de réparation immédiate)</Label>
        </div>
      </div>

      {/* Informations additionnelles */}
      <div>
        <Label htmlFor="additionalInfo">Informations complémentaires</Label>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
          placeholder="Toute information supplémentaire qui pourrait être utile au réparateur..."
          rows={3}
        />
      </div>

      {/* Erreur de soumission */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{errors.submit}</p>
          </div>
        </div>
      )}
    </div>
  )

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour créer une demande de réparation.</p>
            <Button asChild className="w-full">
              <Link href="/connexion?redirect=/demande-reparation">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer une demande de réparation</h1>
          <p className="text-gray-600">Décrivez votre problème et trouvez le bon réparateur</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-full h-1 mx-4 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Problème</span>
            <span>Localisation</span>
            <span>Budget</span>
            <span>Finalisation</span>
          </div>
        </div>

        {/* Contenu du formulaire */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>

          {/* Navigation */}
          <CardContent className="p-6 border-t bg-gray-50">
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Précédent
              </Button>

              {currentStep < 4 ? (
                <Button onClick={nextStep}>Suivant</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Création en cours..." : "Créer ma demande"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
