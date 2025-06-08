"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { StorageService } from "@/lib/storage"

export default function DevenirReparateurPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    professional: {
      companyName: "",
      siret: "",
      experience: "",
      specialties: [] as string[],
      description: "",
      website: "",
    },
    subscription: "pro",
    avatar: "",
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

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

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Essentiel",
      price: "29€/mois",
      features: ["Accès aux demandes clients", "Profil professionnel", "5 réponses par mois", "Support par email"],
    },
    {
      id: "pro",
      name: "Professionnel",
      price: "59€/mois",
      popular: true,
      features: [
        "Accès illimité aux demandes",
        "Profil premium avec photos",
        "Réponses illimitées",
        "Priorité dans les résultats",
        "Support téléphonique",
        "Statistiques détaillées",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "99€/mois",
      features: [
        "Tous les avantages Pro",
        "Badge 'Expert certifié'",
        "Mise en avant géographique",
        "Support prioritaire 24/7",
        "Formation continue",
        "API d'intégration",
      ],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation des champs requis
      if (!formData.personal.firstName.trim()) {
        alert("Veuillez indiquer votre prénom")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.lastName.trim()) {
        alert("Veuillez indiquer votre nom")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.email.trim()) {
        alert("Veuillez indiquer votre email")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.phone.trim()) {
        alert("Veuillez indiquer votre téléphone")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.address.trim()) {
        alert("Veuillez indiquer votre adresse")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.city.trim()) {
        alert("Veuillez indiquer votre ville")
        setIsSubmitting(false)
        return
      }

      if (!formData.personal.postalCode.trim()) {
        alert("Veuillez indiquer votre code postal")
        setIsSubmitting(false)
        return
      }

      if (!formData.professional.experience) {
        alert("Veuillez indiquer votre expérience")
        setIsSubmitting(false)
        return
      }

      if (formData.professional.specialties.length === 0) {
        alert("Veuillez sélectionner au moins une spécialité")
        setIsSubmitting(false)
        return
      }

      if (!formData.professional.description.trim()) {
        alert("Veuillez décrire votre activité")
        setIsSubmitting(false)
        return
      }

      if (!termsAccepted) {
        alert("Veuillez accepter les conditions d'utilisation")
        setIsSubmitting(false)
        return
      }

      // Créer le compte réparateur
      const newUser = {
        id: StorageService.generateId(),
        email: formData.personal.email,
        password: "temp_password", // Mot de passe temporaire
        firstName: formData.personal.firstName,
        lastName: formData.personal.lastName,
        phone: formData.personal.phone,
        address: formData.personal.address,
        city: formData.personal.city,
        postalCode: formData.personal.postalCode,
        userType: "reparateur" as const,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        avatar: formData.avatar,
        subscription: {
          plan: formData.subscription,
          status: "trial" as const, // 15 jours d'essai gratuit
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        },
        professional: {
          companyName: formData.professional.companyName,
          siret: formData.professional.siret,
          experience: formData.professional.experience,
          specialties: formData.professional.specialties,
          description: formData.professional.description,
          website: formData.professional.website,
        },
      }

      StorageService.saveUser(newUser)
      StorageService.setCurrentUser(newUser)

      // Envoyer email de vérification
      await StorageService.sendVerificationEmail(newUser.email, newUser.firstName)

      console.log("Inscription réparateur:", newUser)
      alert(
        "Votre inscription a été enregistrée avec succès ! Un email de confirmation vous a été envoyé. Vous bénéficiez de 15 jours d'essai gratuit.",
      )

      // Redirection vers le profil professionnel
      router.push("/profil-pro")
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        professional: {
          ...formData.professional,
          specialties: [...formData.professional.specialties, specialty],
        },
      })
    } else {
      setFormData({
        ...formData,
        professional: {
          ...formData.professional,
          specialties: formData.professional.specialties.filter((s) => s !== specialty),
        },
      })
    }
  }

  const handlePhotoChange = (photoUrl: string) => {
    setFormData({ ...formData, avatar: photoUrl })
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez FixeoPro en tant que réparateur</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Développez votre activité en rejoignant notre réseau de professionnels qualifiés. Accédez à des demandes de
            réparation ciblées et augmentez votre visibilité.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <div className={`h-1 w-12 ${currentStep >= 2 ? "bg-green-500" : "bg-gray-200"}`}></div>
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep >= 2 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <div className={`h-1 w-12 ${currentStep >= 3 ? "bg-green-500" : "bg-gray-200"}`}></div>
            <div
              className={`rounded-full h-10 w-10 flex items-center justify-center ${
                currentStep >= 3 ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              3
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.personal.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, firstName: e.target.value } })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.personal.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, lastName: e.target.value } })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.personal.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, phone: e.target.value } })
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.personal.address}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, address: e.target.value } })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.personal.city}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, city: e.target.value } })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.personal.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, personal: { ...formData.personal, postalCode: e.target.value } })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={nextStep}>
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Informations professionnelles */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Informations professionnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    value={formData.professional.companyName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: { ...formData.professional, companyName: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="siret">Numéro SIRET</Label>
                  <Input
                    id="siret"
                    value={formData.professional.siret}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: { ...formData.professional, siret: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Années d'expérience *</Label>
                  <Select
                    value={formData.professional.experience}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        professional: { ...formData.professional, experience: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 ans</SelectItem>
                      <SelectItem value="3-5">3-5 ans</SelectItem>
                      <SelectItem value="6-10">6-10 ans</SelectItem>
                      <SelectItem value="10+">Plus de 10 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.professional.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: { ...formData.professional, website: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Spécialités *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {specialties.map((specialty) => (
                      <div key={specialty} className="flex items-center space-x-2">
                        <Checkbox
                          id={`specialty-${specialty}`}
                          checked={formData.professional.specialties.includes(specialty)}
                          onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked === true)}
                        />
                        <Label htmlFor={`specialty-${specialty}`} className="cursor-pointer">
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description de votre activité *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.professional.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: { ...formData.professional, description: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Précédent
                </Button>
                <Button type="button" onClick={nextStep}>
                  Suivant
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Abonnement et finalisation */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Choisissez votre abonnement</h2>
              <p className="text-green-600 font-medium mb-4">
                Profitez de 15 jours d'essai gratuit avec toutes les fonctionnalités !
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${
                      formData.subscription === plan.id ? "ring-2 ring-green-500" : "hover:shadow-lg transition-shadow"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-bl">
                        Recommandé
                      </div>
                    )}
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <div className="text-2xl font-bold mt-2">{plan.price}</div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <RadioGroup
                        value={formData.subscription}
                        onValueChange={(value) => setFormData({ ...formData, subscription: value })}
                        className="flex justify-center"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} />
                          <Label htmlFor={`plan-${plan.id}`}>Sélectionner</Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    politique de confidentialité
                  </a>
                </Label>
              </div>

              <div className="mt-6 flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Précédent
                </Button>
                <Button type="submit" disabled={isSubmitting || !termsAccepted}>
                  {isSubmitting ? "Inscription en cours..." : "Finaliser l'inscription"}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Avantages */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Pourquoi rejoindre FixeoPro ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Clients qualifiés</h3>
              <p className="text-gray-600">
                Accédez à des demandes de réparation ciblées et qualifiées dans votre zone géographique.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Gagnez du temps</h3>
              <p className="text-gray-600">
                Moins de temps passé à chercher des clients, plus de temps pour développer votre activité.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Développez votre activité</h3>
              <p className="text-gray-600">
                Augmentez votre visibilité et votre chiffre d'affaires grâce à notre plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
