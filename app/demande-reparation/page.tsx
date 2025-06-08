"use client"

import Link from "next/link"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin } from "lucide-react"

export default function DemandeReparationPage() {
  const [formData, setFormData] = useState({
    category: "",
    urgency: "",
    description: "",
    location: "",
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    budget: "",
    availability: [],
    photos: [],
  })

  const categories = [
    "Électroménager",
    "Informatique",
    "Plomberie",
    "Électricité",
    "Chauffage",
    "Serrurerie",
    "Multimédia",
    "Climatisation",
  ]

  const urgencyLevels = [
    { value: "urgent", label: "Urgent (dans les 2h)", icon: "🚨" },
    { value: "same-day", label: "Aujourd'hui", icon: "⏰" },
    { value: "this-week", label: "Cette semaine", icon: "📅" },
    { value: "flexible", label: "Flexible", icon: "🗓️" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Demande soumise:", formData)
    // Ici on enverrait les données au backend
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demande de réparation</h1>
          <p className="text-lg text-gray-600">
            Décrivez votre problème et trouvez rapidement un expert près de chez vous
          </p>
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
              <CardDescription>Nous trouverons les réparateurs les plus proches de vous</CardDescription>
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
                Ces informations restent confidentielles jusqu'à ce qu'un réparateur accepte votre demande
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
                <Checkbox id="terms" />
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

              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                Publier ma demande gratuitement
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
