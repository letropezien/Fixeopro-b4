"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Euro, User, Phone, Filter, Search, MessageSquare, CheckCircle, ImageIcon } from "lucide-react"
import Link from "next/link"

// Données de démonstration avec photos
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
    createdAt: "2024-06-02T10:30:00Z",
    responses: 3,
    status: "open",
    photos: [
      "/placeholder.svg?height=200&width=300&text=Lave-linge+en+panne",
      "/placeholder.svg?height=200&width=300&text=Eau+stagnante",
    ],
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
    createdAt: "2024-05-14T14:20:00Z",
    responses: 1,
    status: "in_progress",
    photos: ["/placeholder.svg?height=200&width=300&text=Écran+noir+PC"],
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
    createdAt: "2024-05-25T09:15:00Z",
    responses: 5,
    status: "open",
    photos: [
      "/placeholder.svg?height=200&width=300&text=Fuite+robinet",
      "/placeholder.svg?height=200&width=300&text=Dégâts+eau",
    ],
  },
  {
    id: "4",
    title: "Installation climatisation",
    description: "Installation d'une climatisation réversible dans un appartement de 50m².",
    category: "Climatisation",
    urgency: "Cette semaine",
    urgencyLevel: "medium",
    city: "Nice",
    postalCode: "06000",
    department: "06",
    departmentName: "Alpes-Maritimes",
    budget: "300-500€",
    client: {
      firstName: "Thomas",
      lastName: "R.",
      phone: "06 78 90 12 34",
      email: "thomas.r@email.com",
    },
    createdAt: "2024-05-20T11:45:00Z",
    responses: 8,
    status: "completed",
    completedAt: "2024-06-01T15:30:00Z",
    photos: ["/placeholder.svg?height=200&width=300&text=Salon+à+climatiser"],
  },
  {
    id: "5",
    title: "Réparation téléviseur Sony",
    description: "Écran qui s'éteint après quelques minutes d'utilisation. TV Sony Bravia de 2020.",
    category: "Multimédia",
    urgency: "Flexible",
    urgencyLevel: "low",
    city: "Bordeaux",
    postalCode: "33000",
    department: "33",
    departmentName: "Gironde",
    budget: "70-150€",
    client: {
      firstName: "Julie",
      lastName: "B.",
      phone: "06 23 45 67 89",
      email: "julie.b@email.com",
    },
    createdAt: "2024-05-10T16:20:00Z",
    responses: 2,
    status: "open",
    photos: [],
  },
  {
    id: "6",
    title: "Panne chaudière gaz",
    description: "Ma chaudière ne démarre plus depuis ce matin. Plus d'eau chaude ni de chauffage.",
    category: "Chauffage",
    urgency: "Urgent",
    urgencyLevel: "high",
    city: "Toulouse",
    postalCode: "31000",
    department: "31",
    departmentName: "Haute-Garonne",
    budget: "100-200€",
    client: {
      firstName: "Michel",
      lastName: "B.",
      phone: "06 11 22 33 44",
      email: "michel.b@email.com",
    },
    createdAt: "2024-06-01T08:15:00Z",
    responses: 0,
    status: "open",
    photos: ["/placeholder.svg?height=200&width=300&text=Chaudière+en+panne"],
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
    status: "",
  })

  // Fonction pour déterminer si une annonce est "nouvelle" (moins d'une semaine)
  const isNewRequest = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = now.getTime() - created.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  // Fonction pour déterminer si une annonce terminée doit être supprimée (plus de 15 jours)
  const shouldBeDeleted = (completedAt: string) => {
    if (!completedAt) return false
    const completed = new Date(completedAt)
    const now = new Date()
    const diffTime = now.getTime() - completed.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays > 15
  }

  // Filtrer les annonces qui devraient être supprimées automatiquement
  useEffect(() => {
    const filteredByLifecycle = mockRequests.filter((request) => {
      if (request.status === "completed" && request.completedAt && shouldBeDeleted(request.completedAt)) {
        return false
      }
      return true
    })
    setRequests(filteredByLifecycle)
  }, [])

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

    if (filters.status) {
      if (filters.status === "new") {
        filtered = filtered.filter((request) => isNewRequest(request.createdAt))
      } else {
        filtered = filtered.filter((request) => request.status === filters.status)
      }
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

  const getStatusBadge = (request: any) => {
    if (isNewRequest(request.createdAt)) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Nouvelle</Badge>
    }

    if (request.status === "in_progress") {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          En cours
        </Badge>
      )
    }

    if (request.status === "completed") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Terminée
        </Badge>
      )
    }

    return null
  }

  const getResponsesBadge = (count: number) => {
    let bgColor = "bg-gray-100 text-gray-700"

    if (count === 0) {
      bgColor = "bg-red-50 text-red-700"
    } else if (count >= 5) {
      bgColor = "bg-green-50 text-green-700"
    } else if (count >= 1) {
      bgColor = "bg-blue-50 text-blue-700"
    }

    return (
      <Badge variant="outline" className={`${bgColor}`}>
        <MessageSquare className="h-3 w-3 mr-1" />
        {count}
      </Badge>
    )
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
    setFilters({ search: "", category: "", department: "", urgency: "", status: "" })
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
                    <SelectValue placeholder="Toutes" />
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
                    <SelectValue placeholder="Tous" />
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
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les urgences</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                    <SelectItem value="medium">Cette semaine</SelectItem>
                    <SelectItem value="low">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statut */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="new">Nouvelles</SelectItem>
                    <SelectItem value="open">Ouvertes</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredRequests.length}</div>
              <p className="text-sm text-gray-600">Demandes actives</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredRequests.filter((r) => isNewRequest(r.createdAt)).length}
              </div>
              <p className="text-sm text-gray-600">Nouvelles demandes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">
                {filteredRequests.filter((r) => r.status === "in_progress").length}
              </div>
              <p className="text-sm text-gray-600">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter((r) => r.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Terminées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredRequests.reduce((total, r) => total + r.responses, 0)}
              </div>
              <p className="text-sm text-gray-600">Réponses totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Grid des demandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className={`hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                request.status === "completed"
                  ? "border-green-200"
                  : request.status === "in_progress"
                    ? "border-amber-200"
                    : isNewRequest(request.createdAt)
                      ? "border-blue-200"
                      : "border-gray-200"
              }`}
            >
              {/* Image en avant-plan */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {request.photos && request.photos.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={request.photos[0] || "/placeholder.svg"}
                      alt={request.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {request.photos.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <ImageIcon className="h-3 w-3 mr-1" />+{request.photos.length - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center text-gray-400">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Aucune photo</p>
                    </div>
                  </div>
                )}

                {/* Badges superposés */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {getStatusBadge(request)}
                  <Badge className={getUrgencyColor(request.urgencyLevel)} variant="outline">
                    {request.urgency}
                  </Badge>
                </div>

                {/* Badge réponses */}
                <div className="absolute bottom-2 right-2">{getResponsesBadge(request.responses)}</div>
              </div>

              <CardContent className="p-4">
                {/* En-tête */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {request.category}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(request.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {request.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{request.description}</p>

                {/* Informations */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {request.city} ({request.postalCode})
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Euro className="h-4 w-4 mr-2 text-gray-400" />
                    {request.budget}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    {request.client.firstName} {request.client.lastName}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Contacter
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Voir détails
                  </Button>
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
