"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Filter, Search, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

// Données de démonstration
const mockRequests = [
  {
    id: "1",
    title: "Réparation lave-linge Samsung",
    description:
      "Mon lave-linge ne vidange plus correctement. L'eau reste au fond du tambour après le cycle de lavage.",
    category: "Électroménager",
    urgency: "Cette semaine",
    urgencyLevel: "medium",
    city: "Paris",
    postalCode: "75001",
    department: "75",
    departmentName: "Paris",
    budget: "80-120€",
    client: {
      firstName: "Marie",
      lastName: "D.",
      phone: "06 12 34 56 78",
      email: "marie.d@email.com",
    },
    createdAt: "2024-01-15T10:30:00Z",
    responses: 3,
    photos: ["/placeholder.svg?height=100&width=100&text=Photo1"],
  },
  {
    id: "2",
    title: "Dépannage ordinateur portable",
    description: "Écran noir au démarrage, ventilateur qui tourne mais rien ne s'affiche. Ordinateur HP Pavilion.",
    category: "Informatique",
    urgency: "Urgent",
    urgencyLevel: "high",
    city: "Lyon",
    postalCode: "69001",
    department: "69",
    departmentName: "Rhône",
    budget: "50-100€",
    client: {
      firstName: "Pierre",
      lastName: "M.",
      phone: "06 98 76 54 32",
      email: "pierre.m@email.com",
    },
    createdAt: "2024-01-14T14:20:00Z",
    responses: 1,
    photos: [],
  },
  {
    id: "3",
    title: "Fuite robinet cuisine",
    description: "Fuite importante sous l'évier de la cuisine. Le robinet goutte en permanence.",
    category: "Plomberie",
    urgency: "Aujourd'hui",
    urgencyLevel: "high",
    city: "Marseille",
    postalCode: "13001",
    department: "13",
    departmentName: "Bouches-du-Rhône",
    budget: "60-90€",
    client: {
      firstName: "Sophie",
      lastName: "L.",
      phone: "06 45 67 89 12",
      email: "sophie.l@email.com",
    },
    createdAt: "2024-01-14T09:15:00Z",
    responses: 5,
    photos: ["/placeholder.svg?height=100&width=100&text=Photo1", "/placeholder.svg?height=100&width=100&text=Photo2"],
  },
]

const departments = [
  { code: "75", name: "Paris" },
  { code: "69", name: "Rhône" },
  { code: "13", name: "Bouches-du-Rhône" },
  { code: "59", name: "Nord" },
  { code: "33", name: "Gironde" },
  { code: "31", name: "Haute-Garonne" },
  { code: "06", name: "Alpes-Maritimes" },
  { code: "44", name: "Loire-Atlantique" },
]

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

export default function ListeDemandesPage() {
  const [requests, setRequests] = useState(mockRequests)
  const [filteredRequests, setFilteredRequests] = useState(mockRequests)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    department: "",
    urgency: "",
  })

  useEffect(() => {
    let filtered = requests

    if (filters.search) {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          request.city.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.category) {
      filtered = filtered.filter((request) => request.category === filters.category)
    }

    if (filters.department) {
      filtered = filtered.filter((request) => request.department === filters.department)
    }

    if (filters.urgency) {
      filtered = filtered.filter((request) => request.urgencyLevel === filters.urgency)
    }

    setFilteredRequests(filtered)
  }, [filters, requests])

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Il y a moins d'1h"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`
  }

  const resetFilters = () => {
    setFilters({ search: "", category: "", department: "", urgency: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Liste des demandes de dépannage</h1>
          <p className="text-lg text-gray-600">
            Découvrez toutes les demandes de réparation disponibles sur la plateforme
          </p>
        </div>

        {/* Filtres */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Recherche */}
              <div className="lg:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par titre, description ou ville..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Catégorie */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Catégorie</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Département */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Département</label>
                <Select
                  value={filters.department}
                  onValueChange={(value) => setFilters({ ...filters, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les départements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les départements</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.code} value={dept.code}>
                        {dept.code} - {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Urgence */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Urgence</label>
                <Select value={filters.urgency} onValueChange={(value) => setFilters({ ...filters, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les urgences" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les urgences</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                    <SelectItem value="medium">Cette semaine</SelectItem>
                    <SelectItem value="low">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                {filteredRequests.length} demande{filteredRequests.length > 1 ? "s" : ""} trouvée
                {filteredRequests.length > 1 ? "s" : ""}
              </p>
              <Button variant="outline" onClick={resetFilters} size="sm">
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
              <p className="text-sm text-gray-600">Demandes actives</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.filter((r) => r.urgencyLevel === "high").length}
              </div>
              <p className="text-sm text-gray-600">Demandes urgentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter((r) => r.responses === 0).length}
              </div>
              <p className="text-sm text-gray-600">Sans réponse</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(filteredRequests.map((r) => r.department)).size}
              </div>
              <p className="text-sm text-gray-600">Départements</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {request.category}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgencyLevel)}>{request.urgency}</Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {request.department} - {request.departmentName}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getTimeAgo(request.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-2">{request.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.city} ({request.postalCode})
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Euro className="h-4 w-4 mr-1" />
                      {request.budget}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">{request.description}</p>

                {/* Photos */}
                {request.photos.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Photos du problème :</p>
                    <div className="flex space-x-2">
                      {request.photos.map((photo, index) => (
                        <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border">
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {request.client.firstName} {request.client.lastName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {request.responses} réponse{request.responses > 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Contacter
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Voir les détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
              <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche ou vos filtres</p>
              <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
            </CardContent>
          </Card>
        )}

        {/* CTA pour les réparateurs */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous êtes réparateur ?</h2>
            <p className="text-gray-600 mb-6">
              Rejoignez notre réseau de professionnels et accédez à toutes ces demandes de dépannage
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/devenir-reparateur">
                <Button className="bg-green-600 hover:bg-green-700">Devenir réparateur</Button>
              </Link>
              <Link href="/connexion">
                <Button variant="outline">Se connecter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
