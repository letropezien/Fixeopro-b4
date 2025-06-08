"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Star, Euro, Users, Building } from "lucide-react"

export default function DevenirReparateurPage() {
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
      specialties: [],
      description: "",
      website: "",
      socialMedia: {
        facebook: "",
        instagram: "",
        linkedin: "",
      },
    },
    subscription: "basic",
  })

  const specialties = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inscription réparateur:", formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez FixeoPro en tant que réparateur</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Développez votre activité en rejoignant la première plateforme de mise en relation entre clients et
            professionnels de la réparation
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Plus de clients</h3>
              <p className="text-sm text-gray-600">Accédez à des milliers de demandes de réparation chaque mois</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Euro className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Revenus supplémentaires</h3>
              <p className="text-sm text-gray-600">Augmentez votre chiffre d'affaires avec des missions régulières</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Réputation en ligne</h3>
              <p className="text-sm text-gray-600">Construisez votre réputation grâce aux avis clients</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inscription" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inscription">Inscription</TabsTrigger>
            <TabsTrigger value="abonnements">Choisir un abonnement</TabsTrigger>
          </TabsList>

          <TabsContent value="inscription">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </span>
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        value={formData.personal.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, firstName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        value={formData.personal.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, lastName: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personal.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, email: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.personal.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.personal.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personal: { ...formData.personal, address: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        value={formData.personal.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, city: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        value={formData.personal.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, postalCode: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations professionnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <Building className="h-5 w-5 mr-2" />
                    Informations professionnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Nom de l'entreprise</Label>
                      <Input
                        id="companyName"
                        placeholder="Ex: Réparations Express SARL"
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
                      <Label htmlFor="siret">SIRET</Label>
                      <Input
                        id="siret"
                        placeholder="Ex: 12345678901234"
                        value={formData.professional.siret}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professional: { ...formData.professional, siret: e.target.value },
                          })
                        }
                      />
                    </div>
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
                        <SelectValue placeholder="Sélectionnez votre expérience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">Moins de 2 ans</SelectItem>
                        <SelectItem value="2-5">2 à 5 ans</SelectItem>
                        <SelectItem value="5-10">5 à 10 ans</SelectItem>
                        <SelectItem value="10+">Plus de 10 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Spécialités *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={formData.professional.specialties.includes(specialty)}
                            onCheckedChange={(checked) => {
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
                            }}
                          />
                          <Label htmlFor={specialty} className="text-sm">
                            {specialty}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description de votre activité *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre expertise, vos services, votre zone d'intervention..."
                      value={formData.professional.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          professional: { ...formData.professional, description: e.target.value },
                        })
                      }
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Site web</Label>
                    <Input
                      id="website"
                      placeholder="https://votre-site.fr"
                      value={formData.professional.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          professional: { ...formData.professional, website: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Réseaux sociaux</Label>
                    <div className="space-y-2 mt-2">
                      <Input
                        placeholder="Facebook"
                        value={formData.professional.socialMedia.facebook}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professional: {
                              ...formData.professional,
                              socialMedia: { ...formData.professional.socialMedia, facebook: e.target.value },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Instagram"
                        value={formData.professional.socialMedia.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professional: {
                              ...formData.professional,
                              socialMedia: { ...formData.professional.socialMedia, instagram: e.target.value },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="LinkedIn"
                        value={formData.professional.socialMedia.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            professional: {
                              ...formData.professional,
                              socialMedia: { ...formData.professional.socialMedia, linkedin: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les conditions d'utilisation et la politique de confidentialité
                </Label>
              </div>

              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Créer mon compte réparateur
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="abonnements">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Choisissez votre abonnement</h2>
                <p className="text-gray-600">Sélectionnez l'offre qui correspond le mieux à vos besoins</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                        Le plus populaire
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "variant-outline"}`}
                        onClick={() => setFormData({ ...formData, subscription: plan.id })}
                      >
                        {formData.subscription === plan.id ? "Sélectionné" : "Choisir cette offre"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Pourquoi un abonnement ?</h3>
                <p className="text-blue-800 text-sm mb-4">
                  L'abonnement nous permet de maintenir une plateforme de qualité et de protéger les données des
                  clients. Seuls les réparateurs abonnés peuvent accéder aux coordonnées complètes des demandeurs.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pas d'engagement, résiliable à tout moment</li>
                  <li>• 7 jours d'essai gratuit pour tous les nouveaux membres</li>
                  <li>• Facturation mensuelle, pas de frais cachés</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
